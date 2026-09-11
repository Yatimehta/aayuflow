import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Award, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Hospital, 
  Mail, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Stethoscope, 
  User, 
  FileText,
  Download,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DoctorProfile: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, selectedHospital, showToast } = useApp();

  const isAyurveda = (currentUser?.discipline || 'Ayurveda') === 'Ayurveda';

  const doctorData = {
    name: currentUser?.name || (isAyurveda ? 'Dr. Alok Verma' : 'Dr. Priya Nair'),
    discipline: currentUser?.discipline || (isAyurveda ? 'Ayurveda' : 'Allopathy'),
    qualification: currentUser?.qualification || (isAyurveda ? 'BAMS, MD (Ayurveda) Kayachikitsa' : 'MBBS, MD (General Medicine), DNB'),
    licenseId: currentUser?.licenseId || (isAyurveda ? 'AYU-MED-DEL-2014-889' : 'MCI-DEL-2016-55421'),
    department: currentUser?.department || (isAyurveda ? 'Kayachikitsa (Internal Medicine)' : 'General Medicine & OPD Triage'),
    hospitalName: currentUser?.hospitalName || selectedHospital.name,
    yearsOfPractice: currentUser?.yearsOfPractice || (isAyurveda ? 14 : 10),
    contactNumber: currentUser?.phone || (isAyurveda ? '+91 98101 23456' : '+91 98203 76543'),
    email: currentUser?.email || (isAyurveda ? 'dr.alok.verma@aiia.gov.in' : 'dr.priya.nair@aiia.gov.in'),
    counter: currentUser?.counter || (isAyurveda ? 'OPD Room 104' : 'OPD Room 102'),
    avatarUrl: currentUser?.avatarUrl
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    showToast({
      type: 'info',
      title: 'Digital Credential Copied',
      message: `ABDM National Health Practitioner ID (${doctorData.licenseId}) copied to clipboard.`
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 px-2 sm:px-4 relative z-10">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/doctor')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Doctor Workstation</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Copy ABDM ID</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print ID Card</span>
          </button>
        </div>
      </div>

      {/* Main Single-Focus Profile Card */}
      <div className="glass-card overflow-hidden border border-slate-200/80 shadow-soft-lg">
        
        {/* Banner Header with Subtle Discipline Tint */}
        <div className={`p-6 sm:p-8 border-b border-slate-200/80 relative overflow-hidden ${
          isAyurveda 
            ? 'bg-gradient-to-r from-amber-500/15 via-teal-500/10 to-emerald-500/15' 
            : 'bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-sky-500/15'
        }`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10 text-center sm:text-left">
            {/* Avatar / Photo */}
            <div className="relative">
              {doctorData.avatarUrl ? (
                <img 
                  src={doctorData.avatarUrl} 
                  alt={doctorData.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-md" 
                />
              ) : (
                <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-3xl font-extrabold text-white border-4 border-white shadow-md ${
                  isAyurveda
                    ? 'bg-gradient-to-br from-amber-600 to-teal-700'
                    : 'bg-gradient-to-br from-blue-600 to-indigo-700'
                }`}>
                  {doctorData.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
              )}
              <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Active on ABDM Gateway">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Doctor Identity Header */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {doctorData.name}
                  </h1>
                  <p className="text-sm font-semibold text-slate-600 mt-0.5">
                    {doctorData.qualification}
                  </p>
                </div>

                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border self-center sm:self-start shadow-xs ${
                  isAyurveda
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-blue-100 text-blue-900 border-blue-300'
                }`}>
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>{doctorData.discipline} Practitioner</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1 gap-x-3 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1 font-mono font-medium text-slate-700 bg-white/90 px-2 py-0.5 rounded-md border border-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  Reg ID: {doctorData.licenseId}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {doctorData.department}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {doctorData.yearsOfPractice} Years Clinical Practice
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body: Identity & Credentials Grid */}
        <div className="p-6 sm:p-8 space-y-6 bg-white">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Clinical & Institutional Assignment */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Hospital className="w-4 h-4 text-teal-600" />
                <span>Hospital & Institutional Assignment</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Hospital</span>
                  <p className="font-bold text-slate-900 text-sm">{doctorData.hospitalName}</p>
                  <p className="text-slate-500 flex items-center gap-1 text-[11px] pt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    New Delhi • Apex Central Institute (Ministry of AYUSH)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Department & Room</span>
                  <p className="font-bold text-slate-900">{doctorData.department}</p>
                  <p className="text-slate-600 text-[11px]">{doctorData.counter} • Morning & Evening OPD Shifts</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ABDM Registry Status</span>
                    <p className="font-bold text-slate-900">National Health Doctor Registry (HPR)</p>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active & Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Official Contact & Professional Identity */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" />
                <span>Contact & Communication Info</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Institutional Email</span>
                  <p className="font-bold text-slate-900 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    {doctorData.email}
                  </p>
                  <p className="text-[11px] text-slate-500">Official government domain communications</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct OPD Contact</span>
                  <p className="font-bold text-slate-900 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    {doctorData.contactNumber}
                  </p>
                  <p className="text-[11px] text-slate-500">Counter extension: Ext. 4104</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Clinical Focus</span>
                  <p className="font-bold text-slate-900">
                    {isAyurveda 
                      ? 'Nidana, Chikitsa, Panchakarma Consultation & Case-Sheet Management' 
                      : 'Internal Medicine, Acute Triage, Chronic Disease Management'}
                  </p>
                  <p className="text-[11px] text-slate-500">Authorized for electronic prescriptions & sign-off</p>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Notice Banner */}
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">ABDM Gateway Compliance</p>
                <p className="text-slate-600 text-[11px]">
                  All consultations, prescriptions, and digital case dossiers signed by this ID are encrypted and anchored with ABDM consent managers.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/doctor')}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs self-start sm:self-auto whitespace-nowrap transition-colors"
            >
              Go to Patient Queue &rarr;
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
export default DoctorProfile;
