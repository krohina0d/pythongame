export interface Task {
  id: string;
  title: string;
  description: string;
  initialCode: string;
  solution?: string;
  hints?: string[];
} 