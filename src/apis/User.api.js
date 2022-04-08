import { axiosWrapper, getAuthorizationHeader } from ".";

export class UserApi {
    static async login(username) {
        return axiosWrapper.post(`/auth`, { username: username })
            .then(res => res.data);
    }
    
    static async logout() {
        return axiosWrapper.post(`/auth/logout`, {}, getAuthorizationHeader())
            .then(res => res.data);
    }

    static async validateUsername(username) {
        return axiosWrapper.post(`/user/validate`, { username: username })
            .then(res => res.data);
    }

    static async updateName(name) {
        return axiosWrapper.put(`/user`, { name: name }, getAuthorizationHeader())
            .then(res => res.data);
    }
}