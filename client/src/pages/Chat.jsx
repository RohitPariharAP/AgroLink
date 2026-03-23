// client/src/pages/Chat.jsx
import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import API from '../api/axios';
import { io } from 'socket.io-client';
import { Send, MapPin, Loader2, Search, MessageCircle, Leaf, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Avatar ─────────────────────────────────────────────────────── */
const Avatar = ({ name, px = 40, online = false }) => (
  <div style={{ position: 'relative', flexShrink: 0 }}>
    <div style={{
      width: px, height: px, borderRadius: px * 0.28,
      background: 'linear-gradient(135deg, #3dd68c, #22c074)',
      boxShadow: '0 2px 8px rgba(52,214,140,0.28)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 800, fontSize: px * 0.38,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {name?.charAt(0)?.toUpperCase() || '?'}
    </div>
    {online && (
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: px * 0.28, height: px * 0.28, borderRadius: '50%',
        background: '#22c55e', border: `${px * 0.06}px solid #fff`,
      }} />
    )}
  </div>
);

/* ─── User row in sidebar ────────────────────────────────────────── */
const UserRow = ({ u, active, onClick }) => (
  <motion.div
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', cursor: 'pointer', position: 'relative',
      borderBottom: '1px solid #f1f5f2',
      background: active ? '#f0fdf4' : '#fff',
      transition: 'background 0.15s',
    }}
    whileHover={{ backgroundColor: active ? '#f0fdf4' : '#f8faf8' }}
    whileTap={{ scale: 0.99 }}
  >
    {/* Active indicator */}
    {active && (
      <motion.div
        layoutId="user-active"
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: 3, background: 'linear-gradient(180deg, #3dd68c, #a7f3d0)',
          borderRadius: '0 2px 2px 0',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    )}

    <Avatar name={u.name} px={42} online />

    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{
        fontSize: 13, fontWeight: 800, color: active ? '#16a34a' : '#1e293b',
        margin: 0, fontFamily: "'DM Sans', sans-serif",
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {u.name}
      </p>
      <p style={{
        fontSize: 11, color: '#94a3b8', margin: '3px 0 0',
        display: 'flex', alignItems: 'center', gap: 3,
        fontFamily: "'DM Sans', sans-serif",
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        <MapPin style={{ width: 10, height: 10 }} />
        {u.location?.district || 'Farmer'}
      </p>
    </div>
  </motion.div>
);

/* ─── Message bubble ─────────────────────────────────────────────── */
const Bubble = ({ msg, isMe }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    style={{
      display: 'flex',
      justifyContent: isMe ? 'flex-end' : 'flex-start',
      marginBottom: 2,
    }}
  >
    <div style={{
      maxWidth: '68%',
      padding: '10px 15px',
      borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
      background: isMe
        ? 'linear-gradient(135deg, #3dd68c, #22c074)'
        : '#fff',
      color: isMe ? '#fff' : '#334155',
      boxShadow: isMe
        ? '0 3px 12px rgba(52,214,140,0.3)'
        : '0 2px 8px rgba(0,0,0,0.06)',
      border: isMe ? 'none' : '1.5px solid #eef0ec',
    }}>
      <p style={{
        fontSize: 14, lineHeight: 1.5, margin: 0,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {msg.content}
      </p>
      <p style={{
        fontSize: 10, margin: '5px 0 0',
        color: isMe ? 'rgba(255,255,255,0.7)' : '#94a3b8',
        textAlign: 'right', fontFamily: "'DM Sans', sans-serif",
      }}>
        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  </motion.div>
);

/* ─── Date divider ───────────────────────────────────────────────── */
const DateDivider = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
    <div style={{ flex: 1, height: 1, background: '#eef0ec' }} />
    <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>
      {label}
    </span>
    <div style={{ flex: 1, height: 1, background: '#eef0ec' }} />
  </div>
);

/* ─── Main Chat ──────────────────────────────────────────────────── */
const Chat = () => {
  const { user }   = useContext(AuthContext);
  const location   = useLocation();

  const [socket, setSocket]         = useState(null);
  const [users, setUsers]           = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages]     = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading]   = useState(true);
  const messagesEndRef              = useRef(null);

  /* Init socket + fetch users */
 useEffect(() => {
    API.get('/chat/users')
      .then(res => setUsers(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));

    // CHANGE THIS LINE: Use your live Render backend, NOT localhost!
    const sock = io('https://agrolink-fnwu.onrender.com'); 
    
    setSocket(sock);
    if (user?._id) sock.emit('join', user._id);
    sock.on('receiveMessage', msg => setMessages(prev => [...prev, msg]));
    return () => sock.disconnect();
  }, [user]);

  /* Auto-select from routing */
  useEffect(() => {
    if (location.state?.targetUser) {
      const target = location.state.targetUser;
      setActiveChat(target);
      setUsers(prev => prev.find(u => u._id === target._id) ? prev : [target, ...prev]);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  /* Fetch chat history */
  useEffect(() => {
    if (!activeChat) return;
    API.get(`/chat/${activeChat._id}`)
      .then(res => setMessages(res.data))
      .catch(console.error);
  }, [activeChat]);

  /* Auto scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* Send */
const handleSend = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !activeChat || !socket) return;
    
    const messageText = newMessage;
    setNewMessage(''); // Clear input immediately so it feels fast
    
    try {
      // 1. Save it to MongoDB permanently
      const res = await API.post('/chat/send', { 
        receiverId: activeChat._id, 
        content: messageText 
      });
      
      // 2. Put it on your screen
      setMessages(prev => [...prev, res.data]);
      
      // 3. Shoot it through the socket to the other person instantly
      socket.emit('sendMessage', res.data);
      
    } catch (error) {
      console.error("Failed to send message to database:", error);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* Loading */
  if (isLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '96px 0', gap: 12 }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
        <Leaf style={{ width: 32, height: 32, color: '#3dd68c' }} />
      </motion.div>
      <p style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'DM Sans', sans-serif" }}>Loading messages…</p>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #d4ead9; border-radius: 99px; }
        .msg-input::placeholder { color: #cbd5e1; }
        .msg-input:focus { outline: none; }
      `}</style>

      <div style={{ maxWidth: 1000, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ marginBottom: 20 }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
            Messages
          </h2>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>
            Chat with farmers across the community
          </p>
        </motion.div>

        {/* Chat shell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            height: 680,
            background: '#fff',
            border: '1.5px solid #e8f0ea',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          }}
        >

          {/* ── LEFT: Contact list ── */}
          <div style={{
            width: 280, flexShrink: 0,
            display: 'flex', flexDirection: 'column',
            borderRight: '1.5px solid #eef0ec',
            background: '#fff',
          }}>
            {/* Search header */}
            <div style={{ padding: '20px 16px 14px', borderBottom: '1.5px solid #f1f5f2' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 14,
                background: '#f8faf8', border: '1.5px solid #eef0ec',
              }}>
                <Search style={{ width: 14, height: 14, color: '#94a3b8', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search farmers…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="msg-input"
                  style={{
                    flex: 1, background: 'transparent', border: 'none',
                    fontSize: 13, color: '#334155', fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            </div>

            {/* Section label */}
            <div style={{ padding: '10px 16px 6px' }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>
                All Farmers
              </span>
            </div>

            {/* User list */}
            <div className="chat-scroll" style={{ flex: 1, overflowY: 'auto' }}>
              {filteredUsers.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'DM Sans', sans-serif" }}>No farmers found</p>
                </div>
              ) : (
                filteredUsers.map(u => (
                  <UserRow
                    key={u._id}
                    u={u}
                    active={activeChat?._id === u._id}
                    onClick={() => setActiveChat(u)}
                  />
                ))
              )}
            </div>
          </div>

          {/* ── RIGHT: Chat window ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <AnimatePresence mode="wait">
              {!activeChat ? (
                /* Empty state */
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 14,
                    background: '#fafcfb',
                  }}
                >
                  <div style={{
                    width: 72, height: 72, borderRadius: 20,
                    background: '#f0fdf4', border: '1.5px solid #bbf7d0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <MessageCircle style={{ width: 32, height: 32, color: '#3dd68c' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                      Your Messages
                    </p>
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: '6px 0 0', fontFamily: "'DM Sans', sans-serif" }}>
                      Select a farmer from the left to start chatting
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeChat._id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
                >
                  {/* Chat header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '16px 20px',
                    borderBottom: '1.5px solid #eef0ec',
                    background: '#fff',
                  }}>
                    <Avatar name={activeChat.name} px={42} online />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                        {activeChat.name}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                        <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                          Online
                        </span>
                        {activeChat.location?.district && (
                          <>
                            <span style={{ color: '#e2e8f0' }}>·</span>
                            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 2 }}>
                              <MapPin style={{ width: 10, height: 10 }} />
                              {activeChat.location.district}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Messages area */}
                  <div
                    className="chat-scroll"
                    style={{
                      flex: 1, overflowY: 'auto',
                      padding: '20px 24px',
                      background: 'linear-gradient(160deg, #f6f9f6 0%, #f0f4f1 100%)',
                      display: 'flex', flexDirection: 'column',
                    }}
                  >
                    {messages.length === 0 ? (
                      <div style={{
                        flex: 1, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 10,
                      }}>
                        <div style={{ fontSize: 36 }}>👋</div>
                        <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", textAlign: 'center' }}>
                          Say hello to {activeChat.name.split(' ')[0]}!
                        </p>
                      </div>
                    ) : (
                      <>
                        <DateDivider label="Today" />
                        {messages.map(msg => {
                          const isMe = msg.senderId === user._id || msg.sender === user._id;
                          return <Bubble key={msg._id} msg={msg} isMe={isMe} />;
                        })}
                      </>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input bar */}
                  <div style={{
                    padding: '14px 20px',
                    borderTop: '1.5px solid #eef0ec',
                    background: '#fff',
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px 10px 16px',
                      borderRadius: 18, background: '#f8faf8',
                      border: '1.5px solid #eef0ec',
                      transition: 'border-color 0.2s',
                    }}
                      onFocus={() => {}} // handled inline
                    >
                      <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend(e)}
                        placeholder={`Message ${activeChat.name.split(' ')[0]}…`}
                        className="msg-input"
                        style={{
                          flex: 1, background: 'transparent', border: 'none',
                          fontSize: 14, color: '#334155',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                        onFocus={e => e.target.closest('div').style.borderColor = '#3dd68c'}
                        onBlur={e => e.target.closest('div').style.borderColor = '#eef0ec'}
                      />
                      <motion.button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        style={{
                          width: 36, height: 36, borderRadius: 12, border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: newMessage.trim()
                            ? 'linear-gradient(135deg, #3dd68c, #22c074)'
                            : '#f1f5f9',
                          boxShadow: newMessage.trim() ? '0 2px 8px rgba(52,214,140,0.3)' : 'none',
                          transition: 'all 0.2s', flexShrink: 0,
                        }}
                        whileHover={newMessage.trim() ? { scale: 1.08 } : {}}
                        whileTap={newMessage.trim() ? { scale: 0.93 } : {}}
                      >
                        <Send style={{ width: 15, height: 15, color: newMessage.trim() ? '#fff' : '#94a3b8' }} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div style={{ height: 32 }} />
      </div>
    </>
  );
};

export default Chat;