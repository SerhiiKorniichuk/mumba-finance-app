export const AUTH_SET_USER_ID = 'AUTH_SET_USER_ID';
export const AUTH_SET_USER_PHOTO = 'AUTH_SET_USER_PHOTO';

export const authSetUserId = (userId) => ({
    type: AUTH_SET_USER_ID,
    payload: userId,
});

export const authSetUserPhoto = (userPhoto) => ({
    type: AUTH_SET_USER_PHOTO,
    payload: userPhoto,
});

