
import { useState, useEffect, useContext, createContext, useCallback  } from "react";
import { io } from "socket.io-client";
import { UserApi } from "../apis/User.api";
import { parseMediumDateTime } from "../utils/datetime.util";

export const TEXT_LIMIT = 20;

const AppContext = createContext();

export function useApp() {
    return useContext(AppContext);
}

export function AppProvider({ children }) {
    
    const [socket, setSocket] = useState();
    const [user, setUser] = useState(null);
    const [channels, setChannels] = useState([]);
    const [chat, setChat] = useState(null);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [contacts, setContacts] = useState({});

    const [showDetailsPanel, setShowDetailsPanel] = useState(false);
    const [showNewFormPanel, setShowNewFormPanel] = useState(false);


    function logout() {
        sessionStorage.setItem("user", JSON.stringify(null));
        UserApi.logout();
        setChannels([]);
        setChat(null);
        setSelectedChatId(null);
        setContacts({});
        setShowDetailsPanel(false);
        setShowNewFormPanel(false);
        setUser(null);
    }


    useEffect(() => {
        let user = JSON.parse(sessionStorage.getItem("user")) || null;
        if (user != null) {
            setUser(user);
        }
    }, [])


    useEffect(() => {
        if (user === null) return;

        const socket = io(process.env.REACT_APP_BACKEND_URL, { query: { id: user._id, name: user.username } });
        socket.connect();

        setSocket(socket);

        return () => {
            socket.close();
        }
    }, [user, setSocket])
    
    // On new channel socket event
    useEffect(() => {
        if (!socket) return;
  
        socket.on("new_channel", ({ newChannel, newContacts }) => {
            const newChannels = [newChannel, ...channels];
            setChannels(newChannels);
            setContacts({...contacts, ...newContacts})
        })
  
        return () => {
            socket.off("new_channel");
        }
    
    }, [socket, channels, setChannels, contacts, setContacts])

    // On delete chat event
    useEffect(() => {
        if (!socket) return;
  
        socket.on("remove_channel", ({ channelId }) => {
            if (chat?._id === channelId) {
                setChat(null);
                setSelectedChatId(null);
            }
    
            const newChannels = channels.filter(x => x._id !== channelId);
            setChannels(newChannels);
        })
  
        return () => {
            socket.off("remove_channel");
        }
    
    }, [socket, chat, setChat, setSelectedChatId, channels, setChannels])
    
    
    // On new last seen socket event
    useEffect(() => {
        if (!socket) return;
  
        socket.on("update_last_seen", ({ userId, timestamp }) => {
            const newLastSeens = {...contacts, [userId]: { ...contacts[userId], lastSeen: timestamp } }
            setContacts(newLastSeens)
        })
  
        return () => {
            socket.off("update_last_seen");
        }
    
    }, [socket, contacts, setContacts])
    
    
    // On new message socket event
    useEffect(() => {
        if (!socket) return;

        socket.on("message", data => {
            const { newText, channelId } = data;

            const newChannels = [...channels]
            const index = newChannels.findIndex(x => x._id === channelId);

            // Update last text in channel list
            if (index > -1) {
                newChannels.splice(index, 1, { ...newChannels[index], lastText: newText })
            }
            
            // If channel is not opened
            if (chat?._id !== channelId) {
                // Update unread count
                if (index > -1) {
                    newChannels.splice(index, 1, { ...newChannels[index], unreadCount: (newChannels[index].unreadCount || 0)+1 })
                }
                // Update last received timestamp
                socket.emit('update_last_received', {
                    userId: user._id,
                    channelId: channelId,
                    timestamp: new Date(),
                })
            } else {
                // Append the new text in chatbox
                setChat({...chat, messages: [newText, ...chat.messages]})

                // Update last read timestamp
                socket.emit('update_last_read', {
                    userId: user._id,
                    channelId: channelId,
                    timestamp: new Date(),
                })
            }

            // Shift channel to first item of the array list
            const channel = newChannels.splice(index, 1);
            setChannels([...channel, ...newChannels])
            
        })
  
        return () => {
            socket.off("message");
        }
    
    }, [socket, user, chat, setChat, channels, setChannels])

    
    // On a user's last read/received timestamp change
    useEffect(() => {
        if (!socket) return;
  
        // On a new user's changed last received timestamp
        socket.on("last_received", data => {
            const { channelId, userId, timestamp } = data;

            if (chat == null || channelId !== chat._id) return;

            // Register his/her new timestamp
            const newParticipants = [...chat.participants];
            const index = newParticipants.findIndex(x => x.userId === userId);
            if (index > -1) {
                newParticipants.splice(index, 1, { ...newParticipants[index], lastReceived: timestamp })
            }
            setChat({...chat, participants: newParticipants });
        })

        // On a new user's changed last read timestamp
        socket.on("last_read", data => {
            const { channelId, userId, timestamp } = data;

            if (chat == null || channelId !== chat._id) return;
            
            // Register his/her new timestamp
            const newParticipants = [...chat.participants];
            const index = newParticipants.findIndex(x => x.userId === userId);
            if (index > -1) {
                newParticipants.splice(index, 1, { ...newParticipants[index], lastReceived: timestamp, lastRead: timestamp })
            }
            setChat({...chat, participants: newParticipants });
        })
  
        return () => {
            socket.off("last_received");
            socket.off("last_read");
        }
    
    }, [chat, setChat, socket])


    // Returns a string describing the participant's last seen
    const getParticipantLastSeen = useCallback(
        (userId) => {
            if (userId === user._id) return 'Online';
            const lastSeen = contacts[userId].lastSeen;
            if (!lastSeen) return 'Offline';
            if (lastSeen === 'Online') return lastSeen;
            return `Last seen: ${parseMediumDateTime(contacts[userId].lastSeen)}`
        },
        [contacts, user],
    )


    // Returns a string describing the participant's name
    const getParticipantLabel = useCallback(
        (userId) => {
            if (userId === user._id) return 'Me';
            if (!userId || !contacts[userId]) return 'Unknown';
            return contacts[userId].name || contacts[userId].username;
        },
        [contacts, user],
    )
    

    // Return group chat title if have, otherwise get participant name
    const getChannelLabel = useCallback(
        (channel) => {
            if (channel.title != null) {
                return channel.title;
            } else {
                for (let participant of channel.participants) {
                    if (participant.userId !== user._id) {
                        return getParticipantLabel(participant.userId);
                    }
                }
            }
        
            return 'Unknown';
        },
        [user, getParticipantLabel],
    )

    
    // On a user's name change
    useEffect(() => {
        if (!socket) return;
  
        socket.on("update_name", data => {
            const { userId, name } = data;

            const contact = contacts[userId];

            if (contact != null) {
                const newContact = { ...contact, name: name };
                setContacts({ ...contacts, [userId]: newContact })
            }
        })
  
        return () => {
            socket.off("update_name");
        }
    
    }, [contacts, setContacts, socket])


    return (
        <AppContext.Provider 
            value={{ 
                user, setUser, logout,
                socket, 
                channels, setChannels, 
                chat, setChat, 
                selectedChatId, setSelectedChatId,
                showDetailsPanel, setShowDetailsPanel,
                showNewFormPanel, setShowNewFormPanel,
                contacts, setContacts,
                getChannelLabel,
                getParticipantLabel,
                getParticipantLastSeen,
            }}>
            { children }
        </AppContext.Provider>
    )
}