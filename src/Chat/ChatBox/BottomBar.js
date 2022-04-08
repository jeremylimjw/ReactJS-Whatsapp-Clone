import { Fab, TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import SendIcon from '@mui/icons-material/Send';
import { useApp } from '../../providers/AppProvider';
import { ChatApi } from '../../apis/Chat.api';
import { handleHttpError } from '../../utils/error.util';

export default function BottomBar() {
    const { user, channels, setChannels, chat, setChat } = useApp();

    const [text, setText] = useState('');
    
    // On textarea keydown event
    function handleKeyDownEvent(e) {
        // Submit on enter key, but ignore if shift+enter
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    }

    // Create the new message
    function onSubmit() {
        const textValue = text.trim();
        setText('');
        if (textValue === '') return;

        const key = Math.random();

        const message = {
            channelId: chat._id,
            text: textValue,
            from: user._id,
            key: key,
            createdAt: new Date(),
        }

        // Add new text in chatbox
        const newTexts = [message, ...chat.messages];
        setChat({...chat, messages: newTexts });
        
        // Update last text in channel list
        const newChannels = [...channels]
        const index = newChannels.findIndex(x => x._id === chat._id);
        if (index > -1) {
            newChannels.splice(index, 1, { ...newChannels[index], lastText: message })
        }
        
        // Shift channel to first item of the array list
        const modifiedChannel = newChannels.splice(index, 1);
        setChannels([...modifiedChannel, ...newChannels])

        ChatApi.createText(message)
            .then(newMessage => {
                // Update the message with the newly created message
                setChat(chat => {
                    const newTexts = [...chat.messages]
                    const index = newTexts.findIndex(x => x.key === message.key);
                    if (index > -1) {
                        newTexts.splice(index, 1, { ...newTexts[index], ...newMessage })
                        return { ...chat, messages: newTexts };
                    }
                    // If somehow the message cannot be found, append to the message list
                    return { ...chat, messages: [newMessage, ...newTexts] };
                })
            })
            .catch(handleHttpError)
            .catch(() => false);
    }

    return (
        <Box sx={styles.container}>
            <TextField sx={styles.textField}
                placeholder='Type a message'
                multiline
                maxRows={4}
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKeyDownEvent}
            />
            <Box sx={styles.sendButtonContainer}>
                <Fab color="primary" size="medium" onClick={onSubmit}>
                    <SendIcon />
                </Fab>
            </Box>
        </Box>
    )
}

const styles = {
    container: {
        padding: 1,
        display: 'flex',
        borderTop: '1px solid #ccc',
    },
    textField: {
        backgroundColor: 'white',
        flexGrow: 1,
    },
    sendButtonContainer: {
        paddingLeft: '12px',
        width: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}
