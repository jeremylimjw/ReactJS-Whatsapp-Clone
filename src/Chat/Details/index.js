import React, { useState } from 'react'
import { AppBar, Avatar, Box, Toolbar, Typography, IconButton, List, ListItemButton, ListItemAvatar, ListItemText, Divider, LinearProgress } from '@mui/material';
import { green, lightBlue } from '@mui/material/colors';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useApp } from '../../providers/AppProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingButton from '@mui/lab/LoadingButton';
import { ChatApi } from '../../apis/Chat.api';
import { handleHttpError } from '../../utils/error.util';

export default function Details() {

    const { user, chat, channels, setChannels, contacts, setChat, setSelectedChatId, getParticipantLabel, getParticipantLastSeen, setShowDetailsPanel } = useApp();

    const [submitting, setSubmitting] = useState(false)

    // Handle on submit to delete the chat
    function handleDeleteChat() {
        setSubmitting(true);

        ChatApi.deleteChannel(chat._id)
            .then(() => {
                const newChannels = channels.filter(x => x._id !== chat._id);
                setChannels(newChannels);
                setChat(null);
                setSelectedChatId(null);

                setSubmitting(false);
                setShowDetailsPanel(false)
            })
            .catch(handleHttpError)
            .catch(() => setSubmitting(false));
    }

    return (
        <>
        { chat != null && 
            <Box sx={styles.container}>
                <AppBar position="static" color="transparent" sx={styles.appBar}>
                    <ListItemButton sx={{ padding: 0 }} onClick={() => setShowDetailsPanel(false)}>
                        <Toolbar sx={{ padding: '0 18px 0 18px' }} disableGutters>

                            <IconButton size="large" edge="start">
                                <ArrowBackIosNewIcon />
                            </IconButton>

                            <Typography variant="h6" component="div" sx={styles.appBarText}>
                                Chat Details
                            </Typography>
                        </Toolbar>
                    </ListItemButton>
                </AppBar>

                { submitting && 
                    <LinearProgress />
                }
                
                <List sx={styles.list}>
                    { chat.participants.map((participant, index) => (
                        <Box key={index}>
                            { participant.userId === user._id ? 
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: lightBlue[500] }}>{(user.name || user.username).charAt(0)}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={
                                            <>
                                                {user.name && 
                                                    <>{user.name}&nbsp;•&nbsp;</>
                                                }

                                                <Typography 
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="subtitle"
                                                    color="text.secondary"
                                                >
                                                    {user.username}
                                                </Typography>
                                            </>
                                        }
                                        secondary={
                                            <Typography 
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="button"
                                                color="text.secondary"
                                            >
                                                Online
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            :
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: green[500] }}>{getParticipantLabel(participant.userId).charAt(0)}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={
                                            <>
                                                {contacts[participant.userId].name && 
                                                    <>{contacts[participant.userId].name}&nbsp;•&nbsp;</>
                                                }

                                                <Typography 
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="subtitle"
                                                    color="text.secondary"
                                                >
                                                    {contacts[participant.userId].username}
                                                </Typography>
                                            </>
                                        }
                                        secondary={
                                            <Typography 
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="button"
                                                color="text.secondary"
                                            >
                                                {getParticipantLastSeen(participant.userId)}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            }
                            <Divider variant="fullWidth" component="li" />
                        </Box>
                    ))}
                </List>
                
                <Box sx={{ padding: 1 }}>
                    <LoadingButton
                        color="secondary"
                        onClick={handleDeleteChat}
                        loading={submitting}
                        loadingPosition="start"
                        startIcon={<DeleteIcon />}
                        variant="contained"
                        sx={{ width: '100%' }}
                    >
                        Delete Chat
                    </LoadingButton>
                </Box>

            </Box>
        }
        </>
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