import React from 'react'
import Paper from '@mui/material/Paper';
import Sidebar from './Sidebar';
import { useApp } from '../providers/AppProvider';
import ChatBox from './ChatBox';
import Details from './Details';
import NewChat from './NewChat';

export default function Chat() {
    const { showDetailsPanel, showNewFormPanel, selectedChatId } = useApp();

    return (
        <Paper sx={styles.container}>
            <Sidebar />
            { selectedChatId != null &&
                <ChatBox key={selectedChatId} />
            }
            { showDetailsPanel && 
                <Details />
            }
            { showNewFormPanel && 
                <NewChat />
            }
        </Paper>
    )
}

const styles = {
    container: {
        position: 'relative',
        boxSizing: 'border-box',
        width: {
            xs: '100%',
            xl: 1400,
        },
        height: {
            xs: '100%',
            xl: '95%',
        },
        // Flex only on desktop view, >sm
        display: {
            sm: 'flex',
        },
        backgroundColor: '#fff',
    }
}