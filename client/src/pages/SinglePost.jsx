// client/src/pages/SinglePost.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPostById, addComment } from '../api/posts';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, MessageCircle, MapPin, Loader2, Send, Leaf, Calendar, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── helpers ────────────────────────────────────────────────────── */
const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

/* ─── Avatar ─────────────────────────────────────────────────────── */
const Avatar = ({ name, px = 44 }) => (
  <div
    style={{
      width: px, height: px, borderRadius: px * 0.3,
      background: 'linear-gradient(135deg, #3dd68c, #22c074)',
      boxShadow: '0 3px 10px rgba(52,214,140,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 800, fontSize: px * 0.38,
      flexShrink: 0, fontFamily: "'DM Sans', sans-serif",
    }}
  >
    {name?.charAt(0)?.toUpperCase() || 'U'}
  </div>
);

/* ─── Tag pill ───────────────────────────────────────────────────── */
const Tag = ({ label }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 99,
    background: '#e8faf2', color: '#16a34a', border: '1.5px solid #bbf7d0',
    fontFamily: "'DM Sans', sans-serif",
  }}>
    <Hash style={{ width: 10, height: 10 }} />
    {label}
  </span>
);

/* ─── Comment row ────────────────────────────────────────────────── */
const CommentRow = ({ comment }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    style={{ display: 'flex', gap: 14 }}
  >
    {/* UPDATED: Profile Picture / Fallback Initial (38px) */}
    <div style={{
      width: 38, height: 38, borderRadius: '50%', background: '#f1f5f9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#334155', fontWeight: 'bold', overflow: 'hidden', flexShrink: 0,
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {comment.author?.avatar ? (
        <img 
          src={comment.author.avatar} 
          alt={comment.author?.name || "Commenter"} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      ) : (
        comment.author?.name?.charAt(0) || 'U'
      )}
    </div>

    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Bubble */}
      <div style={{
        background: '#fff',
        border: '1.5px solid #eef0ec',
        borderRadius: '4px 18px 18px 18px',
        padding: '14px 18px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', fontFamily: "'DM Sans', sans-serif" }}>
            {comment.author?.name || 'Unknown'}
          </span>
          <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: "'DM Sans', sans-serif" }}>
            {timeAgo(comment.createdAt)}
          </span>
        </div>
        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.65, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
          {comment.content}
        </p>
      </div>
    </div>
  </motion.div>
);

