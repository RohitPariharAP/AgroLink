// client/src/pages/Dashboard.jsx
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  CloudRain, Sun, Cloud, Scan, MessageSquare, ShoppingBag,
  Award, ChevronRight, Leaf, Sparkles, Loader2, MapPin,
  Wind, Droplets, Thermometer,MessageCircle
} from 'lucide-react';

/* ─── Quick action config ────────────────────────────────────────── */
const ACTIONS = [
  {
    to: '/scanner',
    icon: Scan,
    title: 'Crop Scanner AI',
    desc: 'Upload a leaf photo — get instant disease diagnosis',
    cta: 'Scan now',
    accent: '#16a34a',
    bg: '#f0fdf4',
    iconBg: '#dcfce7',
  },
  {
    to: '/forum',
    icon: MessageSquare,
    title: 'Community Forum',
    desc: 'Ask questions and learn from fellow farmers',
    cta: 'Join discussion',
    accent: '#2563eb',
    bg: '#eff6ff',
    iconBg: '#dbeafe',
  },
  {
    to: '/marketplace',
    icon: ShoppingBag,
    title: 'Marketplace',
    desc: 'Buy, sell or rent farming equipment locally',
    cta: 'Browse market',
    accent: '#d97706',
    bg: '#fffbeb',
    iconBg: '#fef3c7',
  },
  {
    to: '/chat',
    icon: MessageCircle,
    title: 'Live Expert Chat',
    desc: 'Message agronomists directly in real-time',
    cta: 'Start chatting',
    accent: '#8b5cf6', // A nice purple color
    bg: '#f5f3ff',
    iconBg: '#ede9fe',
  }
];

/* ─── Weather icon helper ────────────────────────────────────────── */
const WeatherIcon = ({ condition, size = 40 }) => {
  const s = { width: size, height: size };
  if (!condition) return <Sun style={{ ...s, color: '#f59e0b' }} />;
  const c = condition.toLowerCase();
  if (c.includes('rain') || c.includes('drizzle')) return <CloudRain style={{ ...s, color: '#60a5fa' }} />;
  if (c.includes('cloud'))  return <Cloud style={{ ...s, color: '#94a3b8' }} />;
  return <Sun style={{ ...s, color: '#f59e0b' }} />;
};

