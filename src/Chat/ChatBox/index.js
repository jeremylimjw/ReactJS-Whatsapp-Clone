import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material';
import BottomBar from './BottomBar';
import TopBar from './TopBar';
import Messages from './Messages';
import { ChatApi } from '../../apis/Chat.api';
import { TEXT_LIMIT, useApp } from '../../providers/AppProvider';
import { handleHttpError } from '../../utils/error.util';

export default function ChatBox() {
    const { chat, setChat, selectedChatId } = useApp();

    const [chatLoading, setChatLoading] = useState(false)
    const [hasMoreText, setHasMoreText] = useState(false)

    useEffect(() => {
        let isSubscribed = true;
        // Retrieve the chat
        setChatLoading(true);
        ChatApi.getChannelById(selectedChatId, TEXT_LIMIT)
            .then(channel => {
                if (!isSubscribed) return;
                if (channel != null) {
                    setChat(channel);
                    setHasMoreText(channel.messages.length === TEXT_LIMIT)
                }
                setChatLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setChatLoading(false));
            
        return () => {
            isSubscribed = false;
        }
    }, [selectedChatId, setChatLoading, setChat, setHasMoreText])

    return (
        <>
        { chat != null &&
            <Box sx={styles.container} variant="outlined" square>
                <TopBar />
                <Messages 
                    hasMoreText={hasMoreText} 
                    setHasMoreText={setHasMoreText}
                    chatLoading={chatLoading}
                />
                <BottomBar />
            </Box>
        }
        </>
    )
}

const styles = {
    container: {
        height: '100%',
        width: '100%',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        // Overlap container on mobile view
        position: {
            xs: 'absolute',
            sm: 'relative',
        },
        top: 0,
        left: 0,
        zIndex: 1,
        backgroundColor: '#fff',
    },
}
