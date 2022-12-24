import ApiRequest from "./utils/requests";

// Make Vue plugin: vue.use(<imported Api>);
export default {
    install: (app, baseUrlPath) => {
        app.config.globalProperties.$api = new Api(baseUrlPath);
    }
}

export class Api extends ApiRequest {
    signIn = (email, password) => this.post(`/user/auth`, {email, password});
    signOut = () => this.delete(`/user/session`);
    getUser = () => this.get(`/user`);
    getAnotherUser = (id) => this.get(`/user`, {id})
    signUp = (password, email, name) => this.post(`/user`, {password, email, name});
    updateUser = (userId, email, name) => this.put(`/user`, {userId, email, name});
    updateUserAvatarImageId = (userId, avatarImageId) => this.put(`/user`, {userId, avatarImageId});
    updatePassword = (oldPassword, newPassword) => this.put(`/user/password`, {oldPassword, newPassword});
    deleteUser = (userId) => this.delete(`/user`, {userId});
    sendRestorePasswordEmail = (email) => this.post(`/user/password/restore`, {email});
    restorePassword = (code, newPassword) => this.put(`/user/password/restore`, {code, newPassword});
    sendSignInEmail = (email) => this.post(`/user/auth/code`, {email});
    signInByEmailCode = (email, code) => this.post(`/user/auth/code`, {email, code});
    confirmEmailSendMessage = () => this.post(`/user/email/confirm`);
    confirmEmailByCode = (code) => this.put(`/user/email/confirm`, {code});

    getEvents = (filters) => this.get(`/event`, filters); // filters: any of {date, placeId, participantId, type, search}; type = one of ['all', 'past', 'next'];
    getEventById = (id) => this.get(`/event`, {id});
    createEvent = (name, description, date, timeStart, timeEnd, placeId, eventTimeStart, eventTimeEnd, needPeopleByCategory) => this.post(`/event`, {name, date, timeStart, timeEnd, description, placeId, eventTimeStart, eventTimeEnd, needPeople: needPeopleByCategory}); // needPeopleByCategory: [{positionId: Number, count: Number}, ...]
    editEvent = (id, name, description, date, timeStart, timeEnd, placeId, eventTimeStart, eventTimeEnd, needPeopleByCategory) => this.put(`/event`, {id, name, date, timeStart, timeEnd, description, placeId, eventTimeStart, eventTimeEnd, needPeople: needPeopleByCategory});
    deleteEventById = (id) => this.delete(`/event`, {id});

    participateInEvent = (eventId, userId, positionId) => this.post(`/participation/event`, {eventId, userId, positionId});
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

    getDocs = (filters) => this.get(`/docs`, filters); // filters: any of {placeId, positionId, search}
    getDocById = (id) => this.get(`/docs`, {id});
    editDoc = (id, title, text, placeId, positionId) => this.put(`/docs`, {id, title, text, placeId, positionId});
    createDoc = (id, title, text, placeId, positionId) => this.post(`/docs`, {id, title, text, placeId, positionId});

    uploadImage = (dataUrl) => this.post(`/image`, {dataUrl});
    deleteImage = (imageId) => this.delete(`/image`, {imageId});

    executeAdminSql = (sql) => this.post(`/admin/sql`, {sql});
    setAdminConfirmation = (userId, isConfirmed) => this.put(`/admin/user/confirmation`, {userId, isConfirmed})
}
