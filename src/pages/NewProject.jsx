import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Input from '../components/Input';
import LocationPicker from '../components/LocationPicker';
import { useNavigate } from 'react-router-dom';

const NewProject = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manual'); // 'csv' or 'manual'
  const [lat, setLat] = useState('-7.250445');
  const [lng, setLng] = useState('112.768845');
  const [isLocationLocked, setIsLocationLocked] = useState(false);

  const handleLocationChange = (newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Carlito']">
      <Sidebar />
      
      <div className="ml-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 rounded-full transition-colors group">
                 <svg className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                 </svg>
              </button>
              <h1 className="text-3xl font-bold text-slate-800">Add New Project</h1>
            </div>

            {/* Tabs */}
            <div className="relative mb-8">
              {/* Red Blur Background Effect */}
              <div className={`absolute top-0 w-48 h-16 bg-red-600/5 blur-[20px] transition-all duration-500 rounded-b-full pointer-events-none ${
                activeTab === 'csv' ? 'left-0' : 'left-40'
              }`}></div>

              <div className="border-b-4 border-slate-200/50 flex gap-8 relative z-10">
                <button 
                  onClick={() => setActiveTab('csv')}
                  className={`pb-3 text-2xl font-bold transition-colors relative ${activeTab === 'csv' ? 'text-red-600 border-b-4 border-red-600 -mb-1' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Upload CSV
                </button>
                <button 
                  onClick={() => setActiveTab('manual')}
                  className={`pb-3 text-2xl font-bold transition-colors relative ${activeTab === 'manual' ? 'text-red-600 border-b-4 border-red-600 -mb-1' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Add New Line
                </button>
              </div>
            </div>

            {/* Form Content */}
            {activeTab === 'manual' ? (
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                  
                  {/* Left Column */}
                  <div className="space-y-6">
                    <Input label="Jenis Layanan" placeholder="Enter service type" />
                    <Input label="Paket/Kecepatan" placeholder="Enter package/speed" />
                    <Input label="Order_ID" placeholder="Enter Order ID" />
                    <Input label="Lokasi" placeholder="Enter location name" />
                    <Input label="Alamat" placeholder="Enter full address" />
                    <Input label="CP Pelanggan" placeholder="Enter customer contact" />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <Input label="Status Order" placeholder="Enter status" />
                    <Input label="Target RFS" type="date" />
                    
                    {/* Map Section */}
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center justify-between">
                          <label className="text-slate-800 text-lg font-bold">Koordinat Map</label>
                          <button 
                            type="button"
                            onClick={() => setIsLocationLocked(!isLocationLocked)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-bold transition-colors ${
                              isLocationLocked 
                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {isLocationLocked ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                              )}
                            </svg>
                            {isLocationLocked ? 'Unlock Location' : 'Lock Location'}
                          </button>
                       </div>
                       <LocationPicker 
                          lat={lat} 
                          lng={lng} 
                          onLocationChange={handleLocationChange} 
                          locked={isLocationLocked}
                       />
                    </div>

                    {/* Coordinates Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2 relative">
                        <label className="text-slate-800 text-lg font-bold">Longitude</label>
                        <input 
                          type="text" 
                          placeholder="Longitude" 
                          value={lng}
                          onChange={(e) => setLng(e.target.value)}
                          disabled={isLocationLocked}
                          className={`w-full h-14 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-red-600 text-lg placeholder-slate-400 ${
                            isLocationLocked ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'
                          }`}
                        />
                      </div>
                      <div className="flex flex-col gap-2 relative">
                        <label className="text-slate-800 text-lg font-bold">Latitude</label>
                        <input 
                          type="text" 
                          placeholder="Latitude" 
                          value={lat}
                          onChange={(e) => setLat(e.target.value)}
                          disabled={isLocationLocked}
                          className={`w-full h-14 px-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-red-600 text-lg placeholder-slate-400 ${
                            isLocationLocked ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Width Description */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-800 text-lg font-bold">Keterangan</label>
                  <textarea 
                    className="w-full h-36 p-4 bg-white rounded-xl border border-transparent focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-800 transition-all shadow-sm resize-none placeholder-slate-400"
                    placeholder="Enter additional notes..."
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button className="flex items-center justify-center gap-3 h-14 px-8 rounded-2xl bg-zinc-300 text-white text-xl font-bold hover:bg-zinc-400 transition-colors group">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                    </svg>
                    Save Draft
                  </button>
                  <button className="flex items-center justify-center gap-3 h-14 px-8 rounded-2xl bg-red-600 text-white text-xl font-bold hover:bg-red-700 transition-colors shadow-md shadow-red-600/20 group">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                    </svg>
                    Save Project
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-300">
                 <div className="flex flex-col items-center gap-4">
                    <img className="w-20 h-20 opacity-20" src="https://placehold.co/80x80" alt="upload" />
                    <h3 className="text-xl font-bold text-slate-700">Upload CSV File</h3>
                    <p className="text-slate-500 mb-4">Drag and drop your file here or click to browse</p>
                    <button className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors">
                       Choose File
                    </button>
                 </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default NewProject;
