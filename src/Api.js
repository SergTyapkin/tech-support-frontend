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
    getUser = () => this.get(`/user`)
    getUnconfirmedUsers = () => this.get(`/user/all`, {confirmedByAdmin: false});
    getAllUsers = () => this.get(`/user/all`, {confirmedByAdmin: true});
    getUsersBySearch = (search) => this.get(`/user/all`, {search});
    getAnotherUser = (id) => this.get(`/user`, {id})
    signUp = (password, email, name) => this.post(`/user`, {password, email, name});
    updateUser = (userId, email, name) => this.put(`/user`, {userId, email, name});
    updateUserTitle = (userId, title) => this.put(`/user`, {userId, title});
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
    createEvent = (name, description, date, timeStart, timeEnd, placeId, eventTimeStart, eventTimeEnd, peopleNeeds) => this.post(`/event`, {name, date, timeStart, timeEnd, description, placeId, eventTimeStart, eventTimeEnd, peopleNeeds});
    editEvent = (id, name, description, date, timeStart, timeEnd, placeId, eventTimeStart, eventTimeEnd, peopleNeeds) => this.put(`/event`, {id, name, date, timeStart, timeEnd, description, placeId, eventTimeStart, eventTimeEnd, peopleNeeds});
    deleteEventById = (id) => this.delete(`/event`, {id});

    participateInEvent = (eventId, userId, positionId) => this.post(`/participation/event`, {eventId, userId, positionId});
    notParticipateInEvent = (eventId, userId) => this.delete(`/participation/event`, {eventId, userId});
    updateParticipationScore = (id, score) => this.put(`/participation/event`, {id, score});
    updateParticipationComment = (id, comment) => this.put(`/participation/event`, {id, comment});
    getUnvotedParticipations = () => this.get(`/participation/unvoted`);

    getParticipationRating = () => this.get(`/ratings`);

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
    createDoc = (title, text, placeId, positionId) => this.post(`/docs`, {title, text, placeId, positionId});
    deleteDoc = (id) => this.delete(`/docs`, {id});

    getAchievements = () => this.get(`/achievements`);
    getAchievementById = (id) => this.get(`/achievements`, {id});
    createAchievement = (name, description, levels) => this.post(`/achievements`, {name, description, levels});
    editAchievement = (id, name, description, levels) => this.put(`/achievements`, {id, name, description, levels});
    updateAchievementImage = (id, imageId) => this.put(`/achievements`, {id, imageId});
    deleteAchievement = (id) => this.delete(`/achievements`, {id});

    getUserAchievements = (userId) => this.get(`/achievements/user`, {userId});
    addUserAchievement = (userId, achievementId, level) => this.post(`/achievements/user`, {userId, achievementId, level});
    editUserAchievement = (id, userId, achievementId, level) => this.put(`/achievements/user`, {id, userId, achievementId, level});
    deleteUserAchievement = (id) => this.delete(`/achievements/user`, {id});

    uploadImage = (dataUrl) => this.post(`/image`, {dataUrl});
    deleteImage = (imageId) => this.delete(`/image`, {imageId});

    executeAdminSql = (sql) => this.post(`/admin/sql`, {sql});
    setAdminConfirmation = (userId, isConfirmed) => this.put(`/admin/user/confirmation`, {userId, isConfirmed})
}
