import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Lazy initialization / server-side client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAIClient;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      service: "BloodRUSH API Engine",
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString()
    });
  });

  // AI Demand Forecasting & Shortage Prediction
  app.post("/api/gemini/forecast", async (req, res) => {
    try {
      const { facilityName, inventorySummary, scheduledSurgeries, seasonalContext } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          success: true,
          isSimulated: true,
          model: "BloodRUSH-Local-Inference",
          forecasts: [
            {
              bloodGroup: "O-",
              component: "PRBC",
              currentUsableStock: 4,
              predictedDemand7Days: 16,
              shortageEtaDays: 2.5,
              recommendedOrderUnits: 14,
              safetyStockTarget: 6,
              riskLevel: "CRITICAL",
              reasoning: "High trauma intake expected over weekend + 2 cardiac surgeries scheduled on Thursday requiring O- universal coverage. Usable inventory will deplete in ~60 hours."
            },
            {
              bloodGroup: "O+",
              component: "PRBC",
              currentUsableStock: 8,
              predictedDemand7Days: 20,
              shortageEtaDays: 5.0,
              recommendedOrderUnits: 17,
              safetyStockTarget: 8,
              riskLevel: "HIGH",
              reasoning: "Hospital may face an O-positive shortage within five days. Current usable stock is 8 units, predicted demand is 20 units and the recommended order is 17 units, including safety stock."
            },
            {
              bloodGroup: "AB-",
              component: "Platelets",
              currentUsableStock: 3,
              predictedDemand7Days: 8,
              shortageEtaDays: 1.8,
              recommendedOrderUnits: 6,
              safetyStockTarget: 4,
              riskLevel: "HIGH",
              reasoning: "Platelet shelf-life is strictly 5 days. 2 units expire tomorrow at 18:00, leaving net usable at 1 unit with oncology chemotherapy scheduled."
            },
            {
              bloodGroup: "A+",
              component: "FFP",
              currentUsableStock: 24,
              predictedDemand7Days: 12,
              shortageEtaDays: null,
              recommendedOrderUnits: 0,
              safetyStockTarget: 10,
              riskLevel: "OPTIMAL",
              reasoning: "Healthy inventory buffer. 24 units stored at -18°C. No immediate replenishment needed."
            }
          ],
          aiSummary: "Proactive replenishment recommended for O- PRBC and AB- Platelets immediately to avoid critical surgical deferral."
        });
      }

      const prompt = `You are the BloodRUSH AI Clinical Data Science Engine for hospital blood bank inventory.
Analyze the following hospital scenario and provide precise demand forecasts, shortage risks, and safety stock recommendations:
- Facility: ${facilityName || "Metro General Hospital (Trauma Center)"}
- Current Inventory: ${JSON.stringify(inventorySummary || {})}
- Scheduled Surgeries & Trauma Pattern: ${JSON.stringify(scheduledSurgeries || [])}
- Context/Seasonality: ${seasonalContext || "Standard metropolitan weekend trauma & elective surgical schedule"}

Provide your analysis in clean JSON with this exact structure:
{
  "forecasts": [
    {
      "bloodGroup": "O- | O+ | A+ | A- | B+ | B- | AB+ | AB-",
      "component": "PRBC | Platelets | FFP | Cryoprecipitate | WholeBlood",
      "currentUsableStock": number,
      "predictedDemand7Days": number,
      "shortageEtaDays": number | null,
      "recommendedOrderUnits": number,
      "safetyStockTarget": number,
      "riskLevel": "CRITICAL" | "HIGH" | "MODERATE" | "OPTIMAL" | "SURPLUS",
      "reasoning": "Clear, clinically grounded explanation with specific numbers"
    }
  ],
  "aiSummary": "Executive summary paragraph for the inventory director"
}
Return only JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        }
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      return res.json({
        success: true,
        isSimulated: false,
        model: "gemini-3.7-flash",
        ...parsed
      });
    } catch (err: any) {
      console.error("AI Forecast error:", err);
      res.status(500).json({ error: err.message || "Failed to generate AI forecast" });
    }
  });

  // AI Draft Ordering
  app.post("/api/gemini/draft-order", async (req, res) => {
    try {
      const { facilityName, orderingMode, inventoryDeficits, suppliers, budgetCap } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          success: true,
          isSimulated: true,
          orderDraft: {
            recommendedSupplier: suppliers?.[0]?.name || "Central Regional Blood Bank",
            items: [
              { bloodGroup: "O-", component: "PRBC", units: 8, unitPrice: 210, totalCost: 1680, urgency: "CRITICAL", rationale: "Universal donor safety buffer for ER trauma arrivals." },
              { bloodGroup: "O+", component: "PRBC", units: 15, unitPrice: 190, totalCost: 2850, urgency: "HIGH", rationale: "Scheduled cardiac & orthopaedic bypass operations." },
              { bloodGroup: "A+", component: "Platelets", units: 6, unitPrice: 240, totalCost: 1440, urgency: "HIGH", rationale: "Short 5-day expiry replenishment cycle." },
              { bloodGroup: "B+", component: "FFP", units: 5, unitPrice: 150, totalCost: 750, urgency: "NORMAL", rationale: "Coagulation therapy baseline replenishment." }
            ],
            totalUnits: 34,
            estimatedCost: 6720,
            autoApprovable: orderingMode === "controlled_auto" && 6720 <= (budgetCap || 10000),
            auditJustification: "Order bundle prepared based on predicted 7-day depletion and verified shelf-life constraints."
          }
        });
      }

      const prompt = `You are BloodRUSH's Automated Weekly Blood Procurement Engine.
