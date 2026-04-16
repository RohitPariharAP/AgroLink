// client/src/components/Layout.jsx
import { useState, useContext } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Home,
  MessageSquare,
  ShoppingBag,
  Scan,
  LogOut,
  Leaf,
  Sparkles,MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "./NotificationBell";
 

/* ─── Nav Config ─────────────────────────────────────────────────── */
const NAV = [
  { name: "Dashboard", path: "/dashboard", icon: Home, label: "Overview" },
  { name: "Forum", path: "/forum", icon: MessageSquare, label: "Community" },
  {
    name: "Marketplace",
    path: "/marketplace",
    icon: ShoppingBag,
    label: "Shop",
  },
  { name: "Crop Scanner", path: "/scanner", icon: Scan, label: "AI Scanner" },
  { name: "Live Chat", path: "/chat", icon: MessageCircle, label: "Expert Support" }
];

/* ─── Sidebar Nav Item ───────────────────────────────────────────── */
const NavItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;
  return (
    <Link to={item.path} onClick={onClick}>
      <motion.div
        className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group"
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        {/* Active background */}
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #e8faf2 0%, #d4f5e7 100%)",
              border: "1.5px solid #b2e8cc",
            }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          />
        )}

        {/* Hover bg */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{ background: "#f5faf7" }}
        />

        {/* Icon */}
        <div
          className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            isActive
              ? "bg-white shadow-sm"
              : "bg-transparent group-hover:bg-white/70"
          }`}
          style={
            isActive ? { boxShadow: "0 2px 8px rgba(52,185,120,0.18)" } : {}
          }
        >
          <Icon
            className={`w-4 h-4 transition-colors duration-200 ${
              isActive
                ? "text-emerald-500"
                : "text-slate-400 group-hover:text-slate-600"
            }`}
          />
        </div>

        {/* Text */}
        <div className="relative z-10 flex-1 min-w-0">
          <p
            className={`text-sm font-semibold leading-none transition-colors duration-200 ${
              isActive
                ? "text-emerald-700"
                : "text-slate-500 group-hover:text-slate-700"
            }`}
            style={{ fontFamily: "'Geist', 'DM Sans', sans-serif" }}
          >
            {item.name}
          </p>
          <p
            className={`text-[10px] mt-0.5 transition-colors duration-200 ${
              isActive ? "text-emerald-400" : "text-slate-400"
            }`}
          >
            {item.label}
          </p>
        </div>

        {/* Active dot */}
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative z-10 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
          />
        )}
      </motion.div>
    </Link>
  );
};

/* ─── Compact Sidebar ────────────────────────────────────────────── */
const Sidebar = ({ currentPath, user, onLogout, onClose, mobile }) => (
  <div
    className="flex flex-col h-full"
    style={{
      background: "#ffffff",
      borderRight: "1.5px solid #eef0ec",
      width: mobile ? "100%" : undefined,
    }}

    
  >
    {/* Logo */}
    <div className="px-5 pt-6 pb-5">
      <motion.div
        className="flex items-center gap-2.5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #3dd68c 0%, #22c074 100%)",
            boxShadow: "0 3px 12px rgba(52,214,140,0.3)",
          }}
        >
          <Leaf className="w-4 h-4 text-white" />
        </div>
        <div>
          <p
            className="font-black text-slate-800 text-base leading-none tracking-tight"
            style={{ fontFamily: "'Geist', 'DM Sans', sans-serif" }}
          >
            AgroLink
          </p>
          <p className="text-[9px] text-emerald-500 font-semibold tracking-widest uppercase mt-0.5">
            Farm Platform
          </p>
        </div>
      </motion.div>
    </div>

    {/* Divider */}
    <div
      className="mx-5 mb-4 h-px"
      style={{ background: "linear-gradient(90deg, #e8f5ee, transparent)" }}
    />

    {/* Section label */}

    {/* Nav */}
    <nav className="flex-1 px-3 space-y-0.5">
      {NAV.map((item, i) => (
        <motion.div
          key={item.path}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
        >
          <NavItem
            item={item}
            isActive={currentPath === item.path}
            onClick={onClose}
          />
        </motion.div>
      ))}
    </nav>

    {/* Bottom section */}
    <motion.div
      className="px-4 pb-6 pt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      {/* Divider */}
      <div
        className="mb-4 h-px"
        style={{ background: "linear-gradient(90deg, #e8f5ee, transparent)" }}
      />

      {/* User card */}
      <div
        className="flex items-center gap-3 p-3 rounded-xl mb-2"
        style={{ background: "#f8faf8", border: "1.5px solid #eef5f0" }}
      >
      {/* Sidebar Bottom User Chip Avatar */}
<div className="w-10 h-10 rounded-full bg-emerald-400 text-white flex items-center justify-center font-bold overflow-hidden flex-shrink-0">
  {user?.avatar ? (
    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
  ) : (
    user?.name?.charAt(0) || 'U'
  )}
</div>
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-bold text-slate-700 truncate"
            style={{ fontFamily: "'Geist', 'DM Sans', sans-serif" }}
          >
            {user?.name}
          </p>
         
        </div>
        {/* Online indicator */}
        <div
          className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
          style={{ boxShadow: "0 0 6px rgba(52,214,140,0.6)" }}
        />
      </div>

      {/* Logout */}
      <motion.button
        onClick={onLogout}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-slate-400 transition-all duration-150 group"
        whileHover={{ backgroundColor: "#fff1f2" }}
        whileTap={{ scale: 0.97 }}
        style={{ border: "1.5px solid transparent" }}
      >
        <LogOut className="w-3.5 h-3.5 group-hover:text-rose-400 transition-colors" />
        <span
          className="text-xs font-semibold group-hover:text-rose-500 transition-colors"
          style={{ fontFamily: "'Geist', 'DM Sans', sans-serif" }}
        >
          Sign Out
        </span>
      </motion.button>
    </motion.div>
  </div>
);

/* ─── Root Layout ────────────────────────────────────────────────── */
const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const currentPage =
    NAV.find((l) => l.path === location.pathname)?.name || "Platform";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; }
        body { background: #f6f8f6; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d4ead9; border-radius: 99px; }
      `}</style>

      <div
        className="flex min-h-screen"
        style={{
          background: "linear-gradient(150deg, #f6f8f6 0%, #f0f4f1 100%)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* ── Desktop Sidebar ── */}
        <aside
          className="hidden md:flex flex-col h-screen sticky top-0 z-20 flex-shrink-0"
          style={{ width: 224 }}
        >
          <Sidebar
            currentPath={location.pathname}
            user={user}
            onLogout={handleLogout}
            onClose={() => {}}
          />
        </aside>

        {/* ── Mobile Drawer ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="fixed inset-0 z-50 md:hidden flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "rgba(15,25,20,0.35)",
                  backdropFilter: "blur(3px)",
                }}
                onClick={() => setMobileOpen(false)}
              />
              {/* Drawer */}
              <motion.div
                className="relative z-10 h-full"
                style={{ width: 224 }}
                initial={{ x: -224 }}
                animate={{ x: 0 }}
                exit={{ x: -224 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Sidebar
                  currentPath={location.pathname}
                  user={user}
                  onLogout={handleLogout}
                  onClose={() => setMobileOpen(false)}
                  mobile
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Content Column ── */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top Header */}
          <motion.header
            className="sticky top-0 z-10 flex items-center justify-between px-5 md:px-8 py-4"
            style={{
              background: "rgba(246,248,246,0.85)",
              backdropFilter: "blur(18px)",
              borderBottom: "1.5px solid rgba(220,235,224,0.8)",
            }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Left: hamburger + title */}
            <div className="flex items-center gap-4">
              <motion.button
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "#fff", border: "1.5px solid #e4ede6" }}
                onClick={() => setMobileOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
              >
                <svg
                  className="w-4 h-4 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h10M4 18h16"
                  />
                </svg>
              </motion.button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1
                    className="text-lg font-extrabold text-slate-800 leading-none tracking-tight"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {currentPage}
                  </h1>
                  <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
                    Welcome back, {user?.name?.split(" ")[0]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
             

              <NotificationBell />

              {/* Avatar */}
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 hover:bg-green-100 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-brand-mid text-white flex items-center justify-center text-xs font-bold">
                  {/* If they have an avatar, show it. Otherwise, show their initial */}
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0) || "J"
                  )}
                </div>
                <span className="text-sm font-bold text-brand-dark">
                  {user?.name || "Farmer"}
                </span>
              </Link>
            </div>
          </motion.header>

          {/* Mint accent line */}
          <div
            className="h-[2px] w-full flex-shrink-0"
            style={{
              background:
                "linear-gradient(90deg, #3dd68c 0%, #a7f3d0 50%, transparent 100%)",
            }}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                className="px-5 md:px-8 py-6 md:py-8"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
