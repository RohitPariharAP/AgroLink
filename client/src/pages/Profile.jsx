// client/src/pages/Profile.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchUserProfile, updateUserProfile } from '../api/users';
import {
  MapPin, Award, MessageSquare, ShoppingBag,
  Calendar, Loader2, Camera, Send, Leaf,
  IndianRupee, Hash, Star,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Badge config ───────────────────────────────────────────────── */
const getBadge = (pts = 0) => {
  if (pts >= 2000) return { title: 'Master Farmer', emoji: '👑', bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' };
  if (pts >= 500)  return { title: 'Harvester',     emoji: '🌾', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
  if (pts >= 100)  return { title: 'Cultivator',    emoji: '🌿', bg: '#e8faf2', color: '#16a34a', border: '#bbf7d0' };
  return              { title: 'Seedling',        emoji: '🌱', bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' };
};

/* ─── Stat pill ──────────────────────────────────────────────────── */
const StatPill = ({ icon: Icon, label, value, color = '#3dd68c' }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    padding: '16px 24px', borderRadius: 16,
    background: '#fff', border: '1.5px solid #eef0ec',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minWidth: 90,
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: color + '15', marginBottom: 2,
    }}>
      <Icon style={{ width: 18, height: 18, color }} />
    </div>
    <span style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>
      {value}
    </span>
    <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'DM Sans', sans-serif" }}>
      {label}
    </span>
  </div>
);

/* ─── Tab button ─────────────────────────────────────────────────── */
const TabBtn = ({ active, onClick, icon: Icon, label, count }) => (
  <motion.button
    onClick={onClick}
    style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      padding: '14px 0', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
      fontFamily: "'DM Sans', sans-serif', sans-serif",
      background: active ? '#fff' : 'transparent',
      color: active ? '#1e293b' : '#94a3b8',
      borderBottom: active ? '2px solid #3dd68c' : '2px solid transparent',
      transition: 'all 0.2s',
    }}
    whileHover={{ color: active ? '#1e293b' : '#475569' }}
    whileTap={{ scale: 0.97 }}
  >
    <Icon style={{ width: 15, height: 15 }} />
    {label}
    <span style={{
      fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 99,
      background: active ? '#e8faf2' : '#f1f5f9',
      color: active ? '#16a34a' : '#94a3b8',
    }}>
      {count}
    </span>
  </motion.button>
);

