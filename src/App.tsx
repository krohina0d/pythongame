import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import PythonEditor from './components/PythonEditor';
import { TaskProvider } from './context/TaskContext';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TaskProvider>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <PythonEditor />
        </Container>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default App;