import { apiClient } from './client';
import { Patient, Consultation } from '../types';

export const authApi = {
  login: async (data: { identifier: string; password: string; role: string }) => {
    const res = await apiClient.post('/api/v1/auth/login', data);
    return { encounter_id: res.data.id, ...res.data };
  }
};

export const patientApi = {
  createPatient: async (data: any) => {
    const res = await apiClient.post('/api/v1/intake/patient', data);
    return { encounter_id: res.data.id, ...res.data }; // { patient_id: 123 }
  },
  submitConsent: async (data: any) => {
    const res = await apiClient.post('/api/v1/intake/consent', data);
    return { encounter_id: res.data.id, ...res.data };
  }
};

export const encounterApi = {
  createEncounter: async (patient_id: string | number) => {
    const numericId = Number(String(patient_id).replace('pat-', '')) || 1;
    const res = await apiClient.post('/api/v1/intake/session', { patient_id: numericId });
    return { encounter_id: res.data.id, ...res.data }; // { encounter_id: 123 }
  },

  getQuestionnaireSchema: async (pathway: string) => {
    const res = await apiClient.get(`/api/v1/intake/schema?pathway=${pathway}`);
    return res.data;
  },
  submitBulkQuestionnaire: async (encounterId: number, language: string, pathway: string, responses: any[]) => {
    const res = await apiClient.post('/api/v1/intake/bulk-response', {
      encounter_id: encounterId,
      language,
      clinical_pathway: pathway,
      responses
    });
    return res.data;
  },

  listEncounters: async () => {
    const res = await apiClient.get('/api/v1/encounters/');
    return res.data.encounters;
  },
  getEncounter: async (id: number) => {
    const res = await apiClient.get(`/api/v1/encounters/${id}`);
    return { encounter_id: res.data.id, ...res.data };
  },
  getTimeline: async (id: number) => {
    const res = await apiClient.get(`/api/v1/encounters/${id}/timeline`);
    return { encounter_id: res.data.id, ...res.data };
  },
  updateStatus: async (id: number, status: string) => {
    const res = await apiClient.patch(`/api/v1/encounters/${id}/status`, { status });
    return { encounter_id: res.data.id, ...res.data };
  },
  getDraft: async (id: number) => {
    const res = await apiClient.get(`/api/v1/encounters/${id}/draft`);
    return { encounter_id: res.data.id, ...res.data };
  },
  getFacts: async (id: number) => {
    const res = await apiClient.get(`/api/v1/encounters/${id}/facts`);
    return { encounter_id: res.data.id, ...res.data };
  }
};

export const documentApi = {
  uploadDocument: async (patient_id: number, consultation_id: number, file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    const res = await apiClient.post(`/api/v1/documents/patients/${patient_id}/documents?consultation_id=${consultation_id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return { encounter_id: res.data.id, ...res.data };
  },
  listDocuments: async (patient_id: number) => {
    const res = await apiClient.get(`/api/v1/documents/patients/${patient_id}/documents`);
    return { encounter_id: res.data.id, ...res.data };
  },
  getAccessUrl: async (document_id: number, consultation_id: number) => {
    const res = await apiClient.get(`/api/v1/documents/${document_id}/access?consultation_id=${consultation_id}`);
    return { encounter_id: res.data.id, ...res.data };
  }
};

export const intakeApi = {
  getNextQuestion: async (encounterId: number, language: string, intakeType: string = 'allopathy') => {
    const response = await apiClient.post('/api/v1/intake/next-question', {
      encounter_id: encounterId,
      language,
      intake_type: intakeType
    });
    return response.data;
  },
  submitResponse: async (encounterId: number, questionId: string, answer: string, language: string, source: string) => {
    const response = await apiClient.post('/api/v1/intake/response', {
      encounter_id: encounterId,
      question_id: questionId,
      transcript_text: answer,
      language,
      input_method: source
    });
    return response.data;
  },
  transcribeAudio: async (audioBlob: Blob, language: string) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    if (language) formData.append('language', language);
    
    const response = await apiClient.post('/api/v1/asr/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
