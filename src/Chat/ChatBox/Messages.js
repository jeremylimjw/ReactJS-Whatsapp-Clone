import { Box, List, Avatar, ListItemText, ListItemButton, ListItemAvatar, Typography, Divider, LinearProgress } from '@mui/material'
import { green, lightBlue } from '@mui/material/colors'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { ChatApi } from '../../apis/Chat.api';
import { TEXT_LIMIT, useApp } from '../../providers/AppProvider';
import { parseDate, parseTime } from '../../utils/datetime.util';
import { handleHttpError } from '../../utils/error.util';

export default function Messages({ hasMoreText, setHasMoreText, chatLoading }) {
    const { user, chat, setChat, getParticipantLabel } = useApp();

    // Check if 2 dates are the same day
    function isSameDay(d1, d2) {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        return date1.toDateString() === date2.toDateString();
    }

    // Check all participants in chat if received the message
    function isReceived(message) {
        for (let participant of chat.participants) {
            if (participant.userId !== user._id && participant.lastReceived < message.createdAt) {
                return false;
            }

        }
        return true;
    }
    
    // Check all participants in chat if read the message
    function isRead(message) {
        for (let participant of chat.participants) {
            if (participant.userId !== user._id && participant.lastRead < message.createdAt) {
                return false;
            }
    
        }
        return true;
    }

    // Render the message status
    function renderStatus(message) {
        if (message._id == null) return 'Sending';
        if (isRead(message)) return 'Seen';
        if (isReceived(message)) return 'Received';
        return 'Sent';
    }

    // Handles on loading more messages
    function handleNext() {
        ChatApi.getMoreText(chat._id, chat.messages[chat.messages.length-1].sequence, TEXT_LIMIT)
            .then(messages => {
                if (messages.length < TEXT_LIMIT) {
                    setHasMoreText(false);
                }

                const newMessages = [...chat.messages, ...messages];
                setChat({...chat, messages: newMessages });
            })
            .catch(handleHttpError)
            .catch(() => false);
    }

    return (
        <>
            {chatLoading && 
                <LinearProgress />
            }

            <Box id="scrollableDiv" style={styles.container}>

                <List sx={styles.list}>

                    <InfiniteScroll
                        style={{ display: 'flex', flexDirection: 'column-reverse' }}
                        dataLength={chat.messages.length}
                        next={handleNext}
                        hasMore={hasMoreText}
                        inverse={true}
                        loader={<LinearProgress />}
                        scrollableTarget="scrollableDiv"
                    >
                        {chat.messages.map((message, index) => (
                            <Box key={index}>
                                
                                {/* Date Seperator */}
                                { index === chat.messages.length-1 || (index < chat.messages.length-1 && !isSameDay(chat.messages[index + 1].createdAt, message.createdAt)) ?
                                    <Divider variant="fullWidth" component="li">
                                        <Typography 
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="button"
                                        >
                                            {parseDate(message.createdAt)}
                                        </Typography>
                                    </Divider>
                                    :
                                    <Divider variant="fullWidth" component="li" />
                                }

                                <ListItemButton sx={styles.listItem}>
                                    <ListItemAvatar>
                                        { user._id === message.from ? 
                                            <Avatar sx={{ bgcolor: lightBlue[500] }}>{(user.name || user.username).charAt(0)}</Avatar>
                                            :
                                            <Avatar sx={{ bgcolor: green[500] }}>{getParticipantLabel(message.from).charAt(0)}</Avatar>
                                        }
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={getParticipantLabel(message.from)}
                                        secondary={
                                            <>
                                                <Typography
                                                    sx={{ display: 'block', wordBreak: 'break-all' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {message.text}
                                                </Typography>

                                                <Typography 
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="button"
                                                >
                                                    {parseTime(message.createdAt)}
                                                </Typography>

                                                { user._id === message.from && 
                                                    <Typography 
                                                        sx={{ display: 'inline', float: 'right' }}
                                                        component="span"
                                                        variant="subtitle"
                                                    >
                                                        {renderStatus(message)}
                                                    </Typography>
                                                }
                                            </>
                                        }
                                    />
                                </ListItemButton>

                            </Box>
                        ))}
                            
                    </InfiniteScroll>

                </List>
            </Box>
        </>
    )
}

const styles = {
    container: {
        flexGrow: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
    },
    list: {
        padding: 0,
    },
    listItem: {
        backgroundColor: "#fff"
    },
}
