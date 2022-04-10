import React, { useState } from 'react'
import { AppBar, Box, Toolbar, Typography, IconButton, ListItemButton, LinearProgress, TextField } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useApp } from '../../providers/AppProvider';
import { handleHttpError } from '../../utils/error.util';
import { LoadingButton } from '@mui/lab';
import { UserApi } from '../../apis/User.api';

export default function Profile() {
    const { user, setUser, setShowProfilePanel } = useApp();

    const [submitting, setSubmitting] = useState(false)

    const [form, setForm] = useState({
        name: user.name || '',
    });
    const [error, setError] = useState(null);

    // Handle on button submit
    function handleOnSubmit(e) {
        e.preventDefault();

        setError(null);

        const newName = form.name;

        if (newName.trim() === '') {
            setError({ name: "Name is required." });
            return;
        };

        setSubmitting(true);
        UserApi.updateName(newName)
            .then(newUser => {
                sessionStorage.setItem("user", JSON.stringify(newUser));
                setUser(newUser);

                setSubmitting(false);
                setShowProfilePanel(false);
            })
            .catch(handleHttpError)
            .catch(() => setSubmitting(false))
    }

    return (
        <Box sx={styles.container}>
            <AppBar position="static" color="transparent" sx={styles.appBar}>
                <ListItemButton sx={{ padding: 0 }} onClick={() => setShowProfilePanel(false)}>
                    <Toolbar sx={{ padding: '0 18px 0 18px' }} disableGutters>

                        <IconButton size="large" edge="start">
                            <ArrowBackIosNewIcon />
                        </IconButton>

                        <Typography variant="h6" component="div" sx={styles.appBarText}>
                            Profile
                        </Typography>
                    </Toolbar>
                </ListItemButton>
            </AppBar>

            { submitting && 
                <LinearProgress />
            }
            
            <form onSubmit={handleOnSubmit}>
                <Box sx={{ padding: 2 }}>
                    <TextField 
                        disabled={submitting}
                        label="Enter display name" 
                        variant="outlined" 
                        autoComplete='off'
                        sx={{ width: '100%', mb: 1 }} 
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        error={error?.name != null}
                        helperText={error?.name}
                    />

                    <LoadingButton
                        type="submit"
                        color="primary"
                        loading={submitting}
                        loadingPosition="start"
                        startIcon={<ArrowBackIosNewIcon />}
                        variant="contained"
                        sx={{ width: '100%' }}
                    >
                        Update Profile
                    </LoadingButton>
                </Box>
            </form>

        </Box>
    )
}

const styles = {
    container: {
        position: 'absolute',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        // Snap to full width on mobile
        width: {
            xs: '100%',
            sm: 420,
        },
        // Remove border divider on mobile
        borderRight: {
            xs: 'none',
            sm: '1px solid #ccc',
        },
    },
    appBar: {
        boxShadow: 'none',
        borderBottom: '1px solid #ccc',
        cursor: 'pointer',
    },
    appBarText: {
        flexGrow: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: 16,
        mr: 2,
    },
    list: {
        overflowY: 'scroll',
        padding: 0,
    },
}
