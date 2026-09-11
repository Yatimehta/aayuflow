import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QuestionnaireForm } from '../../components/QuestionnaireForm';

export const PatientIntake: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <QuestionnaireForm
      pathway="allopathy"
      title={t('title') || 'Allopathic Intake'}
      onBack={() => navigate('/patient/intake/path')}
    />
  );
};
