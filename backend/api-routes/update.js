const plants = require('../middlewares/plants'),
  responseMiddleware = require('../middlewares/response');

module.exports = {
  post: [
    plants.initLocals,
    plants.authorizeIOT,
    plants.updatePlantData,
    responseMiddleware.sendResponse(200, 'outData'),
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
          $ref: '#/components/schemas/UpdatePlantData',
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successfully updated plant data',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Plant',
          },
        },
      },
    },
  },
};
