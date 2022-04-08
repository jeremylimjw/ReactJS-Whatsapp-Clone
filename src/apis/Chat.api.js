import { axiosWrapper } from ".";

export class ChatApi {
    // Uses cookies to query with user id
    static async getChannels() {
        return axiosWrapper.get(`/channel`)
            .then(res => res.data);
    }

    static async getChannelById(id, textLimit) {
        return axiosWrapper.get(`/channel/detail`, { params: { id: id, textLimit: textLimit } })
            .then(res => res.data);
    }

    static async createChannel(channel) {
        return axiosWrapper.post(`/channel`, channel)
            .then(res => res.data);
    }

    static async deleteChannel(channelId) {
        return axiosWrapper.delete(`/channel`, { params: { channelId: channelId } })
            .then(res => res.data);
    }

    static async createText(text) {
        return axiosWrapper.post(`/text`, text)
            .then(res => res.data);
    }

    static async getMoreText(channelId, sequenceOffset, textLimit) {
        return axiosWrapper.get(`/text`, { params: { channelId: channelId, sequenceOffset: sequenceOffset, textLimit: textLimit } })
            .then(res => res.data);
    }
}