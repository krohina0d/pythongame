import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import PythonEditor from './components/PythonEditor';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <PythonEditor />
      </Container>
    </ThemeProvider>
  );
};

export default App;