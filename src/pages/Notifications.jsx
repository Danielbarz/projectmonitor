import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [notificationGroups, setNotificationGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const groupNotificationsByDate = (notifs) => {
    const groups = {};
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    notifs.forEach(n => {
      const d = new Date(n.created_at);
      const dString = d.toDateString();
      
      let key = dString;
      if (dString === today) key = 'Today';
      else if (dString === yesterdayString) key = 'Yesterday';
      else {
          key = d.toLocaleDateString('en-GB'); // DD/MM/YYYY format
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });

    const sortedKeys = Object.keys(groups).sort((a, b) => {
        if (a === 'Today') return -1;
        if (b === 'Today') return 1;
        if (a === 'Yesterday') return -1;
        if (b === 'Yesterday') return 1;
        return new Date(groups[b][0].created_at) - new Date(groups[a][0].created_at);
    });

    return sortedKeys.map(key => ({
        title: key,
        items: groups[key]
    }));
  };

  const getNotificationTitle = (msg) => {
    if (msg.toLowerCase().includes('created')) return 'New Project Added';
    if (msg.toLowerCase().includes('updated')) return 'New Project Update';
    return 'Notification';
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [token]);

  const fetchNotifications = async () => {
      if (!token) return;
      try {
          const res = await fetch('http://localhost:5000/api/notifications', {
              headers: { Authorization: token } 
          });
          const data = await res.json();
          if (Array.isArray(data)) {
              setNotificationGroups(groupNotificationsByDate(data));
          }
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
  };

  const handleNotificationClick = async (item) => {
      // Mark as read
      if (!item.is_read) {
          try {
              await fetch(`http://localhost:5000/api/notifications/${item.id}/read`, {
                  method: 'PUT',
                  headers: { Authorization: token }
              });
              // Optimistically update UI
               fetchNotifications();
          } catch (err) {
              console.error(err);
          }
      }

      // Navigate
      if (item.project_id) {
          navigate(`/projects/${item.project_id}`);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Carlito']">
      <Sidebar />

      <div className="ml-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">

            {/* Page Header */}
            <div className="flex items-center gap-4 mb-10">
              <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-500">Loading notifications...</div>
            ) : notificationGroups.length === 0 ? (
                <div className="text-center py-10 text-slate-500">No notifications found.</div>
            ) : (
                <div className="space-y-12">
                {notificationGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800 px-2">{group.title}</h2>
                    
                    <div className="space-y-4">
                        {group.items.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => handleNotificationClick(item)}
                            className={`bg-white rounded-2xl p-6 shadow-sm border ${item.is_read ? 'border-slate-100 opacity-75' : 'border-red-100 ring-1 ring-red-50'} hover:shadow-md transition-all cursor-pointer relative group`}
                        >
                            <div className="flex justify-between items-start mb-2">
                            <h3 className={`text-xl font-bold ${item.is_read ? 'text-slate-700' : 'text-slate-900'} pr-12`}>
                                {item.project_id ? getNotificationTitle(item.message) : 'Notification'}
                            </h3>
                            <span className="text-slate-400 font-medium whitespace-nowrap">{formatTime(item.created_at)}</span>
                            </div>
                            <p className="text-slate-500 font-bold leading-relaxed pr-8">
                            {item.message}
                            </p>
                            
                            {/* Unread Indicator */}
                            {!item.is_read && (
                                <span className="absolute top-6 right-4 w-3 h-3 bg-red-600 rounded-full"></span>
                            )}

                            {/* Interactive Indicator */}
                            {item.project_id && (
                                <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-red-600 font-bold text-sm">View Project →</span>
                                </div>
                            )}
                        </div>
                        ))}
                    </div>
                    </div>
                ))}
                </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
