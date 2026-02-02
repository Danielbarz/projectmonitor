import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import DateRangePicker from '../components/DateRangePicker';

const AllProjects = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setAllProjects(data);
      } else {
        setAllProjects([]);
        setError('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1); // Reset to page 1 on filter
  };

  // Filter Logic
  const filteredProjects = allProjects.filter(p => {
        const matchesSearch = p.order_id?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.lokasi?.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!startDate || !endDate) return matchesSearch;
        
        const projectDate = new Date(p.input_date || p.created_at);
        const start = new Date(startDate);
        const end = new Date(endDate);
        projectDate.setHours(0,0,0,0);
        start.setHours(0,0,0,0);
        end.setHours(0,0,0,0);

        const matchesDate = projectDate >= start && projectDate <= end;
        return matchesSearch && matchesDate;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleReset = async () => {
    if (window.confirm('ARE YOU SURE? This will DELETE ALL PROJECTS and cannot be undone!')) {
        try {
            const response = await fetch('http://localhost:5000/api/projects/reset', { method: 'DELETE' });
            if (response.ok) {
                alert('Database reset successful.');
                fetchProjects(); // Refresh list
            } else {
                alert('Failed to reset database.');
            }
        } catch (error) {
            console.error(error);
            alert('Error resetting database.');
        }
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h1 className="text-3xl font-bold text-slate-800">
                All <span className="text-red-600">Projects</span>
              </h1>
              
              <Link to="/projects/new" className="flex items-center gap-2 bg-red-600 text-white rounded-full px-6 py-2.5 hover:bg-red-700 transition-colors shadow-sm active:scale-95 transform duration-100">
                <span className="text-2xl font-bold leading-none mb-0.5">+</span>
                <span className="text-sm font-bold tracking-wide">Add New Project</span>
              </Link>
            </div>

            {/* Filter Section (Compact) */}
            <div className="bg-slate-800 rounded-2xl p-3 mb-8 flex items-center justify-between gap-4 shadow-lg">
               {/* Date Filter */}
               <div className="w-60">
                 <DateRangePicker startDate={startDate} endDate={endDate} onChange={handleDateChange} />
               </div>

              {/* Search Box */}
              <div className="w-full max-w-xs">
                <div className="bg-slate-100 h-10 rounded-full px-5 flex items-center justify-between hover:bg-white transition-colors border-2 border-transparent focus-within:border-red-500/50 group">
                  <input 
                    type="text" 
                    placeholder="Search Order ID, Location..." 
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
                  />
                  <svg className="w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {['Order ID', 'Input Date', 'Service', 'Address', 'Status', ''].map((head, i) => (
                        <th key={i} className={`px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap ${i === 5 ? 'w-16' : ''}`}>
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-slate-400">Loading projects...</td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-red-500">Error: {error}</td>
                      </tr>
                    ) : currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-slate-400">No projects found.</td>
                      </tr>
                    ) : (
                      currentItems.map((project, index) => (
                        <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-slate-700">{project.order_id}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{formatDate(project.input_date)}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">{project.layanan_name || '-'}</td>
                          <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={project.lokasi}>{project.lokasi || '-'}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                              project.status_name === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' :
                              project.status_name === 'JT' ? 'bg-red-100 text-red-800 border-red-200' :
                              project.status_name === 'Cancelled' ? 'bg-red-600 text-white border-red-700' :
                              'bg-cyan-100 text-cyan-800 border-cyan-200'
                            }`}>
                              {project.status_name || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right w-16">
                            <button 
                              onClick={() => handleProjectClick(project.id)}
                              className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer group"
                            >
                               <svg className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                               </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                    Showing <span className="font-bold text-slate-700">{indexOfFirstItem + 1}</span> to <span className="font-bold text-slate-700">{Math.min(indexOfLastItem, filteredProjects.length)}</span> of <span className="font-bold text-slate-700">{filteredProjects.length}</span> entries
                </span>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-slate-300 rounded-md bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Prev
                  </button>
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                        <button 
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`px-3 py-1 text-sm rounded-md transition-all ${currentPage === i + 1 ? 'bg-red-600 text-white font-bold shadow-sm' : 'hover:bg-slate-200 text-slate-600'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 text-sm border border-slate-300 rounded-md bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone (Full Width Thin Grey) */}
            <div className="mt-6">
                <button 
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-100 hover:text-red-500 transition-all"
                >
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Reset All Project Data
                </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AllProjects;