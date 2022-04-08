import { AppBar, Avatar, IconButton, ListItemButton, ListItemText, Toolbar } from '@mui/material'
import React from 'react'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useApp } from '../../providers/AppProvider';
import { green } from '@mui/material/colors';

export default function TopBar() {
    const { user, chat, setChat, setSelectedChatId, setShowDetailsPanel, getChannelLabel, getParticipantLabel, getParticipantLastSeen } = useApp();

    // Render the string label for a group chat
    function renderGroupChatDescription() {
        return chat.participants.map((x, idx) => (idx === 0 ? '' : ', ') + getParticipantLabel(x.userId))
    }

    // Render the string label for a direct message chat
    function renderDirectMessageDescription() {
        for (let participant of chat.participants) {
            if (participant.userId !== user._id) {
                return getParticipantLastSeen(participant.userId)
            }
        }
    }

    // Handles on close chat event
    function closeChat(e) {
        e.stopPropagation();
        setSelectedChatId(null);
        setChat(null);
        setShowDetailsPanel(false);
    }

    return (
        <AppBar position="static" color="transparent" sx={styles.container} onClick={() => setShowDetailsPanel(true)}>
            <ListItemButton sx={{ padding: 0 }}>
                <Toolbar sx={{ padding: '0 18px 0 18px' }} disableGutters>

                    <IconButton size="large" edge="start" onClick={closeChat}>
                        <ArrowBackIosNewIcon />
                    </IconButton>

                    <Avatar sx={styles.appBarIcon}>
                        { getChannelLabel(chat).charAt(0) }
                    </Avatar>
                    
                    <ListItemText
                        primary={ getChannelLabel(chat) }
                        secondary={
                            <span style={styles.listItemText}>
                                { chat.title ? renderGroupChatDescription() : renderDirectMessageDescription() }
                            </span>
                        }
                    />
                </Toolbar>
            </ListItemButton>
        </AppBar>
    )
}

const styles = {
    container: {
        boxShadow: 'none',
        borderBottom: '1px solid #ccc',
        cursor: 'pointer',
        backgroundColor: '#fff',
    },
    appBarIcon: {
        bgcolor: green[500],
        ml: 2,
        mr: 2,
    },
    listItemText: {
        display: 'block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
}
