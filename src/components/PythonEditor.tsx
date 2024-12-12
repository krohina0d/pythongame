import { Box, Button, Paper, Typography, IconButton, Tooltip, TextField } from '@mui/material';
import { PlayArrow, AdminPanelSettings, Visibility, Edit, Save, Cancel } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useTask } from '../context/TaskContext';
import { getCanvasPixelMatrix } from '../utils/canvasUtils';

const EditorContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
  height: 'calc(100vh - 200px)',
}));

const CodeEditorContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
});

const LineNumbers = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '100%',
  backgroundColor: '#1e1e1e',
  color: '#858585',
  fontFamily: 'monospace',
  fontSize: '14px',
  padding: `${theme.spacing(2)} ${theme.spacing(1)}`,
  textAlign: 'right',
  userSelect: 'none',
  borderRight: '1px solid #333',
}));

const CodeEditor = styled('textarea')(({ theme }) => ({
  width: 'calc(100% - 40px)',
  height: '100%',
  fontFamily: 'monospace',
  fontSize: '14px',
  padding: theme.spacing(2),
  backgroundColor: '#1e1e1e',
  color: '#ffffff',
  border: 'none',
  resize: 'none',
  lineHeight: '1.5',
  '&:focus': {
    outline: 'none',
  },
}));

const OutputArea = styled('pre')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap',
  backgroundColor: '#f5f5f5',
  overflowY: 'auto',
  minHeight: '100px',
  maxHeight: '150px',
}));

const TaskDescription = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#f8f9fa',
}));

const AdminPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#fff3e0',
}));

const DemoPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2)
}));

