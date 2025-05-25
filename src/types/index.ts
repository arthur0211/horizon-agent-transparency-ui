
export interface AgentStatus {
  name: string;
  isActive: boolean;
  progress: number;
  confidence: number;
  reasoning: string[];
  tools: ToolStatus[];
  isProcessing: boolean;
}

export interface ToolStatus {
  name: string;
  isActive: boolean;
  icon: string;
}

export interface PlanningPhase {
  id: number;
  name: string;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
  description: string;
}

export interface UserData {
  personalInfo: {
    age?: number;
    income?: number;
    retirementAge?: number;
  };
  currentSituation: {
    currentWealth?: number;
    monthlyExpenses?: number;
    debts?: number;
  };
  goals: {
    desiredLifestyle?: string;
    riskTolerance?: string;
  };
  projection: {
    finalAmount?: number;
    monthlyContribution?: number;
    years?: number;
  };
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  phase?: number;
}

export interface ProjectionData {
  labels: string[];
  values: number[];
  currentValue: number;
  targetValue: number;
  projectedValue: number;
}

export interface Command {
  id: string;
  title: string;
  description: string;
  shortcut?: string;
  action: () => void;
  group: string;
}