Prepare an optimized order draft for ${facilityName || "Hospital"} under ${orderingMode || "ai_draft"} mode.
Deficits & Demand: ${JSON.stringify(inventoryDeficits || [])}
Available Suppliers: ${JSON.stringify(suppliers || [])}
Budget Cap: $${budgetCap || 10000}

Respond in strict JSON:
{
  "orderDraft": {
    "recommendedSupplier": "Supplier name",
    "items": [
      {
        "bloodGroup": "O- | O+ | A+ | A- | B+ | B- | AB+ | AB-",
        "component": "PRBC | Platelets | FFP | Cryoprecipitate | WholeBlood",
        "units": number,
        "unitPrice": number,
        "totalCost": number,
        "urgency": "CRITICAL" | "HIGH" | "NORMAL",
        "rationale": "Clinical reason"
      }
    ],
    "totalUnits": number,
    "estimatedCost": number,
    "autoApprovable": boolean,
    "auditJustification": "Concise summary for hospital compliance records"
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({
        success: true,
        isSimulated: false,
        ...parsed
      });
    } catch (err: any) {
      console.error("AI Draft Order error:", err);
      res.status(500).json({ error: err.message || "Failed to generate AI order draft" });
    }
  });

  // Emergency Matcher & Logistics Advisor
  app.post("/api/gemini/emergency-advisor", async (req, res) => {
    try {
      const { emergencyRequest, nearbyFacilities } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          success: true,
          isSimulated: true,
          matchStrategy: {
            recommendedFacilityId: nearbyFacilities?.[0]?.id || "fac-2",
            recommendedFacilityName: nearbyFacilities?.[0]?.name || "City Central Blood Center",
            compatibilityNote: "Universal O- PRBC compatible with all Rh/ABO recipients. Direct cold-chain dispatch recommended.",
            estimatedTransitMinutes: 18,
            routeSummary: "Via Arterial Expressway 4 (Green Corridor Priority)",
            splitFulfillmentRecommended: false,
            actionSteps: [
              "Lock 4 units at donor blood bank with automated RFID freeze.",
              "Dispatch insulated temperature-logged container (2°C-6°C target).",
              "Provide 6-digit delivery handshake PIN to trauma receiver."
            ]
          }
        });
      }

      const prompt = `You are BloodRUSH Emergency Blood Logistics Dispatch AI.
Evaluate this critical emergency blood request:
Request Details: ${JSON.stringify(emergencyRequest || {})}
Nearby Facilities with Usable Stock: ${JSON.stringify(nearbyFacilities || [])}

Provide optimal logistics routing, compatibility safety checks, and dispatch steps in JSON format:
{
  "matchStrategy": {
    "recommendedFacilityId": "string",
    "recommendedFacilityName": "string",
    "compatibilityNote": "transfusion compatibility verification",
    "estimatedTransitMinutes": number,
    "routeSummary": "recommended transit route",
    "splitFulfillmentRecommended": boolean,
    "actionSteps": ["step 1", "step 2", "step 3"]
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({
        success: true,
        isSimulated: false,
        ...parsed
      });
    } catch (err: any) {
      console.error("Emergency Advisor error:", err);
      res.status(500).json({ error: err.message || "Failed to evaluate emergency request" });
    }
  });

  // Hotspot Analysis & Proactive Stocking Advisor
  app.post("/api/gemini/hotspot-insights", async (req, res) => {
    try {
      const { incidents, facilities } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          success: true,
          isSimulated: true,
          insights: [
            {
              corridorName: "Highway 101 / Mile Marker 42 Interchange",
              riskRating: "EXTREME",
              peakWindow: "Friday & Saturday (22:00 - 04:00)",
              traumaProfile: "High-speed multi-vehicle collisions requiring massive transfusion protocol (MTP).",
              recommendedPreStock: {
                "O- PRBC": 6,
                "O+ PRBC": 10,
                "FFP": 8,
                "Platelets": 4
              },
              targetHospital: "Metro General Hospital (Level 1 Trauma)"
            },
            {
              corridorName: "Downtown Entertainment & Transit District",
              riskRating: "HIGH",
              peakWindow: "Weekend Evenings (20:00 - 02:00)",
              traumaProfile: "Penetrating & blunt trauma arrivals; rapid emergency blood requirement.",
              recommendedPreStock: {
                "O- PRBC": 4,
                "A+ PRBC": 6,
                "Platelets": 3
              },
              targetHospital: "Apex Trauma Care Center"
            }
          ],
          executiveRecommendation: "Pre-position 10 additional units of O- PRBC across Metro General and Apex Trauma before Friday 18:00 to reduce STAT emergency transit delays by 84%."
        });
      }

      const prompt = `You are BloodRUSH Accident & Trauma Predictive Analytics Engine.
