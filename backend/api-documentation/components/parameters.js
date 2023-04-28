module.exports = {
  personId: {
    name: 'person_id',
    in: 'header',
    description: 'Contains the person_id of the user',
    required: true,
    schema: {
      $ref: '#/components/schemas/GenericId',
    },
  },
  sessionId: {
    name: 'session_id',
    in: 'header',
    description: 'Contains the session_id of the user',
    required: true,
    schema: {
      $ref: '#/components/schemas/Uuid',
    },
  },
  plantId: {
    name: 'plant_id',
    in: 'path',
    description: 'Contains the plant_id of the plant',
    required: true,
    schema: {
      $ref: '#/components/schemas/GenericId',
    },
    example: '1',
  },
};
