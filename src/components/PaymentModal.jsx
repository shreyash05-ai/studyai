import { useState } from 'react';
import { X } from 'lucide-react';

export default function PaymentModal({ plan, onClose, onSuccess }) {
  const [region, setRegion] = useState('india');
  const [payTab, setPayTab] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2800));
    setProcessing(false); setDone(true);
    setTimeout(onSuccess, 2000);
  };

  const priceINR = plan === 'monthly' ? 415 : 4150;
  const priceUSD = plan === 'monthly' ? 5 : 50;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="card fade-up" style={{ width: '100%', maxWidth: 440, padding: 28, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
        {done ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 8 }}>Payment Successful!</h2>
            <p style={{ color: '#64748b' }}>Welcome to StudyAI Premium</p>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[['india','🇮🇳','India','UPI · Cards · Net Banking'],['international','🌍','International','Cards · PayPal · Stripe']].map(([r,flag,name,sub]) => (
                <button key={r} onClick={() => setRegion(r)} style={{ padding: '12px 8px', borderRadius: 12, border: `2px solid ${region===r?'#00d4ff':'#1e2d4a'}`, background: region===r?'rgba(0,212,255,0.08)':'transparent', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{flag}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: region===r?'#00d4ff':'#94a3b8' }}>{name}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{sub}</div>
                </button>
              ))}
            </div>

            {region === 'india' ? (
              <>
                <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                  {[['upi','UPI'],['card','Card'],['netbanking','Net Banking'],['wallet','Wallets']].map(([t,l]) => (
                    <button key={t} onClick={() => setPayTab(t)} className={`tab-btn ${payTab===t?'tab-active':'tab-inactive'}`} style={{ padding: '6px 12px', fontSize: 12 }}>{l}</button>
                  ))}
                </div>
                {payTab === 'upi' && <div style={{ marginBottom: 16 }}><input className="input-field" placeholder="Enter UPI ID (name@upi)" /></div>}
                {payTab === 'card' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    <input className="input-field" placeholder="Card Number" />
                    <input className="input-field" placeholder="Name on Card" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <input className="input-field" placeholder="MM / YY" />
                      <input className="input-field" placeholder="CVV" />
                    </div>
                  </div>
                )}
                {payTab === 'netbanking' && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                    {['SBI','HDFC','ICICI','Axis','Kotak','PNB'].map(b => (
                      <button key={b} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #1e2d4a', background: '#060d1f', color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>{b}</button>
                    ))}
                  </div>
                )}
                {payTab === 'wallet' && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                    {['Paytm Wallet','Mobikwik','Freecharge','Airtel Money'].map(w => (
                      <button key={w} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #1e2d4a', background: '#060d1f', color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}>{w}</button>
                    ))}
                  </div>
                )}
                <button onClick={handlePay} disabled={processing} className="gradient-btn" style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', color: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                  {processing ? 'Processing...' : `Pay ₹${priceINR} →`}
                </button>
                <p style={{ textAlign: 'center', color: '#475569', fontSize: 12, marginTop: 8 }}>🔒 Secured by Razorpay · SSL Encrypted</p>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  <input className="input-field" placeholder="Card Number" />
                  <input className="input-field" placeholder="Cardholder Name" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input className="input-field" placeholder="MM / YY" />
                    <input className="input-field" placeholder="CVC" />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {['PayPal','Apple Pay','Google Pay','Klarna'].map(m => (
                    <button key={m} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #1e2d4a', background: '#060d1f', color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}>{m}</button>
                  ))}
                </div>
                <button onClick={handlePay} disabled={processing} className="gradient-btn" style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', color: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                  {processing ? 'Processing...' : `Pay $${priceUSD} →`}
                </button>
                <p style={{ textAlign: 'center', color: '#475569', fontSize: 12, marginTop: 8 }}>🔒 Secured by Stripe · SSL Encrypted</p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
