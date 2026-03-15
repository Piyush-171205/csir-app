export const validateUsername = (username) => {
  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  return regex.test(username);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateMobile = (mobile) => {
  const regex = /^\d{10}$/;
  return regex.test(mobile);
};

export const validatePincode = (pincode) => {
  const regex = /^\d{6}$/;
  return regex.test(pincode);
};