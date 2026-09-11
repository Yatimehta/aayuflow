import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QuestionnaireForm } from '../../components/QuestionnaireForm';

export const PatientAyurvedaIntake: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <QuestionnaireForm
      pathway="ayurveda"
      title={t('ayurveda_title') || 'Ayurvedic Intake'}
      onBack={() => navigate('/patient/intake/path')}
    />
  );
};
