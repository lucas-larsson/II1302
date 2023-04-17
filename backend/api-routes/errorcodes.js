const { sendErrorCodes } = require('../middlewares/errorcodes');
module.exports = {
	get: [sendErrorCodes],
};

module.exports.get.apiDoc = {
	tags: ['error-codes'],
	responses: {
		200: {
			description: 'Successfully fetched all error codes',
			content: {
				'application/json': {
					schema: {
						$ref: '#/components/schemas/ListOfErrorCodes',
					},
				},
			},
		},
	},
};
