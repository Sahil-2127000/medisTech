import React, { useState, useEffect } from 'react';

const AppointmentRequests = ({ 
  appointments, 
  onStatusChange, 
  pageInfo, 
  onFetchHistory, 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter 
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
  }, [debouncedSearch]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    onFetchHistory(1, searchQuery, status);
  };

  const handlePageChange = (newPage) => {
    onFetchHistory(newPage, searchQuery, statusFilter);
  };

  const pendingRequests = appointments.filter(app => app.status === 'pending');
  const otherHistory = appointments.filter(app => app.status !== 'pending');

  const renderPagination = () => {
    const { currentPage, totalPages, totalCount } = pageInfo;
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center mt-10 px-4 py-1 bg-slate-50/50 rounded-[2.5rem] border border-gray-100/50">
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`w-6 h-6 rounded-xl flex items-center bg-blue-600 justify-center transition-all ${currentPage === 1 ? 'text-gray-200  border border-gray-50' : 'text-slate-600 bg-white border border-gray-100 hover:text-clinic-600 hover:shadow-lg active:scale-90 cursor-pointer'}`}
          >
            <svg className="w-3 h-3" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            // Only show limited pages if too many
            if (totalPages > 5 && Math.abs(pageNum - currentPage) > 2 && pageNum !== 1 && pageNum !== totalPages) return null;
            
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${currentPage === pageNum ? 'bg-clinic-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-50' : 'bg-white text-slate-400 border border-gray-100 hover:border-clinic-200 hover:text-clinic-600'}`}
              >
                {pageNum}
              </button>
            );
          })}

          <button 
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentPage === totalPages ? 'text-gray-200 bg-white border border-gray-50' : 'text-slate-600 bg-white border border-gray-100 hover:text-clinic-600 hover:shadow-lg active:scale-90 cursor-pointer'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    );
  };

  const renderTable = (list, title, emptyMsg) => (
    <div className="animate-fade-in w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[10px] text-gray-400 font-extrabold uppercase tracking-[0.2em] px-2">
              <th className="pb-2 pl-4">Patient Profile</th>
              <th className="pb-2">Schedule</th>
              <th className="pb-2">Current Status</th>
              <th className="pb-2 text-right pr-4">Action Control</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan="4" className="bg-slate-50/50 rounded-2xl py-20 text-center text-gray-400 font-bold border-2 border-dashed border-gray-100 italic transition-colors">
                  {emptyMsg}
                </td>
              </tr>
            ) : (
              list.map(app => {
                const displayName = app.name || "New Patient";
                const displayChar = typeof displayName === 'string' && displayName.length > 0 ? displayName.charAt(0).toUpperCase() : "P";
                
                return (
                  <tr key={app.id} className="bg-white group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                    <td className="py-4 pl-4 rounded-l-2xl border-y border-l border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-clinic-600 to-blue-400 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-500/20">
                          {displayChar}
                        </div>
                        <div>
                          <div className="font-black text-slate-800 text-base tracking-tight">{displayName}</div>
                          <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{app.age || "--"} yrs • {app.gender || "---"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 border-y border-gray-100">
                      <div className="font-black text-slate-700">{app.date}</div>
                      <div className="text-[10px] text-clinic-600 font-black uppercase tracking-widest">At {app.time}</div>
                    </td>
                    <td className="py-4 border-y border-gray-100">
                      {app.status === 'in_progress' && <span className="bg-blue-50 text-blue-600 text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-xl border border-blue-100 animate-pulse">In Consultation</span>}
                      {app.status === 'completed' && <span className="bg-slate-50 text-slate-500 text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-xl border border-slate-100">Session Closed</span>}
                      {app.status === 'approved' && <span className="bg-green-50 text-green-600 text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-xl border border-green-100">Confirmed</span>}
                      {app.status === 'pending' && <span className="bg-amber-50 text-amber-600 text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-xl border border-amber-100 shadow-xs">Awaiting Approval</span>}
                      {app.status === 'rejected' && <span className="bg-rose-50 text-rose-500 text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-xl border border-rose-100">Declined</span>}
                    </td>
                    <td className="py-4 text-right pr-4 rounded-r-2xl border-y border-r border-gray-100">
                      {app.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => onStatusChange(app.id, 'approved')} 
                            className="bg-green-500 text-white p-2.5 rounded-xl hover:bg-green-600 shadow-lg shadow-green-500/30 transition-all active:scale-90"
                            title="Approve Requested Slot"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                          </button>
                          <button 
                            onClick={() => onStatusChange(app.id, 'rejected')} 
                            className="bg-rose-50 text-rose-500 p-2.5 rounded-xl hover:bg-rose-100 transition-colors active:scale-90"
                            title="Decline Request"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Logged Record</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );

  return (
    <div className="w-full h-full pb-10 flex flex-col">
      {/* Search and Filters Header - Only shown for History */}
      {activeSubTab === 'history' && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 shrink-0">
            <div className="relative w-full md:w-[400px] group">
              <input 
                type="text" 
                placeholder="Search patients by name..."
                value={debouncedSearch}
                onChange={(e) => setDebouncedSearch(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-slate-800 font-bold focus:outline-hidden focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all shadow-sm group-hover:shadow-md"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-clinic-600 transition-colors">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
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

            <div className="flex items-center gap-3 self-end md:self-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Filter Status:</span>
               {['', 'approved', 'completed', 'rejected', 'pending'].map(st => (
                 <button 
                   key={st}
                   onClick={() => handleStatusFilterChange(st)}
                   className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === st ? 'bg-clinic-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-400 border border-gray-100 hover:text-slate-600 hover:border-slate-200'}`}
                 >
                   {st === '' ? 'All Record' : st}
                 </button>
               ))}
            </div>
        </div>
      )}

      {/* Sub-Tab Switcher */}
      <div className="flex gap-8 mb-8 border-b border-gray-100 shrink-0">
        <button 
          onClick={() => setActiveSubTab('requests')}
          className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative ${activeSubTab === 'requests' ? 'text-clinic-600' : 'text-gray-400 hover:text-slate-600'}`}
        >
          <div className="flex items-center gap-3">
             Current Requests
             <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeSubTab === 'requests' ? 'bg-clinic-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
               {pendingRequests.length}
             </span>
          </div>
          {activeSubTab === 'requests' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-clinic-600 rounded-full animate-fade-in" />}
        </button>

        <button 
          onClick={() => setActiveSubTab('history')}
          className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative ${activeSubTab === 'history' ? 'text-clinic-600' : 'text-gray-400 hover:text-slate-600'}`}
        >
          <div className="flex items-center gap-3">
             History & Records
             <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeSubTab === 'history' ? 'bg-clinic-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
               {pageInfo.totalCount - pendingRequests.length}
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
