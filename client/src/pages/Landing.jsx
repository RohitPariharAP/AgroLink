// client/src/pages/Landing.jsx
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Leaf, Scan, Users, ShoppingBag, CloudSun, ArrowRight, CheckCircle, Sprout, Wheat, Star } from 'lucide-react';

/* ─── Floating seed particle ─────────────────────────────────────── */
const Seed = ({ x, y, size, delay, duration }) => (
  <motion.div
    style={{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50% 0 50% 0', background: 'rgba(61,214,140,0.15)', pointerEvents: 'none' }}
    animate={{ y: [0, -30, 0], rotate: [0, 180, 360], opacity: [0.3, 0.7, 0.3] }}
    transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
);

/* ─── Feature card ───────────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, desc, checks, accent, iconBg, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -6, transition: { duration: 0.25 } }}
    style={{
      padding: '36px 32px',
      borderRadius: 28,
      background: '#fff',
      border: '1.5px solid #eef0ec',
      boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
      display: 'flex', flexDirection: 'column', gap: 0,
    }}
  >
    <div style={{
      width: 56, height: 56, borderRadius: 18,
      background: iconBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 24,
    }}>
      <Icon style={{ width: 26, height: 26, color: accent }} />
    </div>
    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 12px', fontFamily: "'Fraunces', serif" }}>
      {title}
    </h3>
    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75, margin: '0 0 24px', flex: 1, fontFamily: "'DM Sans', sans-serif" }}>
      {desc}
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {checks.map((c, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: accent + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle style={{ width: 11, height: 11, color: accent }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#475569', fontFamily: "'DM Sans', sans-serif" }}>{c}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

/* ─── Stat block ─────────────────────────────────────────────────── */
const Stat = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay }}
    style={{ textAlign: 'center' }}
  >
    <p style={{ fontSize: 42, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-2px', lineHeight: 1, fontFamily: "'Fraunces', serif" }}>
      {value}
    </p>
    <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.55)', margin: '6px 0 0', fontFamily: "'DM Sans', sans-serif" }}>
      {label}
    </p>
  </motion.div>
);

/* ─── Testimonial card ───────────────────────────────────────────── */
const Testimonial = ({ quote, name, location, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    style={{
      padding: '28px 28px 24px',
      borderRadius: 24,
      background: '#fff',
      border: '1.5px solid #eef0ec',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    }}
  >
    <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
      {[1,2,3,4,5].map(i => <Star key={i} style={{ width: 14, height: 14, color: '#f59e0b', fill: '#f59e0b' }} />)}
    </div>
    <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.75, margin: '0 0 20px', fontStyle: 'italic', fontFamily: "'DM Sans', sans-serif" }}>
      "{quote}"
    </p>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 38, height: 38, borderRadius: 12,
        background: 'linear-gradient(135deg, #3dd68c, #22c074)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 800, fontSize: 14,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {name.charAt(0)}
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{name}</p>
        <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0', fontFamily: "'DM Sans', sans-serif" }}>{location}</p>
      </div>
    </div>
  </motion.div>
);

