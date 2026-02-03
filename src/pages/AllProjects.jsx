import React, { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import DateRangePicker from '../components/DateRangePicker';
import { useAuth } from '../context/AuthContext';

// Multi-select Dropdown Component
const MultiSelectFilter = ({ label, options, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const isActive = selectedValues.length > 0;

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap hover:text-slate-700 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-500'}`}
      >
        <span>{label}</span>
        {isActive && (
            <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full">
                {selectedValues.length}
            </span>
        )}
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="max-h-60 overflow-y-auto">
                {options.map((opt) => (
                    <label
                        key={opt}
                        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
                        onClick={() => toggleOption(opt)}
                    >
                        {/* Square Checkbox UI */}
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                            selectedValues.includes(opt)
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-slate-300 group-hover:border-slate-400 bg-white'
                        }`}>
                            {selectedValues.includes(opt) && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>

                        <span className={`text-[13px] font-medium transition-colors ${
                            selectedValues.includes(opt) ? 'text-slate-900 font-bold' : 'text-slate-600'
                        }`}>
                            {opt}
                        </span>
                    </label>
                ))}
            </div>
            {isActive && (
                <div className="pt-2 mt-2 border-t border-slate-100">
                    <button
                        onClick={() => onChange([])}
                        className="w-full py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

const AllProjects = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Multi-select Filter States
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [allProjects, setAllProjects] = useState([]);
  const [masterData, setMasterData] = useState({ layanan: [], status: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
        if (!token) return;
        try {
            const [projectsRes, masterRes] = await Promise.all([
                fetch('http://localhost:5000/api/projects', {
                    headers: { Authorization: token }
                }),
                fetch('http://localhost:5000/api/master')
            ]);

            if (!projectsRes.ok) throw new Error('Failed to fetch projects');

            const projectsData = await projectsRes.json();
            const masterData = await masterRes.json();

            if (Array.isArray(projectsData)) {
                setAllProjects(projectsData);
            } else {
                setAllProjects([]);
                setError('Invalid data format received');
            }
            setMasterData(masterData);

        } catch (error) {
            console.error('Error loading data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [token]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1);
  };

  // Filter Logic
  const filteredProjects = useMemo(() => {
    return allProjects.filter(p => {
        // Search Filter
        const matchesSearch = p.order_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             p.lokasi?.toLowerCase().includes(searchQuery.toLowerCase());

        // Service Filter (Multi)
        const matchesService = selectedServices.length === 0 || selectedServices.includes(p.layanan_name);

        // Status Filter (Multi)
        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(p.status_name);

        // Date Filter
        let matchesDate = true;
        if (startDate && endDate) {
            const projectDate = new Date(p.input_date || p.created_at);
            const start = new Date(startDate);
            const end = new Date(endDate);
            projectDate.setHours(0,0,0,0);
            start.setHours(0,0,0,0);
            end.setHours(0,0,0,0);
            matchesDate = projectDate >= start && projectDate <= end;
        }

        return matchesSearch && matchesService && matchesStatus && matchesDate;
    });
  }, [allProjects, searchQuery, startDate, endDate, selectedServices, selectedStatuses]);

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
            const response = await fetch('http://localhost:5000/api/projects/reset', { 
                method: 'DELETE',
                headers: { Authorization: token }
            });
            if (response.ok) {
                alert('Database reset successful.');
                window.location.reload();
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
            <div className="bg-slate-800 rounded-xl p-3 mb-8 flex items-center justify-between gap-4 shadow-lg">
               {/* Date Filter */}
               <div className="w-60">
                 <DateRangePicker startDate={startDate} endDate={endDate} onChange={handleDateChange} />
               </div>

              {/* Search Box (Compact) */}
              <div className="w-64">
                <div className="bg-slate-100 h-10 rounded-xl px-5 flex items-center justify-between hover:bg-white transition-colors border-2 border-transparent focus-within:border-red-500/50 group">
                  <input
                    type="text"
                    placeholder="Search..."
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
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-visible"> {/* overflow-visible allows dropdowns to pop out */}
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Order ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Input Date</th>

                      {/* Service Filter Header (Multi-Select) */}
                      <th className="px-6 py-4 text-left">
                          <MultiSelectFilter
                            label="Service"
                            options={masterData.layanan.map(l => l.name)}
                            selectedValues={selectedServices}
                            onChange={(vals) => { setSelectedServices(vals); setCurrentPage(1); }}
                          />
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Address</th>

                      {/* Status Filter Header (Multi-Select) */}
                      <th className="px-6 py-4 text-left">
                          <MultiSelectFilter
                            label="Status"
                            options={masterData.status.map(s => s.status_name)}
                            selectedValues={selectedStatuses}
                            onChange={(vals) => { setSelectedStatuses(vals); setCurrentPage(1); }}
                          />
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-16"></th>
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
                        <tr key={index} className="hover:bg-slate-50/80 transition-colors animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                          <td className="px-6 py-4 text-sm font-bold text-slate-700">{project.order_id}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{formatDate(project.input_date)}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">{project.layanan_name || '-'}</td>
                          <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={project.lokasi}>{project.lokasi || '-'}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                              project.status_name === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' :
                              project.status_name === 'JT' ? 'bg-amber-500 text-white border-amber-600' :
                              project.status_name === 'Progres PT 1' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                              project.status_name === 'Survey' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              project.status_name === 'Cancelled' ? 'bg-red-600 text-white border-red-700' :
                              'bg-slate-100 text-slate-600 border-slate-200'
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
                    Showing <span className="font-bold text-slate-700">{filteredProjects.length > 0 ? indexOfFirstItem + 1 : 0}</span> to <span className="font-bold text-slate-700">{Math.min(indexOfLastItem, filteredProjects.length)}</span> of <span className="font-bold text-slate-700">{filteredProjects.length}</span> entries
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
                    {/* Responsive Pagination */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5) {
                            if (currentPage > 3) pageNum = currentPage - 2 + i;
                            if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                        }
                        return (
                            <button
                                key={pageNum}
                                onClick={() => paginate(pageNum)}
                                className={`px-3 py-1 text-sm rounded-md transition-all ${currentPage === pageNum ? 'bg-red-600 text-white font-bold shadow-sm' : 'hover:bg-slate-200 text-slate-600'}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
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