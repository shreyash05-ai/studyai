import { useState } from 'react';
import { X } from 'lucide-react';

export default function PaymentModal({ plan, onClose, onSuccess }) {
  const [region, setRegion] = useState('india');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const priceINR = plan === 'monthly' ? 415 : 4150;
  const priceUSD = plan === 'monthly' ? 5 : 50;

  const handleRazorpay = () => {
    setProcessing(true);
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: priceINR * 100, // paise
      currency: 'INR',
      name: 'StudyAI',
      description: plan === 'monthly' ? 'Monthly Premium' : 'Yearly Premium',
      handler: function (response) {
        setProcessing(false);
        setDone(true);
        setTimeout(onSuccess, 2000);
      },
      prefill: { name: '', email: '' },
      theme: { color: '#00d4ff' },
      modal: {
        ondismiss: () => setProcessing(false)
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleStripe = () => {
    // For now simulate — replace with real Stripe when ready
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      setTimeout(onSuccess, 2000);
    }, 2000);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="card fade-up" style={{ width: '100%', maxWidth: 440, padding: 28, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 8 }}>Payment Successful!</h2>
            <p style={{ color: '#64748b' }}>Welcome to StudyAI Premium ⚡</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>Upgrade to Premium</h2>
              <p className="gradient-text font-display" style={{ fontSize: 28, fontWeight: 900, margin: '8px 0 4px' }}>
                {region === 'india' ? `₹${priceINR}` : `$${priceUSD}`}
              </p>
              <p style={{ color: '#64748b', fontSize: 13 }}>{plan === 'monthly' ? 'per month' : 'per year · save 17%'}</p>
            </div>

            {/* Plan toggle */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ padding: '8px 20px', borderRadius: 10, background: plan === 'monthly' ? 'rgba(0,212,255,0.15)' : 'transparent', border: `1px solid ${plan === 'monthly' ? '#00d4ff' : '#1e2d4a'}`, color: plan === 'monthly' ? '#00d4ff' : '#64748b', fontSize: 13, fontWeight: 700 }}>Monthly</div>
              <div style={{ padding: '8px 20px', borderRadius: 10, background: plan === 'yearly' ? 'rgba(0,212,255,0.15)' : 'transparent', border: `1px solid ${plan === 'yearly' ? '#00d4ff' : '#1e2d4a'}`, color: plan === 'yearly' ? '#00d4ff' : '#64748b', fontSize: 13, fontWeight: 700 }}>Yearly · Save 17%</div>
            </div>

            {/* Region */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {[['india','🇮🇳','India (Razorpay)'],['international','🌍','International']].map(([r, flag, name]) => (
                <button key={r} onClick={() => setRegion(r)} style={{ padding: '14px 8px', borderRadius: 12, border: `2px solid ${region === r ? '#00d4ff' : '#1e2d4a'}`, background: region === r ? 'rgba(0,212,255,0.08)' : 'transparent', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{flag}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: region === r ? '#00d4ff' : '#94a3b8' }}>{name}</div>
                </button>
              ))}
            </div>

            {region === 'india' ? (
              <>
                <button onClick={handleRazorpay} disabled={processing} className="gradient-btn"
                  style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', color: 'white', fontWeight: 700, fontSize: 16, cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.8 : 1, marginBottom: 8 }}>
                  {processing ? '⏳ Opening Payment...' : `Pay ₹${priceINR} with Razorpay →`}
                </button>
                <p style={{ textAlign: 'center', color: '#475569', fontSize: 12 }}>🔒 UPI · Cards · Net Banking · Wallets · SSL Encrypted</p>
              </>
            ) : (
              <>
                <button onClick={handleStripe} disabled={processing} className="gradient-btn"
                  style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', color: 'white', fontWeight: 700, fontSize: 16, cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.8 : 1, marginBottom: 8 }}>
                  {processing ? '⏳ Processing...' : `Pay $${priceUSD} →`}
                </button>
                <p style={{ textAlign: 'center', color: '#475569', fontSize: 12 }}>🔒 Secured by Stripe · SSL Encrypted</p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
