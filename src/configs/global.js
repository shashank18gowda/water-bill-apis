const RESPONSE = {
  SUCCESS: {
    code: 200,
    message: "Everything worked as expected.",
  },

  IS_MANDATORY: {
    code: 201,
    message: "is mandatory parameter.",
  },
  INVALID_DATA: {
    code: 202,
    message: "is invalid.",
  },
  NOT_MATCH: {
    code: 203,
    message: "Given data is not match.",
  },
  ALREADY_EXIST: {
    code: 204,
    message: "is already exist.",
  },
  NOT_FOUND: {
    code: 205,
    message: "not found",
  },

  FIELDS_MISSING: {
    code: 206,
    message: "Some fields are missing",
  },

  INVALID_TOKEN: {
    code: 400,
    message: "Invalid token",
  },

  ACCESS_DENIED: {
    code: 401,
    message: "Access denied. Unauthorized user",
  },

  UNKNOWN_ERROR: {
    code: 500,
    message: "Something went wrong, Please try again!",
  },
};
export default RESPONSE;
