exports.generateSuccessResponse = (message = '', data = '') => ({ status: 'success', message, data });

exports.generateErrorResponse = (message = '', err = '') => ({ status: 'error', message, err });
