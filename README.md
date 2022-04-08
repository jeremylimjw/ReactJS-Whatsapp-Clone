# ReactJS Whatsapp Clone
A side project developed with the objective to learn and experience the popular React framework. This app utilizes web sockets to enable features as listed below. The login system only requires a single string (username), if the username does not exist, a new user will be created automatically. Messages are not encrypted.

# Features
1. Real-time Online/Last seen timestamp  
2. Real-time message's read receipts Sent/Received/Read states  
3. Async text sending - No need to wait for message to send out before typing the next message
4. Lazy loading of messages, triggered by scrolling up
5. Real-time group chat and direct messaging

# Tech Stack
- ReactJS 17
- ExpressJS
- MongoDB

# Usage
Prerequisite: Backend server is running
1. Run `npm install`
2. Create `.env` file in root directory with the following:
```
PORT=4200
REACT_APP_BACKEND_URL=http://localhost:3000
```
3. Run `npm start`.
4. Access from http://localhost:4200.

# Credits
- Socket IO Client - https://socket.io/
- Material UI - https://mui.com/
- Scrolling Pagination - https://github.com/ankeetmaini/react-infinite-scroll-component