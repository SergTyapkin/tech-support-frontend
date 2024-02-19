import { createApp } from 'vue'

import App from './App.vue'
import Store from './Store.js'
import createVueRouter from './Router.js'
import Api from "./Api";
import ScrollRestore from "./ScrollRestore";

import './styles/global.styl';
import './styles/show-hide.styl';
import './styles/scrollbars.styl';
import './styles/glitch.styl';
import {API_URL} from "./constants";


const Router = createVueRouter(Store);
const restoreScrollPages = Router.setScrollToTopDenyPagesList([
  'events',
  'achievements',
  'ratings',
  'doc',
  'docs',
]);
const denyScrollToTopPages = Router.appendScrollToTopDenyPagesList(
  'event',
);
console.log("SCROLL WILL BE RESTORED ON PAGES:", denyScrollToTopPages);


const app = createApp(App)
  .use(Api, API_URL)
  .use(Router)
  .use(Store)
  .use(ScrollRestore, restoreScrollPages)
  .mount('#app');
Store.$app = app;
