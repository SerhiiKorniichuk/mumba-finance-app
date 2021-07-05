export const IsValidFirstName = (str) => /^[A-Za-z]+$/.test(str);
export const IsValidLastName = (str) => /^[A-Za-z]+(([ ])?[A-Za-z]+)?$/.test(str);
