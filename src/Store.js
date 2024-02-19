import Vuex from 'vuex'
import User from "./models/user";

const Store = new Vuex.Store({
  state: {
    user: new User(),
  },
  mutations: {
    SET_USER(state, userData) {
      state.user.set(userData);
    },
    DELETE_USER(state) {
      state.user.setDefault();
    },
  },
  actions: {
    async GET_USER(state) {
      const u = await this.$app.$api.getUser();
      if (u.ok_) {
        state.commit('SET_USER', {
          avatarImageId: u.avatarimageid,
          email: u.email,
          telegram: u.telegram,
          id: u.id,
          isConfirmedEmail: u.isconfirmedemail,
          isConfirmedByAdmin: u.isconfirmedbyadmin,
          joinedDate: u.joineddate,
          firstName: u.firstname,
          secondName: u.secondname,
          thirdName: u.thirdname,
          title: u.title,
          completedEvents: u.completedevents,
          rating: u.rating,
          position: u.position,

          canEditAchievements: u.caneditachievements,
          canAssignAchievements: u.canassignachievements,
          canConfirmNewUsers: u.canconfirmnewusers,
          canEditEvents: u.caneditevents,
          canEditUsersTitles: u.canedituserstitles,
          canEditUsersData: u.caneditusersdata,
          canEditParticipations: u.caneditparticipations,
          canEditDocs: u.caneditdocs,
          canEditPlaces: u.caneditplaces,
          canEditPositions: u.caneditpositions,
          canExecuteSQL: u.canexecutesql,
        });
      } else {
        state.commit('DELETE_USER');
      }
    },
    async DELETE_USER(state) {
      state.commit('DELETE_USER');
    },
  }
});

export default Store;
