// client/src/pages/Login.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, Sprout, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [phone, setPhone]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused]       = useState('');

  const { login }  = useContext(AuthContext);
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(phone, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '13px 16px 13px 46px',
    borderRadius: 14,
    border: `1.5px solid ${focused === field ? '#3dd68c' : '#eef0ec'}`,
    background: focused === field ? '#f8fffe' : '#f8faf8',
    fontSize: 14,
    color: '#1e293b',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Fraunces:wght@700;800;900&display=swap');
        ::placeholder { color: #cbd5e1; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(150deg, #f4f9f5 0%, #eef7f0 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* ── Left decorative panel (hidden on mobile) ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '60px 48px',
          background: 'linear-gradient(160deg, #0f4c2a 0%, #1a6b3a 60%, #22874a 100%)',
          position: 'relative', overflow: 'hidden',
        }} className="hidden lg:flex">

          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(61,214,140,0.08)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(61,214,140,0.06)' }} />
          <motion.div
            style={{ position: 'absolute', top: '30%', right: '10%', width: 80, height: 80, borderRadius: '50% 0 50% 0', background: 'rgba(61,214,140,0.12)' }}
            animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 360 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Sprout style={{ width: 24, height: 24, color: '#a7f3d0' }} />
              </div>
              <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: "'Fraunces', serif", letterSpacing: '-0.5px' }}>AgroLink</span>
            </div>

            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1.15, margin: '0 0 16px', fontFamily: "'Fraunces', serif", letterSpacing: '-1px' }}>
              Apni kheti ko<br />
              <span style={{ color: '#a7f3d0', fontStyle: 'italic' }}>smart banao.</span>
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, margin: '0 0 40px' }}>
              AI se fasal diagnosis, live mausam, aur local marketplace — sab ek jagah.
            </p>

            {/* Testimonial */}
            <div style={{ padding: '20px 22px', borderRadius: 18, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#fde68a', fontSize: 13 }}>★</span>)}
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, margin: '0 0 14px', fontStyle: 'italic' }}>
                "Scanner ne 5 second mein bataya ki mere tamatar ko Early Blight hai."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #3dd68c, #22c074)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13 }}>R</div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 800, color: '#fff', margin: 0 }}>Piyush Patidar</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: '2px 0 0' }}>ujjain, MP</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Login form ── */}
        <div style={{
          width: '100%', maxWidth: 480,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '40px 32px',
          background: '#fff',
        }}>

          {/* Mobile logo */}
          <div className="flex lg:hidden" style={{ alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #3dd68c, #22c074)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sprout style={{ width: 20, height: 20, color: '#fff' }} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', fontFamily: "'Fraunces', serif" }}>AgroLink</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', maxWidth: 380 }}
          >
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.5px', fontFamily: "'Fraunces', serif" }}>
              Wapas aao! 👋
            </h1>
            <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 36px' }}>
              Apne account mein sign in karein
            </p>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: '12px 16px', borderRadius: 12, background: '#fff1f2', border: '1.5px solid #fecaca', marginBottom: 20 }}
                >
                  <p style={{ fontSize: 13, color: '#e11d48', fontWeight: 600, margin: 0 }}>⚠️ {error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Phone */}
              <div style={{ position: 'relative' }}>
                <Phone style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: focused === 'phone' ? '#3dd68c' : '#94a3b8', transition: 'color 0.2s' }} />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused('')}
                  required
                  style={inputStyle('phone')}
                />
              </div>

              {/* Password */}
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: focused === 'pass' ? '#3dd68c' : '#94a3b8', transition: 'color 0.2s' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('pass')}
                  onBlur={() => setFocused('')}
                  required
                  style={{ ...inputStyle('pass'), paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8' }}
                >
                  {showPass ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%', padding: '14px', borderRadius: 14,
                  border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #3dd68c, #22c074)',
                  color: '#fff', fontSize: 15, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 4px 16px rgba(52,214,140,0.35)',
                  marginTop: 6, opacity: isSubmitting ? 0.7 : 1,
                  fontFamily: "'DM Sans', sans-serif",
                }}
                whileHover={!isSubmitting ? { scale: 1.02, boxShadow: '0 6px 24px rgba(52,214,140,0.45)' } : {}}
                whileTap={!isSubmitting ? { scale: 0.97 } : {}}
              >
                {isSubmitting
                  ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                  : <><span>Sign In</span><ArrowRight style={{ width: 16, height: 16 }} /></>
                }
              </motion.button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#f1f5f2' }} />
              <span style={{ fontSize: 11, color: '#cbd5e1', fontWeight: 600 }}>NAYA ACCOUNT?</span>
              <div style={{ flex: 1, height: 1, background: '#f1f5f2' }} />
            </div>

            <Link to="/register" style={{ textDecoration: 'none', display: 'block' }}>
              <motion.div
                style={{
                  width: '100%', padding: '13px', borderRadius: 14,
                  border: '1.5px solid #eef0ec', background: '#f8faf8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  cursor: 'pointer',
                }}
                whileHover={{ borderColor: '#b2e8cc', background: '#f0fdf4' }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: '#475569', fontFamily: "'DM Sans', sans-serif" }}>
                  Register karein — bilkul free hai
                </span>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;