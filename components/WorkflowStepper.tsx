"use client";

import { BusinessType } from "@/types/contractor";
import { getWorkflowSteps, getBusinessTypeLabel } from "@/lib/workflowConfig";
import { Check, Circle, ArrowRight } from "lucide-react";

interface WorkflowStepperProps {
  businessType: BusinessType;
  currentStepId?: string;
  completedSteps?: string[];
}

export default function WorkflowStepper({
  businessType,
  currentStepId,
  completedSteps = [],
}: WorkflowStepperProps) {
  const steps = getWorkflowSteps(businessType);

  const getStepStatus = (stepId: string) => {
    if (completedSteps.includes(stepId)) return "completed";
    if (currentStepId === stepId) return "current";
    return "pending";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Onboarding Workflow
        </h3>
        <p className="text-sm text-gray-500">
          {getBusinessTypeLabel(businessType)}
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative">
              {/* Step Item */}
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {status === "completed" ? (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Check size={16} className="text-white" />
                    </div>
                  ) : status === "current" ? (
                    <div className="w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center">
                      <Circle size={16} className="text-white fill-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <Circle size={16} className="text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={`text-sm font-semibold ${
                        status === "completed"
                          ? "text-green-600"
                          : status === "current"
                          ? "text-[#FF6B00]"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </h4>
                    {status === "completed" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        Complete
                      </span>
                    )}
                    {status === "current" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-[#FF6B00]">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    {step.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    <span className="font-medium">Role:</span> {step.role}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="ml-4 pl-0.5 h-6 border-l-2 border-gray-200"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#FF6B00]"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
            <span>Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}
