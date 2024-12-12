import { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper,
  Divider 
} from '@mui/material';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import styled from '@emotion/styled';

const AuthContainer = styled(Paper)`
  padding: 24px;
  max-width: 400px;
  margin: 40px auto;
`;

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth = ({ onAuthSuccess }: AuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailAuth = async (isSignUp: boolean) => {
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthContainer>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Войдите или зарегистрируйтесь
      </Typography>
      
      <TextField
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <TextField
        fullWidth
        type="password"
        label="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={() => handleEmailAuth(false)}
          fullWidth
        >
          Войти
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => handleEmailAuth(true)}
          fullWidth
        >
          Регистрация
        </Button>
      </Box>
      
      <Divider sx={{ mb: 2 }}>или</Divider>
      
      <Button
        variant="contained"
        onClick={handleGoogleAuth}
        fullWidth
        sx={{ 
          backgroundColor: '#4285f4',
          '&:hover': { backgroundColor: '#357ae8' }
        }}
      >
        Войти через Google
      </Button>
    </AuthContainer>
  );
};

export default Auth; 