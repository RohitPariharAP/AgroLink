// client/src/pages/Forum.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchPosts, createPost, deletePostAPI, toggleLikeAPI } from '../api/posts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ThumbsUp, MessageCircle, MapPin, Tag, Loader2,
  ImagePlus, Trash2, Send, X, Leaf, MoreHorizontal,
  TrendingUp, Users, Sprout,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Stagger container variants ────────────────────────────────── */
const feedVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Avatar (UPDATED FOR CLOUDINARY IMAGES) ─────────────────────── */
const Avatar = ({ user, size = 10 }) => (
  <div
    className={`w-${size} h-${size} rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden`}
    style={{ background: 'linear-gradient(135deg, #3dd68c, #22c074)', boxShadow: '0 2px 8px rgba(52,214,140,0.3)', fontFamily: "'DM Sans', sans-serif" }}
  >
    {user?.avatar ? (
      <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
    ) : (
      user?.name?.charAt(0)?.toUpperCase() || 'U'
    )}
  </div>
);

/* ─── Tag chip ───────────────────────────────────────────────────── */
const TagChip = ({ tag }) => (
  <span
    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
    style={{ background: '#e8faf2', color: '#16a34a', border: '1px solid #bbf7d0' }}
  >
    #{tag}
  </span>
);

/* ─── Stat button ────────────────────────────────────────────────── */
const StatBtn = ({ icon: Icon, count, active, onClick, activeColor = '#16a34a', label }) => (
  <motion.button
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-150"
    style={{
      color: active ? activeColor : '#94a3b8',
      background: active ? '#e8faf2' : 'transparent',
    }}
    whileHover={{ scale: 1.06, background: '#f0fdf4' }}
    whileTap={{ scale: 0.93 }}
  >
    <Icon className={`w-4 h-4 ${active ? 'fill-current' : ''}`} style={{ color: active ? activeColor : undefined }} />
    <span style={{ color: active ? activeColor : '#64748b', fontFamily: "'DM Sans', sans-serif" }}>{count}</span>
    {label && <span className="hidden sm:inline text-xs font-medium text-slate-400">{label}</span>}
  </motion.button>
);

