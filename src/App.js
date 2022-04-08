import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';
import Chat from './Chat';
import Login from './Login';
import { useApp } from './providers/AppProvider';
import Box from '@mui/material/Box';

export default function App() {
  const { user } = useApp();

  return (
    <Box sx={styles.container}>
      { user == null ?
        <Login />
        :
        <Chat />
      }
    </Box>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}
