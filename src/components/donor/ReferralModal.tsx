import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Users, 
  Copy, 
  Check, 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  Gift,
  ArrowRight,
  HeartHandshake
} from 'lucide-react';
import { DonorProfile } from '../../types';

interface ReferralModalProps {
  donor: DonorProfile;
  isOpen: boolean;
  onClose: () => void;
  onSimulateReferral: (friendName: string, friendBloodGroup: string) => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({
  donor,
  isOpen,
  onClose,
  onSimulateReferral
}) => {
  const [copied, setCopied] = useState(false);
  const [simulatedFriendName, setSimulatedFriendName] = useState('Maya Lin');
  const [simulatedFriendBloodGroup, setSimulatedFriendBloodGroup] = useState('O+');
  const [isSimulating, setIsSimulating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const referralLink = `https://bloodrush.network/join?ref=${donor.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      onSimulateReferral(simulatedFriendName, simulatedFriendBloodGroup);
      setSuccessMessage(`Verified! ${simulatedFriendName} (${simulatedFriendBloodGroup}) completed their first donation.`);
      setIsSimulating(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Donor Ambassador Portal</h2>
              <p className="text-[11px] text-slate-500">Invite Friends & Earn +200 Hero Points per Donation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Ambassador Reward Highlight Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 text-white shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                Dual Lifesaver Bonus
              </span>
              <span className="text-xs font-bold text-amber-200 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" /> Both of You Win
              </span>
            </div>
            <h3 className="text-base font-bold leading-tight">Give Life Together</h3>
            <p className="text-xs text-white/90 leading-relaxed">
              When someone registers with your code and completes their first donation, you receive <strong className="text-amber-200">+200 Points</strong> and they get a <strong className="text-amber-200">+100 Welcome Bonus</strong>!
            </p>
          </div>

          {/* Referral Code & Share Link */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Your Unique Ambassador Code
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-900 truncate">
                {donor.referralCode}
              </div>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Share directly via SMS, WhatsApp, or community health groups.
            </p>
          </div>

          {/* Current Referral Stats */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Referrals</div>
              <div className="text-lg font-black text-slate-900 font-mono mt-0.5">{donor.referralsCount}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Bonus Earned</div>
              <div className="text-lg font-black text-indigo-600 font-mono mt-0.5">+{donor.referralsCount * 200} pts</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Next Badge</div>
              <div className="text-xs font-bold text-slate-700 mt-1 truncate">Squad Leader</div>
            </div>
          </div>

          {/* Interactive Simulation Sandbox */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Simulate Friend Intake
              </span>
              <span className="text-[10px] font-semibold text-slate-400">Sandbox Testing</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-medium block mb-1">Friend Name</label>
                <input
                  type="text"
                  value={simulatedFriendName}
                  onChange={(e) => setSimulatedFriendName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-medium block mb-1">Blood Group</label>
                <select
                  value={simulatedFriendBloodGroup}
                  onChange={(e) => setSimulatedFriendBloodGroup(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleTriggerSimulation}
              disabled={isSimulating}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {isSimulating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Simulating Intake...</span>
                </>
              ) : (
                <>
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Simulate Friend Donation & Claim +200 Points</span>
                </>
              )}
            </button>

            {successMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
