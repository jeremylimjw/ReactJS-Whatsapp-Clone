import React, { useState } from 'react'
import { useApp } from '../providers/AppProvider';
import { Paper, TextField, Box, Typography, ListItemButton } from '@mui/material';
import { LoadingButton } from '@mui/lab'
import GitHubIcon from '@mui/icons-material/GitHub';
import BoltIcon from '@mui/icons-material/Bolt';
import { handleHttpError } from '../utils/error.util';
import { UserApi } from '../apis/User.api';

export default function Login() {
    const { setUser } = useApp();
    
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [herokuMessage, setHerokuMessage] = useState(null);

    function handleOnSubmit(e) {
        e.preventDefault();
        setError(null);

        if (username.trim() === '') {
            setError("Username is required.");
            return;
        }

        // For long backend server startups
        const timeout = setTimeout(() => {
            setHerokuMessage('Heroku server is winding up... Please wait a moment...');
        }, 2000);
        
        setSubmitting(true);
        UserApi.login(username)
            .then(user => {
                sessionStorage.setItem("user", JSON.stringify(user));
                setSubmitting(false);
                clearInterval(timeout);
                setUser(user);
            })
            .catch(handleHttpError)
            .catch(err => {
                setError(err.message);
                setSubmitting(false);
            })
    }

    return (
        <Box display="flex" sx={{ flexDirection: 'column' }}>
            <Paper sx={styles.container}>
                <form onSubmit={handleOnSubmit}>
                    <TextField
                        disabled={submitting}
                        label="Enter a username to start" 
                        variant="outlined" 
                        autoComplete='off'
                        sx={{ width: '100%', mb: 1 }} 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        error={error != null}
                        helperText={error || herokuMessage}
                    />

                    <LoadingButton
                        type="submit"
                        color="primary"
                        size="large"
                        loading={submitting}
                        variant="contained"
                        sx={{ width: '100%' }}
                    >
                        Start
                    </LoadingButton>
                </form>
            </Paper>
            
            <ListItemButton sx={styles.github} onClick={() => window.open("https://github.com/jeremylimjw")}>
                <GitHubIcon />
                <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                >
                    &nbsp;https://github.com/jeremylimjw
                </Typography>
            </ListItemButton>
            
            <ListItemButton sx={styles.heroku} onClick={() => window.open("https://www.heroku.com/")}>
                <BoltIcon color='secondary' />
                <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                >
                    Powered by Heroku
                </Typography>
            </ListItemButton>
        </Box>
    )
}

const styles = {
    container: {
        maxWidth: 400,
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
    },
    github: {
        mt: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroku: {
        mt: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
}
