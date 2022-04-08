import axios from 'axios';

export const axiosWrapper = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
    withCredentials: true
});

export function getAuthorizationHeader() {
    const userId = JSON.parse(sessionStorage.getItem("user"))?._id;
    const authorization = {
        headers: {
            'Authorization': userId 
        }
    }
    return authorization;
}