Analyze the following anonymized incident hotspot records and hospital network:
Incidents: ${JSON.stringify(incidents || [])}
Facilities: ${JSON.stringify(facilities || [])}

Generate proactive pre-stocking recommendations in JSON format:
{
  "insights": [
    {
      "corridorName": "string",
      "riskRating": "EXTREME" | "HIGH" | "MODERATE",
      "peakWindow": "string",
      "traumaProfile": "string",
      "recommendedPreStock": { "O- PRBC": 6, "O+ PRBC": 8 },
      "targetHospital": "string"
    }
  ],
  "executiveRecommendation": "Proactive policy summary"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({
        success: true,
        isSimulated: false,
        ...parsed
      });
    } catch (err: any) {
      console.error("Hotspot insights error:", err);
      res.status(500).json({ error: err.message || "Failed to analyze accident hotspots" });
    }
  });

  // Interactive AI Assistant Chat
  app.post("/api/gemini/assistant", async (req, res) => {
    try {
      const { message, history, currentContext } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          reply: `[BloodRUSH AI Assistant]\n\nBased on your current inventory at ${currentContext?.facilityName || "the facility"}, here is the recommended action:\n- O-Negative PRBC is currently below the 6-unit emergency threshold.\n- Platelet batches in Tray B-4 expire in 18 hours.\n- Controlled Auto-Order can trigger a 10-unit replenishment from City Central Blood Bank within your $10,000 monthly ceiling.\n\n*Note: BloodRUSH AI supports inventory optimization only. Clinical transfusion decisions remain with licensed medical professionals.*`
        });
      }

      const systemInstruction = `You are the BloodRUSH AI Operational & Clinical Assistant.
You assist hospital blood bank managers, trauma coordinators, and regional blood bank dispatchers.
Key context:
Current Facility: ${currentContext?.facilityName || "Metro General Hospital"}
Current Role: ${currentContext?.role || "Inventory Manager"}
Inventory Overview: ${JSON.stringify(currentContext?.inventoryOverview || {})}

Always follow these principles:
1. Emphasize patient safety, cold-chain integrity (RBC: 2-6°C, Platelets: 20-24°C agitated, Plasma: -18°C), and shelf-life constraints (Platelets 5 days, RBC 42 days, FFP 1 year).
2. Clarify that AI guides inventory, supply forecasting, and emergency logistics, while authorized medical staff make clinical compatibility and transfusion decisions.
3. Be concise, actionable, and clinically rigorous with exact numbers, blood groups, and timing.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `${systemInstruction}\n\nUser Question: ${message}`,
        config: {
          temperature: 0.3
        }
      });

      return res.json({
        reply: response.text || "I am ready to assist with BloodRUSH inventory and emergency coordination."
      });
    } catch (err: any) {
      console.error("AI Assistant error:", err);
      res.status(500).json({ error: err.message || "Failed to get AI assistant response" });
    }
  });

  // Vite middleware in dev mode, static serving in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BloodRUSH Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start BloodRUSH server:", err);
  process.exit(1);
});
