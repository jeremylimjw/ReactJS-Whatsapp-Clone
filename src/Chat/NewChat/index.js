import React, { useState } from 'react'
import { AppBar, Box, Toolbar, Typography, IconButton, ListItemButton, Divider, LinearProgress } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useApp } from '../../providers/AppProvider';
import DirectMessage from './DirectMessage';
import GroupChat from './GroupChat';

export default function NewChat() {
    const { setShowNewFormPanel } = useApp();

    const [submitting, setSubmitting] = useState(false)

    return (
        <Box sx={styles.container}>
            <AppBar position="static" color="transparent" sx={styles.appBar}>
                <ListItemButton sx={{ padding: 0 }} onClick={() => setShowNewFormPanel(false)}>
                    <Toolbar sx={{ padding: '0 18px 0 18px' }} disableGutters>

                        <IconButton size="large" edge="start">
                            <ArrowBackIosNewIcon />
                        </IconButton>

                        <Typography variant="h6" component="div" sx={styles.appBarText}>
                            Create New Chat
                        </Typography>
                    </Toolbar>
                </ListItemButton>
            </AppBar>

            { submitting && 
                <LinearProgress />
            }
            
            <DirectMessage 
                submitting={submitting} 
                setSubmitting={setSubmitting}
            />

            <Divider />
            
            <GroupChat 
                submitting={submitting} 
                setSubmitting={setSubmitting}
            />

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
