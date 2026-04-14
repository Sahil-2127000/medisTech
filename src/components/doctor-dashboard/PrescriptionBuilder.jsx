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
      <div className="w-[40%] bg-slate-100 h-full p-8 flex items-center justify-center overflow-y-auto w-full">
        
        {/* Printable A4 Paper Container Concept */}
        <div id="prescription-preview" className="w-[100%] max-w-[600px] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-sm min-h-[850px] relative overflow-hidden flex flex-col justify-start mx-auto print-view-paper">
          
          {/* Aesthetic Overlay Splashes closely mirroring reference images */}
          <div className="absolute top-0 right-0 left-0 h-12 bg-green-600"></div>
          <div className="absolute top-8 -left-10 w-[500px] h-[100px] bg-green-50 rounded-full blur-[40px] opacity-60"></div>
          
          {/* Header Bounds */}
          <div className="w-full flex justify-between items-start pt-16 px-10 relative z-10 shrink-0">
             <div>
               <h2 className="text-2xl font-black tracking-tight text-slate-800">Clinic@Flow Health</h2>
               <p className="text-xs text-gray-500 font-medium leading-tight mt-1">123 Clinical Highway, Medica Sector<br/>City Central, 10002. Reg: 994200</p>
             </div>
             <div className="text-right">
               <h3 className="text-lg font-extrabold text-[#021024] uppercase tracking-wider">{doctorName}</h3>
               <p className="text-xs text-gray-500 font-bold mt-1">M.B.B.S, M.D.</p>
               <p className="text-[10px] text-gray-400 font-medium">Reg No. XY90123</p>
             </div>
          </div>
          
          {/* Border Separator */}
          <div className="w-[calc(100%-5rem)] mx-auto border-b-2 border-slate-100 my-6"></div>

          {/* Vitals & Context Body */}
          <div className="px-10 flex justify-between text-sm w-full mb-8 shrink-0 relative z-10">
             <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="text-gray-400 font-bold w-12">Name:</span> <span className="font-bold text-slate-800 border-b border-dashed border-gray-300 min-w-[200px]">{patientName}</span>
                </div>
                <div className="flex justify-between w-[260px]">
                   <div className="flex gap-2"><span className="text-gray-400 font-bold">Age:</span> <span className="font-bold text-slate-800">{patientAge} yrs</span></div>
                   <div className="flex gap-2"><span className="text-gray-400 font-bold">Date:</span> <span className="font-bold text-slate-800">{new Date().toLocaleDateString()}</span></div>
                </div>
             </div>
             
             {/* Large Medical Cross / Rx watermark dynamically rendered */}
             <div className="text-4xl font-serif text-slate-800 shrink-0 select-none">Rx</div>
          </div>

          <div className="absolute inset-x-0 inset-y-1/3 flex items-center justify-center pointer-events-none opacity-[0.03]">
             <svg className="w-[400px] h-[400px]" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          </div>

          {/* Medicines Dynamic Grid Body */}
          <div className="px-10 w-full relative z-10 flex-1">
             {medicines.length === 0 ? (
               <div className="mt-10 px-8 py-16 border-2 border-dashed border-gray-100 rounded-3xl text-center text-gray-400 w-full bg-slate-50/50">
                 No medicines prescribed currently.<br/>Fill out the left form dynamically to preview output securely.
               </div>
             ) : (
               <div className="flex flex-col gap-6 mt-4">
                 {medicines.map((med, i) => (
                    <div key={med.id} className="flex flex-col gap-1 w-full bg-white relative pb-4 border-b border-gray-50 last:border-b-0">
                       <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                           <span className="text-xs font-black text-gray-400">{(i + 1).toString().padStart(2, '0')}.</span> 
                           {med.name}
                       </h4>
                       <div className="pl-6 grid grid-cols-2 gap-2 text-sm max-w-[90%]">
                           <div className="font-bold text-slate-700">{med.dosage} (<span className="text-gray-500 font-medium">{formatTiming(med.timing)}</span>)</div>
                           <div className="text-right text-slate-500 font-bold tracking-wider">{med.duration}</div>
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-widest col-span-2">{med.food}</div>
                       </div>
                    </div>
                 ))}
               </div>
             )}
          </div>

          {/* Footer PDF Template Block */}
          <div className="mt-auto px-10 pb-8 flex flex-col items-center justify-center text-center shrink-0 w-full relative z-10">
             {/* Bottom Smooth Green Swooshes mimicking image */}
             <div className="absolute bottom-0 right-0 left-0 h-16 bg-gradient-to-tr from-green-500 to-green-300 opacity-90 rounded-b-sm z-0"></div>
             <div className="absolute bottom-4 right-[-5%] w-full h-8 bg-green-200 blur-xl opacity-80 z-0"></div>
             
             <div className="relative z-10">
               <div className="w-48 h-12 border-b border-gray-300 mb-2"></div>
               <div className="text-xs font-bold text-white tracking-widest uppercase">Doctor Signature</div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrescriptionBuilder;
