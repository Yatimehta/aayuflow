import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PatientTable } from '../../components/PatientTable';
import { Patient } from '../../types';
import { useTranslation } from '../../utils/translations';

export const WorkerPatients: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { patients, addPatient, setActivePatientId, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'table' | 'create'>('table');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    phone: '',
    address: '',
    bloodGroup: 'B+',
    chiefComplaint: ''
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast({ type: 'error', title: 'Missing Info', message: 'Name and Phone are required.' });
      return;
    }

    const created = addPatient({
      name: formData.name,
      age: parseInt(formData.age, 10) || 40,
      gender: formData.gender,
      phone: formData.phone,
      address: formData.address || 'Delhi NCR',
      bloodGroup: formData.bloodGroup,
      chiefComplaint: formData.chiefComplaint || 'OPD General Consultation',
      doshaPrimary: 'Vata-Pitta'
    });

    setActivePatientId(created.id);
    setActiveTab('table');
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      address: '',
      bloodGroup: 'B+',
      chiefComplaint: ''
    });
  };

  const handleSelectPatient = (p: Patient) => {
    setActivePatientId(p.id);
    navigate('/worker/assist');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header and Toggle Tabs */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#DCEAE7] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0D2B3E]">
            {t('wp_title')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('wp_subtitle')}
          </p>
        </div>

        <div className="flex rounded-2xl bg-[#F4FBF9] p-1 border border-[#DCEAE7] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'table'
                ? 'bg-white text-[#0D2B3E] shadow-xs'
                : 'text-slate-600 hover:text-[#0D2B3E]'
            }`}
          >
            {t('wp_all_patients')} ({patients.length})
          </button>
          <button
            onClick={() => navigate('/worker/assist')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#146356] text-white hover:bg-[#0f4d43] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t('wp_guided_intake')}</span>
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        /* Create Patient Form Card */
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-[#DCEAE7] shadow-sm space-y-6">
          <div className="border-b border-[#DCEAE7] pb-3">
            <h2 className="text-lg font-bold text-[#0D2B3E]">{t('wp_form_title')}</h2>
            <p className="text-xs text-slate-500">{t('wp_form_subtitle')}</p>
          </div>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#0D2B3E] mb-1">{t('wp_full_name')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smt. Manju Devi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEAE7] bg-[#F4FBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146356]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0D2B3E] mb-1">{t('wp_mobile')}</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98XXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEAE7] bg-[#F4FBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146356]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0D2B3E] mb-1">{t('wp_age_gender')}</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-20 px-3 py-2 rounded-xl border border-[#DCEAE7] bg-[#F4FBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146356]"
                  />
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#DCEAE7] bg-[#F4FBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146356] font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0D2B3E] mb-1">{t('wp_blood_group')}</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEAE7] bg-[#F4FBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146356] font-medium"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#0D2B3E] mb-1">{t('wp_address')}</label>
                <input
                  type="text"
                  placeholder="e.g. New Delhi, India"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEAE7] bg-[#F4FBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146356]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#0D2B3E] mb-1">{t('wp_complaint')}</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Joint pain & stiffness in knees..."
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#DCEAE7] bg-[#F4FBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146356]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#DCEAE7] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('table')}
                className="px-4 py-2.5 rounded-xl border border-[#DCEAE7] text-[#0D2B3E] font-semibold hover:bg-slate-100"
              >
                {t('pi_cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#146356] hover:bg-[#0f4d43] text-white font-bold shadow-xs flex items-center gap-2"
              >
                <span>{t('wp_register_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Patient Table */
        <PatientTable
          patients={patients}
          onSelectPatient={handleSelectPatient}
          onNewPatient={() => navigate('/worker/assist')}
          title={t('wp_table_title')}
          subtitle={t('wp_table_subtitle')}
        />
      )}

    </div>
  );
};
