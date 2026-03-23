// client/src/pages/Scanner.jsx
import { useState } from 'react';
import { analyzeCropImage } from '../api/scanner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan, UploadCloud, Loader2, Leaf,
  AlertTriangle, CheckCircle2, RefreshCw,
  Sparkles, FlaskConical, Microscope,
} from 'lucide-react';

/* ─── Scanning pulse ring ────────────────────────────────────────── */
const PulseRings = () => (
  <div className="relative w-20 h-20 flex items-center justify-center">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        className="absolute inset-0 rounded-full"
        style={{ border: '2px solid #3dd68c' }}
        animate={{ scale: [1, 1.8 + i * 0.3], opacity: [0.6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
      />
    ))}
    <div className="w-12 h-12 rounded-full flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #e8faf2, #d4f5e7)', border: '2px solid #b2e8cc' }}>
      <Microscope className="w-6 h-6 text-emerald-500" />
    </div>
  </div>
);

/* ─── Result section renderer ────────────────────────────────────── */
const ResultBlock = ({ result }) => {
  // Split result into sections by double newline or line breaks for nicer rendering
  const lines = result.split('\n').filter(l => l.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      {/* Success banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
        style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3dd68c, #22c074)' }}>
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Scan Complete
          </p>
          <p className="text-[11px] text-emerald-600">Diagnosis powered by Gemini AI</p>
        </div>
        <Sparkles className="w-4 h-4 text-emerald-400 ml-auto flex-shrink-0" />
      </div>

      {/* Result text — rendered line by line */}
      <div
        className="rounded-2xl p-4 space-y-2 overflow-y-auto"
        style={{ background: '#f8faf8', border: '1.5px solid #eef0ec', maxHeight: 340 }}
      >
        {lines.map((line, i) => {
          const isBold = line.startsWith('**') || line.startsWith('##') || line.endsWith(':');
          const clean  = line.replace(/\*\*/g, '').replace(/##/g, '').trim();
          return (
            <p
              key={i}
              className={`text-sm leading-relaxed ${isBold ? 'font-bold text-slate-700 mt-2' : 'text-slate-500'}`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {clean}
            </p>
          );
        })}
      </div>
    </motion.div>
  );
};

/* ─── Main Scanner ───────────────────────────────────────────────── */
const Scanner = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl,    setPreviewUrl]    = useState(null);
  const [isScanning,    setIsScanning]    = useState(false);
  const [result,        setResult]        = useState(null);
  const [error,         setError]         = useState('');

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError('');
  };

  const handleScan = async () => {
    if (!selectedImage) return;
    setIsScanning(true);
    setError('');
    try {
      const data = await analyzeCropImage(selectedImage);
      setResult(data.analysis);
    } catch {
      setError('Failed to analyze the image. Please try again with a clearer photo.');
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError('');
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');`}</style>

      <div className="max-w-5xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Page heading */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Crop Scanner AI
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Upload a leaf photo — our AI botanist diagnoses it instantly
          </p>
        </motion.div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── LEFT: Upload panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex flex-col gap-4"
          >
            {/* Upload / preview card */}
            <div
              className="overflow-hidden rounded-2xl"
              style={{ background: '#fff', border: '1.5px solid #eef0ec', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              {/* Card header */}
              <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1.5px solid #f1f5f2' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: '#e8faf2', border: '1px solid #bbf7d0' }}>
                  <UploadCloud className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-sm font-bold text-slate-700">Upload Image</p>
              </div>

              <div className="p-5">
                <AnimatePresence mode="wait">
                  {!previewUrl ? (
                    /* Drop zone */
                    <motion.label
                      key="dropzone"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all duration-200 min-h-[260px] group"
                      style={{ border: '2px dashed #c8e6d4', background: '#f8faf8' }}
                      onDragOver={e => e.preventDefault()}
                      onDrop={handleDrop}
                      whileHover={{ borderColor: '#3dd68c', backgroundColor: '#f0fdf4' }}
                    >
                      <motion.div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: 'linear-gradient(135deg, #e8faf2, #d4f5e7)', border: '1.5px solid #bbf7d0' }}
                        whileHover={{ scale: 1.08, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <UploadCloud className="w-8 h-8 text-emerald-500" />
                      </motion.div>
                      <p className="font-bold text-slate-700 text-sm mb-1">Drop your photo here</p>
                      <p className="text-xs text-slate-400 mb-4">or click to browse files</p>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                        style={{ background: '#e8faf2', border: '1px solid #bbf7d0' }}>
                        <span className="text-[11px] font-semibold text-emerald-600">JPG · PNG · WEBP</span>
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    </motion.label>
                  ) : (
                    /* Preview */
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="relative w-full rounded-2xl overflow-hidden"
                        style={{ height: 240, background: '#0f0f0f' }}>
                        <img src={previewUrl} alt="Crop" className="w-full h-full object-contain" />
                        {/* Scanning overlay */}
                        {isScanning && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ background: 'rgba(0,0,0,0.55)' }}
                          >
                            <motion.div
                              className="absolute left-0 right-0 h-0.5"
                              style={{ background: 'linear-gradient(90deg, transparent, #3dd68c, transparent)', top: 0 }}
                              animate={{ top: ['0%', '100%', '0%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <p className="text-white text-xs font-semibold tracking-widest uppercase">Analyzing…</p>
                          </motion.div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 w-full">
                        <motion.button
                          onClick={reset}
                          disabled={isScanning}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-slate-500 disabled:opacity-40 transition-colors"
                          style={{ background: '#f8faf8', border: '1.5px solid #eef0ec' }}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Retake
                        </motion.button>
                        <motion.button
                          onClick={handleScan}
                          disabled={isScanning}
                          className="flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-70"
                          style={{ background: 'linear-gradient(135deg, #3dd68c, #22c074)', boxShadow: '0 3px 10px rgba(52,214,140,0.3)' }}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        >
                          {isScanning
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>
                            : <><Scan className="w-4 h-4" /> Run AI Diagnosis</>
                          }
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-4 flex items-start gap-3 px-4 py-3 rounded-xl"
                      style={{ background: '#fff1f2', border: '1.5px solid #fecaca' }}
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs font-semibold text-rose-600">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Tips card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="px-5 py-4 rounded-2xl"
              style={{ background: '#fff', border: '1.5px solid #eef0ec', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <p className="text-[10px] font-bold text-slate-300 tracking-widest uppercase mb-3">Photo Tips</p>
              <div className="space-y-2">
                {[
                  { emoji: '☀️', tip: 'Shoot in bright natural light' },
                  { emoji: '🔍', tip: 'Focus on the affected area' },
                  { emoji: '📐', tip: 'Keep the leaf flat and fully visible' },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{t.emoji}</span>
                    <p className="text-xs text-slate-500">{t.tip}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Results panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col"
          >
            <div
              className="flex flex-col flex-1 overflow-hidden rounded-2xl"
              style={{ background: '#fff', border: '1.5px solid #eef0ec', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', minHeight: 420 }}
            >
              {/* Card header */}
              <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1.5px solid #f1f5f2' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: '#e8faf2', border: '1px solid #bbf7d0' }}>
                  <FlaskConical className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-sm font-bold text-slate-700">AI Analysis Results</p>
                {result && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: '#e8faf2', color: '#16a34a', border: '1px solid #bbf7d0' }}
                  >
                    Done
                  </motion.span>
                )}
              </div>

              {/* Body */}
              <div className="flex-1 p-5 overflow-hidden">
                <AnimatePresence mode="wait">

                  {/* Empty state */}
                  {!isScanning && !result && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center gap-4 py-8"
                    >
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ background: '#f8faf8', border: '1.5px solid #eef0ec' }}>
                        <Leaf className="w-8 h-8 text-slate-200" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-400">No scan yet</p>
                        <p className="text-xs text-slate-300 mt-0.5">Upload a leaf photo and hit Run AI Diagnosis</p>
                      </div>
                      {/* Decorative dashed connector */}
                      <div className="flex items-center gap-2 mt-2">
                        {['Upload', 'Scan', 'Results'].map((step, i) => (
                          <div key={step} className="flex items-center gap-2">
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-slate-300"
                                style={{ background: '#f8faf8', border: '1.5px solid #eef0ec' }}>
                                {i + 1}
                              </div>
                              <span className="text-[9px] text-slate-300 font-medium">{step}</span>
                            </div>
                            {i < 2 && <div className="w-6 h-px mb-3" style={{ background: '#eef0ec' }} />}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Scanning state */}
                  {isScanning && (
                    <motion.div
                      key="scanning"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center gap-5"
                    >
                      <PulseRings />
                      <div className="text-center">
                        <p className="font-bold text-slate-700 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          Scanning leaf…
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Cross-referencing botanical databases</p>
                      </div>
                      {/* Animated progress bar */}
                      <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ background: '#e8faf2' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #3dd68c, #22c074)' }}
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Result state */}
                  {result && !isScanning && (
                    <motion.div key="result" className="h-full overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                      <ResultBlock result={result} />
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default Scanner;