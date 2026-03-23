// client/src/pages/Register.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Lock, MapPin, Sprout, Loader2, ArrowRight, Eye, EyeOff, Home, Layers } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'farmer',
    language: 'hi',
    location: { village: '', district: '', state: '' },
    crops: ['Wheat'],
  });
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused]       = useState('');

  const { register } = useContext(AuthContext);
  const navigate     = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['village', 'district', 'state'].includes(name)) {
      setFormData(prev => ({ ...prev, location: { ...prev.location, [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '13px 16px 13px 44px',
    borderRadius: 14,
    border: `1.5px solid ${focused === field ? '#3dd68c' : '#eef0ec'}`,
    background: focused === field ? '#f8fffe' : '#f8faf8',
    fontSize: 14, color: '#1e293b', outline: 'none',
    transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
  });

  const iconStyle = (field) => ({
    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
    width: 16, height: 16,
    color: focused === field ? '#3dd68c' : '#94a3b8',
    transition: 'color 0.2s',
  });

  const STEPS = [
    { label: 'Personal', icon: '👤' },
    { label: 'Location', icon: '📍' },
  ];

  const steps = [
    { key: 'personal', label: 'Personal Info', icon: '👤' },
    { key: 'location', label: 'Your Location', icon: '📍' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Fraunces:wght@700;800;900&display=swap');
        ::placeholder { color: #cbd5e1; }
        select option { background: #fff; color: #1e293b; }
      `}</style>

      <div style={{
        minHeight: '100vh', display: 'flex',
        background: 'linear-gradient(150deg, #f4f9f5 0%, #eef7f0 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* ── Left panel ── */}
        <div
          style={{
            flex: 1, flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '60px 48px',
            background: 'linear-gradient(160deg, #0f4c2a 0%, #1a6b3a 60%, #22874a 100%)',
            position: 'relative', overflow: 'hidden',
          }}
          className="hidden lg:flex"
        >
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(61,214,140,0.08)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(61,214,140,0.06)' }} />
          <motion.div
            style={{ position: 'absolute', top: '25%', right: '8%', width: 60, height: 60, borderRadius: '50% 0 50% 0', background: 'rgba(61,214,140,0.15)' }}
            animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 360 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Sprout style={{ width: 24, height: 24, color: '#a7f3d0' }} />
              </div>
              <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: "'Fraunces', serif", letterSpacing: '-0.5px' }}>AgroLink</span>
            </div>

            <h2 style={{ fontSize: 34, fontWeight: 900, color: '#fff', lineHeight: 1.15, margin: '0 0 16px', fontFamily: "'Fraunces', serif", letterSpacing: '-1px' }}>
              Kisan community<br />
              <span style={{ color: '#a7f3d0', fontStyle: 'italic' }}>mein shaamil ho.</span>
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, margin: '0 0 44px' }}>
              Free mein register karo. Koi hidden charge nahi.
            </p>

            {/* Feature bullets */}
            {[
              { emoji: '🔬', text: 'AI se fasal disease diagnose karo' },
              { emoji: '🌾', text: 'Local marketplace mein seedha becho' },
              { emoji: '💬', text: 'Thousands of farmers se seekho' },
              { emoji: '🌤️', text: 'Apne gaon ka live mausam dekho' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}
              >
                <span style={{ fontSize: 18, width: 32, flexShrink: 0, textAlign: 'center' }}>{f.emoji}</span>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0, fontWeight: 500 }}>{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Right: Register form ── */}
        <div style={{
          width: '100%', maxWidth: 500,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '40px 32px',
          background: '#fff',
          overflowY: 'auto',
        }}>

          {/* Mobile logo */}
          <div className="flex lg:hidden" style={{ alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #3dd68c, #22c074)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sprout style={{ width: 20, height: 20, color: '#fff' }} />
            </div>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', fontFamily: "'Fraunces', serif" }}>AgroLink</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', maxWidth: 400 }}
          >
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px', fontFamily: "'Fraunces', serif" }}>
              Account banao 🌱
            </h1>
            <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 28px' }}>
              Sirf 1 minute mein ready ho jaoge
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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* ── Section: Personal ── */}
              <p style={{ fontSize: 9, fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '4px 0 4px', fontFamily: "'DM Sans', sans-serif" }}>
                Personal Details
              </p>

              {/* Name */}
              <div style={{ position: 'relative' }}>
                <User style={iconStyle('name')} />
                <input type="text" name="name" placeholder="Poora naam" value={formData.name}
                  onChange={handleChange} onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                  required style={inputStyle('name')} />
              </div>

              {/* Phone */}
              <div style={{ position: 'relative' }}>
                <Phone style={iconStyle('phone')} />
                <input type="tel" name="phone" placeholder="Phone number (10 digits)" value={formData.phone}
                  onChange={handleChange} onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                  required style={inputStyle('phone')} />
              </div>

              {/* Password */}
              <div style={{ position: 'relative' }}>
                <Lock style={iconStyle('pass')} />
                <input type={showPass ? 'text' : 'password'} name="password" placeholder="Password banao"
                  value={formData.password} onChange={handleChange}
                  onFocus={() => setFocused('pass')} onBlur={() => setFocused('')}
                  required style={{ ...inputStyle('pass'), paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8' }}>
                  {showPass ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>

              {/* Role */}
              <div style={{ position: 'relative' }}>
                <Layers style={iconStyle('role')} />
                <select name="role" value={formData.role} onChange={handleChange}
                  onFocus={() => setFocused('role')} onBlur={() => setFocused('')}
                  style={{ ...inputStyle('role'), appearance: 'none', cursor: 'pointer' }}>
                  <option value="farmer">🌾 Kisan (Farmer)</option>
                  <option value="buyer">🛒 Khareedaar (Buyer)</option>
                  <option value="expert">🔬 Expert / Advisor</option>
                </select>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: '#f1f5f2', margin: '6px 0' }} />

              {/* ── Section: Location ── */}
              <p style={{ fontSize: 9, fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 4px', fontFamily: "'DM Sans', sans-serif" }}>
                Aapka Sthan (Location)
              </p>

              {/* Village */}
              <div style={{ position: 'relative' }}>
                <Home style={iconStyle('village')} />
                <input type="text" name="village" placeholder="Gaon / Village" value={formData.location.village}
                  onChange={handleChange} onFocus={() => setFocused('village')} onBlur={() => setFocused('')}
                  required style={inputStyle('village')} />
              </div>

              {/* District + State */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ position: 'relative' }}>
                  <MapPin style={iconStyle('district')} />
                  <input type="text" name="district" placeholder="Zila / District" value={formData.location.district}
                    onChange={handleChange} onFocus={() => setFocused('district')} onBlur={() => setFocused('')}
                    required style={inputStyle('district')} />
                </div>
                <div style={{ position: 'relative' }}>
                  <MapPin style={iconStyle('state')} />
                  <input type="text" name="state" placeholder="Rajya / State" value={formData.location.state}
                    onChange={handleChange} onFocus={() => setFocused('state')} onBlur={() => setFocused('')}
                    required style={inputStyle('state')} />
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%', padding: '14px', borderRadius: 14, border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #3dd68c, #22c074)',
                  color: '#fff', fontSize: 15, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 4px 16px rgba(52,214,140,0.35)',
                  marginTop: 8, opacity: isSubmitting ? 0.7 : 1,
                  fontFamily: "'DM Sans', sans-serif",
                }}
                whileHover={!isSubmitting ? { scale: 1.02, boxShadow: '0 6px 24px rgba(52,214,140,0.45)' } : {}}
                whileTap={!isSubmitting ? { scale: 0.97 } : {}}
              >
                {isSubmitting
                  ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                  : <><span>Account Banao</span><ArrowRight style={{ width: 16, height: 16 }} /></>
                }
              </motion.button>
            </form>

            {/* Sign in link */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 20px' }}>
              <div style={{ flex: 1, height: 1, background: '#f1f5f2' }} />
              <span style={{ fontSize: 11, color: '#cbd5e1', fontWeight: 600 }}>PEHLE SE ACCOUNT HAI?</span>
              <div style={{ flex: 1, height: 1, background: '#f1f5f2' }} />
            </div>

            <Link to="/login" style={{ textDecoration: 'none', display: 'block' }}>
              <motion.div
                style={{
                  width: '100%', padding: '13px', borderRadius: 14,
                  border: '1.5px solid #eef0ec', background: '#f8faf8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer',
                }}
                whileHover={{ borderColor: '#b2e8cc', background: '#f0fdf4' }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: '#475569', fontFamily: "'DM Sans', sans-serif" }}>
                  Sign In karein
                </span>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Register;