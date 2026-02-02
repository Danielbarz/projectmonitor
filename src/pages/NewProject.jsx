import React, { useState, useEffect } from 'react';
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

  // File Upload State
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Manual Form State
  const [masterData, setMasterData] = useState({ layanan: [], status: [] });
  const [formData, setFormData] = useState({
    layanan_id: '',
    paket_kecepatan: '',
    order_id: '',
    lokasi: '',
    alamat: '',
    cp_pelanggan: '',
    status_id: '',
    input_date: '',
    target_rfs: '',
    description: ''
  });
  const [manualLoading, setManualLoading] = useState(false);

  // Fetch Master Data
  useEffect(() => {
    fetch('http://localhost:5000/api/master')
      .then(res => res.json())
      .then(data => setMasterData(data))
      .catch(err => console.error('Failed to load master data', err));
  }, []);

  const handleLocationChange = (newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);
  };

  const handleManualInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setManualLoading(true);

    try {
        const payload = {
            ...formData,
            latitude: lat,
            longitude: lng
        };

        const response = await fetch('http://localhost:5000/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Project created successfully!');
            navigate('/projects');
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (err) {
        alert('Failed to create project.');
    } finally {
        setManualLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!file) {
        setUploadStatus('Please select a file first.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        setIsUploading(true);
        setUploadStatus('Uploading...');
        
        const response = await fetch('http://localhost:5000/api/projects/import', {
            method: 'POST',
            body: formData,
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setUploadStatus(`Success! ${data.message}`);
        } else {
            setUploadStatus(`Error: ${data.message}`);
        }
    } catch (err) {
        setUploadStatus('Upload failed. Server error.');
    } finally {
        setIsUploading(false);
    }
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
              <h1 className="text-3xl font-bold text-slate-800">
                Add <span className="text-red-600">New Project</span>
              </h1>
            </div>

            {/* Tabs */}
            <div className="relative mb-8">
              {/* Red Blur Background Effect */}
              <div className={`absolute top-0 w-32 h-12 bg-red-600/5 blur-[15px] transition-all duration-500 rounded-b-full pointer-events-none ${
                activeTab === 'csv' ? 'left-0' : 'left-32'
              }`}></div>

              <div className="border-b-2 border-slate-200/50 flex gap-6 relative z-10">
                <button 
                  onClick={() => setActiveTab('csv')}
                  className={`pb-2 text-base font-bold transition-colors relative ${activeTab === 'csv' ? 'text-red-600 border-b-2 border-red-600 -mb-[2px]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Upload CSV
                </button>
                <button 
                  onClick={() => setActiveTab('manual')}
                  className={`pb-2 text-base font-bold transition-colors relative ${activeTab === 'manual' ? 'text-red-600 border-b-2 border-red-600 -mb-[2px]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Add New Line
                </button>
              </div>
            </div>

            {/* Form Content */}
            {activeTab === 'manual' ? (
              <form className="space-y-8" onSubmit={handleManualSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                  
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Layanan Dropdown */}
                    <div className="flex flex-col gap-2">
                      <label className="text-slate-800 text-lg font-bold">Jenis Layanan</label>
                      <select 
                        name="layanan_id"
                        value={formData.layanan_id}
                        onChange={handleManualInput}
                        className="w-full h-11 px-4 bg-white rounded-xl border border-transparent focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-800 transition-all shadow-sm"
                      >
                        <option value="">Select Service Type</option>
                        {masterData.layanan.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                      </select>
                    </div>

                    <Input 
                        label="Paket/Kecepatan" 
                        placeholder="Enter package/speed" 
                        value={formData.paket_kecepatan}
                        onChange={(e) => handleManualInput({ target: { name: 'paket_kecepatan', value: e.target.value } })}
                    />
                    <Input 
                        label="Order_ID" 
                        placeholder="Enter Order ID"
                        value={formData.order_id}
                        onChange={(e) => handleManualInput({ target: { name: 'order_id', value: e.target.value } })}
                    />
                    <Input 
                        label="Input Date" 
                        type="date"
                        value={formData.input_date}
                        onChange={(e) => handleManualInput({ target: { name: 'input_date', value: e.target.value } })}
                    />
                    <Input 
                        label="Lokasi" 
                        placeholder="Enter location name" 
                        value={formData.lokasi}
                        onChange={(e) => handleManualInput({ target: { name: 'lokasi', value: e.target.value } })}
                    />
                    <Input 
                        label="Alamat" 
                        placeholder="Enter full address" 
                        value={formData.alamat}
                        onChange={(e) => handleManualInput({ target: { name: 'alamat', value: e.target.value } })}
                    />
                    <Input 
                        label="CP Pelanggan" 
                        placeholder="Enter customer contact" 
                        value={formData.cp_pelanggan}
                        onChange={(e) => handleManualInput({ target: { name: 'cp_pelanggan', value: e.target.value } })}
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Status Dropdown */}
                    <div className="flex flex-col gap-2">
                      <label className="text-slate-800 text-lg font-bold">Status Order</label>
                      <select 
                        name="status_id"
                        value={formData.status_id}
                        onChange={handleManualInput}
                        className="w-full h-11 px-4 bg-white rounded-xl border border-transparent focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-800 transition-all shadow-sm"
                      >
                        <option value="">Select Status</option>
                        {masterData.status.map(s => (
                            <option key={s.id} value={s.id}>{s.status_name}</option>
                        ))}
                      </select>
                    </div>

                    <Input 
                        label="Target RFS" 
                        type="date" 
                        value={formData.target_rfs}
                        onChange={(e) => handleManualInput({ target: { name: 'target_rfs', value: e.target.value } })}
                    />
                    
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
                    name="description"
                    value={formData.description}
                    onChange={handleManualInput}
                    className="w-full h-36 p-4 bg-white rounded-xl border border-transparent focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-slate-800 transition-all shadow-sm resize-none placeholder-slate-400"
                    placeholder="Enter additional notes..."
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button type="button" className="flex items-center justify-center gap-3 h-14 px-8 rounded-2xl bg-zinc-300 text-white text-xl font-bold hover:bg-zinc-400 transition-colors group">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                    </svg>
                    Save Draft
                  </button>
                  <button 
                    type="submit" 
                    disabled={manualLoading}
                    className={`flex items-center justify-center gap-3 h-14 px-8 rounded-2xl bg-red-600 text-white text-xl font-bold transition-colors shadow-md shadow-red-600/20 group ${manualLoading ? 'opacity-70' : 'hover:bg-red-700'}`}
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                    </svg>
                    {manualLoading ? 'Saving...' : 'Save Project'}
                  </button>
                </div>
              </form>
            ) : (
              // CSV Upload Section
              <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-300">
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-700">Upload CSV/Excel File</h3>
                    <p className="text-slate-500 mb-4 max-w-md">
                        Drag and drop your file here or click to browse. 
                        Supported formats: .xlsx, .csv
                    </p>

                    <input 
                        type="file" 
                        accept=".csv, .xlsx, .xls"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                    />
                    
                    <label 
                        htmlFor="file-upload"
                        className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors cursor-pointer flex items-center gap-2"
                    >
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                       </svg>
                       {file ? 'Change File' : 'Choose File'}
                    </label>

                    {file && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-lg w-full max-w-md flex items-center justify-between border border-slate-200">
                            <div className="flex items-center gap-3">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <div className="text-left">
                                    <p className="font-bold text-slate-700 text-sm truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleUpload} 
                                disabled={isUploading}
                                className={`px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg transition-colors ${
                                    isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                                }`}
                            >
                                {isUploading ? 'Processing...' : 'Upload & Process'}
                            </button>
                        </div>
                    )}

                    {uploadStatus && (
                        <div className={`mt-4 text-sm font-bold p-3 rounded-lg w-full max-w-md ${
                            uploadStatus.startsWith('Success') ? 'bg-green-100 text-green-700' : 
                            uploadStatus.startsWith('Error') || uploadStatus.startsWith('Upload failed') ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-600'
                        }`}>
                            {uploadStatus}
                            
                            {uploadStatus.startsWith('Success') && (
                                <div className="mt-3 text-center">
                                    <button 
                                        onClick={() => navigate('/projects')}
                                        className="text-green-800 underline hover:text-green-900 font-bold"
                                    >
                                        Go to All Projects &rarr;
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
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