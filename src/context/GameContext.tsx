import { createContext, useContext, ReactNode, useState } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  initialCode: string;
  solution: string;
}

interface GameContextType {
  currentTask: Task;
  completedTasks: number[];
  score: number;
  savedCode: string;
  setCurrentTask: (task: Task) => void;
  completeTask: (taskId: number) => void;
  updateScore: (points: number) => void;
  saveCode: (code: string) => void;
}

const defaultTask: Task = {
  id: 1,
  title: 'Нарисуй квадрат',
  description: 'Используй команды turtle для рисования квадрата.',
  initialCode: `import turtle

t = turtle.Turtle()
t.speed(1)  # Установим скорость черепашки

# Нарисуем квадрат
for _ in range(4):
    t.forward(100)
    t.right(90)`,
  solution: 'square'
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [currentTask, setCurrentTask] = useState<Task>(defaultTask);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [savedCode, setSavedCode] = useState(defaultTask.initialCode);

  const completeTask = (taskId: number) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  const updateScore = (points: number) => {
    setScore(score + points);
  };

  const saveCode = (code: string) => {
    setSavedCode(code);
    localStorage.setItem('savedCode', code);
  };

  return (
    <GameContext.Provider
      value={{
        currentTask,
        completedTasks,
        score,
        savedCode,
        setCurrentTask,
        completeTask,
        updateScore,
        saveCode,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
