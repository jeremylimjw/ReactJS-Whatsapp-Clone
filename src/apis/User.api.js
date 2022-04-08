import { axiosWrapper } from ".";

export class UserApi {
    static async login(username) {
        return axiosWrapper.post(`/auth`, { username: username })
            .then(res => res.data);
    }
    
    static async logout() {
        return axiosWrapper.post(`/auth/logout`)
            .then(res => res.data);
    }

    static async validateUsername(username) {
        return axiosWrapper.post(`/user/validate`, { username: username })
            .then(res => res.data);
    }

    static async updateName(name) {
        return axiosWrapper.put(`/user`, { name: name })
            .then(res => res.data);
    }
}