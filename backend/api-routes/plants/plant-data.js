const plants = require('../../middlewares/plants'),
  responseMiddleware = require('../../middlewares/response'),
  auth = require('../../middlewares/auth');
module.exports = {
  post: [
    plants.initLocals,
    auth.authorizeSession,
    plants.getPlantDataWithDate,
    responseMiddleware.sendResponse(201, 'outData'),
  ],
};

module.exports.post.apiDoc = {
  tags: ['plants'],
  requestBody: {
    required: true,
    description: 'updates plant data',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/PlantDateInformation',
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Successfully updated plant data',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/PlantData',
          },
        },
      },
    },
  },
};
