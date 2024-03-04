const validateFields = (mode, fields) => {
  const output = [];
  !fields.userName && output.push('No username provided');
  !fields.password && output.push('No password provided');
  if (mode === 'signup') {
    !fields.lastName && output.push('No last name provided');
    !fields.firstName && output.push('No firstName provided');
  }
  return output;
};

export const createError = (err) => {
  return { message: { err } };
};

export default validateFields;
