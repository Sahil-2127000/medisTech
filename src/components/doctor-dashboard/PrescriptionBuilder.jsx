import React, { useState } from 'react';
import { Form, Input, Checkbox, Select, Button, Card, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, DeleteOutlined, FilePdfOutlined, CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';


const { Option } = Select;

const PrescriptionBuilder = ({ activePatient, onCancel, onSave, doctorProfile }) => {
  const [medicines, setMedicines] = useState([]);
  const [form] = Form.useForm();

  const handleAddMedicine = (values) => {
    const newMed = {
      id: Date.now().toString(),
      name: values.medicineName,
      dosage: values.dosage,
      timing: values.timing || [],
      food: values.food,
      duration: values.duration
    };
    setMedicines([...medicines, newMed]);
    form.resetFields();
  };

  const handleRemoveMedicine = (id) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  const formatTiming = (timingArr) => {
    if (!timingArr || timingArr.length === 0) return "Specific timings not specified";
    return timingArr.join(' - ');
  };

  const handleFinalSubmit = async () => {
    if (medicines.length === 0) {
      message.warning("Please add at least one medicine before finalizing the prescription.");
      return;
    }

    // Capture visually perfect PDF using robust async parsing
    const element = document.getElementById('prescription-preview');
    if (!element) {
      onSave && onSave(medicines, "");
      return;
    }

    const hideLoading = message.loading("Generating Secure PDF Prescription...", 0);
    try {
      // html-to-image utilizes native browser rendering bypassing manual CSS parser errors natively tracking perfectly
      const imgData = await htmlToImage.toPng(element, { pixelRatio: 2, backgroundColor: '#ffffff' });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const pdfBase64 = pdf.output('datauristring');

      hideLoading();
      onSave && onSave(medicines, pdfBase64);
    } catch (error) {
      console.error("PDF Parsing failed natively:", error);
      hideLoading();
      message.error("PDF conversion failed: " + (error?.message || String(error)));
      onSave && onSave(medicines, "");
    }
  };

  // Safe Fallback Display Params
  const patientName = activePatient?.name || "Patient";
  const patientAge = activePatient?.age || "--";
  const doctorName = doctorProfile?.firstName ? `Dr. ${doctorProfile.firstName} ${doctorProfile.lastName || ''}` : "Doctor";

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex overflow-hidden animate-fade-in font-sans">

      {/* LEFT PANEL: Builder Form (60%) */}
      <div className="w-[60%] flex flex-col h-full bg-white shadow-2xl relative overflow-y-auto no-scrollbar border-r border-gray-100">

        {/* Header Header */}
        <div className="p-6 md:p-10 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-20 shrink-0">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Prescription Builder</h1>
            <p className="text-gray-500 font-medium mt-1">Add medications symmetrically for {patientName}</p>
          </div>
          <button onClick={onCancel} className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition-colors">
            <CloseOutlined className="text-lg" />
          </button>
        </div>

        {/* Builder Form Zone */}
        <div className="p-6 md:p-10 flex-col gap-6 w-full flex-1">
          <Card className="w-full shadow-sm border border-gray-100 rounded-3xl" title="Add New Clinical Medicine">
            <Form form={form} layout="vertical" onFinish={handleAddMedicine} className="w-full">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                <Form.Item label="Medicine Name" name="medicineName" rules={[{ required: true, message: 'Please enter medicine name.' }]}>
                  <Input placeholder="e.g. Paracetamol 500mg" size="large" className="rounded-xl" />
                </Form.Item>

                <Form.Item label="Dosage Rules" name="dosage" rules={[{ required: true, message: 'Please specify dosage units.' }]}>
                  <Input placeholder="e.g. 1 Tablet" size="large" className="rounded-xl" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-1 mt-2">
                <Form.Item label="Meal Instructions" name="food" initialValue="After Food">
                  <Select size="large" className="rounded-xl">
                    <Option value="Before Food">Before Food</Option>
                    <Option value="After Food">After Food</Option>
                    <Option value="With Food">With Food</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Duration" name="duration" rules={[{ required: true, message: 'Specify duration.' }]}>
                  <Input placeholder="e.g. 5 Days" size="large" className="rounded-xl" />
                </Form.Item>

                <Form.Item label="Timing" name="timing" className="md:col-span-1">
                  <Checkbox.Group className="flex flex-col gap-2 mt-1">
                    <Checkbox value="Morning">Morning</Checkbox>
                    <Checkbox value="Afternoon">Afternoon</Checkbox>
                    <Checkbox value="Night">Night</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </div>

              <div className="flex justify-end mt-4">
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />} size="large" className="rounded-xl bg-blue-600 font-bold px-8 shadow-blue-500/20 shadow-lg">
                  Add Medicine
                </Button>
              </div>
            </Form>
          </Card>

          {/* Active Medicines Map Grid */}
          {medicines.length > 0 && (
            <div className="mt-8 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-slate-800">Assigned Prescriptions ({medicines.length})</h3>
              {medicines.map((med, index) => (
                <div key={med.id} className="relative bg-white border border-blue-50 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{med.name}</h4>
                      <p className="text-sm font-medium text-gray-500 mt-1">
                        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mr-2">{med.dosage}</span>
                        {formatTiming(med.timing)} • {med.food} • {med.duration}
                      </p>
                    </div>
                  </div>
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveMedicine(med.id)} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Bottom Layout */}
        <div className="p-6 md:p-10 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0 gap-4 mt-auto">
          <Button size="large" className="rounded-xl px-8 font-bold" onClick={onCancel}>Cancel</Button>
          <Button type="primary" size="large" icon={<CheckCircleOutlined />} onClick={handleFinalSubmit} className="rounded-xl px-10 bg-green-500 hover:bg-green-600 shadow-green-500/30 shadow-lg font-extrabold pb-0 pt-0">
            Finalize Prescription & Close
          </Button>
        </div>

      </div>


      {/* RIGHT PANEL: Live PDF Preview (40%) */}
      <div className="w-[40%] bg-slate-100 h-full p-8 flex items-center justify-center overflow-y-auto w-full" >       

        {/* Printable A4 Paper Container Concept */}
        <div id="prescription-preview" className="w-[100%] max-w-[600px] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-sm min-h-[850px] relative overflow-hidden flex flex-col justify-start mx-auto print-view-paper">

          {/* Graphic Horizontal Watermark */}
          <div className="absolute top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center pointer-events-none select-none z-0 opacity-5">
             <div className="text-[120px] font-black text-[#0d9488] tracking-tighter relative">
                MedicsTech
                <div className="absolute -bottom-4 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#0d9488] to-transparent"></div>
             </div>
             <div className="flex gap-10 mt-8">
                {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="w-8 h-8 border-4 border-[#0d9488] rounded-lg rotate-45"></div>
                ))}
             </div>
          </div>

          {/* Header Data */}
          <div className="w-full relative z-10 shrink-0 bg-[#0d9488] p-10 pb-16">
             <div className="flex justify-between items-start text-white">
                <div>
                  <h1 className="text-3xl font-black tracking-tight leading-none mb-1">{doctorName}</h1>
                  <p className="text-sm font-bold opacity-90">M.B.B.S, M.D. (Internal Medicine)</p>
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Verified Document</div>
                   <div className="text-lg font-black italic">MT-SECURE</div>
                </div>
             </div>
          </div>

          {/* Patient Info Grid */}
          <div className="px-10 relative z-10 w-full shrink-0 -mt-8">
             <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-black/5 grid grid-cols-2 gap-y-6 text-[13px] border border-gray-100/50 backdrop-blur-sm">
                <div className="flex gap-2 items-end">
                   <span className="text-gray-400 font-bold whitespace-nowrap">Patient :</span>
                   <span className="flex-1 border-b border-gray-100 font-black text-slate-800 pb-0.5">{patientName}</span>
                </div>
                <div className="flex gap-2 items-end ml-4">
                   <span className="text-gray-400 font-bold whitespace-nowrap">Date :</span>
                   <span className="flex-1 border-b border-gray-100 font-black text-slate-800 pb-0.5">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 items-end">
                   <span className="text-gray-400 font-bold">Age/Gender :</span>
                   <span className="flex-1 border-b border-gray-100 font-black text-slate-800 pb-0.5">{patientAge} yrs • {activePatient?.gender || '---'}</span>
                </div>
                <div className="flex gap-2 items-end ml-4">
                   <span className="text-gray-400 font-bold whitespace-nowrap">Diagnosis :</span>
                   <span className="flex-1 border-b border-gray-100 font-bold text-slate-800 pb-0.5 italic">General evaluation completed.</span>
                </div>
             </div>
          </div>

          {/* Medicines Dynamic Grid Body */}
          <div className="px-10 mt-10 w-full relative z-10 flex-1">
            <div className="mb-6 flex items-center justify-between border-b-2 border-teal-500/20 pb-4">
               <div className="flex items-center gap-4">
                  <div className="text-[11px] font-black text-[#0d9488] uppercase tracking-[0.3em]">Clinical Prescription</div>
                  <div className="text-[9px] font-black text-white bg-[#0d9488] px-3 py-1 rounded-full uppercase tracking-widest">
                     Duration: {medicines[0]?.duration || 'Course'}
                  </div>
               </div>
               <div className="flex gap-4 pr-4">
                  <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest w-10 text-center">Morn</div>
                  <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest w-10 text-center">Aftn</div>
                  <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest w-10 text-center">Nite</div>
               </div>
            </div>

            {medicines.length === 0 ? (
              <div className="mt-10 px-8 py-16 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center text-gray-300 w-full bg-slate-50/20">
                Medicinal records will appear here.<br />Use the builder to add guidance.
              </div>
            ) : (
              <div className="flex flex-col">
                {medicines.map((med, i) => {
                  const isM = med.timing?.includes('Morning');
                  const isA = med.timing?.includes('Afternoon');
                  const isN = med.timing?.includes('Night');

                  return (
                    <div key={med.id} className="flex items-center justify-between gap-6 py-4 border-b border-gray-50 last:border-b-0 animate-fade-in group">
                       <div className="flex-1">
                          <h4 className="text-base font-black text-slate-800">{i + 1}. {med.name}</h4>
                          <p className="text-[10px] font-extrabold text-[#0d9488] mt-1 uppercase tracking-widest">{med.dosage} • {med.food}</p>
                       </div>
                       
                       <div className="flex gap-4 pr-4">
                          <div className={`w-10 text-center text-xl font-black ${isM ? 'text-[#0d9488]' : 'text-slate-100'}`}>{isM ? '1' : '0'}</div>
                          <div className={`w-10 text-center text-xl font-black ${isA ? 'text-[#0d9488]' : 'text-slate-100'}`}>{isA ? '1' : '0'}</div>
                          <div className={`w-10 text-center text-xl font-black ${isN ? 'text-[#0d9488]' : 'text-slate-100'}`}>{isN ? '1' : '0'}</div>
                       </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Area */}
          <div className="mt-auto p-10 pt-16 w-full relative shrink-0">
             <div className="flex justify-between items-end relative z-10">
                <div className="text-gray-400">
                   <div className="text-xs font-black text-[#0d9488] uppercase tracking-widest mb-1">Authenticated By</div>
                   <h5 className="font-black text-lg text-slate-800 leading-none">Pulse Health Clinic</h5>
                   <p className="text-[10px] font-bold opacity-80 mt-1">Reg No. XY90123 • MedicsTech ecosystem</p>
                </div>
                <div className="text-center">
                   <div className="w-32 border-b-2 border-slate-100 mb-2"></div>
                   <div className="text-[10px] uppercase font-black tracking-widest text-[#0d9488]">Physician Signature</div>
                </div>
             </div>
             <div className="absolute bottom-0 right-0 left-0 h-2 bg-[#0d9488]"></div>
          </div>
        </div>
        </div>
        </div>
        
  );
};

export default PrescriptionBuilder;
