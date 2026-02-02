import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProjectMap from '../components/ProjectMap';
import MilestoneTimeline from '../components/MilestoneTimeline';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`);
        if (!response.ok) throw new Error('Project not found');
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    } catch { return dateString; }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Carlito']">
        <p className="text-xl text-slate-500 font-bold">Loading...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Carlito']">
        <p className="text-xl text-red-500 font-bold">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Carlito']">
      <Sidebar />
      
      <div className="ml-64 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div className="flex items-start gap-4">
                 <button onClick={() => navigate('/projects')} className="mt-2 p-2 hover:bg-slate-200 rounded-full transition-colors group">
                   <svg className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                   </svg>
                 </button>
                 <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                      Order ID <span className="text-red-600">#{project.order_id}</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          project.status_name === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' : 
                          'bg-cyan-100 text-cyan-700 border-cyan-200'
                      }`}>
                        {project.status_name}
                      </span>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => navigate(`/projects/${id}/edit`)}
                className="flex items-center gap-3 bg-slate-800 text-white px-6 py-3 rounded-xl hover:bg-slate-900 transition-colors shadow-lg shadow-slate-800/20 group"
              >
                <svg className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span className="font-bold">Update Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Left Column (60%) */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Project Info Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                     <div className="space-y-1">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Layanan</label>
                        <p className="text-slate-800 text-xl font-bold">{project.layanan_name || '-'}</p>
                     </div>
                     <div className="space-y-1">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Tanggal Mulai</label>
                        <p className="text-slate-800 text-xl font-bold">{formatDate(project.input_date)}</p>
                     </div>

                     <div className="space-y-1">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Paket/Kecepatan</label>
                        <p className="text-slate-800 text-xl font-bold">{project.paket_kecepatan || '-'}</p>
                     </div>
                     <div className="space-y-1">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Lokasi</label>
                        <p className="text-slate-800 text-xl font-bold">{project.lokasi || '-'}</p>
                     </div>

                     <div className="space-y-1 md:col-span-2">
                        <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Alamat</label>
                        <p className="text-slate-800 text-xl font-bold leading-relaxed">{project.alamat || '-'}</p>
                     </div>
                  </div>
                </div>

                {/* RFS Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                      <div className="space-y-1">
                          <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Target RFS</label>
                          <p className="text-slate-800 text-xl font-bold">{formatDate(project.target_rfs)}</p>
                      </div>
                      <div className="space-y-1">
                          <label className="text-slate-400 font-bold text-sm uppercase tracking-wide">Actual RFS</label>
                          <div className="flex items-center gap-2">
                             <p className="text-slate-800 text-xl font-bold">{formatDate(project.actual_rfs)}</p>
                          </div>
                      </div>
                   </div>
                </div>

                {/* Activity Log / Notes (Full History) */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative">
                   <h3 className="text-slate-400 font-bold text-lg uppercase tracking-wide mb-8">Activity Log / Notes</h3>
                   <div className="relative">
                      {/* Vertical Line */}
                      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                      
                      <div className="space-y-8">
                          {(project.notes && project.notes.length > 0 ? project.notes : (project.description ? [{ created_at: null, keterangan: project.description }] : [])).map((note, idx) => (
                              <div key={note.id || idx} className="relative pl-10 group">
                                 {/* Dot */}
                                 <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 ${idx === 0 ? 'bg-red-600 ring-4 ring-red-50' : 'bg-slate-400 ring-4 ring-slate-50 opacity-80'}`}></div>
                                 
                                 <div className="flex flex-col gap-2">
                                    <span className="text-slate-400 text-sm font-medium tracking-tight">
                                        {note.created_at ? new Date(note.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' }) : 'Latest Update'}
                                    </span>
                                    <div className="text-slate-700 text-lg font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        {note.keterangan}
                                    </div>
                                 </div>
                              </div>
                          ))}
                          
                          {(!project.notes || project.notes.length === 0) && !project.description && (
                              <div className="relative pl-10 text-slate-400 italic text-sm">No notes available.</div>
                          )}
                      </div>
                   </div>
                </div>

              </div>

              {/* Right Column (40%) */}
              <div className="lg:col-span-2 flex flex-col gap-6 h-full">
                
                {/* PIC Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                   <div className="w-16 h-16 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center text-slate-400 font-bold text-xl uppercase">
                      {project.cp_pelanggan ? project.cp_pelanggan.substring(0, 2) : 'NA'}
                   </div>
                   <div className="flex-1">
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-wide">PIC Project</p>
                      <p className="text-slate-800 text-xl font-bold truncate">{project.cp_pelanggan || 'Not Assigned'}</p>
                   </div>
                </div>

                {/* Coordinates Card with Map */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
                   <div>
                       <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wide mb-4">Coordinates</h3>
                       <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                               <label className="text-xs text-slate-500 font-bold uppercase">Latitude</label>
                               <p className="text-slate-800 font-bold">{project.latitude || '-'}</p>
                           </div>
                           <div className="space-y-1">
                               <label className="text-xs text-slate-500 font-bold uppercase">Longitude</label>
                               <p className="text-slate-800 font-bold">{project.longitude || '-'}</p>
                           </div>
                       </div>
                   </div>

                   {/* Map Inside Card */}
                   {project.latitude && project.longitude && (
                        <div className="rounded-xl overflow-hidden border border-slate-200">
                            <ProjectMap 
                                center={[project.latitude, project.longitude]}
                                zoom={13}
                                height="200px"
                                data={[{
                                    id: project.id,
                                    lat: project.latitude,
                                    lng: project.longitude,
                                    name: project.lokasi,
                                    status: project.status_name
                                }]}
                            />
                        </div>
                   )}
                </div>

                {/* Project Milestone (Dynamic Component) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative flex-1">
                   <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wide mb-8">Project Milestone</h3>
                   <MilestoneTimeline 
                      statusName={project.status_name}
                      statusSequence={project.status_sequence}
                      lastStatusSequence={project.last_status_sequence}
                   />
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;