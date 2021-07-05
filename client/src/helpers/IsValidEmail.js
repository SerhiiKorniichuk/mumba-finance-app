const IsValidEmail = (str) => /^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9-]+\.[A-Za-z]+$/.test(str);

export default IsValidEmail;