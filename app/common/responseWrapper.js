// eslint-disable-next-line no-undef
const _ = require('lodash');

module.exports = {
    successResponse: (res, statusCode, data, message) => {
        if (statusCode == null) throw new Error('Status code is missing');
        if (typeof (statusCode) !== 'number') throw new Error('Status code passed is not a number');
        if (data == null) throw new Error('Data is missing');
        console.log('API successful', { status_code: statusCode });
        return res.status(statusCode).json({
          isError: false,
          data,
          message: message,
          statusCode: 200,
        });
    },
    errorResponse: (res, statusCode, errorMessage, errObject, data) => {
        if (statusCode == null) throw new Error('Status code is missing');
        if (typeof (statusCode) !== 'number') throw new Error('Status code passed is not a number');
        if (_.isNil(errorMessage)) throw new Error('Error message is missing');
        let customStatusCode = statusCode;
        return res.status(statusCode).json({
          isError: true,
          data,
          message: errorMessage,
          statusCode: customStatusCode,
        });
    },
}