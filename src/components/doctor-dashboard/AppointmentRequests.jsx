import React, { useState, useEffect } from 'react';

const AppointmentRequests = ({ 
  appointments, 
  pendingAppointments = [],
  onStatusChange, 
  pageInfo, 
  onFetchHistory, 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  trailing // shown beside the search box on phones/tablets (e.g. the alert bell)
}) => {
  const [activeSubTab, setActiveSubTab] = useState('requests');
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search query to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      onFetchHistory(1, debouncedSearch, statusFilter);
      setSearchQuery(debouncedSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [debouncedSearch, statusFilter]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    onFetchHistory(1, searchQuery, status);
  };

  const handlePageChange = (newPage) => {
    onFetchHistory(newPage, searchQuery, statusFilter);
  };

  const parseApptDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
      return new Date(dateStr);
    } else if (dateStr.includes('-') && dateStr.split('-')[2].length === 4) {
      const [d, m, y] = dateStr.split('-');
      return new Date(`${y}-${m}-${d}`);
    }
    return new Date(dateStr);
  };

  const formatTime12Hour = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  // Pending requests come from their own endpoint so none are hidden on later history pages;
  // the search box still filters them by name / patient ID
  const q = (searchQuery || '').trim().toLowerCase();
  const pendingRequests = pendingAppointments.filter(app =>
    !q || app.name?.toLowerCase().includes(q) || app.patientUid?.toLowerCase().includes(q));
  const otherHistory = appointments.filter(app => app.status !== 'pending').sort((a, b) => {
      const dateA = parseApptDate(a.date);
      const dateB = parseApptDate(b.date);
      if (dateA.getTime() === dateB.getTime()) {
        const timeA = a.time || "";
        const timeB = b.time || "";
        return timeB.localeCompare(timeA); // Descending time
      }
      return dateB - dateA; // Descending date
  });

  const renderPagination = () => {
    const { currentPage, totalPages } = pageInfo;
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center mt-10">
        <div className="flex items-center gap-6 bg-slate-50/80 px-4 py-2 rounded-full border border-gray-100 shadow-sm">
          <button 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-clinic-600 border border-gray-200 shadow-sm hover:translate-x-[-2px] ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'text-slate-700  cursor-pointer' }`}
          >
            <svg className="w-4 h-4 " fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          
          <div className="text-sm font-bold text-slate-700 select-none">
            {currentPage} of {totalPages}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md hover:translate-x-[2px] ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-clinic-600 text-white hover:brightness-110 cursor-pointer active:scale-95'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    );
  };

  const renderTable = (list, title, emptyMsg) => (
    <div className="animate-fade-in w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3 max-md:block">
          <thead className="max-md:hidden">
            <tr className="text-[10px] text-gray-400 font-extrabold uppercase tracking-[0.2em] px-2">
              <th className="pb-2 pl-4">Patient Profile</th>
              <th className="pb-2">Schedule</th>
              <th className="pb-2 text-right pr-8">Current Status</th>
              {activeSubTab === 'requests' && <th className="pb-2 text-right pr-4">Action Control</th>}
            </tr>
          </thead>
          <tbody className="max-md:block max-md:space-y-2">
            {list.length === 0 ? (
              <tr className="max-md:block">
                <td colSpan={activeSubTab === 'requests' ? "4" : "3"} className="max-md:block bg-slate-50/50 rounded-2xl py-14 md:py-20 px-4 text-center text-gray-400 font-bold border-2 border-dashed border-gray-100 italic transition-colors">
                  {emptyMsg}
                </td>
              </tr>
            ) : (
              list.map(app => {
                const displayName = app.name || "New Patient";
                const displayChar = typeof displayName === 'string' && displayName.length > 0 ? displayName.charAt(0).toUpperCase() : "P";
                
                return (
                  <tr key={app.id} className="bg-white group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 max-md:flex max-md:flex-wrap max-md:items-center max-md:gap-x-2 max-md:gap-y-2 max-md:p-3 max-md:rounded-2xl max-md:border max-md:border-gray-100 max-md:shadow-sm">
                    <td className="py-4 pl-4 rounded-l-2xl border-y border-l border-gray-100 max-md:order-1 max-md:w-[calc(100%-100px)] max-md:min-w-0 max-md:p-0 max-md:border-0 max-md:rounded-none">
                      <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl md:rounded-2xl bg-clinic-600 text-white flex items-center justify-center font-black text-base md:text-lg shadow-lg shadow-blue-500/20">
                          {displayChar}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold md:font-black text-slate-800 text-sm md:text-base tracking-tight truncate">{displayName}</div>
                          <div className="text-[11px] md:text-[10px] text-gray-400 font-semibold md:font-black md:uppercase md:tracking-widest">{app.age || "--"} yrs • {app.gender || "---"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 border-y border-gray-100 max-md:order-3 max-md:flex-1 max-md:pl-[52px] max-md:p-0 max-md:border-0 max-md:text-xs">
                      <div className="font-black text-slate-700 max-md:inline max-md:font-semibold max-md:text-slate-500">{app.date}</div>
                      <div className="text-[10px] text-clinic-600 font-black uppercase tracking-widest max-md:inline max-md:text-xs max-md:font-semibold max-md:normal-case max-md:tracking-normal max-md:ml-1"><span className="max-md:hidden">At </span><span className="md:hidden">· </span>{formatTime12Hour(app.time)}</div>
                    </td>
                    <td className={`py-4 border-y border-gray-100 max-md:order-4 max-md:p-0 max-md:border-0 max-md:[&>span]:px-2 max-md:[&>span]:py-1 max-md:[&>span]:tracking-wide max-md:[&>span]:rounded-lg ${activeSubTab !== 'requests' ? 'text-right pr-4 rounded-r-2xl border-r' : ''}`}>
                      {app.status === 'in_progress' && <span className="bg-blue-50 text-blue-600 text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-xl border border-blue-100 animate-pulse">In Consultation</span>}
                      {app.status === 'completed' && <span className="bg-slate-50 text-slate-500 text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-xl border border-slate-100">Completed</span>}
                      {app.status === 'approved' && <span className="bg-green-50 text-green-600 text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-xl border border-green-100">Confirmed</span>}
                      {app.status === 'pending' && <span className="bg-amber-50 text-amber-600 text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-xl border border-amber-100 shadow-xs"><span className="md:hidden">Pending</span><span className="max-md:hidden">Awaiting Approval</span></span>}
                      {app.status === 'rejected' && <span className="bg-rose-50 text-rose-500 text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-xl border border-rose-100">Declined</span>}
                    </td>
                    {activeSubTab === 'requests' && (
                    <td className="py-4 text-right pr-4 rounded-r-2xl border-y border-r border-gray-100 max-md:order-2 max-md:p-0 max-md:border-0 max-md:rounded-none">
                      {app.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => onStatusChange(app.id, 'approved')} 
                            className="bg-green-500 text-white p-2 md:p-2.5 rounded-xl hover:bg-green-600 shadow-lg shadow-green-500/30 transition-all active:scale-90"
                            title="Approve Requested Slot"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                          </button>
                          <button 
                            onClick={() => onStatusChange(app.id, 'rejected')} 
                            className="bg-rose-50 text-rose-500 p-2 md:p-2.5 rounded-xl hover:bg-rose-100 transition-colors active:scale-90"
                            title="Decline Request"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                          </button>
                        </div>
                      ) : (
                        <span className="max-md:hidden text-[10px] font-black text-slate-300 uppercase tracking-widest">Logged Record</span>
                      )}
                    </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {activeSubTab === 'history' && renderPagination()}
    </div>
  );

  return (
    <div className="w-full h-full pb-10 flex flex-col">
      {/* Search and Filters Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 lg:gap-4 mb-4 lg:mb-10 shrink-0">
            <div className="flex items-center gap-3 w-full xl:w-auto">
            <div className="relative flex-1 min-w-0 xl:w-[400px] xl:flex-none group">
              <input 
                type="text" 
                placeholder="Search by name or ID..."
                value={debouncedSearch}
                onChange={(e) => setDebouncedSearch(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-2xl py-3 lg:py-4 pl-12 lg:pl-14 pr-10 lg:pr-6 text-slate-800 font-bold focus:outline-hidden focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all shadow-sm group-hover:shadow-md"
              />
              <div className="absolute left-4 lg:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-clinic-600 transition-colors">
                 <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              {debouncedSearch && (
                <button 
                  onClick={() => setDebouncedSearch('')} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </div>
            {trailing && <div className="lg:hidden shrink-0">{trailing}</div>}
            </div>

            <div className="flex items-center gap-1.5 w-full xl:w-auto overflow-x-auto no-scrollbar pb-1 xl:pb-0">
               <span className="hidden md:inline text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 shrink-0">Filter:</span>
               {['', 'approved', 'completed', 'rejected', 'pending'].map(st => (
                 <button 
                   key={st}
                   onClick={() => handleStatusFilterChange(st)}
                   className={`shrink-0 px-3 py-1.5 md:py-2 rounded-full md:rounded-xl text-xs md:text-[10px] font-bold md:font-black capitalize md:uppercase md:tracking-widest transition-all whitespace-nowrap ${statusFilter === st ? 'bg-clinic-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-400 border border-gray-100 hover:text-slate-600 hover:border-slate-200'}`}
                 >
                   {st === '' ? 'All' : st}
                 </button>
               ))}
            </div>
        </div>

      {/* Sub-Tab Switcher */}
      <div className="flex gap-4 lg:gap-8 mb-3 lg:mb-8 border-b border-gray-100 shrink-0">
        <button 
          onClick={() => setActiveSubTab('requests')}
          className={`pb-3 lg:pb-4 px-1 lg:px-2 text-xs lg:text-sm font-bold lg:font-black lg:uppercase lg:tracking-widest whitespace-nowrap transition-all relative ${activeSubTab === 'requests' ? 'text-clinic-600' : 'text-gray-400 hover:text-slate-600'}`}
        >
          <div className="flex items-center gap-2 lg:gap-3">
             <span className="lg:hidden">Requests</span><span className="hidden lg:inline">Current Requests</span>
             <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeSubTab === 'requests' ? 'bg-clinic-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
               {pendingRequests.length}
             </span>
          </div>
          {activeSubTab === 'requests' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-clinic-600 rounded-full animate-fade-in" />}
        </button>

        <button 
          onClick={() => setActiveSubTab('history')}
          className={`pb-3 lg:pb-4 px-1 lg:px-2 text-xs lg:text-sm font-bold lg:font-black lg:uppercase lg:tracking-widest whitespace-nowrap transition-all relative ${activeSubTab === 'history' ? 'text-clinic-600' : 'text-gray-400 hover:text-slate-600'}`}
        >
          <div className="flex items-center gap-2 lg:gap-3">
             History<span className="hidden lg:inline">&nbsp;& Records</span>
             <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeSubTab === 'history' ? 'bg-clinic-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
               {Math.max(0, pageInfo.totalCount - (statusFilter ? 0 : pendingRequests.length))}
             </span>
          </div>
          {activeSubTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-clinic-600 rounded-full animate-fade-in" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeSubTab === 'requests' ? 
           renderTable(pendingRequests, "Incoming Requests", "No pending appointments found matching your search.") :
           renderTable(otherHistory, "History & Records Log", "No historical records found matching your search.")
        }
      </div>
    </div>
  );
};

export default AppointmentRequests;