/* ─── Main Landing ───────────────────────────────────────────────── */
const Landing = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const seeds = [
    { x: '8%',  y: '20%', size: 24, delay: 0,   duration: 6 },
    { x: '85%', y: '15%', size: 16, delay: 1.2, duration: 8 },
    { x: '75%', y: '55%', size: 20, delay: 0.6, duration: 7 },
    { x: '15%', y: '65%', size: 12, delay: 2,   duration: 5 },
    { x: '60%', y: '80%', size: 18, delay: 0.3, duration: 9 },
    { x: '40%', y: '10%', size: 14, delay: 1.8, duration: 6.5 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,800;0,900;1,700;1,800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #f4f9f5; }
        a { text-decoration: none; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #c8e6d0; border-radius: 99px; }
        .hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(52,214,140,0.4) !important; }
        .hero-btn-secondary:hover { background: #fff !important; border-color: #b2e8cc !important; }
        .nav-link:hover { color: #1e293b !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f4f9f5', fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Navbar ── */}
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            background: 'rgba(244,249,245,0.88)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1.5px solid rgba(200,230,208,0.6)',
          }}
        >
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 11,
                background: 'linear-gradient(135deg, #3dd68c, #22c074)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(52,214,140,0.35)',
              }}>
                <Sprout style={{ width: 20, height: 20, color: '#fff' }} />
              </div>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', fontFamily: "'Fraunces', serif" }}>
                AgroLink
              </span>
            </div>

            {/* Nav actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link to="/login">
                <span className="nav-link" style={{ fontSize: 13, fontWeight: 700, color: '#64748b', padding: '8px 16px', transition: 'color 0.15s' }}>
                  Login
                </span>
              </Link>
              <Link to="/register">
                <motion.span
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 13, fontWeight: 800, color: '#fff',
                    padding: '9px 20px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #3dd68c, #22c074)',
                    boxShadow: '0 3px 12px rgba(52,214,140,0.35)',
                  }}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                >
                  Start Free <ArrowRight style={{ width: 14, height: 14 }} />
                </motion.span>
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* ── Hero ── */}
        <section
          ref={heroRef}
          style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: 64 }}
        >
          {/* Mesh background */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(61,214,140,0.08)', filter: 'blur(80px)' }} />
            <div style={{ position: 'absolute', top: '40%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(34,192,116,0.07)', filter: 'blur(80px)' }} />
            <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(61,214,140,0.06)', filter: 'blur(60px)' }} />
          </div>

          {/* Floating seeds */}
          {seeds.map((s, i) => <Seed key={i} {...s} />)}

          <motion.div
            style={{ y: heroY, opacity: heroOpacity, width: '100%' }}
          >
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 28px 100px' }}>
              <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>

                {/* Pill badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, background: '#e8faf2', border: '1.5px solid #bbf7d0', marginBottom: 36 }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3dd68c', display: 'inline-block', boxShadow: '0 0 0 3px rgba(61,214,140,0.3)' }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#16a34a', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>
                    PWA · Works Offline
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ fontSize: 'clamp(42px, 7vw, 76px)', fontWeight: 900, color: '#0f172a', lineHeight: 1.07, letterSpacing: '-2px', margin: '0 0 24px', fontFamily: "'Fraunces', serif" }}
                >
                  Kheti ko banao{' '}
                  <span style={{ fontStyle: 'italic', background: 'linear-gradient(135deg, #3dd68c, #22c074)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    smart
                  </span>{' '}
                  aur shandaar.
                </motion.h1>

                {/* Subline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.32 }}
                  style={{ fontSize: 17, color: '#475569', lineHeight: 1.75, margin: '0 0 44px', fontFamily: "'DM Sans', sans-serif" }}
                >
                  AgroLink deta hai Indian farmers ko AI-powered fasal diagnosis, hyper-local mausam, aur direct marketplace — sab kuch ek hi jagah, Hindi mein.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.44 }}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}
                >
                  <Link to="/register">
                    <span
                      className="hero-btn-primary"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '16px 32px', borderRadius: 16,
                        background: 'linear-gradient(135deg, #3dd68c, #22c074)',
                        color: '#fff', fontSize: 15, fontWeight: 800,
                        boxShadow: '0 6px 24px rgba(52,214,140,0.32)',
                        transition: 'all 0.25s', fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Abhi Join Karein <ArrowRight style={{ width: 18, height: 18 }} />
                    </span>
                  </Link>
                  <a href="#features">
                    <span
                      className="hero-btn-secondary"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '16px 32px', borderRadius: 16,
                        background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
                        color: '#334155', fontSize: 15, fontWeight: 800,
                        border: '1.5px solid #d4ead9',
                        transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Features Dekho
                    </span>
                  </a>
                </motion.div>

                {/* Social proof row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 52 }}
                >
                  {/* Avatar stack */}
                  <div style={{ display: 'flex' }}>
                    {['R','S','A','M','P'].map((l, i) => (
                      <div key={i} style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: `hsl(${140 + i * 18}, 60%, ${45 + i * 5}%)`,
                        border: '2.5px solid #f4f9f5',
                        marginLeft: i === 0 ? 0 : -10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 11, fontWeight: 800,
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        {l}
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5].map(i => <Star key={i} style={{ width: 12, height: 12, color: '#f59e0b', fill: '#f59e0b' }} />)}
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0', fontFamily: "'DM Sans', sans-serif" }}>
                      <strong style={{ color: '#1e293b' }}>1,200+</strong> farmers already using AgroLink
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Stats banner ── */}
        <section style={{ background: 'linear-gradient(135deg, #0f4c2a 0%, #1a6b3a 60%, #22874a 100%)', padding: '60px 28px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {[
              { value: '1,200+', label: 'Active Farmers',    delay: 0 },
              { value: '50+',    label: 'Districts Covered', delay: 0.08 },
              { value: '98%',    label: 'AI Accuracy',       delay: 0.16 },
              { value: '₹0',     label: 'Commission Fees',   delay: 0.24 },
            ].map(s => <Stat key={s.label} {...s} />)}
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" style={{ padding: '100px 28px', background: '#f4f9f5' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>

            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <motion.p
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                style={{ fontSize: 11, fontWeight: 800, color: '#3dd68c', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 14px', fontFamily: "'DM Sans', sans-serif" }}
              >
                Kya milega aapko
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#0f172a', margin: '0 0 16px', letterSpacing: '-1px', fontFamily: "'Fraunces', serif" }}
              >
                Sab kuch jo ek kisan ko chahiye.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ fontSize: 15, color: '#64748b', maxWidth: 520, margin: '0 auto', lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif" }}
              >
                Rural connectivity ke liye banaya gaya — lightweight, fast, aur real problems solve karne wala.
              </motion.p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              <FeatureCard
                icon={Scan}
                title="AI Crop Scanner"
                desc="Beemar patte ki photo lo — AI turant disease diagnose karega aur sahi dawai ya fertilizer batayega. Koi internet? Offline bhi kaam karta hai."
                checks={['Results 10 second mein', 'Treatment recommendations Hindi mein']}
                accent="#16a34a" iconBg="#dcfce7" delay={0}
              />
              <FeatureCard
                icon={Users}
                title="Kisan Forum"
                desc="Akele mat ugao. Apni problems poochho, fasal ki photos share karo, aur dusre kisaanon se seekho. Points milenge madad karne par."
                checks={['Photo sharing', 'Reward points system']}
                accent="#2563eb" iconBg="#dbeafe" delay={0.08}
              />
              <FeatureCard
                icon={ShoppingBag}
                title="Local Marketplace"
                desc="Beechiye ko hatao. Apni fasal seedha khareedaron ko becho, ya apna tractor kiraye par do — zero commission fees ke saath."
                checks={['Zero commission', 'Direct buyer chat']}
                accent="#d97706" iconBg="#fef3c7" delay={0.16}
              />
              <FeatureCard
                icon={CloudSun}
                title="Live Mausam + Offline"
                desc="Aapke exact gaon ka mausam dekho. Internet nahi hai khet mein? PWA sab data cache kar leta hai — app chalti rahegi."
                checks={['GPS-accurate forecast', 'Home screen pe install ho']}
                accent="#7c3aed" iconBg="#ede9fe" delay={0.24}
              />
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section style={{ background: '#fff', padding: '90px 28px', borderTop: '1.5px solid #eef0ec' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <motion.p
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                style={{ fontSize: 11, fontWeight: 800, color: '#3dd68c', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 14px', fontFamily: "'DM Sans', sans-serif" }}
              >
                Kisan kya bolte hain
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', fontFamily: "'Fraunces', serif" }}
              >
                Real farmers, real results.
              </motion.h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              <Testimonial
                quote="Scanner ne 5 second mein bataya ki mere tamatar ko Early Blight hai. Pehle main 2 hafte doctor ke paas jaata tha."
                name="Ramesh Patel" location="Dewas, MP"
                delay={0}
              />
              <Testimonial
                quote="Marketplace mein apna tractor list kiya — 3 din mein rent pe chala gaya. Sidha paise aaye, koi beechiya nahi."
                name="Sukhwinder Singh" location="Ludhiana, Punjab"
                delay={0.1}
              />
              <Testimonial
                quote="Forum pe ek sawaal poocha gehun ke baare mein — 1 ghante mein 4 experienced kisaanon ne jawab diya. Maza aa gaya!"
                name="Anita Devi" location="Varanasi, UP"
                delay={0.2}
              />
            </div>
          </div>
        </section>

        {/* ── CTA banner ── */}
        <section style={{ background: 'linear-gradient(135deg, #0f4c2a, #22874a)', padding: '80px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none' }}>
            <Wheat style={{ width: 320, height: 320, color: '#fff', position: 'absolute', right: -40, top: -60 }} />
            <Leaf style={{ width: 200, height: 200, color: '#fff', position: 'absolute', left: -30, bottom: -40 }} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{ position: 'relative', zIndex: 1, maxWidth: 580, margin: '0 auto' }}
          >
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#fff', margin: '0 0 16px', lineHeight: 1.15, letterSpacing: '-1px', fontFamily: "'Fraunces', serif" }}>
              Taiyaar ho? Apni kheti badlo aaj se.
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', margin: '0 0 36px', lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif" }}>
              Free mein join karo. Koi hidden charge nahi. Apne phone pe install karo aur khet mein bhi use karo.
            </p>
            <Link to="/register">
              <motion.span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '16px 36px', borderRadius: 16,
                  background: '#fff', color: '#16a34a',
                  fontSize: 15, fontWeight: 900,
                  boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
              >
                Bilkul Free Join Karein <ArrowRight style={{ width: 18, height: 18 }} />
              </motion.span>
            </Link>
          </motion.div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ background: '#0a1a0f', padding: '48px 28px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 11,
              background: 'linear-gradient(135deg, #3dd68c, #22c074)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sprout style={{ width: 20, height: 20, color: '#fff' }} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', fontFamily: "'Fraunces', serif" }}>
              AgroLink
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#4a6956', fontFamily: "'DM Sans', sans-serif" }}>
            Indian farmers ke liye, Indian farmers ke saath. © {new Date().getFullYear()}
          </p>
        </footer>

      </div>
    </>
  );
};

export default Landing;