const TaskEditor = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const PythonEditor = () => {
  const { 
    currentTask, 
    isAdmin, 
    setIsAdmin, 
    updateSolution,
    updateTask,
    setSolutionMatrix,
    checkSolution 
  } = useTask();
  
  const [code, setCode] = useState(currentTask.initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editedTitle, setEditedTitle] = useState(currentTask.title);
  const [editedDescription, setEditedDescription] = useState(currentTask.description);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const turtleDiv = document.getElementById('mycanvas');
    if (turtleDiv) {
      turtleDiv.innerHTML = '';
    }
  }, []);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    setIsCorrect(null);

    try {
      const turtleDiv = document.getElementById('mycanvas');
      if (turtleDiv) {
        turtleDiv.innerHTML = '';
      }

      function outf(text: string) {
        setOutput(prev => prev + text);
      }

      function builtinRead(x: string) {
        if (window.Sk.builtinFiles === undefined ||
            window.Sk.builtinFiles["files"][x] === undefined)
          throw "File not found: '" + x + "'";
        return window.Sk.builtinFiles["files"][x];
      }

      window.Sk.configure({
        output: outf,
        read: builtinRead,
        __future__: window.Sk.python3
      });

      (window.Sk.TurtleGraphics || (window.Sk.TurtleGraphics = {})).target = 'mycanvas';

      await window.Sk.misceval.asyncToPromise(() => 
        window.Sk.importMainWithBody("<stdin>", false, code, true)
      );

      const canvas = document.querySelector('#mycanvas canvas') as HTMLCanvasElement;
      if (canvas) {
        const matrix = getCanvasPixelMatrix(canvas);
        
        if (isAdmin) {
          setSolutionMatrix(matrix);
        } else {
          const result = checkSolution(matrix);
          setIsCorrect(result);
        }
      }

    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveSolution = () => {
    updateSolution(code);
    handleRun();
    alert('Решение сохранено!');
  };

  const handleRunDemo = async () => {
    if (!currentTask.solution) {
      alert('Решение администратора еще не добавлено');
      return;
    }

    setIsRunning(true);
    try {
      const turtleDiv = document.getElementById('mycanvas');
      if (turtleDiv) {
        turtleDiv.innerHTML = '';
      }

      function outf(text: string) {
        // Не показываем вывод при демонстрации
      }

      function builtinRead(x: string) {
        if (window.Sk.builtinFiles === undefined ||
            window.Sk.builtinFiles["files"][x] === undefined)
          throw "File not found: '" + x + "'";
        return window.Sk.builtinFiles["files"][x];
      }

      window.Sk.configure({
        output: outf,
        read: builtinRead,
        __future__: window.Sk.python3
      });

      (window.Sk.TurtleGraphics || (window.Sk.TurtleGraphics = {})).target = 'mycanvas';

      await window.Sk.misceval.asyncToPromise(() => 
        window.Sk.importMainWithBody("<stdin>", false, currentTask.solution!, true)
      );

    } catch (error) {
      console.error('Error running demo:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleEditTask = () => {
    setIsEditingTask(true);
    setEditedTitle(currentTask.title);
    setEditedDescription(currentTask.description);
  };

  const handleSaveTaskEdit = () => {
    updateTask({
      ...currentTask,
      title: editedTitle,
      description: editedDescription
    });
    setIsEditingTask(false);
  };

  const handleCancelTaskEdit = () => {
    setIsEditingTask(false);
    setEditedTitle(currentTask.title);
    setEditedDescription(currentTask.description);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    const lines = newCode.split('\n').length;
    setLineCount(lines);
  };

  // Создаем массив номеров строк
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <Box>
      <TaskDescription elevation={1}>
        {isAdmin && isEditingTask ? (
          <TaskEditor>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Название задачи"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                sx={{ mr: 2 }}
              />
              <Box>
                <IconButton onClick={handleSaveTaskEdit} color="primary">
                  <Save />
                </IconButton>
                <IconButton onClick={handleCancelTaskEdit} color="error">
                  <Cancel />
                </IconButton>
              </Box>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Описание задачи"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </TaskEditor>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" gutterBottom>
                {currentTask.title}
              </Typography>
              <Box>
                {isAdmin && (
                  <IconButton onClick={handleEditTask} color="primary" sx={{ mr: 1 }}>
                    <Edit />
                  </IconButton>
                )}
                <IconButton onClick={() => setIsAdmin(!isAdmin)} color={isAdmin ? 'primary' : 'default'}>
                  <AdminPanelSettings />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body1" component="div" 
              dangerouslySetInnerHTML={{ __html: currentTask.description.replace(/\n/g, '<br/>') }} 
            />
          </>
        )}
      </TaskDescription>

      {!isAdmin && currentTask.solution && (
        <DemoPanel elevation={1}>
          <Typography variant="body1">
            Посмотрите, как должен выглядеть результат:
          </Typography>
          <Tooltip title="Показать правильное решение">
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={handleRunDemo}
              disabled={isRunning}
            >
              Показать пример
            </Button>
          </Tooltip>
        </DemoPanel>
      )}

      {isAdmin && (
        <AdminPanel elevation={1}>
          <Typography variant="h6" gutterBottom>
            Панель администратора
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveSolution}
            sx={{ mr: 1 }}
          >
            Сохранить как решение
          </Button>
          {currentTask.solution && (
            <Button
              variant="outlined"
              onClick={() => setCode(currentTask.solution || '')}
            >
              Загрузить решение
            </Button>
          )}
        </AdminPanel>
      )}

      <Button
        variant="contained"
        color="primary"
        startIcon={<PlayArrow />}
        onClick={handleRun}
        disabled={isRunning}
        sx={{ mb: 2 }}
      >
        Запустить
      </Button>

      <EditorContainer>
        <Paper elevation={3}>
          <CodeEditorContainer>
            <LineNumbers>
              {lineNumbers.map(num => (
                <div key={num}>{num}</div>
              ))}
            </LineNumbers>
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              disabled={isRunning}
              onScroll={(e) => {
                const lineNumbers = document.querySelector('[class*="LineNumbers"]');
                if (lineNumbers) {
                  lineNumbers.scrollTop = e.currentTarget.scrollTop;
                }
              }}
            />
          </CodeEditorContainer>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box 
            id="mycanvas"
            sx={{ 
              flex: 1,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              mb: 2
            }}
          />
          <OutputArea>
            {output}
          </OutputArea>
        </Paper>
      </EditorContainer>

      {!isAdmin && isCorrect !== null && (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            mb: 2, 
            backgroundColor: isCorrect ? '#e8f5e9' : '#ffebee'
          }}
        >
          <Typography variant="h6" color={isCorrect ? 'success.main' : 'error.main'}>
            {isCorrect ? 'Решение верное!' : 'Решение неверное. Попробуйте еще раз.'}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default PythonEditor; 