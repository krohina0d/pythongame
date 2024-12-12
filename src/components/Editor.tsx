import { Box, Button, Paper } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

const EditorContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
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
  borderRadius: theme.shape.borderRadius,
  resize: 'none',
}));

const ControlPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  gap: theme.spacing(1),
}));

const OutputArea = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1),
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap',
  color: theme.palette.error.main,
}));

const defaultCode = `import turtle

t = turtle.Turtle()
t.speed(1)

# Draw a square
for _ in range(4):
    t.forward(100)
    t.right(90)
`;

const Editor = () => {
  const [code, setCode] = useState(defaultCode);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = document.getElementById('turtle-container');
    if (container) {
      container.innerHTML = `
        <div id="turtle-canvas-wrapper">
          <pre id="turtle-pre" style="display: none;"></pre>
          <div id="turtle-div" style="width: 100%; height: 100%;">
            <canvas id="turtle-canvas" style="width: 100%; height: 100%;"></canvas>
          </div>
        </div>
      `;

      const canvas = document.getElementById('turtle-canvas') as HTMLCanvasElement;
      if (canvas) {
        const wrapper = canvas.parentElement;
        if (wrapper) {
          canvas.width = wrapper.offsetWidth;
          canvas.height = wrapper.offsetHeight;
        }
      }
    }
  }, []);

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setOutput('');

    try {
      const outputBuffer: string[] = [];
      function outf(text: string) {
        outputBuffer.push(text);
        setOutput(outputBuffer.join('\n'));
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
        __future__: window.Sk.python3,
        inputfunTakesPrompt: true,
        debugging: true,
        target: 'turtle-div'
      });

      const canvas = document.getElementById('turtle-canvas') as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }

      await window.Sk.misceval.asyncToPromise(() => 
        window.Sk.importMainWithBody("<stdin>", false, code, true)
      );

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Box>
      <ControlPanel>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayArrow />}
          onClick={handleRun}
          disabled={isRunning}
        >
          Run
        </Button>
      </ControlPanel>

      <EditorContainer>
        <Paper elevation={3}>
          <CodeEditor
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isRunning}
          />
        </Paper>
        <Paper elevation={3} sx={{ p: 2, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <Box 
            id="turtle-container"
            sx={{ 
              flex: 1, 
              position: 'relative',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              '& > div': {
                width: '100%',
                height: '100%'
              }
            }}
          />
          {(error || output) && (
            <OutputArea>
              {error && <Box sx={{ color: 'error.main' }}>{error}</Box>}
              {output && <Box>{output}</Box>}
            </OutputArea>
          )}
        </Paper>
      </EditorContainer>
    </Box>
  );
};

export default Editor; 