import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { io } from 'socket.io-client';
import { Bell } from 'lucide-react';

const NotificationBell = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Fetch History On Load
    const fetchHistory = async () => {
      try {
        const res = await API.get('/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };
    fetchHistory();

    // Setup Socket
    const socket = io('https://agrolink-fnwu.onrender.com');
    socket.emit('join', user._id);

    // Listen for incoming live notifications
    socket.on('newNotification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    return () => socket.disconnect();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/read');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="p-4 bg-brand-dark text-white font-bold flex justify-between items-center">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-brand-pale hover:underline">Mark all read</button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">You're all caught up!</div>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!n.isRead ? 'bg-brand-mist/20' : ''}`}>
                  <p className="text-sm text-gray-800">{n.message}</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">{new Date(n.createdAt || n.time).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;