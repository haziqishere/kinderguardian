interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  return (
    <div className="w-full mb-8">
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-blue-600 rounded-full transition-all"
          style={{
            width: `${((currentStep + 1) / totalSteps) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
