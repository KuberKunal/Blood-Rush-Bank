import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Droplet, 
  QrCode, 
  Check, 
  Copy, 
  Sparkles, 
  Heart,
  Share2
} from 'lucide-react';
import { DonorProfile } from '../../types';
import { DONOR_TIER_CONFIGS } from '../../data/donorGamificationData';

interface DigitalDonorCardModalProps {
  donor: DonorProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalDonorCardModal: React.FC<DigitalDonorCardModalProps> = ({
  donor,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentTierConfig = DONOR_TIER_CONFIGS.find(t => t.tier === donor.tier) || DONOR_TIER_CONFIGS[0];

  const handleCopyDonorId = () => {
    navigator.clipboard.writeText(`BLOODRUSH-ID-${donor.id}-${donor.bloodGroup}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Digital Donor Pass</h2>
              <p className="text-[11px] text-slate-500">Universal Check-In & Emergency Phenotype</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Body with Virtual Pass Styling */}
        <div className="p-6 space-y-5">
          
          {/* Visual Digital Pass */}
          <div className={`relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br ${currentTierConfig.color} shadow-xl border border-white/20`}>
            
            {/* Holographic Texture Highlights */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/20 rounded-full blur-xl pointer-events-none" />

            {/* Top Pass Bar */}
            <div className="relative flex items-center justify-between pb-4 border-b border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xs">
                  BR
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/80">BloodRUSH Network</div>
                  <div className="text-xs font-semibold">Verified Lifesaver Pass</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {donor.tier}
              </span>
            </div>

            {/* Middle Pass: Blood Group Hero & Donor Info */}
            <div className="relative py-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] text-white/75 font-medium">Donor Name</div>
                <div className="text-lg font-black tracking-tight">{donor.name}</div>
                <div className="text-[11px] text-white/80 font-mono mt-0.5">@{donor.handle}</div>
                
                {donor.isRareType && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold text-white border border-white/30">
                    <Sparkles className="w-3 h-3 text-amber-300" /> Rare Universal Type
                  </div>
                )}
              </div>

              {/* Big Blood Badge */}
              <div className="w-20 h-20 rounded-2xl bg-white text-slate-900 shadow-lg flex flex-col items-center justify-center p-2 text-center shrink-0 border border-white/40">
                <div className="text-[9px] uppercase font-black text-rose-600 tracking-wider flex items-center gap-0.5">
                  <Droplet className="w-2.5 h-2.5 fill-rose-600" /> ABO / Rh
                </div>
                <div className="text-2xl font-black font-mono text-slate-950 leading-none mt-0.5">
                  {donor.bloodGroup}
                </div>
                <div className="text-[8px] font-bold text-slate-500 mt-1 uppercase">Universal</div>
              </div>
            </div>

            {/* Bottom Pass: Impact Stats & Barcode Simulation */}
            <div className="relative pt-4 border-t border-white/20 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-black/15 backdrop-blur-sm rounded-xl p-2">
                <div className="text-[9px] text-white/70 uppercase font-bold">Donations</div>
                <div className="font-black text-sm font-mono mt-0.5">{donor.totalDonationsCount}</div>
              </div>
              <div className="bg-black/15 backdrop-blur-sm rounded-xl p-2">
                <div className="text-[9px] text-white/70 uppercase font-bold">Volume</div>
                <div className="font-black text-sm font-mono mt-0.5">{(donor.totalVolumeMl / 1000).toFixed(1)}L</div>
              </div>
              <div className="bg-black/15 backdrop-blur-sm rounded-xl p-2">
                <div className="text-[9px] text-white/70 uppercase font-bold">Lives Saved</div>
                <div className="font-black text-sm font-mono text-emerald-300 mt-0.5">{donor.livesSavedEstimated}</div>
              </div>
            </div>

            {/* Simulated Digital Security Code */}
            <div className="relative mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/70 font-mono">
              <span>NFC FAST-CHECKIN ACTIVE</span>
              <span>VERIFIED: 2026-VAL-489</span>
            </div>

          </div>

          {/* Rapid Pass Action Buttons */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Unique Donor Token</span>
                <span className="font-mono font-bold text-slate-800 text-xs">BLOODRUSH-{donor.id.slice(-6).toUpperCase()}-{donor.bloodGroup}</span>
              </div>
              <button
                onClick={handleCopyDonorId}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copied' : 'Copy ID'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Zero-Wait Priority Phlebotomy</span>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Present this digital pass at any verified hospital or blood bank kiosk for instant biomarker synchronization and fast-track intake.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Close Pass
          </button>
        </div>

      </div>
    </div>
  );
};
