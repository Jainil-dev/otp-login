exports.generateSuccessResponse = (message = "", data = "") => {
  return { status: "success", message: message, data: data };
};

exports.generateErrorResponse = (message = "", err = "") => {
  return { status: "error", message: message, err: err };
};
