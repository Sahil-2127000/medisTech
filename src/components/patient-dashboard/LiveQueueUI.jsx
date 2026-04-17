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
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      
      {/* 1. Live Tracker Banner */}
      <Card className="w-full shadow-md border-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between text-white p-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
              <SyncOutlined spin className="text-2xl" />
            </div>
            <div>
              <h3 className="text-white/80 font-bold uppercase tracking-widest text-xs mb-1">Currently Serving</h3>
              <div className="text-4xl font-black">Token {currentlyServing || '--'}</div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-8">
            <Statistic 
              title={<span className="text-white/60 font-medium">Doctor Active</span>}
              value={doctorName || "Specialist"}
              valueStyle={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}
            />
          </div>
        </div>
      </Card>

      {/* 2. Patient Specific Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patientToken ? (
          <>
            <Card className="rounded-3xl shadow-sm border-blue-100 bg-blue-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                  <UserOutlined className="text-xl" />
                </div>
                <div>
                  <div className="text-gray-400 text-xs font-bold uppercase">Your Position</div>
                  <div className="text-2xl font-black text-slate-800">Token {patientToken}</div>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl shadow-sm border-teal-100 bg-teal-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-500 text-white rounded-xl flex items-center justify-center">
                  <ClockCircleOutlined className="text-xl" />
                </div>
                <div>
                  <div className="text-gray-400 text-xs font-bold uppercase">Estimated Time</div>
                  <div className="text-2xl font-black text-slate-800">
                    {estimatedTimeFormatted || (estimatedWaitMinutes === 0 ? "Now" : "Calculating")}
                  </div>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card className="md:col-span-2 rounded-3xl shadow-sm border-gray-100 bg-gray-50/50">
             <Result
                status="info"
                title={<span className="font-bold text-slate-800">Ready to Join the Queue?</span>}
                subTitle="You don't have an active appointment for today yet."
                extra={[
                  <Button type="primary" key="book" size="large" className="rounded-xl px-8 bg-blue-600">
                    Book Now
                  </Button>
                ]}
             />
          </Card>
        )}
      </div>

      {/* 3. Queue Logic Visualizer (Optional but helpful) */}
      {patientToken && estimatedWaitMinutes > 0 && (
        <div className="bg-white border border-dashed border-gray-200 rounded-[2.5rem] p-8 text-center">
           <p className="text-gray-400 font-medium">
             There are <strong className="text-blue-600">{patientToken - currentlyServing > 0 ? patientToken - currentlyServing - 1 : 0}</strong> patients ahead of you. 
             Each consultation is estimated at <strong className="text-slate-800">15 minutes</strong> dynamically tracking current wait.
           </p>
           <div className="flex items-center justify-center gap-4 mt-4">
              <Tag color="blue" className="px-4 py-1 rounded-full font-bold">Token {currentlyServing}</Tag>
              <ArrowRightOutlined className="text-gray-300" />
              <Tag color="cyan" className="px-4 py-1 rounded-full font-bold opacity-50">Token {currentlyServing + 1}</Tag>
              <ArrowRightOutlined className="text-gray-300" />
              <Tag color="gold" className="px-4 py-1 rounded-full font-bold">Token {patientToken} (You)</Tag>
           </div>
        </div>
      )}

    </div>
  );
};

export default LiveQueueUI;
