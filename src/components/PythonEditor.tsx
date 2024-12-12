import { Box, Button, Paper } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

const EditorContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
  height: 'calc(100vh - 100px)',
}));

const CodeEditor = styled('textarea')(({ theme }) => ({
  width: '100%',
  height: '100%',
  fontFamily: 'monospace',
  fontSize: '14px',
  padding: theme.spacing(2),
  backgroundColor: '#1e1e1e',
  color: '#ffffff',
  border: 'none',
  resize: 'none',
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

const defaultCode = `import turtle

# Создаем черепашку
t = turtle.Turtle()

# Устанавливаем скорость
t.speed(1)

# Рисуем квадрат
for _ in range(4):
    t.forward(100)
    t.right(90)
`;

const PythonEditor = () => {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Создаем div для turtle graphics при монтировании компонента
    const turtleDiv = document.getElementById('mycanvas');
    if (turtleDiv) {
      turtleDiv.innerHTML = '';
    }
  }, []);

  const handleRun = () => {
    setIsRunning(true);
    setOutput('');

    try {
      // Очищаем предыдущий вывод turtle
      const turtleDiv = document.getElementById('mycanvas');
      if (turtleDiv) {
        turtleDiv.innerHTML = '';
      }

      // Функция для вывода
      function outf(text: string) {
        setOutput(prev => prev + text);
      }

      // Функция для чтения файлов
      function builtinRead(x: string) {
        if (window.Sk.builtinFiles === undefined ||
            window.Sk.builtinFiles["files"][x] === undefined)
          throw "File not found: '" + x + "'";
        return window.Sk.builtinFiles["files"][x];
      }

      // Настраиваем Skulpt
      window.Sk.configure({
        output: outf,
        read: builtinRead,
        __future__: window.Sk.python3
      });

      // Важная строка из примера - настройка TurtleGraphics
      (window.Sk.TurtleGraphics || (window.Sk.TurtleGraphics = {})).target = 'mycanvas';

      // Запускаем код
      window.Sk.misceval.asyncToPromise(() => 
        window.Sk.importMainWithBody("<stdin>", false, code, true)
      ).catch((error: Error) => {
        setOutput(`Error: ${error.toString()}`);
      });

    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PlayArrow />}
        onClick={handleRun}
        disabled={isRunning}
        sx={{ mb: 2 }}
      >
        Run
      </Button>

      <EditorContainer>
        <Paper elevation={3}>
          <CodeEditor
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isRunning}
          />
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
    </Box>
  );
};

export default PythonEditor; 