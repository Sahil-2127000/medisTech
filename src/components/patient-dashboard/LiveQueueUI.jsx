import React, { useState, useEffect } from 'react';
import { Card, Tag, Button, Empty, Spin, Statistic, Result } from 'antd';
import { ClockCircleOutlined, UserOutlined, ArrowRightOutlined, SyncOutlined } from '@ant-design/icons';
import { calculateWaitTime } from '../../utils/queueUtils';
import { useSocket } from '../../context/SocketContext';

const LiveQueueUI = ({ doctorId, doctorName }) => {
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQueueStatus = async () => {
    setRefreshing(true);
    try {
      const now = new Date();
      const today = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
      
      const res = await fetch(`http://localhost:5001/api/appointments/queue-status?doctorId=${doctorId}&date=${today}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setQueueData(data);
      }
    } catch (err) {
      console.error("Queue fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const socket = useSocket();

  useEffect(() => {
    fetchQueueStatus();
    const interval = setInterval(fetchQueueStatus, 15000); // Polling fallback every 15s
    
    if (socket) {
      socket.on('queueUpdated', fetchQueueStatus);
    }

    return () => {
      clearInterval(interval);
      if (socket) {
         socket.off('queueUpdated', fetchQueueStatus);
      }
    };
  }, [doctorId, socket]);

  if (loading) return <div className="p-10 text-center"><Spin size="large" tip="Loading Live Queue..." /></div>;

  const { currentlyServing, patientToken, estimatedWaitMinutes, estimatedTimeFormatted } = queueData || {};

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-in pb-12">
      
      {/* 1. Live Tracker Banner */}
      <div className="w-full shadow-2xl shadow-blue-500/20 bg-gradient-to-br from-blue-600 via-[#3963F9] to-indigo-700 rounded-[2.5rem] overflow-hidden p-8 relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between text-white relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center animate-pulse border border-white/20">
              <SyncOutlined spin className="text-3xl" />
            </div>
            <div>
              <h3 className="text-white/70 font-black uppercase tracking-[0.2em] text-xs mb-2">Live Queue Status</h3>
              <div className="text-5xl font-black tracking-tight">Token {currentlyServing || '--'}</div>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">On-Duty Specialist</div>
            <div className="text-xl font-black">{doctorName || "Dr. Unknown"}</div>
          </div>
        </div>
      </div>

      {/* 2. Patient Specific Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {patientToken ? (
          <>
            <div className="rounded-[2.5rem] p-8 shadow-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-white/5 transition-all group hover:scale-[1.02]">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <UserOutlined className="text-2xl" />
                </div>
                <div>
                  <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Your Position</div>
                  <div className="text-3xl font-black text-slate-800 dark:text-white mt-1">Token {patientToken}</div>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] p-8 shadow-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-white/5 transition-all group hover:scale-[1.02]">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-emerald-600/10 dark:bg-emerald-600/20 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <ClockCircleOutlined className="text-2xl" />
                </div>
                <div>
                  <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Estimated Time</div>
                  <div className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                    {estimatedTimeFormatted || (estimatedWaitMinutes === 0 ? "Now" : "Calculating...")}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="md:col-span-2 rounded-[3rem] p-16 shadow-2xl bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 text-center flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
             
             <div className="w-24 h-24 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-8 relative">
               <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
               <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             
             <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">Ready to Join the Queue?</h3>
             <p className="text-slate-400 dark:text-slate-500 font-bold mb-10 max-w-sm mx-auto">You don't have an active appointment for today yet. Reserve your spot now to get a live token.</p>
             
             <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
               Book Appointment Now
             </button>
          </div>
        )}
      </div>

      {/* 3. Queue Logic Visualizer */}
      {patientToken && estimatedWaitMinutes > 0 && (
        <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] p-10 text-center">
           <p className="text-slate-400 dark:text-slate-500 font-bold text-lg mb-8">
             There are <strong className="text-blue-600 dark:text-blue-400">{patientToken - currentlyServing > 0 ? patientToken - currentlyServing - 1 : 0}</strong> patients ahead of you.
           </p>
           <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-blue-500/20">Token {currentlyServing}</div>
              <ArrowRightOutlined className="text-slate-300 dark:text-slate-700" />
              <div className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-6 py-3 rounded-2xl font-black opacity-50">Token {currentlyServing + 1}</div>
              <ArrowRightOutlined className="text-slate-300 dark:text-slate-700" />
              <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-emerald-500/20">Token {patientToken} (You)</div>
           </div>
        </div>
      )}

    </div>
  );
};

export default LiveQueueUI;
