// client/src/pages/Marketplace.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchProducts, createProduct, deleteProductAPI } from '../api/products';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, X, MapPin, Loader2, ImagePlus,
  Trash2, IndianRupee, Send, Tag, Layers,
  MoreHorizontal, Leaf, SlidersHorizontal, Star,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ─── Stagger variants ───────────────────────────────────────────── */
const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Category config ────────────────────────────────────────────── */
const CATEGORIES = [
  { label: 'All',         emoji: '🌾' },
  { label: 'Equipment',   emoji: '🚜' },
  { label: 'Seeds',       emoji: '🌱' },
  { label: 'Fertilizers', emoji: '🧪' },
  { label: 'Crops',       emoji: '🌽' },
  { label: 'Other',       emoji: '📦' },
];

const CONDITIONS = ['New', 'Good', 'Fair', 'Used'];

/* ─── Seller avatar ──────────────────────────────────────────────── */
const Avatar = ({ name, size = 8 }) => (
  <div
    className={`w-${size} h-${size} rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
    style={{ background: 'linear-gradient(135deg, #3dd68c, #22c074)', boxShadow: '0 2px 6px rgba(52,214,140,0.28)', fontFamily: "'DM Sans', sans-serif" }}
  >
    {name?.charAt(0)?.toUpperCase() || 'U'}
  </div>
);

/* ─── Condition badge ────────────────────────────────────────────── */
const ConditionBadge = ({ condition }) => {
  const map = {
    New:  { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
    Good: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    Fair: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    Used: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  };
  const s = map[condition] || map.Good;
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {condition}
    </span>
  );
};

/* ─── Product card ───────────────────────────────────────────────── */
const ProductCard = ({ product, userId, onDelete, onMessage }) => {
  const isOwner  = product.seller?._id === userId;
  const [menu, setMenu] = useState(false);
  const catEmoji = CATEGORIES.find(c => c.label === product.category)?.emoji || '📦';

  return (
    <motion.div
      variants={cardVariants}
      className="relative flex flex-col overflow-hidden group"
      style={{
        background: '#ffffff',
        border: '1.5px solid #eef0ec',
        borderRadius: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}
    >
      {/* Image area */}
      <div className="relative overflow-hidden" style={{ height: 192, background: '#f8faf8' }}>
        {product.images?.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <span className="text-4xl">{catEmoji}</span>
            <span className="text-xs text-slate-300 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>No photo</span>
          </div>
        )}

        {/* Price badge */}
        <div
          className="absolute bottom-3 left-3 flex items-center gap-0.5 px-3 py-1.5 rounded-xl font-black text-sm text-white"
          style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
        >
          <IndianRupee className="w-3.5 h-3.5" />
          <span style={{ fontFamily: "'DM Sans', sans-serif" }}>{Number(product.price).toLocaleString('en-IN')}</span>
        </div>

        {/* Owner menu */}
        {isOwner && (
          <div className="absolute top-3 right-3">
            <motion.button
              onClick={() => setMenu(v => !v)}
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,0,0,0.06)' }}
              whileTap={{ scale: 0.9 }}
            >
              <MoreHorizontal className="w-4 h-4 text-slate-600" />
            </motion.button>
            <AnimatePresence>
              {menu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  transition={{ duration: 0.14 }}
                  className="absolute right-0 top-10 z-20 py-1 rounded-xl overflow-hidden"
                  style={{ background: '#fff', border: '1.5px solid #eef0ec', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: 140 }}
                >
                  <button
                    onClick={() => { setMenu(false); onDelete(product._id); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete listing
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Category + condition */}
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: '#e8faf2', color: '#16a34a', border: '1px solid #bbf7d0' }}
          >
            {catEmoji} {product.category}
          </span>
          <ConditionBadge condition={product.condition} />
        </div>

        {/* Title + description */}
        <div className="flex-1">
          <h3 className="font-extrabold text-slate-800 text-sm leading-snug mb-1 line-clamp-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {product.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: '#f1f5f2' }} />

        {/* Seller row + action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0">
  {product.seller?.avatar ? (
    <img src={product.seller.avatar} alt="Seller" className="w-full h-full object-cover" />
  ) : (
    product.seller?.name?.charAt(0) || 'U'
  )}
</div>
            <div>
              <p className="text-xs font-bold text-slate-700 leading-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {product.seller?.name?.split(' ')[0]}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" />{product.location?.district || 'Local'}
              </p>
            </div>
          </div>

          {!isOwner && (
            <motion.button
              onClick={() => onMessage(product.seller)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #3dd68c, #22c074)', boxShadow: '0 2px 8px rgba(52,214,140,0.28)' }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <Send className="w-3 h-3" />
              <span style={{ fontFamily: "'DM Sans', sans-serif" }}>Contact</span>
            </motion.button>
          )}
          {isOwner && (
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
              Your listing
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Sell form drawer ───────────────────────────────────────────── */
const SellDrawer = ({ onSubmit, onClose }) => {
  const [form, setForm]       = useState({ title: '', description: '', price: '', category: 'Equipment', condition: 'Good' });
  const [files, setFiles]     = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSub]  = useState(false);

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
    setSub(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append('images', f));
      await onSubmit(fd);
      onClose();
    } finally {
      setSub(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div
        className="p-5 rounded-2xl"
        style={{ background: '#fff', border: '1.5px solid #eef0ec', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
      >
        {/* Form header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              New Listing
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Fill in the details to list your item</p>
          </div>
          <motion.button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors" whileTap={{ scale: 0.9 }}>
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title + price row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <input
                required type="text"
                placeholder="Item name"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-300 outline-none"
                style={{ background: '#f8faf8', border: '1.5px solid #eef0ec', fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: '#f8faf8', border: '1.5px solid #eef0ec' }}>
              <IndianRupee className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                required type="number"
                placeholder="Price"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full text-sm font-semibold text-slate-800 placeholder-slate-300 outline-none border-none bg-transparent"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
          </div>

          {/* Description */}
          <textarea
            required rows={3}
            placeholder="Describe the item — age, features, usage…"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl text-sm text-slate-600 placeholder-slate-300 outline-none resize-none leading-relaxed"
            style={{ background: '#f8faf8', border: '1.5px solid #eef0ec', fontFamily: "'DM Sans', sans-serif" }}
          />

          {/* Category + condition */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm font-semibold text-slate-700 outline-none appearance-none cursor-pointer"
                style={{ background: '#f8faf8', border: '1.5px solid #eef0ec', fontFamily: "'DM Sans', sans-serif" }}
              >
                {CATEGORIES.filter(c => c.label !== 'All').map(c => <option key={c.label} value={c.label}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div className="relative">
              <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={form.condition}
                onChange={e => setForm({ ...form, condition: e.target.value })}
                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm font-semibold text-slate-700 outline-none appearance-none cursor-pointer"
                style={{ background: '#f8faf8', border: '1.5px solid #eef0ec', fontFamily: "'DM Sans', sans-serif" }}
              >
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Image previews */}
          {previews.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ border: '1.5px solid #eef0ec' }}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Bottom toolbar */}
          <div className="flex items-center gap-2 pt-1">
            <label
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl cursor-pointer transition-colors"
              style={{ background: '#f8faf8', border: '1.5px solid #eef0ec' }}
            >
              <ImagePlus className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {files.length ? `${files.length} photo${files.length > 1 ? 's' : ''}` : 'Add Photos'}
              </span>
              <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
            </label>

            <motion.button
              type="submit"
              disabled={submitting}
              className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #3dd68c, #22c074)', boxShadow: '0 3px 10px rgba(52,214,140,0.3)' }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
            >
              {submitting
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <><Send className="w-4 h-4" /><span style={{ fontFamily: "'DM Sans', sans-serif" }}>List Item</span></>
              }
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

/* ─── Main page ──────────────────────────────────────────────────── */
const Marketplace = () => {
  const { user }   = useContext(AuthContext);
  const navigate   = useNavigate();
  const [products, setProducts]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter]       = useState('');
  const [selling, setSelling]     = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchProducts(filter === 'All' ? '' : filter)
      .then(data => setProducts(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [filter]);

  const handleSubmit = async (fd) => {
    const created = await createProduct(fd);
    if (!filter || filter === 'All' || filter === created.category) {
      setProducts(prev => [created, ...prev]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    await deleteProductAPI(id);
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  const handleMessage = (seller) => navigate('/chat', { state: { targetUser: seller } });

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');`}</style>

      <div className="max-w-6xl mx-auto">

        {/* Page heading */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Marketplace
              </h2>
              <p className="text-sm text-slate-400 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Buy, sell or rent farming equipment &amp; supplies
              </p>
            </div>

            <motion.button
              onClick={() => setSelling(v => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={selling
                ? { background: '#f8faf8', color: '#94a3b8', border: '1.5px solid #eef0ec' }
                : { background: 'linear-gradient(135deg, #3dd68c, #22c074)', color: '#fff', boxShadow: '0 3px 10px rgba(52,214,140,0.3)', border: '1.5px solid transparent' }
              }
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
            >
              {selling
                ? <><X className="w-4 h-4" /><span style={{ fontFamily: "'DM Sans', sans-serif" }}>Cancel</span></>
                : <><ShoppingBag className="w-4 h-4" /><span style={{ fontFamily: "'DM Sans', sans-serif" }}>Sell Item</span></>
              }
            </motion.button>
          </div>
        </motion.div>

        {/* Sell drawer */}
        <AnimatePresence>
          {selling && (
            <div className="mb-6">
              <SellDrawer onSubmit={handleSubmit} onClose={() => setSelling(false)} />
            </div>
          )}
        </AnimatePresence>

        {/* Category filter pills */}
        <motion.div
          className="flex gap-2 overflow-x-auto pb-1 mb-6"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          style={{ scrollbarWidth: 'none' }}
        >
          {CATEGORIES.map(cat => {
            const active = (cat.label === 'All' && !filter) || filter === cat.label;
            return (
              <motion.button
                key={cat.label}
                onClick={() => setFilter(cat.label === 'All' ? '' : cat.label)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-150"
                style={active
                  ? { background: 'linear-gradient(135deg, #3dd68c, #22c074)', color: '#fff', boxShadow: '0 3px 10px rgba(52,214,140,0.28)', border: '1.5px solid transparent' }
                  : { background: '#fff', color: '#64748b', border: '1.5px solid #eef0ec' }
                }
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              >
                <span>{cat.emoji}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif" }}>{cat.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <Leaf className="w-8 h-8 text-emerald-400" />
            </motion.div>
            <p className="text-sm text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>Loading listings…</p>
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 rounded-2xl gap-3"
            style={{ background: '#fff', border: '1.5px solid #eef0ec' }}
          >
            <ShoppingBag className="w-10 h-10 text-slate-200" />
            <p className="text-slate-400 font-semibold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              No items in this category yet
            </p>
            <motion.button
              onClick={() => setSelling(true)}
              className="mt-1 px-4 py-2 rounded-xl text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #3dd68c, #22c074)' }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            >
              Be the first to list
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={gridVariants}
            initial="hidden"
            animate="show"
          >
            {products.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                userId={user?._id}
                onDelete={handleDelete}
                onMessage={handleMessage}
              />
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Marketplace;