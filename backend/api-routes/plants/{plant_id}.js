const plants = require('../../middlewares/plants'),
  responseMiddleware = require('../../middlewares/response');

module.exports = {
  get: [
    plants.initLocals,
    plants.iotExistsByDeviceId,
    plants.getPlantData,
    plants.getPlantSettings,
    responseMiddleware.sendResponse(200, 'outData'),
  ],
};

module.exports.get.apiDoc = {
  tags: ['plants'],
  responses: {
    200: {
      description: 'Successfully retrieved plant data',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/PlantDataResponse',
          },
        },
      },
    },
  },

  parameters: [
    {
      $ref: '#/components/parameters/plantId',
    },
    {
      $ref: '#/components/parameters/sessionId',
    },
  ],
};
