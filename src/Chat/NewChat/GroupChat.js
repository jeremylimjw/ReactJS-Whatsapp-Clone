import { LoadingButton } from '@mui/lab'
import { Box, TextField, Chip } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import React, { useState } from 'react'
import { useApp } from '../../providers/AppProvider';
import { handleHttpError } from '../../utils/error.util';
import { ChatApi } from '../../apis/Chat.api';

export default function GroupChat({ submitting, setSubmitting }) {

    const { user, channels, setChannels, contacts, setContacts, setShowNewFormPanel } = useApp();

    const [form, setForm] = useState({
        title: '',
        username: '',
        participantUsernames: [],
    });

    const [error, setError] = useState({
        title: null,
        username: null,
    });

    // Handles on username input text change
    function handleUsernameInputChange(e) {
        const value = e.target.value;
        const values = value.split(';');
        if (values.length === 2) {
            const username = values[0];
            if (username === '') return;

            if (username === user.username) {
                setError({...error, username: "Cannot add yourself." });
                setForm({...form, username: '' });
                return;
            };

            const newUsernames = form.participantUsernames.filter(x => x !== username);
            newUsernames.push(username);

            setForm({...form, username: '', participantUsernames: newUsernames });
        } else {
            setForm({...form, username: value })
        }
    }
    
    // Handles when chip delete button is clicked
    function handleRemoveUsername(username) {
        const newUsernames = form.participantUsernames.filter(x => x !== username);
        setForm({...form, participantUsernames: newUsernames });
    }

    // When submit button is click
    function handleOnSubmit(e) {
        e.preventDefault();
        
        const errors = { title: null, username: null };

        if (form.title.trim() === '') {
            setError({...errors, title: 'Group chat title is required.' });
            return;
        }

        if (form.participantUsernames.length === 0) {
            setError({...errors, username: 'At least 1 user must be added.' });
            return;
        }

        setError(errors);

        const channel = {
            ownerId: user._id,
            title: form.title,
            participantUsernames: form.participantUsernames,
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
                setError({ ...errors, username: err.message })
                setSubmitting(false);
            })
    }

    return (
        <form onSubmit={handleOnSubmit}>
            <Box sx={{ padding: 2 }}>
                <TextField 
                    disabled={submitting}
                    label="Enter group title" 
                    variant="outlined" 
                    autoComplete='off'
                    sx={{ width: '100%', mb: 1 }} 
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value })}
                    error={error.title != null}
                    helperText={error.title}
                />

                <TextField 
                    disabled={submitting}
                    label="Enter usernames seperated by a semi-colon ;" 
                    variant="outlined" 
                    autoComplete='off'
                    sx={{ width: '100%', mb: 1 }} 
                    value={form.username}
                    onChange={handleUsernameInputChange}
                    error={error.username != null}
                    helperText={error.username}
                />

                { form.participantUsernames.map((username, index) => (
                    <Chip key={index}
                        sx={{ margin: '5px' }}
                        label={username}
                        variant="outlined" 
                        onClick={() => false}
                        onDelete={() => handleRemoveUsername(username)}
                    />
                ))}
            
                <LoadingButton
                    type="submit"
                    color="primary"
                    loading={submitting}
                    loadingPosition="start"
                    startIcon={<PersonIcon />}
                    variant="contained"
                    sx={{ width: '100%', mt: 1 }}
                >
                    New Group Chat
                </LoadingButton>
            </Box>
        </form>
    )
}