/* ─── Main Dashboard ─────────────────────────────────────────────── */
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [weather, setWeather]       = useState(null);
  const [aiTip, setAiTip]           = useState('');
  const [isTipLoading, setIsTipLoading] = useState(true);
  const [locationName, setLocationName] = useState('');

  /* ── 1. Weather — use user's registered district directly ── */
  useEffect(() => {
    if (!user) return;

    // ✅ FIX: Read from the user profile's district field directly —
    // no GPS fallback that was overriding it with 'Dewas'.
    const city = user?.location?.district?.trim() || 'ujjain';
    setLocationName(city);

    const fetchWeather = async () => {
      const API_KEY = 'cc51cc81a25b5f1cc246a8a8efb89318';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&units=metric&appid=${API_KEY}`;
      try {
        const res = await axios.get(url);
        setWeather({
          temp:      Math.round(res.data.main.temp),
          feelsLike: Math.round(res.data.main.feels_like),
          humidity:  res.data.main.humidity,
          wind:      res.data.wind.speed,
          condition: res.data.weather[0].main,
          desc:      res.data.weather[0].description,
        });
        // Use the actual city name returned by API for accuracy
        setLocationName(res.data.name || city);
      } catch {
        setWeather({ temp: 32, feelsLike: 34, humidity: 55, wind: 3.2, condition: 'Clear', desc: 'clear sky' });
      }
    };
    fetchWeather();
  }, [user]);

  /* ── 2. AI tip — wait for weather before calling ── */
  useEffect(() => {
    if (!weather || !locationName) return;
    setIsTipLoading(true);

    const getDailyTip = async () => {
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) throw new Error('Missing key');

        const month = new Date().toLocaleString('default', { month: 'long' });
        const prompt = `Aap ek expert Indian agricultural AI assistant hain jo farmers ko farming advice dete hain. Location: ${locationName}. Mahina: ${month}. Mausam: ${weather.temp}°C, ${weather.condition}. Bilkul 2 chhote, seedhe kaam ki farming sentences likhein jo is temperature aur mausam ke hisaab se sahi fasal bataye. Hinglish mein likhein (Hindi + thoda English mix) — jaise ki aam Indian farmer bolta hai. 30 se kam words mein. "AI Salah: " se shuru karein. Koi heavy English nahi.`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          }
        );
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) setAiTip(text.trim());
        else throw new Error('No text');
      } catch {
        if (weather.temp > 30)
          setAiTip(`AI Salah: ${locationName} mein ${weather.temp}°C garmi hai — Maize, Mung Bean ya Lobia ugayein. Din mein 2 baar sinchai zaroor karein.`);
        else if (weather.temp < 20)
          setAiTip(`AI Salah: ${locationName} mein ${weather.temp}°C thandi hai — Gehun aur Sarson ke liye sahi mausam hai. Pala padhne se bachayein.`);
        else
          setAiTip(`AI Salah: ${locationName} mein ${weather.temp}°C ka mausam theek hai. Fasal mein kide-makode check karein aur mitti ki sehat banaye rakhein.`);
      } finally {
        setIsTipLoading(false);
      }
    };
    getDailyTip();
  }, [weather, locationName]);

  const firstName = user?.name?.split(' ')[0] || 'Farmer';

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

      <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Page greeting ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 28 }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {firstName} 👋
          </h2>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>
            Here's what's happening on your farm today
          </p>
        </motion.div>

        {/* ── Top row: Hero + Weather ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20, marginBottom: 20 }}>

          {/* Hero / AI card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(135deg, #0f4c2a 0%, #1a6b3a 60%, #22874a 100%)',
              borderRadius: 24,
              padding: '32px 32px 28px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(15,76,42,0.25)',
            }}
          >
            {/* Decorative leaf */}
            <div style={{ position: 'absolute', right: -24, top: -24, opacity: 0.06 }}>
              <Leaf style={{ width: 200, height: 200, color: '#fff' }} />
            </div>
            <div style={{ position: 'absolute', left: -16, bottom: -24, opacity: 0.04 }}>
              <Leaf style={{ width: 140, height: 140, color: '#fff' }} />
            </div>

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>
                AgroLink Dashboard
              </p>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 20px', lineHeight: 1.2, letterSpacing: '-0.3px' }}>
                Welcome back,<br />{firstName}! 🌾
              </h1>

              {/* AI tip panel */}
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                borderRadius: 16,
                padding: '16px 18px',
                border: '1px solid rgba(255,255,255,0.15)',
                marginBottom: 20,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <Sparkles style={{ width: 16, height: 16, color: '#fde68a', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                      Aaj Ki Kisan Salah
                    </p>
                    {isTipLoading ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Loader2 style={{ width: 14, height: 14, color: '#a7f3d0', animation: 'spin 1s linear infinite' }} />
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                          Analyzing climate for {locationName}…
                        </p>
                      </div>
                    ) : (
                      <p style={{ fontSize: 13, color: '#fff', lineHeight: 1.6, margin: 0 }}>{aiTip}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Points badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Award style={{ width: 18, height: 18, color: '#fde68a' }} />
                <div>
                  <p style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>{user?.rewardPoints || 0}</p>
                  <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.5)', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reward Points</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Weather card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: '#fff',
              border: '1.5px solid #e8f0ea',
              borderRadius: 24,
              padding: '24px 22px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}
          >
            {/* Location */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>
                    Live Weather
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin style={{ width: 13, height: 13, color: '#3dd68c' }} />
                    {locationName || '…'}
                  </p>
                </div>
                <WeatherIcon condition={weather?.condition} size={38} />
              </div>

              {weather ? (
                <>
                  <p style={{ fontSize: 44, fontWeight: 900, color: '#0f172a', margin: '0 0 2px', lineHeight: 1, letterSpacing: '-2px' }}>
                    {weather.temp}°
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#64748b', margin: '0 0 18px', textTransform: 'capitalize' }}>
                    {weather.desc}
                  </p>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0 18px' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Loader2 style={{ width: 20, height: 20, color: '#3dd68c' }} />
                  </motion.div>
                  <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Fetching…</p>
                </div>
              )}
            </div>

            {/* Stats row */}
            {weather && (
              <div style={{ borderTop: '1.5px solid #f1f5f2', paddingTop: 16, display: 'flex', gap: 0 }}>
                {[
                  { icon: Droplets,    label: 'Humidity', value: `${weather.humidity}%` },
                  { icon: Wind,        label: 'Wind',     value: `${weather.wind} m/s` },
                  { icon: Thermometer, label: 'Feels',    value: `${weather.feelsLike}°` },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                    <s.icon style={{ width: 14, height: 14, color: '#94a3b8', margin: '0 auto 3px', display: 'block' }} />
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#334155', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{s.value}</p>
                    <p style={{ fontSize: 9, color: '#94a3b8', margin: '1px 0 0', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Quick actions ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{ marginBottom: 8 }}
        >
          <p style={{ fontSize: 11, fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 14px', fontFamily: "'DM Sans', sans-serif" }}>
            What would you like to do?
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={action.to} to={action.to} style={{ textDecoration: 'none' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.18 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: '#fff',
                    border: '1.5px solid #eef0ec',
                    borderRadius: 20,
                    padding: '22px 22px 20px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    cursor: 'pointer', height: '100%',
                    display: 'flex', flexDirection: 'column', gap: 0,
                  }}
                  whileHover={{ y: -4, boxShadow: '0 10px 32px rgba(0,0,0,0.09)', borderColor: action.accent + '44' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: action.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                  }}>
                    <Icon style={{ width: 22, height: 22, color: action.accent }} />
                  </div>

                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', margin: '0 0 7px', fontFamily: "'DM Sans', sans-serif" }}>
                    {action.title}
                  </h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 18px', lineHeight: 1.6, flex: 1, fontFamily: "'DM Sans', sans-serif" }}>
                    {action.desc}
                  </p>

                  {/* CTA row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: action.accent, fontFamily: "'DM Sans', sans-serif" }}>
                      {action.cta}
                    </span>
                    <ChevronRight style={{ width: 14, height: 14, color: action.accent }} />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        <div style={{ height: 40 }} />
      </div>
    </>
  );
};

export default Dashboard;