import ApiRequest from "./utils/requests";

// Make Vue plugin: vue.use(<imported Api>);
export default {
    install: (app, baseUrlPath) => {
        app.config.globalProperties.$api = new Api(baseUrlPath);
    }
}

export class Api extends ApiRequest {
    signIn = (username, password) => this.post(`/user/auth`, {username, password});
    signOut = () => this.delete(`/user/session`);
    getUser = () => this.get(`/user`);
    getUserInfo = (id) => this.get(`/user`, {id})
    signUp = (username, password, email, name) => this.post(`/user`, {username, password, email, name});
    updateUser = (email, username, name) => this.put(`/user`, {email, username, name});
    updateUserAvatarImageId = (avatarImageId) => this.put(`/user`, {avatarImageId});
    updatePassword = (oldPassword, newPassword) => this.put(`/user/password`, {oldPassword, newPassword});
    sendRestorePasswordEmail = (email) => this.post(`/user/password/restore`, {email});
    restorePassword = (code, newPassword) => this.put(`/user/password/restore`, {code, newPassword});
    sendSignInEmail = (email) => this.post(`/user/auth/code`, {email});
    signInByEmailCode = (email, code) => this.post(`/user/auth/code`, {email, code});
    confirmEmailSendMessage = () => this.post(`/user/email/confirm`);
    confirmEmailByCode = (code) => this.put(`/user/email/confirm`, {code});

    getEvents = (filters) => this.get(`/event`, filters); // filters: any of {date, placeId, participantId, }
    getEventById = (id) => this.get(`/event`, {id});
    createEvent = (name, description, date, timeStart, timeEnd, placeId, eventTimeStart, eventTimeEnd, needPeopleByCategory) => this.post(`/event`, {name, date, timeStart, timeEnd, description, placeId, eventTimeStart, eventTimeEnd, needPeople: needPeopleByCategory});
    editEvent = (id, name, description, date, timeStart, timeEnd, placeId, eventTimeStart, eventTimeEnd, needPeopleByCategory) => this.put(`/event`, {id, name, date, timeStart, timeEnd, description, placeId, eventTimeStart, eventTimeEnd, needPeople: needPeopleByCategory});
    deleteEventById = (id) => this.delete(`/event`, {id});

    participateInEvent = (eventId, userId, position) => this.post(`/participation/event`, {eventId, userId, position});
    notParticipateInEvent = (eventId, userId) => this.delete(`/participation/event`, {eventId, userId});

    getParticipationRating = () => this.get(`/ratings/participation`);

    getPositions = () => this.get(`/position/all`);
    getPositionById = (id) => this.get(`/position`, {id});
    addPosition = (name) => this.post(`/position`, {name});
    editPosition = (id, name) => this.put(`/position`, {id, name});
    deletePosition = (id) => this.delete(`/position`, {id});

    getPlaces = () => this.get(`/place/all`);
    getPlaceById = (id) => this.get(`/place`, {id});
    addPlace = (name) => this.post(`/place`, {name});
    editPlace = (id, name) => this.put(`/place`, {id, name});
    deletePlace = (id) => this.delete(`/place`, {id});

    uploadImage = (dataUrl) => this.post('/image', {dataUrl});
    deleteImage = (imageId) => this.delete('/image', {imageId});

    executeAdminSql = (sql) => this.post('/admin/sql', {sql});
}
