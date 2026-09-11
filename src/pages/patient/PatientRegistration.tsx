import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  UserCheck, 
  Hospital as HospitalIcon, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Fingerprint, 
  Phone, 
  Calendar, 
  User, 
  MapPin, 
  Building2,
  Stethoscope,
  Edit3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PatientRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, patients, selectedHospital, currentUser, showToast, setActivePatientId, addPatient } = useApp();

  const patient = activePatient || patients[0];

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: patient?.name || currentUser?.name || 'Rameshwar Prasad Sharma',
    abhaId: patient?.abhaId || currentUser?.abhaId || '45-9821-4321-7890',
    phone: patient?.phone || currentUser?.phone || '+91 98112 34567',
    age: String(patient?.age || 58),
    gender: patient?.gender || 'Male',
    address: patient?.address || 'Pocket B, Sarita Vihar, New Delhi, 110076',
    department: 'Kayachikitsa OPD (Ayurvedic Internal Medicine)',
    doctor: 'Dr. Alok Verma, MD (Ayu)'
  });

  const handleConfirmAndProceed = async () => {
    try {
      const { patientApi } = await import('../../api/endpoints');
      const res = await patientApi.createPatient({
        name: formData.name,
        gender: formData.gender,
        age: parseInt(formData.age) || 30,
        phone_number: formData.phone,
        abha_number: formData.abhaId,
        hospital_id: selectedHospital.id
      });
      
      const realId = res.id.toString();
      addPatient({
        id: realId,
        name: formData.name,
        age: parseInt(formData.age) || 30,
        gender: formData.gender,
        phone: formData.phone,
        abhaId: formData.abhaId,
        bloodGroup: 'Unknown',
        address: '',
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'Verified',
        queueNumber: 99
      });
      setActivePatientId(realId);
      
    } catch (err) {
      console.error(err);
    }

    showToast({
      type: 'success',
      title: 'Registration Confirmed',
      message: `Identity verified for ${formData.name}. Proceeding to data consent.`
    });
    navigate('/patient/consent');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 py-8 relative z-10">
      <div className="max-w-2xl w-full glass-card p-6 sm:p-9 space-y-6">
        
        {/* Verification Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md flex-shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Patient Identification & Registration
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ABDM National Health Authority (NHA) Verified Identity
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold self-start sm:self-auto shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>ABHA Verified</span>
          </div>
        </div>

        {/* ABDM Official Credential Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/5 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-teal-700 flex items-center justify-center shadow-xs border border-teal-100 flex-shrink-0">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800">
                Ayushman Bharat Health Account (ABHA ID)
              </span>
              <p className="text-base font-mono font-black text-slate-900 tracking-wider">
                {formData.abhaId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-teal-700 bg-white px-2.5 py-1 rounded-lg border border-teal-200 shadow-xs">
              Link Status: Active
            </span>
          </div>
        </div>

        {/* Identification Details Form / Review */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Demographic & Clinical Routing Details
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-teal-700 font-bold hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Details'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Full Name */}
            <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-semibold text-[11px] text-slate-500">Patient Full Name</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              ) : (
                <p className="font-bold text-slate-900 text-sm">{formData.name}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-semibold text-[11px] text-slate-500">Registered Mobile</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              ) : (
                <p className="font-bold text-slate-900 text-sm">{formData.phone}</p>
              )}
            </div>

            {/* Age & Gender */}
            <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-semibold text-[11px] text-slate-500">Age & Biological Gender</span>
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-20 px-2 py-1 rounded-lg border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="flex-1 px-2 py-1 rounded-lg border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ) : (
                <p className="font-bold text-slate-900 text-sm">
                  {formData.age} Years • {formData.gender}
                </p>
              )}
            </div>

            {/* Hospital & OPD Center */}
            <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-semibold text-[11px] text-slate-500">OPD Center</span>
              </div>
              <p className="font-bold text-slate-900 text-sm truncate">
                {selectedHospital.name}
              </p>
            </div>

            {/* Clinical OPD Department */}
            <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-semibold text-[11px] text-slate-500">Assigned Department</span>
              </div>
              <p className="font-semibold text-slate-800 text-xs">
                {formData.department}
              </p>
            </div>

            {/* Attending Vaidya */}
            <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-semibold text-[11px] text-slate-500">Consulting Physician</span>
              </div>
              <p className="font-semibold text-slate-800 text-xs">
                {formData.doctor} (Room 104)
              </p>
            </div>

          </div>
        </div>

        {/* Security & Consent Note */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            Profile successfully matched with ABDM registry. Proceeding will open your clean Patient Screen to begin your clinical intake questionnaire.
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/patient/dashboard')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-center"
          >
            <span>Skip to Dashboard</span>
          </button>

          <button
            type="button"
            onClick={handleConfirmAndProceed}
            className="flex-1 w-full py-3.5 rounded-xl btn-brand-primary font-bold shadow-md transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>Confirm & Proceed to Consent</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
