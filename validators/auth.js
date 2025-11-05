const yup = require('yup');

const registerValidator = yup.object({
    email: yup
    .string()
    .required("email is required")
    .email('Email must be a valid email address'),
    password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const loginValidator = yup.object({
  identifir: yup
    .string()
    .required('Username or email is required')
    .test('is-valid', 'Must be a valid email or username', value => {
      if (!value) return false;

      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isUsername = value.length >= 3;

      return isEmail || isUsername;
    }),
  
  password: yup
    .string()
    .required('Password is required')
});

module.exports = { registerValidator, loginValidator };