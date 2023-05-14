import { createRouter, createWebHistory } from 'vue-router'

import SignIn from '/src/views/User/SignIn.vue'
import SignUp from '/src/views/User/SignUp.vue'
import Profile from '/src/views/User/Profile.vue'

import RestorePassword from "./views/User/RestorePassword.vue";
import ConfirmEmail from "./views/User/ConfirmEmail.vue";

import EventsList from "./views/EventsList.vue";
import EventPage from "./views/EventPage.vue";
import CreateEvent from "./views/CreateEvent.vue";

import SqlExecute from "./views/SqlExecute.vue";
import AdminPage from "/src/views/AdminPage.vue";
import Ratings from "/src/views/Ratings.vue";
import DocsList from "/src/views/DocsList.vue";
import Doc from "/src/views/Doc.vue";
import Achievement from "./views/Achievement.vue";
import AchievementsList from "./views/AchievementsList.vue";

import table from "/src/components/UsersTable.vue";

import Page404 from '/src/views/Page404.vue'

import {BASE_URL_PATH} from "./constants";
import {scrollSmoothly, scrollSmoothlyStop} from "./utils/utils";
import {nextTick} from "vue";


export default function createVueRouter(Store, scrollToTopDenyHrefs=[]) {
    const routes = [
        {path: BASE_URL_PATH + '/', name: 'default'},
        {path: BASE_URL_PATH + '/signin', name: 'signin', component: SignIn, meta: {noLoginRequired: true}},
        {path: BASE_URL_PATH + '/signup', name: 'signup', component: SignUp, meta: {noLoginRequired: true}},
        {path: BASE_URL_PATH + '/profile', name: 'profile', component: Profile, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/profile/:userId', name: 'userProfile', component: Profile, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/password/restore', name: 'passwordRestore', component: RestorePassword, meta: {noLoginRequired: true}},
        {path: BASE_URL_PATH + '/email/confirm', name: 'emailConfirm', component: ConfirmEmail},

        {path: BASE_URL_PATH + '/event/:eventId', name: 'event', component: EventPage, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/event/create', name: 'createEvent', component: CreateEvent, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/events', name: 'events', component: EventsList, meta: {loginRequired: true}},

        {path: BASE_URL_PATH + '/docs', name: 'docs', component: DocsList, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/doc/:docId', name: 'doc', component: Doc, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/doc', name: 'createDoc', component: Doc, meta: {loginRequired: true}},

        {path: BASE_URL_PATH + '/achievement', name: 'createAchievement', component: Achievement, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/achievement/:achievementId', name: 'achievement', component: Achievement, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/achievements', name: 'achievements', component: AchievementsList, meta: {loginRequired: true}},

        {path: BASE_URL_PATH + '/ratings', name: 'ratings', component: Ratings, meta: {loginRequired: true}},

        {path: BASE_URL_PATH + '/admin', name: 'admin', component: AdminPage, meta: {loginRequired: true}},
        {path: BASE_URL_PATH + '/sql', name: 'sql', component: SqlExecute, meta: {loginRequired: true}},

        {path: BASE_URL_PATH + '/:catchAll(.*)', component: Page404},
        {path: BASE_URL_PATH + '/table', component: table},
    ]

    const Router = createRouter({
        history: createWebHistory(),
        routes: routes,
    });

    let router_got_user = false;
    Router.beforeEach(async (to, from, next) => {
        if (!router_got_user) {
            await Store.dispatch('GET_USER');
            router_got_user = true;
        }

        if (to.path === '/' || to.path === '' || to.path === BASE_URL_PATH || to.path === BASE_URL_PATH + '/') {
            if (Store.state.user.isLogined) {
                next('/profile');
                return;
            }
            next('/signin');
            return;
        }
        // window.scroll({top: 0, left: 0, behavior: 'smooth'});

        const basePartRedirect = {
            path: BASE_URL_PATH + removeBasePartOnStart(to.fullPath),
            params: to.params,
            query: to.query,
        }
        const notLoginedRedirect = {
            path: BASE_URL_PATH + '/signin',
        }
        const loginedRedirect = {
            path: BASE_URL_PATH + '/profile',
        }

        function smartBasePartRedirect() {
            if (isStartsOnBasePart(to.fullPath)) {
                next();
            } else {
                next(basePartRedirect);
            }
        }

        // Login required redirects
        if (to.matched.some(record => record.meta.loginRequired)) {
            if (Store.state.user.isLogined) {
                smartBasePartRedirect();
                return;
            }
            next(notLoginedRedirect);
            return;
        } else if (to.matched.some(record => record.meta.noLoginRequired)) {
            if (!Store.state.user.isLogined) {
                smartBasePartRedirect();
                return;
            }
            next(loginedRedirect);
            return;
        }

        smartBasePartRedirect();
        return;
    });

    Router.setScrollToTopDenyPagesList = (list) => {
        scrollToTopDenyHrefs = list.map((el) => RegExp(Router.resolve(el).fullPath));
        return scrollToTopDenyHrefs;
    };

    Router.afterEach(async (to, from, next) => {
        const inDenyList = scrollToTopDenyHrefs.reduce((sum, cur) => sum || cur.test(to.fullPath), false);
        if (!inDenyList) {
            await nextTick();
            scrollSmoothly(document.body, 0);
        } else {
            scrollSmoothlyStop();
        }
    });

    Router.beforeResolve(async (to) => {
        if (window?.onbeforeunload) {
            if (confirm("Изменения не сохранены. Вы уверены, что хотите покинуть страницу?"))
                window.onbeforeunload = null;
            else
                return false;
        }

        // Email Confirm required handling
        if (to.matched.some(record => record.meta.emailConfirmRequired)) {
            if (!Store.state.user.isConfirmedEmail) {
                Store.$app.$modal.alert("Действие недоступно", "Твой E-mail не подтвержден. Сперва нужно подтвердить его, сделать это можно в профиле")
                return false;
            }
        }
    });

    return Router;
}


function isStartsOnBasePart(string) {
    return new RegExp(`^${BASE_URL_PATH}`, 'i').test(string);
}
function removeBasePartOnStart(string) {
    return string.replace(new RegExp(`^${BASE_URL_PATH}`, 'i'), '');
}
