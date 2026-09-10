import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  shortTitle?: string;
  subtitle?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full">
      {/* Desktop & Tablet Stepper View */}
      <div className="hidden md:flex items-center justify-between relative">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-brand-border -z-0" />
        <div
          className="absolute top-4 left-4 h-0.5 bg-brand-teal transition-all duration-300 -z-0"
          style={{
            width: `${((Math.min(currentStep, steps.length) - 1) / (steps.length - 1)) * 100}%`
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10 group cursor-pointer"
              onClick={() => onStepClick && isCompleted && onStepClick(step.id)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 border-2 ${
                  isCompleted
                    ? 'bg-brand-teal border-brand-teal text-white shadow-soft'
                    : isCurrent
                    ? 'bg-white border-brand-teal text-brand-teal-dark shadow-soft scale-110 ring-4 ring-brand-teal-light'
                    : 'bg-white border-brand-border text-brand-muted hover:border-slate-300'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
              </div>

              <span
                className={`mt-2 text-[11px] font-medium tracking-tight text-center max-w-[80px] line-clamp-1 ${
                  isCurrent
                    ? 'text-brand-teal-dark font-bold'
                    : isCompleted
                    ? 'text-brand-heading'
                    : 'text-brand-muted'
                }`}
              >
                {step.shortTitle || step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Compact Stepper View */}
      <div className="flex md:hidden items-center justify-between bg-white p-3 rounded-2xl border border-brand-border shadow-soft">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center text-xs font-bold shadow-soft">
            {currentStep}
          </div>
          <div>
            <p className="text-xs font-bold text-brand-heading">
              {steps.find((s) => s.id === currentStep)?.title || 'Intake Step'}
            </p>
            <p className="text-[10px] text-brand-muted">
              Step {currentStep} of {steps.length}
            </p>
          </div>
        </div>

        {/* Progress bar in mobile */}
        <div className="w-24 h-2 bg-brand-border rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-teal transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
