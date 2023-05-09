const plants = require('../../middlewares/plants'),
  responseMiddleware = require('../../middlewares/response');

module.exports = {
  post: [
    plants.initLocals,
    plants.iotExistsByDeviceId,
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
          $ref: '#/components/schemas/UpdatePlantData',
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
