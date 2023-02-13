export const BASE_URL_PATH = '';

export const API_URL = BASE_URL_PATH + '/api';

export const IMAGE_MAX_RES = 512;
export const IMAGE_PROFILE_MAX_RES = 82;
export const IMAGE_ACHIEVEMENT_MAX_RES = 132;
export const isMobile = () => window.innerWidth < 700;
export const HEADER_HEIGHT = () => isMobile() ? 0 : 70;
export const MOBILE_HEADER_HEIGHT = () => isMobile() ? 60 : 0;