/* ─── Main ───────────────────────────────────────────────────────── */
const SinglePost = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useContext(AuthContext);

  const [data, setData]             = useState({ post: null, comments: [] });
  const [isLoading, setIsLoading]   = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getPostById(id)
      .then(r => setData(r))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleAddComment = async (e) => {
    e?.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const added = await addComment(id, { content: newComment });
      setData(prev => ({ ...prev, comments: [...prev.comments, added] }));
      setNewComment('');
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  /* Loading */
  if (isLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '96px 0', gap: 12 }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
        <Leaf style={{ width: 32, height: 32, color: '#3dd68c' }} />
      </motion.div>
      <p style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'DM Sans', sans-serif" }}>Loading post…</p>
    </div>
  );

  /* Not found */
  if (!data.post) return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <p style={{ color: '#94a3b8', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>Post not found.</p>
      <Link to="/forum" style={{ color: '#3dd68c', fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>
        <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Forum
      </Link>
    </div>
  );

  const { post, comments } = data;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap');
        .sp-input::placeholder { color: #cbd5e1; }
        .sp-input:focus { outline: none; }
      `}</style>

      <div style={{ maxWidth: 720, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Back ── */}
        <motion.div
          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginBottom: 28 }}
        >
          <Link to="/forum">
            <motion.span
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.15s' }}
              whileHover={{ x: -4, color: '#3dd68c' }}
            >
              <ArrowLeft style={{ width: 16, height: 16 }} />
              Back to Forum
            </motion.span>
          </Link>
        </motion.div>

        {/* ── Post card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: '#fff',
            border: '1.5px solid #e8f0ea',
            borderRadius: 24,
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            marginBottom: 32,
            overflow: 'hidden',
          }}
        >
          {/* Top mint bar */}
          <div style={{ height: 4, background: 'linear-gradient(90deg, #3dd68c 0%, #a7f3d0 60%, transparent 100%)' }} />

          <div style={{ padding: '32px 36px 28px' }}>

            {/* Author + action */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-white font-bold text-xl overflow-hidden flex-shrink-0">
  {post.author?.avatar ? (
    <img src={post.author.avatar} alt="Author" className="w-full h-full object-cover" />
  ) : (
    post.author?.name?.charAt(0) || 'U'
  )}
</div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', margin: 0, lineHeight: 1.2 }}>
                    {post.author?.name || 'Unknown'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5 }}>
                    {post.location?.district && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#94a3b8' }}>
                        <MapPin style={{ width: 12, height: 12 }} />
                        {post.location.district}
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#94a3b8' }}>
                      <Calendar style={{ width: 12, height: 12 }} />
                      {timeAgo(post.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {post.author?._id !== user?._id && (
                <motion.button
                  onClick={() => navigate('/chat', { state: { targetUser: post.author } })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 18px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #3dd68c, #22c074)',
                    color: '#fff', fontSize: 12, fontWeight: 800,
                    boxShadow: '0 3px 12px rgba(52,214,140,0.3)',
                    fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
                  }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                  <Send style={{ width: 13, height: 13 }} />
                  Message
                </motion.button>
              )}
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 26, fontWeight: 900, color: '#0f172a',
              lineHeight: 1.25, margin: '0 0 16px', letterSpacing: '-0.3px',
            }}>
              {post.title}
            </h1>

            {/* Body */}
            <p style={{
              fontSize: 15, color: '#475569', lineHeight: 1.75,
              margin: '0 0 28px', whiteSpace: 'pre-wrap',
            }}>
              {post.content}
            </p>

            {/* Media */}
            {post.media?.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: post.media.length === 1 ? '1fr' : post.media.length === 2 ? '1fr 1fr' : 'repeat(3, 1fr)',
                gap: 8, marginBottom: 28, borderRadius: 16, overflow: 'hidden',
              }}>
                {post.media.map((url, i) => (
                  <div key={i} style={{ aspectRatio: post.media.length === 1 ? '16/9' : '1/1', overflow: 'hidden', borderRadius: 12 }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', display: 'block' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {post.tags.map((tag, i) => <Tag key={i} label={tag} />)}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Comments ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#e8faf2', border: '1.5px solid #bbf7d0',
            }}>
              <MessageCircle style={{ width: 18, height: 18, color: '#16a34a' }} />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', margin: 0 }}>
              Answers &amp; Discussion
            </h2>
            <span style={{
              marginLeft: 'auto', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
              background: '#f1f5f9', color: '#64748b', border: '1.5px solid #e2e8f0',
            }}>
              {comments.length} {comments.length === 1 ? 'reply' : 'replies'}
            </span>
          </div>

          {/* Compose area */}
         <div style={{
            background: '#fff',
            border: '1.5px solid #e8f0ea',
            borderRadius: 20,
            padding: '20px 24px',
            marginBottom: 32,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              
              {/* UPDATED: Current User Avatar logic with your new styles */}
              <div style={{
                width: 40, height: 40, borderRadius: '50%', background: '#3dd68c',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 'bold', overflow: 'hidden', flexShrink: 0,
                fontFamily: "'DM Sans', sans-serif"
              }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.name?.charAt(0) || 'U'
                )}
              </div>

              <div style={{ flex: 1 }}>
                <textarea
                  rows={3}
                  placeholder="Share your knowledge or experience…"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="sp-input"
                  style={{
                    width: '100%', resize: 'none', background: '#f8faf8',
                    border: '1.5px solid #eef0ec', borderRadius: 14,
                    padding: '12px 16px', fontSize: 14, color: '#334155',
                    lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif",
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = '#3dd68c'}
                  onBlur={e => e.target.style.borderColor = '#eef0ec'}
                  onKeyDown={e => e.key === 'Enter' && e.ctrlKey && handleAddComment(e)}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  <span style={{ fontSize: 11, color: '#cbd5e1', fontFamily: "'DM Sans', sans-serif" }}>
                    Ctrl + Enter to post
                  </span>
                  <motion.button
                    onClick={handleAddComment}
                    disabled={isSubmitting || !newComment.trim()}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '10px 22px', borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: newComment.trim()
                        ? 'linear-gradient(135deg, #3dd68c, #22c074)'
                        : '#f1f5f9',
                      color: newComment.trim() ? '#fff' : '#94a3b8',
                      fontSize: 13, fontWeight: 800,
                      boxShadow: newComment.trim() ? '0 3px 12px rgba(52,214,140,0.3)' : 'none',
                      fontFamily: "'DM Sans', sans-serif",
                      transition: 'all 0.2s',
                    }}
                    whileHover={newComment.trim() ? { scale: 1.04 } : {}}
                    whileTap={newComment.trim() ? { scale: 0.96 } : {}}
                  >
                    {isSubmitting
                      ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
                      : <Send style={{ width: 14, height: 14 }} />
                    }
                    Post Answer
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments list */}
          <AnimatePresence>
            {comments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '60px 0', gap: 12,
                  background: '#fff', border: '1.5px solid #eef0ec',
                  borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
              >
                <MessageCircle style={{ width: 36, height: 36, color: '#e2e8f0' }} />
                <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                  No answers yet
                </p>
                <p style={{ fontSize: 12, color: '#cbd5e1', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                  Be the first to help this farmer!
                </p>
              </motion.div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {comments.map((comment, i) => (
                  <CommentRow key={comment._id || i} comment={comment} />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Comments list */}
        

          {/* Bottom padding */}
          <div style={{ height: 40 }} />
        </motion.div>

      </div>
    </>
  );
};

export default SinglePost;