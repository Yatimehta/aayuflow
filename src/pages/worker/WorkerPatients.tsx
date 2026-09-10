import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PatientTable } from '../../components/PatientTable';
import { Patient } from '../../types';

export const WorkerPatients: React.FC = () => {
  const navigate = useNavigate();
  const { patients, addPatient, setActivePatientId, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'table' | 'create'>('table');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    phone: '',
    address: '',
    bloodGroup: 'B+',
    chiefComplaint: '',
    doshaPrimary: 'Vata-Pitta'
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
      doshaPrimary: formData.doshaPrimary
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
      chiefComplaint: '',
      doshaPrimary: 'Vata-Pitta'
    });
  };

  const handleSelectPatient = (p: Patient) => {
    setActivePatientId(p.id);
    navigate('/worker/assist');
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Toggle Tabs */}
      <div className="bg-white p-5 rounded-3xl border border-brand-border shadow-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-heading">
            Patient Registration & Registry
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Register walk-in OPD patients, search existing records, or launch assisted intake.
          </p>
        </div>

        <div className="flex rounded-2xl bg-brand-bg p-1 border border-brand-border self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'table'
                ? 'bg-white text-brand-heading shadow-soft'
                : 'text-brand-muted hover:text-brand-heading'
            }`}
          >
            All Patients ({patients.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'create'
                ? 'bg-white text-brand-heading shadow-soft'
                : 'text-brand-muted hover:text-brand-heading'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ New Patient</span>
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        /* Create Patient Form Card */
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-soft space-y-6">
          <div className="border-b border-brand-border pb-3">
            <h2 className="text-lg font-bold text-brand-heading">Walk-In Patient Registration</h2>
            <p className="text-xs text-brand-muted">Fill in basic demographics to generate OPD queue token</p>
          </div>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-brand-heading mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smt. Manju Devi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-heading mb-1">Mobile Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98XXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-heading mb-1">Age & Gender</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-20 px-3 py-2 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                  />
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="flex-1 px-3 py-2 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-heading mb-1">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 font-medium"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-brand-heading mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="Village / Locality, District, State"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-brand-heading mb-1">Chief Presenting Complaint</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Severe knee joint stiffness for 4 months, worse in morning..."
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                  className="w-full p-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('table')}
                className="px-4 py-2.5 rounded-xl border border-brand-border text-brand-heading font-semibold hover:bg-brand-bg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white font-bold shadow-soft flex items-center gap-2"
              >
                <span>Register & Generate Token</span>
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
          onNewPatient={() => setActiveTab('create')}
          title="Hospital OPD Registry"
          subtitle="All patients queued or registered today"
        />
      )}

    </div>
  );
};
