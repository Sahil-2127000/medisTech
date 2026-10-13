import React, { useEffect, useState } from 'react';

// Patient-side medical documents: upload a PDF and list lab results / reports
const PatientDocuments = () => {
  const [docs, setDocs] = useState([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('lab');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const loadDocs = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/documents/my', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setDocs([...(data.labResults || []), ...(data.reports || [])]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadDocs(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return;
    setUploading(true);
    setMessage('');
    try {
      const fileBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch('http://localhost:5001/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, type, fileBase64, filename: file.name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setTitle('');
      setFile(null);
      e.target.reset();
      setMessage('Document uploaded.');
      loadDocs();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 mt-6 shrink-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-extrabold text-[#0F172A] dark:text-white text-base">Medical Documents</h3>
        <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-full">{docs.length} files</span>
      </div>

      <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-[1fr_160px_1fr_auto] gap-3 mb-5">
        <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Document title (e.g. Blood Test)"
          className="bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-xl px-4 py-2.5 font-semibold text-sm text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-[#5265ec]/20" />
        <select value={type} onChange={e => setType(e.target.value)}
          className="bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-xl px-4 py-2.5 font-semibold text-sm text-slate-700 dark:text-white outline-none">
          <option value="lab">Lab Result</option>
          <option value="report">Medical Report</option>
        </select>
        <input type="file" accept="application/pdf" required onChange={e => setFile(e.target.files[0])}
          className="text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-600 file:font-bold" />
        <button disabled={uploading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl disabled:opacity-60">
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p className="text-xs font-semibold text-slate-500 -mt-3 mb-4">{message}</p>}

      {docs.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">No documents uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {docs.map(d => (
            <a key={d._id} href={d.fileUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-600 hover:shadow-md transition-shadow bg-[#F8FAFC] dark:bg-slate-700/50">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center text-[10px] font-black shrink-0">PDF</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-800 dark:text-white truncate">{d.title}</div>
                <div className="text-[11px] text-slate-400 font-semibold">
                  {d.type === 'lab' ? 'Lab Result' : 'Medical Report'} • {new Date(d.createdAt).toLocaleDateString('en-IN')}
                  {d.doctorId?.fullName ? ` • Dr. ${d.doctorId.fullName}` : ' • Self uploaded'}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDocuments;
