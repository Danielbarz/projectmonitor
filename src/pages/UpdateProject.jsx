import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LocationPicker from '../components/LocationPicker'; // Import LocationPicker
import MilestoneTimeline from '../components/MilestoneTimeline';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [masterData, setMasterData] = useState({ layanan: [], status: [] });
  
  // Note System
  const [notesHistory, setNotesHistory] = useState([]);
  const [oldDescription, setOldDescription] = useState('');
  const [newNote, setNewNote] = useState('');
  const [lastStatusSequence, setLastStatusSequence] = useState(null);
  const [hasJTHistory, setHasJTHistory] = useState(false); // New state for JT History
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [tempNote, setTempNote] = useState('');

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
    actual_rfs: '',
    latitude: '',
    longitude: ''
  });

  // Fetch Project & Master Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, masterRes] = await Promise.all([
          fetch(`http://localhost:5000/api/projects/${id}`),
          fetch('http://localhost:5000/api/master')
        ]);

        if (!projectRes.ok) throw new Error('Failed to fetch project');
        
        const projectData = await projectRes.json();
        const masterData = await masterRes.json();

        setMasterData(masterData);
        
        // Handle Notes: Use history from DB, or fallback to legacy description if notes table is empty
        let initialNotes = projectData.notes || [];
        if (initialNotes.length === 0 && projectData.description) {
            initialNotes = [{
                id: 'legacy',
                created_at: new Date().toISOString(), // Or projectData.updated_at if available
                keterangan: projectData.description
            }];
        }
        setNotesHistory(initialNotes);
        // Save current DB status sequence
        setLastStatusSequence(projectData.last_status_sequence || projectData.status_sequence || 1); 
        setHasJTHistory(projectData.has_jt_history || false); // Set from API
        setOldDescription(projectData.description || '');

        const formatDate = (isoString) => {
            if (!isoString) return '';
            return new Date(isoString).toISOString().split('T')[0];
        };

        setFormData({
            layanan_id: projectData.layanan_id || '',
            paket_kecepatan: projectData.paket_kecepatan || '',
            order_id: projectData.order_id || '',
            lokasi: projectData.lokasi || '',
            alamat: projectData.alamat || '',
            cp_pelanggan: projectData.cp_pelanggan || '',
            status_id: projectData.status_id || '',
            input_date: formatDate(projectData.input_date),
            target_rfs: formatDate(projectData.target_rfs),
            actual_rfs: formatDate(projectData.actual_rfs),
            latitude: projectData.latitude || '',
            longitude: projectData.longitude || ''
        });

      } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading project data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // If changing status and it's NOT Cancelled (ID 6), update the 'last known good' sequence
    if (name === 'status_id' && parseInt(value) !== 6) {
        const selectedStatus = masterData.status.find(s => s.id === parseInt(value));
        if (selectedStatus) {
            setLastStatusSequence(selectedStatus.sequence_order);
        }
    }
  };

  const handleAddNote = () => {
    if (tempNote.trim()) {
        // Just store it in newNote state, will be sent on Save Update
        // If there's already a new note pending, append it
        setNewNote(prev => prev ? `${prev}\n\n${tempNote}` : tempNote);
        setTempNote('');
        setIsNoteModalOpen(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        const payload = {
            ...formData,
            new_note: newNote // Send the new note to backend to handle insertion
        };

        const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Project updated successfully!');
            navigate(`/projects/${id}`);
        } else {
            const err = await response.json();
            alert(`Update failed: ${err.message}`);
        }
    } catch (error) {
        console.error('Error updating:', error);
        alert('Failed to update project.');
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Carlito']">
            <p className="text-xl text-slate-500 font-bold">Loading...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Carlito'] relative">
      <Sidebar />
      
      <div className="ml-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div className="flex items-start gap-4">
                 <button onClick={() => navigate(-1)} className="mt-2 p-2 hover:bg-slate-200 rounded-full transition-colors group">
                   <svg className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                   </svg>
                 </button>
                 <div>
                    <h1 className="text-3xl font-bold text-slate-800">Update Project</h1>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-slate-500 font-bold">#{formData.order_id}</span>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center gap-3 h-14 px-8 rounded-2xl bg-zinc-300 text-white text-xl font-bold hover:bg-zinc-400 transition-colors group"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 bg-red-600 text-white px-8 h-14 rounded-2xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 group"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                    </svg>
                    <span className="font-bold text-xl">{saving ? 'Saving...' : 'Save Update'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Left Column (60%) */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Info Card (Editable) */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                     <div className="space-y-2">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Layanan</label>
                        <select name="layanan_id" value={formData.layanan_id} onChange={handleChange} className="w-full h-12 px-4 bg-slate-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-red-500 font-bold text-slate-800">
                            <option value="">Select Service</option>
                            {masterData.layanan.map(l => (<option key={l.id} value={l.id}>{l.name}</option>))}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Tanggal Mulai</label>
                        <input type="date" name="input_date" value={formData.input_date} onChange={handleChange} className="w-full h-12 px-4 bg-slate-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-red-500 font-bold text-slate-800" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Paket/Kecepatan</label>
                        <input type="text" name="paket_kecepatan" value={formData.paket_kecepatan} onChange={handleChange} className="w-full h-12 px-4 bg-slate-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-red-500 font-bold text-slate-800" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Lokasi</label>
                        <input type="text" name="lokasi" value={formData.lokasi} onChange={handleChange} className="w-full h-12 px-4 bg-slate-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-red-500 font-bold text-slate-800" />
                     </div>
                     <div className="space-y-2 md:col-span-2">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Alamat</label>
                        <textarea name="alamat" value={formData.alamat} onChange={handleChange} className="w-full h-24 p-4 bg-slate-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-red-500 font-bold text-slate-800 resize-none"></textarea>
                     </div>
                  </div>
                </div>

                {/* RFS Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                      <div className="space-y-2">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Target RFS</label>
                        <input type="date" name="target_rfs" value={formData.target_rfs} onChange={handleChange} className="w-full h-12 px-4 bg-slate-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-red-500 font-bold text-slate-800" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Actual RFS</label>
                        <input type="date" name="actual_rfs" value={formData.actual_rfs} onChange={handleChange} className="w-full h-12 px-4 bg-slate-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-red-500 font-bold text-slate-800" />
                      </div>
                   </div>
                </div>

                {/* Activity Log / Notes (Updated) */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative pb-20">
                   <h3 className="text-slate-400 font-bold text-lg uppercase tracking-wide mb-8">Activity Log / Notes</h3>
                   <div className="relative">
                      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                      <div className="space-y-8">
                          
                          {/* Pending New Note Preview */}
                          {newNote && (
                            <div className="relative pl-10 group animate-in slide-in-from-left-2 duration-200">
                                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 bg-red-600 ring-4 ring-red-50"></div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-red-600 text-sm font-bold tracking-tight">Draft Update</span>
                                    <div className="text-slate-800 text-base font-bold whitespace-pre-wrap italic">
                                        {newNote}
                                    </div>
                                </div>
                            </div>
                          )}

                          {/* Historical Notes from DB */}
                          {notesHistory.map((note, idx) => (
                            <div key={note.id || idx} className="relative pl-10 group opacity-80">
                                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 bg-slate-400 ring-4 ring-slate-50"></div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-slate-400 text-sm font-medium tracking-tight">
                                        {new Date(note.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                    </span>
                                    <div className="text-slate-600 text-base font-medium leading-relaxed whitespace-pre-wrap">
                                        {note.keterangan}
                                    </div>
                                </div>
                            </div>
                          ))}
                          
                          {notesHistory.length === 0 && !newNote && (
                            <div className="relative pl-10 text-slate-400 italic text-sm">No notes history available.</div>
                          )}
                      </div>
                   </div>

                   {/* Add New Note Button */}
                   <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                      <button 
                        onClick={() => setIsNoteModalOpen(true)}
                        className="flex items-center gap-3 bg-slate-800 text-white px-8 py-2.5 rounded-xl hover:bg-slate-900 transition-colors shadow-lg active:scale-95"
                      >
                        <span className="text-xl font-bold">+</span>
                        <span className="font-bold">Add New Note</span>
                      </button>
                   </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                   <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wide mb-4">PIC Project</h3>
                   <input type="text" name="cp_pelanggan" value={formData.cp_pelanggan} onChange={handleChange} placeholder="Enter PIC Name" className="w-full h-12 px-4 bg-slate-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-red-500 font-bold text-slate-800" />
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                   <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wide mb-4">Coordinates</h3>
                   
                   {/* Map Picker */}
                   <div className="mb-6">
                       <LocationPicker 
                          lat={formData.latitude} 
                          lng={formData.longitude} 
                          onLocationChange={(newLat, newLng) => {
                              setFormData(prev => ({ ...prev, latitude: newLat, longitude: newLng }));
                          }}
                       />
                   </div>

                   <div className="space-y-4">
                       <div><label className="text-xs text-slate-500 font-bold uppercase">Latitude</label><input type="text" name="latitude" value={formData.latitude} onChange={handleChange} className="w-full h-10 px-3 bg-slate-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-red-500 font-bold text-slate-800" /></div>
                       <div><label className="text-xs text-slate-500 font-bold uppercase">Longitude</label><input type="text" name="longitude" value={formData.longitude} onChange={handleChange} className="w-full h-10 px-3 bg-slate-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-red-500 font-bold text-slate-800" /></div>
                   </div>
                </div>

                {/* Project Milestone (Preview) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative flex-1">
                   <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wide mb-8">Project Milestone</h3>
                   
                   {(() => {
                       const currentStatusObj = masterData.status.find(s => s.id === parseInt(formData.status_id));
                       return (
                           <MilestoneTimeline 
                              statusName={currentStatusObj?.status_name}
                              statusSequence={currentStatusObj?.sequence_order}
                              lastStatusSequence={lastStatusSequence}
                              hasJT={hasJTHistory}
                           />
                       );
                                                         })()}
                                      
                                                         {/* Edit Status Button (Relative Position) */}
                                                         <div className="mt-8 px-6">
                                                            <button 
                                                              type="button"
                                                              onClick={() => setIsMilestoneModalOpen(true)}
                                                              className="w-full flex items-center justify-center gap-3 bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-900 transition-colors shadow-lg"
                                                            >
                                                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                              </svg>
                                                              <span className="font-bold">Edit Status</span>
                                                            </button>
                                                         </div>
                                                      </div>                   
                                 </div>
                               </div>
                             </div>
                           </main>
                         </div>
                   
                         {/* New Note Modal */}
                         {isNoteModalOpen && (
                           <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                              <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
                                 <h2 className="text-3xl font-bold text-slate-800 mb-6">New Note</h2>
                                 <textarea 
                                   value={tempNote}
                                   onChange={(e) => setTempNote(e.target.value)}
                                   className="w-full h-40 bg-slate-50 rounded-xl p-4 text-slate-800 placeholder-slate-400 text-lg border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none resize-none mb-8"
                                   placeholder="Write your update here ..."
                                 ></textarea>
                                 <div className="flex gap-4">
                                   <button onClick={() => { setIsNoteModalOpen(false); setTempNote(''); }} className="flex-1 h-12 rounded-xl border-2 border-slate-300 text-slate-500 font-bold text-xl hover:bg-slate-50 transition-colors">Cancel</button>
                                   <button onClick={handleAddNote} className="flex-1 flex items-center justify-center gap-3 h-12 rounded-xl bg-red-600 text-white font-bold text-xl hover:bg-red-700 transition-colors shadow-lg group">Save Note</button>
                                 </div>
                              </div>
                           </div>
                         )}
                   
                         {/* Edit Status Modal */}
                         {isMilestoneModalOpen && (
                           <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                              <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
                                 <h2 className="text-3xl font-bold text-slate-800 mb-6">Update Status</h2>
                                 
                                 <div className="space-y-4 mb-8">
                                     <label className="text-slate-500 font-bold text-lg">Select New Status</label>
                                     <select 
                                       name="status_id"
                                       value={formData.status_id}
                                       onChange={handleChange}
                                       className="w-full h-14 px-4 bg-slate-100 rounded-xl border-none outline-none focus:ring-2 focus:ring-red-500 font-bold text-slate-800 text-lg"
                                     >
                                         <option value="">Select Status</option>
                                         {masterData.status.map(s => (
                                             <option key={s.id} value={s.id}>{s.status_name}</option>
                                         ))}
                                     </select>
                                 </div>
                   
                                 <div className="flex gap-4">
                                   <button 
                                       onClick={() => setIsMilestoneModalOpen(false)} 
                                       className="flex-1 h-12 rounded-xl border-2 border-slate-300 text-slate-500 font-bold text-xl hover:bg-slate-50 transition-colors"
                                   >
                                       Done
                                   </button>
                                 </div>
                              </div>
                           </div>
                         )}
                       </div>
                     );
                   };

export default UpdateProject;