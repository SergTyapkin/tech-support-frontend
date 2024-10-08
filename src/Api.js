import ApiRequest from "./utils/requests";

// Make Vue plugin: vue.use(<imported Api>);
export default {
    install: (app, baseUrlPath) => {
        app.config.globalProperties.$api = new Api(baseUrlPath);
    }
}

export class Api extends ApiRequest {
    signIn = (email, password, clientBrowser, clientOS) => this.post(`/user/auth`, {email, password, clientBrowser, clientOS});
    signOut = () => this.delete(`/user/session`);
    deleteAnotherSessions = () => this.delete('/user/sessions/another');
    getAllSessions = () => this.get('/user/sessions/all');
    getUser = () => this.get(`/user`)
    getUnconfirmedUsers = () => this.get(`/user/all`, {confirmedByAdmin: false});
    getAllUsers = () => this.get(`/user/all`, {confirmedByAdmin: true});
    getUsersBySearch = (search) => this.get(`/user/all`, {search});
    getAnotherUser = (id) => this.get(`/user`, {id})
    signUp = (password, email, firstName, secondName, thirdName, telegram, clientBrowser, clientOS) => this.post(`/user`, {password, email, firstName, secondName, thirdName, telegram, clientBrowser, clientOS});
    updateUser = (userId, email, firstName, secondName, thirdName, telegram) => this.put(`/user`, {userId, email, firstName, secondName, thirdName, telegram});
    updateUserTitle = (userId, title) => this.put(`/user`, {userId, title});
    updateUserAvatarImageId = (userId, avatarImageId) => this.put(`/user`, {userId, avatarImageId});
    updatePassword = (oldPassword, newPassword) => this.put(`/user/password`, {oldPassword, newPassword});
    deleteUser = (userId) => this.delete(`/user`, {userId});
    sendRestorePasswordEmail = (email) => this.post(`/user/password/restore`, {email});
    restorePassword = (code, newPassword) => this.put(`/user/password/restore`, {code, newPassword});
    sendSignInEmail = (email) => this.post(`/user/auth/code`, {email});
    signInByEmailCode = (email, code, clientBrowser, clientOS) => this.post(`/user/auth/code`, {email, code, clientBrowser, clientOS});
    confirmEmailSendMessage = () => this.post(`/user/email/confirm`);
    confirmEmailByCode = (code) => this.put(`/user/email/confirm`, {code});

    getEvents = (filters) => this.get(`/event`, filters); // filters: any of {date, placeId, participantId, type, search}; type = one of ['all', 'past', 'next'];
    getEventById = (id) => this.get(`/event`, {id});
    createEvent = (name, description, date, timeStart, timeEnd, placeId, eventTimeStart, eventTimeEnd, peopleNeeds, isAcademy) => this.post(`/event`, {name, date, timeStart, timeEnd, description, placeId, eventTimeStart, eventTimeEnd, peopleNeeds, isAcademy});
    editEvent = (id, name, description, date, timeStart, timeEnd, placeId, eventTimeStart, eventTimeEnd, peopleNeeds, isAcademy) => this.put(`/event`, {id, name, date, timeStart, timeEnd, description, placeId, eventTimeStart, eventTimeEnd, peopleNeeds, isAcademy});
    deleteEventById = (id) => this.delete(`/event`, {id});

    participateInEvent = (eventId, userId, positionId, comment) => this.post(`/participation/event`, {eventId, userId, positionId, comment});
    notParticipateInEvent = (eventId, userId) => this.delete(`/participation/event`, {eventId, userId});
    updateParticipationScore = (id, score) => this.put(`/participation/event`, {id, score});
    updateParticipationCommentAdmin = (id, comment) => this.put(`/participation/event`, {id, comment});
    updateParticipationCommentSelf = (id, comment) => this.put(`/participation/event/comment`, {id, comment});
    getUnvotedParticipations = () => this.get(`/participation/unvoted`);

    getParticipationRatingWithDates = (dateStart, dateEnd) => this.get(`/ratings`, {dateStart, dateEnd});
    getParticipationRating = () => this.get(`/ratings`);
    getParticipationsExtract = () => this.get(`/participation/extract`);

    getPositions = () => this.get(`/position/all`);
    getPositionById = (id) => this.get(`/position`, {id});
    addPosition = (name) => this.post(`/position`, {name});
    editPosition = (id, name) => this.put(`/position`, {id, name});
    deletePosition = (id) => this.delete(`/position`, {id});

    getPlaces = () => this.get(`/place/all`);
    getPlaceById = (id) => this.get(`/place`, {id});
    getPeriods = () => this.get(`/period/all`);
    getPeriodById = (id) => this.get(`/period`, {id});
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
    createAchievement = (name, description, levels, special) => this.post(`/achievements`, {name, description, levels, special});
    editAchievement = (id, name, description, levels, special) => this.put(`/achievements`, {id, name, description, levels, special});
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
