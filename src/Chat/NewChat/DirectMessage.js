import { LoadingButton } from '@mui/lab'
import { Box, TextField } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import React, { useState } from 'react'
import { useApp } from '../../providers/AppProvider';
import { handleHttpError } from '../../utils/error.util';
import { ChatApi } from '../../apis/Chat.api';

export default function DirectMessage({ submitting, setSubmitting }) {

    const { user, channels, setChannels, contacts, setContacts, setShowNewFormPanel } = useApp();

    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);

    // Handle on button submit
    function handleOnSubmit(e) {
        e.preventDefault();

        setError(null);

        if (username.trim() === '') {
            setError("Username is required.");
            return;
        };

        if (username === user.username) {
            setError("Cannot direct message yourself.");
            return;
        };

        const channel = {
            ownerId: user._id,
            participantUsernames: [username],
        }

        setSubmitting(true);
        ChatApi.createChannel(channel)
            .then(res => {
                setChannels([res.newChannel, ...channels]);
                setContacts({...contacts, ...res.contacts })

                setSubmitting(false);
                setShowNewFormPanel(false);
            })
            .catch(handleHttpError)
            .catch(err => {
                setSubmitting(false);
                setError(err.message);
            })
    }

    return (
        <form onSubmit={handleOnSubmit}>
            <Box sx={{ padding: 2 }}>
                <TextField 
                    disabled={submitting}
                    label="Enter username" 
                    variant="outlined" 
                    autoComplete='off'
                    sx={{ width: '100%', mb: 1 }} 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    error={error != null}
                    helperText={error}
                />

                <LoadingButton
                    type="submit"
                    color="primary"
                    loading={submitting}
                    loadingPosition="start"
                    startIcon={<PersonIcon />}
                    variant="contained"
                    sx={{ width: '100%' }}
                >
                    Direct Message
                </LoadingButton>
            </Box>
        </form>
    )
}
