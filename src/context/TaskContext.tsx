import { createContext, useContext, useState, ReactNode } from 'react';
import { Task } from '../types/task';
import { getCanvasPixelMatrix, compareCanvasMatrices } from '../utils/canvasUtils';

interface TaskContextType {
  currentTask: Task;
  updateTask: (task: Task) => void;
  updateSolution: (solution: string) => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  solutionMatrix: Uint8ClampedArray | null;
  setSolutionMatrix: (matrix: Uint8ClampedArray | null) => void;
  checkSolution: (studentMatrix: Uint8ClampedArray) => boolean;
}

const defaultTask: Task = {
  id: '1',
  title: 'Нарисовать квадрат',
  description: `Используя модуль turtle, нарисуйте квадрат со следующими характеристиками:
- Левый верхний угол должен находиться в точке (0, 0)
- Длина стороны квадрата должна быть равна 100 единицам
- Квадрат должен быть нарисован по часовой стрелке`,
  initialCode: `import turtle

t = turtle.Turtle()

# Ваш код здесь
`
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [currentTask, setCurrentTask] = useState<Task>(defaultTask);
  const [isAdmin, setIsAdmin] = useState(false);
  const [solutionMatrix, setSolutionMatrix] = useState<Uint8ClampedArray | null>(null);

  const updateTask = (task: Task) => {
    setCurrentTask(task);
  };

  const updateSolution = (solution: string) => {
    setCurrentTask(prev => ({
      ...prev,
      solution
    }));
  };

  const checkSolution = (studentMatrix: Uint8ClampedArray): boolean => {
    if (!solutionMatrix) return false;
    return compareCanvasMatrices(studentMatrix, solutionMatrix);
  };

  return (
    <TaskContext.Provider value={{ 
      currentTask, 
      updateTask, 
      updateSolution,
      isAdmin,
      setIsAdmin,
      solutionMatrix,
      setSolutionMatrix,
      checkSolution
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}; 