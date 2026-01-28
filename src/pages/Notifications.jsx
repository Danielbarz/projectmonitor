import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Notifications = () => {
  const notificationGroups = [
    {
      title: 'Today',
      items: [
        { id: 1, title: 'You got a new notes from Admin!', time: '09.23', content: 'Admin has just add notes saying, “Mohon update progres instalasi dan pastikan koordinat lokasi sudah sesuai.” on Project Dummy #1. Click to open the details.' },
        { id: 2, title: 'You got a new notes from Admin!', time: '09.23', content: 'Admin has just add notes saying, “Mohon update progres instalasi dan pastikan koordinat lokasi sudah sesuai.” on Project Dummy #1. Click to open the details.' },
        { id: 3, title: 'You got a new notes from Admin!', time: '09.23', content: 'Admin has just add notes saying, “Mohon update progres instalasi dan pastikan koordinat lokasi sudah sesuai.” on Project Dummy #1. Click to open the details.' },
      ]
    },
    {
      title: 'Yesterday',
      items: [
        { id: 4, title: 'You got a new notes from Admin!', time: '09.23', content: 'Admin has just add notes saying, “Mohon update progres instalasi dan pastikan koordinat lokasi sudah sesuai.” on Project Dummy #1. Click to open the details.' },
        { id: 5, title: 'You got a new notes from Admin!', time: '09.23', content: 'Admin has just add notes saying, “Mohon update progres instalasi dan pastikan koordinat lokasi sudah sesuai.” on Project Dummy #1. Click to open the details.' },
      ]
    },
    {
      title: '26/04/2025',
      items: [
        { id: 6, title: 'You got a new notes from Admin!', time: '09.23', content: 'Admin has just add notes saying, “Mohon update progres instalasi dan pastikan koordinat lokasi sudah sesuai.” on Project Dummy #1. Click to open the details.' },
        { id: 7, title: 'You got a new notes from Admin!', time: '09.23', content: 'Admin has just add notes saying, “Mohon update progres instalasi dan pastikan koordinat lokasi sudah sesuai.” on Project Dummy #1. Click to open the details.' },
        { id: 8, title: 'You got a new notes from Admin!', time: '09.23', content: 'Admin has just add notes saying, “Mohon update progres instalasi dan pastikan koordinat lokasi sudah sesuai.” on Project Dummy #1. Click to open the details.' },
      ]
    }
  ];

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

            <div className="space-y-12">
              {notificationGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-800 px-2">{group.title}</h2>
                  
                  <div className="space-y-4">
                    {group.items.map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer relative group">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-slate-800 pr-12">{item.title}</h3>
                          <span className="text-slate-400 font-medium whitespace-nowrap">{item.time}</span>
                        </div>
                        <p className="text-slate-500 font-bold leading-relaxed pr-8">
                          {item.content}
                        </p>
                        
                        {/* Interactive Indicator */}
                        <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="text-red-600 font-bold text-sm">View Project →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
