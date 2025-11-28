import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  completed: boolean;
  current: boolean;
}

interface VotingProgressProps {
  steps: Step[];
}

const VotingProgress = ({ steps }: VotingProgressProps) => {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                step.completed
                  ? "border-success bg-success text-success-foreground"
                  : step.current
                  ? "border-primary bg-primary text-primary-foreground animate-pulse-soft"
                  : "border-border bg-secondary text-muted-foreground"
              )}
            >
              {step.completed ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                step.current || step.completed
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "mx-4 h-0.5 w-12 transition-all duration-300",
                step.completed ? "bg-success" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default VotingProgress;
