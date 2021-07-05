const AUTH_DATA_KEY = `authData`;

export const authDataSet = (data) => {
   return localStorage.setItem(AUTH_DATA_KEY, JSON.stringify(data));
};

export const authDataDelete = () => localStorage.removeItem(AUTH_DATA_KEY);

export const authDataGet = () => {
    let authData =  localStorage.getItem(AUTH_DATA_KEY);
    if (authData && authData.length) {
        try {
           return JSON.parse(authData);
        } catch (e) { }
    }
    return {
        userId: 0,
        accessToken: '',
    };
};