/* ─── Post Card ──────────────────────────────────────────────────── */
const PostCard = ({ post, userId, onLike, onDelete }) => {
  const isLiked   = post.upvotes?.includes(userId);
  const isAuthor  = post.author?._id === userId;
  const [menuOpen, setMenuOpen] = useState(false);
  const timeAgo   = (() => {
    const diff = (Date.now() - new Date(post.createdAt)) / 1000;
    if (diff < 60)    return 'just now';
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  })();

  return (
    <motion.article
      variants={cardVariants}
      className="relative overflow-hidden"
      style={{
        background: '#ffffff',
        border: '1.5px solid #eef0ec',
        borderRadius: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}
    >
      {/* Mint left accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[20px]"
        style={{ background: 'linear-gradient(180deg, #3dd68c 0%, #a7f3d0 100%)' }} />

      <div className="pl-5 pr-5 pt-5 pb-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar user={post.author} size={10} />
            <div>
              <p className="text-sm font-bold text-slate-800 leading-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {post.author?.name || 'Unknown'}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                {post.location?.district && (
                  <span className="flex items-center gap-0.5 text-[10px] text-slate-400 font-medium">
                    <MapPin className="w-2.5 h-2.5" />{post.location.district}
                  </span>
                )}
                <span className="text-[10px] text-slate-300">•</span>
                <span className="text-[10px] text-slate-400">{timeAgo}</span>
              </div>
            </div>
          </div>

          {/* More menu */}
          {isAuthor && (
            <div className="relative">
              <motion.button
                onClick={() => setMenuOpen(v => !v)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </motion.button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-10 z-10 py-1 rounded-xl overflow-hidden"
                    style={{ background: '#fff', border: '1.5px solid #eef0ec', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: 140 }}
                  >
                    <button
                      onClick={() => { setMenuOpen(false); onDelete(post._id); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete post
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Title + body */}
        <Link to={`/forum/${post._id}`} className="block group mb-3">
          <h3
            className="text-base font-extrabold text-slate-800 mb-1.5 group-hover:text-emerald-700 transition-colors leading-snug"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {post.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {post.content}
          </p>
        </Link>

        {/* Media grid */}
        {post.media?.length > 0 && (
          <div className={`grid gap-1.5 mb-3 rounded-2xl overflow-hidden ${
            post.media.length === 1 ? 'grid-cols-1' :
            post.media.length === 2 ? 'grid-cols-2' :
            post.media.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
          }`}>
            {post.media.slice(0, 4).map((url, i) => (
              <div key={i} className="relative overflow-hidden" style={{ aspectRatio: post.media.length === 1 ? '16/9' : '1/1' }}>
                <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                {i === 3 && post.media.length > 4 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-black text-xl">+{post.media.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map((tag, i) => <TagChip key={i} tag={tag} />)}
          </div>
        )}

        {/* Divider */}
        <div className="h-px my-2" style={{ background: '#f1f5f2' }} />

        {/* Action row */}
        <div className="flex items-center gap-1">
          <StatBtn
            icon={ThumbsUp}
            count={post.upvotes?.length || 0}
            active={isLiked}
            onClick={() => onLike(post._id)}
            label="Like"
          />
          <Link to={`/forum/${post._id}`}>
            <StatBtn
              icon={MessageCircle}
              count={post.commentCount || 0}
              active={false}
              label="Comment"
            />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

/* ─── Compose Box ────────────────────────────────────────────────── */
const ComposeBox = ({ user, onSubmit }) => {
  const [open, setOpen]           = useState(false);
  const [newPost, setNewPost]     = useState({ title: '', content: '', tags: '' });
  const [files, setFiles]         = useState([]);
  const [previews, setPreviews]   = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleFiles = (e) => {
    const sel = Array.from(e.target.files).slice(0, 4);
    setFiles(sel);
    setPreviews(sel.map(f => URL.createObjectURL(f)));
  };

  const removeFile = (i) => {
    setFiles(f => f.filter((_, idx) => idx !== i));
    setPreviews(p => p.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', newPost.title);
      fd.append('content', newPost.content);
      fd.append('tags', newPost.tags);
      fd.append('type', 'question');
      files.forEach(f => fd.append('media', f));
      await onSubmit(fd);
      setNewPost({ title: '', content: '', tags: '' });
      setFiles([]); setPreviews([]);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="overflow-hidden"
      style={{ background: '#fff', border: '1.5px solid #eef0ec', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
    >
      {/* Trigger row */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Avatar user={user} size={10} />
        <div
          className="flex-1 px-4 py-2.5 rounded-xl text-sm text-slate-400 cursor-pointer select-none"
          style={{ background: '#f8faf8', border: '1.5px solid #eef0ec', fontFamily: "'DM Sans', sans-serif" }}
        >
          Share something with the community…
        </div>
        <motion.button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #3dd68c, #22c074)', boxShadow: '0 3px 10px rgba(52,214,140,0.3)' }}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline" style={{ fontFamily: "'DM Sans', sans-serif" }}>Post</span>
        </motion.button>
      </div>

      {/* Expanded compose */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <form onSubmit={handleSubmit}>
              <div className="px-5 pb-5 space-y-3" style={{ borderTop: '1.5px solid #f1f5f2' }}>
                <div className="pt-4">
                  <input
                    required
                    type="text"
                    placeholder="Give your post a title…"
                    value={newPost.title}
                    onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full text-base font-bold text-slate-800 placeholder-slate-300 bg-transparent outline-none border-none"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the issue, crop condition, or question in detail…"
                  value={newPost.content}
                  onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full text-sm text-slate-600 placeholder-slate-300 bg-transparent outline-none border-none resize-none leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />

                {/* Image previews */}
                {previews.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {previews.map((src, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                        style={{ border: '1.5px solid #eef0ec' }}>
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom toolbar */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  {/* Tags */}
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl flex-1 min-w-0"
                    style={{ background: '#f8faf8', border: '1.5px solid #eef0ec' }}>
                    <Tag className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Tags (wheat, disease…)"
                      value={newPost.tags}
                      onChange={e => setNewPost({ ...newPost, tags: e.target.value })}
                      className="text-xs outline-none border-none bg-transparent w-full text-slate-600 placeholder-slate-300"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>

                  {/* Image picker */}
                  <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer transition-colors"
                    style={{ background: '#f8faf8', border: '1.5px solid #eef0ec' }}>
                    <ImagePlus className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {files.length ? `${files.length} photo${files.length > 1 ? 's' : ''}` : 'Photo'}
                    </span>
                    <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
                  </label>

                  {/* Cancel */}
                  <motion.button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                    whileTap={{ scale: 0.95 }}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Cancel
                  </motion.button>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #3dd68c, #22c074)', boxShadow: '0 3px 10px rgba(52,214,140,0.25)' }}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  >
                    {submitting
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <><Send className="w-3.5 h-3.5" /><span style={{ fontFamily: "'DM Sans', sans-serif" }}>Post</span></>
                    }
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Sidebar stat card ──────────────────────────────────────────── */
const SideStatCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: '#f8faf8', border: '1.5px solid #eef0ec' }}>
    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: color + '18', border: `1.5px solid ${color}33` }}>
      <Icon className="w-4 h-4" style={{ color }} />
    </div>
    <div>
      <p className="text-xs text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
      <p className="text-sm font-bold text-slate-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>{value}</p>
    </div>
  </div>
);

/* ─── Main Forum Page ────────────────────────────────────────────── */
const Forum = () => {
  const { user }   = useContext(AuthContext);
  const [posts, setPosts]       = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts()
      .then(data => setPosts(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (fd) => {
    const created = await createPost(fd);
    setPosts(prev => [created, ...prev]);
  };

  const handleLike = async (id) => {
    const updatedUpvotes = await toggleLikeAPI(id);
    setPosts(prev => prev.map(p => p._id === id ? { ...p, upvotes: updatedUpvotes } : p));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    await deletePostAPI(id);
    setPosts(prev => prev.filter(p => p._id !== id));
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
        <Leaf className="w-8 h-8 text-emerald-400" />
      </motion.div>
      <p className="text-sm text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>Loading community feed…</p>
    </div>
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');`}</style>

      <div className="max-w-5xl mx-auto">

        {/* Page heading */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Community Feed
          </h2>
          <p className="text-sm text-slate-400 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Ask questions, share discoveries, help your fellow farmers
          </p>
        </motion.div>

        {/* Two-column layout on large screens */}
        <div className="flex gap-6 items-start">

          {/* ── Main feed column ── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Compose */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
              <ComposeBox user={user} onSubmit={handleSubmit} />
            </motion.div>

            {/* Feed */}
            {posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-16 rounded-2xl"
                style={{ background: '#fff', border: '1.5px solid #eef0ec' }}
              >
                <Sprout className="w-10 h-10 text-emerald-300 mx-auto mb-3" />
                <p className="text-slate-500 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>No posts yet — be the first to share!</p>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-6"
                variants={feedVariants}
                initial="hidden"
                animate="show"
              >
                {posts.map(post => (
                  <PostCard
                    key={post._id}
                    post={post}
                    userId={user?._id}
                    onLike={handleLike}
                    onDelete={handleDelete}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* ── Right sidebar (desktop only) ── */}
          <aside className="hidden lg:flex flex-col gap-4 flex-shrink-0" style={{ width: 240 }}>
            <motion.div
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="p-4 rounded-2xl space-y-3"
              style={{ background: '#fff', border: '1.5px solid #eef0ec', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              {/* Your profile mini */}
              <div className="flex items-center gap-3 pb-3" style={{ borderBottom: '1.5px solid #f1f5f2' }}>
                <Avatar user={user} size={10} />
                <div>
                  <p className="text-sm font-bold text-slate-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>{user?.name}</p>
                  
                </div>
              </div>

              <p className="text-[10px] font-bold text-slate-300 tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Community Stats
              </p>
              <SideStatCard icon={Users}      label="Members"    value="1,240"              color="#3dd68c" />
              <SideStatCard icon={TrendingUp} label="Posts today" value={posts.length}      color="#38bdf8" />
              <SideStatCard icon={MessageCircle} label="Replies" value="3.4k"               color="#f59e0b" />
            </motion.div>

            {/* Trending tags */}
            <motion.div
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.22 }}
              className="p-4 rounded-2xl"
              style={{ background: '#fff', border: '1.5px solid #eef0ec', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <p className="text-[10px] font-bold text-slate-300 tracking-widest uppercase mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Trending Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Wheat','Pest','Irrigation','Maize','Disease','Organic','Soil'].map(t => (
                  <TagChip key={t} tag={t} />
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Forum;