/* ─── Post list item ─────────────────────────────────────────────── */
const PostItem = ({ post }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
  >
    <Link to={`/forum/${post._id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <motion.div
        style={{
          padding: '18px 20px', borderRadius: 16,
          background: '#fff', border: '1.5px solid #eef0ec',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          position: 'relative', overflow: 'hidden',
        }}
        whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.07)', borderColor: '#b2e8cc' }}
        transition={{ duration: 0.2 }}
      >
        {/* Left accent */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
          background: 'linear-gradient(180deg, #3dd68c, #a7f3d0)',
          borderRadius: '16px 0 0 16px',
        }} />
        <div style={{ paddingLeft: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', margin: '0 0 6px', fontFamily: "'DM Sans', sans-serif" }}>
            {post.title}
          </h4>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif",
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.content}
          </p>
          {post.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {post.tags.slice(0, 3).map((t, i) => (
                <span key={i} style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
                  background: '#e8faf2', color: '#16a34a', border: '1px solid #bbf7d0',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  </motion.div>
);

/* ─── Product list item ──────────────────────────────────────────── */
const ProductItem = ({ product }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
  >
    <Link to="/marketplace" style={{ textDecoration: 'none', display: 'block' }}>
      <motion.div
        style={{
          display: 'flex', gap: 0, borderRadius: 16, overflow: 'hidden',
          background: '#fff', border: '1.5px solid #eef0ec',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
        whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.07)', borderColor: '#b2e8cc' }}
        transition={{ duration: 0.2 }}
      >
        {/* Image */}
        <div style={{ width: 100, height: 100, flexShrink: 0, background: '#f8faf8', overflow: 'hidden' }}>
          {product.images?.[0]
            ? <img src={product.images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag style={{ width: 28, height: 28, color: '#e2e8f0' }} />
              </div>
          }
        </div>
        {/* Info */}
        <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
          <span style={{
            fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 99, alignSelf: 'flex-start',
            background: '#e8faf2', color: '#16a34a', border: '1px solid #bbf7d0', fontFamily: "'DM Sans', sans-serif",
          }}>
            {product.category}
          </span>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', margin: 0, fontFamily: "'DM Sans', sans-serif",
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.title}
          </p>
          <p style={{ fontSize: 14, fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 2, fontFamily: "'DM Sans', sans-serif" }}>
            <IndianRupee style={{ width: 13, height: 13 }} />
            {Number(product.price).toLocaleString('en-IN')}
          </p>
        </div>
      </motion.div>
    </Link>
  </motion.div>
);

/* ─── Empty state ────────────────────────────────────────────────── */
const EmptyState = ({ icon: Icon, message }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 0', gap: 10 }}
  >
    <Icon style={{ width: 36, height: 36, color: '#e2e8f0' }} />
    <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
      {message}
    </p>
  </motion.div>
);

/* ─── Main Profile ───────────────────────────────────────────────── */
const Profile = () => {
  const { id }              = useParams();
  const { user: me }        = useContext(AuthContext);
  const navigate            = useNavigate();

  const [profileData, setProfileData]   = useState(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [activeTab, setActiveTab]       = useState('posts');
  const [isUploading, setIsUploading]   = useState(false);

  useEffect(() => {
    fetchUserProfile(id || me?._id)
      .then(data => setProfileData(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id, me]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const updated = await updateUserProfile(fd);
      setProfileData(prev => ({ ...prev, user: updated }));
    } catch {
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  /* Loading */
  if (isLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '96px 0', gap: 12 }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
        <Leaf style={{ width: 32, height: 32, color: '#3dd68c' }} />
      </motion.div>
      <p style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'DM Sans', sans-serif" }}>Loading profile…</p>
    </div>
  );

  if (!profileData) return (
    <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: "'DM Sans', sans-serif", color: '#94a3b8' }}>
      User not found.
    </div>
  );

  const { user, posts, products } = profileData;
  const isMyProfile = me?._id === user._id;
  const badge = getBadge(user.rewardPoints);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap');
        .avatar-label:hover .avatar-overlay { opacity: 1 !important; }
      `}</style>

      <div style={{ maxWidth: 760, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Hero card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: '#fff',
            border: '1.5px solid #e8f0ea',
            borderRadius: 24,
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            marginBottom: 28,
          }}
        >
          {/* Cover banner */}
          <div style={{
            height: 120,
            background: 'linear-gradient(135deg, #e8faf2 0%, #d4f5e7 40%, #bbf7d0 100%)',
            position: 'relative',
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(52,214,140,0.12)' }} />
            <div style={{ position: 'absolute', top: 20, right: 80, width: 60, height: 60, borderRadius: '50%', background: 'rgba(52,214,140,0.1)' }} />
            <div style={{ position: 'absolute', bottom: -20, left: 140, width: 80, height: 80, borderRadius: '50%', background: 'rgba(52,214,140,0.08)' }} />
          </div>

          <div style={{ padding: '0 32px 28px' }}>
            {/* Avatar row */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -44, marginBottom: 20 }}>

              {/* Avatar */}
              <label className="avatar-label" style={{ position: 'relative', cursor: isMyProfile ? 'pointer' : 'default', display: 'block' }}>
                <div style={{
                  width: 88, height: 88, borderRadius: 22,
                  border: '4px solid #fff',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  background: 'linear-gradient(135deg, #3dd68c, #22c074)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', position: 'relative',
                }}>
                  {user.avatar
                    ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 32, fontWeight: 900, color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
                        {user.name?.charAt(0)?.toUpperCase()}
                      </span>
                  }
                  {/* Upload overlay */}
                  {isMyProfile && (
                    <div className="avatar-overlay" style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 4, opacity: 0, transition: 'opacity 0.2s',
                    }}>
                      {isUploading
                        ? <Loader2 style={{ width: 22, height: 22, color: '#fff', animation: 'spin 1s linear infinite' }} />
                        : <>
                            <Camera style={{ width: 20, height: 20, color: '#fff' }} />
                            <span style={{ fontSize: 9, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Change</span>
                          </>
                      }
                    </div>
                  )}
                </div>
                {isMyProfile && <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} disabled={isUploading} />}
              </label>

              {/* Action button */}
              {!isMyProfile && (
                <motion.button
                  onClick={() => navigate('/chat', { state: { targetUser: user } })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '10px 22px', borderRadius: 14, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #3dd68c, #22c074)',
                    color: '#fff', fontSize: 13, fontWeight: 800,
                    boxShadow: '0 3px 12px rgba(52,214,140,0.3)',
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: 4,
                  }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                  <Send style={{ width: 14, height: 14 }} />
                  Message
                </motion.button>
              )}
            </div>

            {/* Name + meta */}
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-0.3px' }}>
              {user.name}
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              {user.location?.district && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                  <MapPin style={{ width: 14, height: 14, color: '#94a3b8' }} />
                  {user.location.district}
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                <Calendar style={{ width: 14, height: 14, color: '#94a3b8' }} />
                Joined {new Date(user.createdAt).getFullYear()}
              </span>
              {/* Badge */}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 99,
                background: badge.bg, color: badge.color, border: `1.5px solid ${badge.border}`,
              }}>
                {badge.emoji} {badge.title}
              </span>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <StatPill icon={Award}        label="Points"   value={user.rewardPoints || 0} color="#f59e0b" />
              <StatPill icon={MessageSquare} label="Posts"   value={posts.length}            color="#3dd68c" />
              <StatPill icon={ShoppingBag}  label="Listings" value={products.length}         color="#60a5fa" />
            </div>
          </div>
        </motion.div>

        {/* ── Activity section ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: '#fff',
            border: '1.5px solid #e8f0ea',
            borderRadius: 24,
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1.5px solid #f1f5f2',
            background: '#f8faf8',
          }}>
            <TabBtn
              active={activeTab === 'posts'}
              onClick={() => setActiveTab('posts')}
              icon={MessageSquare}
              label="Forum Posts"
              count={posts.length}
            />
            <TabBtn
              active={activeTab === 'products'}
              onClick={() => setActiveTab('products')}
              icon={ShoppingBag}
              label="Listings"
              count={products.length}
            />
          </div>

          {/* Content */}
          <div style={{ padding: '24px 24px 28px' }}>
            <AnimatePresence mode="wait">
              {activeTab === 'posts' && (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  {posts.length === 0
                    ? <EmptyState icon={MessageSquare} message="No forum posts yet" />
                    : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {posts.map(post => <PostItem key={post._id} post={post} />)}
                      </div>
                    )
                  }
                </motion.div>
              )}

              {activeTab === 'products' && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  {products.length === 0
                    ? <EmptyState icon={ShoppingBag} message="No marketplace listings yet" />
                    : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                        {products.map(product => <ProductItem key={product._id} product={product} />)}
                      </div>
                    )
                  }
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div style={{ height: 40 }} />
      </div>
    </>
  );
};

export default Profile;