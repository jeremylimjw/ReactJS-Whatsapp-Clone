import React, { useEffect, useState } from 'react'
import { Avatar, Box, List, Typography, ListItemAvatar, ListItemText, Divider, ListItemButton, AppBar, Toolbar, IconButton, LinearProgress, Badge } from '@mui/material';
import { lightBlue, green } from '@mui/material/colors';
import { useApp } from '../../providers/AppProvider';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { ChatApi } from '../../apis/Chat.api';
import { handleHttpError } from '../../utils/error.util';
import { parseTime } from '../../utils/datetime.util';

export default function Sidebar() {
    const { user, channels, setChannels, chat, setChat, setContacts, selectedChatId, setSelectedChatId, logout, setShowNewFormPanel, setShowProfilePanel, getChannelLabel, getParticipantLabel } = useApp();

    const [loading, setLoading] = useState(false);
    
    // Initial loading of all channels
    useEffect(() => {
        if (user == null) return;

        let isSubscribed = true;
        setLoading(true);
        ChatApi.getChannels()
            .then(({ channels, contacts }) => {
                if (!isSubscribed) return;
                setChannels(channels);
                setContacts(contacts);

                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));

        return () => {
            isSubscribed = false;
        }
    }, [user, setLoading, setChannels, setContacts]);

    // Handles on channel click from list of channels
    function handleChannelClick(channel) {
        if (channel._id === chat?._id) return;

        setSelectedChatId(channel._id);
        setChat(channel)

        // Update unread_count
        const newChannels = [...channels]
        const index = newChannels.findIndex(x => x._id === channel._id);
        if (index > -1) {
            newChannels.splice(index, 1, { ...newChannels[index], unreadCount: 0 })
            setChannels(newChannels);
        }
    }

    // Handle new chat button click
    function handleNewChatClick(e) {
        e.stopPropagation();
        setShowNewFormPanel(true);
    }

    // Handle logout button click
    function handleLogoutClick(e) {
        e.stopPropagation();
        logout();
    }

    // Handle appbar click
    function handleAppBarClick() {
        setShowProfilePanel(true);
    }

    return (
        <Box sx={styles.container}>
            <AppBar position="static" color="transparent" sx={styles.appBar}>
                <ListItemButton sx={{ padding: 0 }} onClick={handleAppBarClick}>
                    <Toolbar sx={{ padding: '0 18px 0 18px', width: '100%' }} disableGutters>

                        <Avatar sx={styles.appBarIcon}>{(user.name || user.username).charAt(0)}</Avatar>

                        <Typography variant="button" component="div" sx={styles.appBarText}>
                            {user.name || user.username}
                        </Typography>

                        <IconButton sx={{ mr: 1 }} size="large" edge="start" onClick={handleNewChatClick}>
                            <AddIcon />
                        </IconButton>

                        <IconButton size="large" edge="start" onClick={handleLogoutClick}>
                            <LogoutIcon />
                        </IconButton>

                    </Toolbar>
                </ListItemButton>
            </AppBar>
            
            <List sx={styles.list}>

                { loading && 
                    <LinearProgress />
                }

                {channels.map((channel, index) => (
                    <Box key={index}>
                        <ListItemButton
                            selected={selectedChatId === channel._id}
                            onClick={() => handleChannelClick(channel)}
                        >
                            <ListItemAvatar>
                                <Badge color="error" badgeContent={channel.unreadCount || 0}>
                                    <Avatar sx={{ bgcolor: green[500] }}>{getChannelLabel(channel).charAt(0)}</Avatar>
                                </Badge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={getChannelLabel(channel)}
                                secondary={
                                    <span style={styles.listItemText}>
                                        <Typography 
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="button"
                                        >
                                            {channel.lastText && parseTime(channel.lastText.createdAt)}&nbsp;
                                        </Typography>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {channel.lastText && `${getParticipantLabel(channel.lastText.from)}: `}
                                        </Typography>
                                        {channel.lastText && channel.lastText.text}
                                    </span>
                                }
                            />
                        </ListItemButton>
                        <Divider variant="fullWidth" component="li" />
                    </Box>
                ))}
            </List>
        </Box>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexGrow: 0,
        flexShrink: 0,
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
    appBarIcon: {
        bgcolor: lightBlue[500],
        mr: 2,
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
        flexGrow: 1,
        padding: 0,
    },
    listItemText: {
        display: 'block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }
}