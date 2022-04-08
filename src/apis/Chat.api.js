import { axiosWrapper, getAuthorizationHeader } from ".";

export class ChatApi {
    static async getChannels() {
        return axiosWrapper.get(`/channel`, getAuthorizationHeader())
            .then(res => res.data);
    }

    static async getChannelById(id, textLimit) {
        return axiosWrapper.get(`/channel/detail`, { params: { id: id, textLimit: textLimit }, ...getAuthorizationHeader() })
            .then(res => res.data);
    }

    static async createChannel(channel) {
        return axiosWrapper.post(`/channel`, channel, getAuthorizationHeader())
            .then(res => res.data);
    }

    static async deleteChannel(channelId) {
        return axiosWrapper.delete(`/channel`, { params: { channelId: channelId }, ...getAuthorizationHeader() })
            .then(res => res.data);
    }

    static async createText(text) {
        return axiosWrapper.post(`/text`, text, getAuthorizationHeader())
            .then(res => res.data);
    }

    static async getMoreText(channelId, sequenceOffset, textLimit) {
        return axiosWrapper.get(`/text`, { params: { channelId: channelId, sequenceOffset: sequenceOffset, textLimit: textLimit }, ...getAuthorizationHeader() })
            .then(res => res.data);
    }
}