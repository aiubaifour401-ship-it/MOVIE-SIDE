import React, { useState } from 'react';
import { X, Check, ShieldCheck, Sparkles, CreditCard, Ticket, ArrowRight } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  onUpdatePlan: (plan: string) => void;
}

const PLANS = [
  {
    id: 'free',
    name: 'Free Trial',
    price: '$0',
    billing: 'forever free',
    quality: '720p HD',
    screens: '1 Screen',
    features: ['Ad-supported playback', 'Standard audio', '720p streaming quality', 'Limited catalog access'],
    badge: 'Basic',
  },
  {
    id: 'standard',
    name: 'Standard HD',
    price: '$13.99',
    billing: 'per month',
    quality: '1080p Full HD',
    screens: '2 Screens',
    features: ['Ad-free experience', '1080p Full HD resolution', 'Download on 2 devices', 'Full catalog access'],
    badge: 'Popular',
  },
  {
    id: 'premium',
    name: 'Premium 4K',
    price: '$19.99',
    billing: 'per month',
    quality: '4K Ultra HD + HDR',
    screens: '4 Screens',
    features: [
      '4K Ultra HD + HDR10+',
      'Dolby Atmos Spatial Audio',
      'Download on 6 devices',
      'VIP Early Access & Originals',
      'Ultra-fast CDN playback'
    ],
    badge: 'Best Value',
    highlight: true,
  },
];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onUpdatePlan,
}) => {
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState('premium');
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'CINEMA2026') {
      setAppliedDiscount(20);
      setCouponMessage('🎉 Promo code CINEMA2026 applied! 20% OFF unlocked.');
    } else {
      setCouponMessage('Invalid promo code. Try "CINEMA2026"');
    }
  };

  const handleCheckout = (planId: string) => {
    setSelectedPlanId(planId);
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onUpdatePlan(planId);
      const planName = PLANS.find((p) => p.id === planId)?.name;
      setSuccessMsg(`Upgraded successfully to ${planName}!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0d0e12] rounded-3xl border border-red-600/30 shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#12141a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-600 text-white font-bold shadow-lg shadow-red-600/30">
              <Sparkles className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Choose Your Cinema Pass</h2>
              <p className="text-xs text-neutral-400">Unlock unlimited 4K Ultra HD streaming, Dolby Atmos, and exclusive originals</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 transition"
            id="subscription-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm text-center animate-in fade-in">
              {successMsg}
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const isCurrent = currentPlan.toLowerCase().includes(plan.id);
              return (
                <div
                  key={plan.id}
                  className={`relative p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition ${
                    plan.highlight
                      ? 'bg-gradient-to-b from-red-600/15 via-[#141620] to-[#10121a] border-red-600 shadow-xl shadow-red-600/10'
                      : 'bg-[#12141c] border-white/10 hover:border-white/20'
                  }`}
                >
                  {plan.badge && (
                    <span className={`absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      plan.highlight ? 'bg-red-600 text-white' : 'bg-white/10 text-neutral-300'
                    }`}>
                      {plan.badge}
                    </span>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-white">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">{plan.price}</span>
                      <span className="text-xs text-neutral-400">/{plan.billing}</span>
                    </div>

                    <div className="pt-2 text-xs space-y-1">
                      <p className="text-red-400 font-bold">🎬 {plan.quality}</p>
                      <p className="text-neutral-300">📱 {plan.screens}</p>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-neutral-300 pt-3 border-t border-white/10">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={processing}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                      isCurrent
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                        : plan.highlight
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    id={`select-plan-${plan.id}`}
                  >
                    {isCurrent ? 'Current Active Plan' : processing && selectedPlanId === plan.id ? 'Processing...' : 'Subscribe Now'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Coupon Code & Stripe Guarantee */}
          <div className="bg-[#12141a] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Ticket className="w-5 h-5 text-red-500 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-bold text-white">Have a Promo Coupon?</p>
                <p className="text-[11px] text-neutral-400">Apply discount code CINEMA2026 for 20% off annual plans</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="CINEMA2026"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="bg-black/60 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white uppercase tracking-wider focus:border-red-600 focus:outline-none w-32"
                id="promo-input"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition"
                id="apply-coupon-btn"
              >
                Apply
              </button>
            </div>
          </div>

          {couponMessage && (
            <p className="text-xs text-center font-bold text-amber-400">{couponMessage}</p>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#12141a] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted • Cancel Anytime • No Contracts</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Supported Cards: Visa, MasterCard, Apple Pay, Stripe</span>
          </div>
        </div>

      </div>
    </div>
  );
};
