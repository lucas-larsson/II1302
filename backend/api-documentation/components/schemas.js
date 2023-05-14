module.exports = {
  ErrorCode: {
    type: 'object',
    additionalProperties: false,
    required: ['statusCode', 'error', 'method', 'path', 'message'],
    properties: {
      statusCode: {
        type: 'integer',
        example: 400,
      },
      error: {
        type: 'string',
        example: 'Invalid value',
      },
      method: {
        type: 'string',
        example: 'GET',
      },
      path: {
        type: 'string',
        example: '/api/applicants',
      },
      message: {
        type: 'string',
        example: 'Invalid value',
      },
    },
  },
  ListOfErrorCodes: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/ErrorCode',
    },
  },
  PumpMode: {
    type: 'string',
    enum: ['auto', 'manual'],
    example: 'auto',
  },
  PersonalNumber: {
    type: 'string',
    pattern: '^[0-9]{8}-[0-9]{4}$',
    example: '19900101-1234',
  },
  GenericId: {
    type: 'integer',
    example: 1,
    minimum: 1,
  },
  Email: {
    type: 'string',
    format: 'email',
    example: 'lulars@kth.se',
  },
  Uuid: {
    type: 'string',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  },
  DateTime: {
    type: 'string',
    format: 'date-time',
    example: '2017-07-21T17:32:28Z',
  },
  User: {
    type: 'object',
    additionalProperties: false,
    required: ['name', 'person_id', 'surname', 'email', 'password'],
    properties: {
      name: {
        type: 'string',
        example: 'John',
        minimum: 1,
        maximum: 255,
      },
      surname: {
        type: 'string',
        example: 'Doe',
        minimum: 1,
        maximum: 255,
      },
      email: {
        $ref: '#/components/schemas/Email',
      },
      password: {
        type: 'string',
        example: 'password',
        minimum: 1,
        maximum: 255,
      },
      person_id: {
        $ref: '#/components/schemas/GenericId',
      },
    },
  },
  SignUpData: {
    type: 'object',
    additionalProperties: false,
    required: ['name', 'surname', 'email', 'password'],
    properties: {
      name: {
        type: 'string',
        example: 'John',
        minimum: 1,
        maximum: 255,
      },
      surname: {
        type: 'string',
        example: 'Doe',
        minimum: 1,
        maximum: 255,
      },
      email: {
        $ref: '#/components/schemas/Email',
      },
      password: {
        type: 'string',
        example: 'password',
        minimum: 1,
        maximum: 255,
      },
    },
  },
  LoginData: {
    type: 'object',
    additionalProperties: false,
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        example: 'lulars@kth.se',
        minimum: 1,
        maximum: 255,
      },
      password: {
        type: 'string',
        example: 'password',
        minimum: 1,
        maximum: 255,
      },
    },
  },
  Session: {
    type: 'object',
    additionalProperties: false,
    required: ['session_id', 'expiration_date'],
    properties: {
      session_id: {
        $ref: '#/components/schemas/Uuid',
      },
      person_id: {
        $ref: '#/components/schemas/GenericId',
      },
      expiration_date: {
        $ref: '#/components/schemas/DateTime',
      },
    },
  },
  UserAndSession: {
    type: 'object',
    additionalProperties: false,
    required: ['user', 'session'],
    properties: {
      user: {
        $ref: '#/components/schemas/User',
      },
      session: {
        $ref: '#/components/schemas/Session',
      },
    },
  },
  SessionsValidation: {
    type: 'object',
    additionalProperties: false,
    required: ['session_id', 'person_id'],
    properties: {
      session_id: {
        $ref: '#/components/schemas/Uuid',
      },
      person_id: {
        $ref: '#/components/schemas/GenericId',
      },
    },
  },
  SessionsValidationResponse: {
    type: 'object',
    additionalProperties: false,
    required: ['session'],
    properties: {
      session: {
        type: 'object',
        additionalProperties: false,
        required: ['session_id', 'person_id', 'expiration_date'],
        properties: {
          session_id: {
            $ref: '#/components/schemas/Uuid',
          },
          person_id: {
            $ref: '#/components/schemas/GenericId',
          },
          expiration_date: {
            $ref: '#/components/schemas/DateTime',
          },
        },
      },
      role: {
        type: 'object',
        additionalProperties: false,
        required: ['role_id'],
        properties: {
          role_id: {
            $ref: '#/components/schemas/GenericId',
          },
        },
      },
    },
  },
  UpdatePlantData: {
    type: 'object',
    additionalProperties: false,
    required: ['moisture_level', 'last_watered', 'iot_device_id', 'iot_device_password'],
    properties: {
      moisture_level: {
        type: 'integer',
        example: 1,
        minimum: 1,
      },
      last_watered: {
        $ref: '#/components/schemas/DateTime',
      },
      iot_device_id: {
        $ref: '#/components/schemas/GenericId',
      },
      iot_device_password: {
        type: 'string',
        example: 'password',
        minimum: 1,
        maximum: 255,
      },
    },
  },
  PlantData: {
    type: 'object',
    additionalProperties: false,
    required: ['iot_device_id', 'moisture_level', 'last_watered', 'person_id'],
    properties: {
      iot_device_id: {
        $ref: '#/components/schemas/GenericId',
      },
      moisture_level: {
        type: 'integer',
        example: 1,
        minimum: 1,
      },
      last_watered: {
        $ref: '#/components/schemas/DateTime',
      },
      person_id: {
        $ref: '#/components/schemas/GenericId',
      },
    },
  },
  IOTDeviceSettings: {
    type: 'object',
    additionalProperties: false,
    required: ['automatic_mode', 'water_threshold'],
    properties: {
      automatic_mode: {
        type: 'boolean',
        example: true,
      },
      water_threshold: {
        type: 'integer',
        example: 1,
        minimum: 1,
      },
    },
  },
  PlantDataResponse: {
    type: 'object',
    additionalProperties: false,
    required: ['iot_device_id', 'moisture_level', 'last_watered', 'person_id'],
    properties: {
      iot_device_id: {
        $ref: '#/components/schemas/GenericId',
      },
      moisture_level: {
        type: 'integer',
        example: 1,
        minimum: 1,
      },
      last_watered: {
        $ref: '#/components/schemas/DateTime',
      },
      person_id: {
        $ref: '#/components/schemas/GenericId',
      },
      iot_settings: {
        $ref: '#/components/schemas/IOTDeviceSettings',
      },
    },
  },
  WaterCommand: {
    type: 'object',
    additionalProperties: false,
    required: ['water_now', 'time', 'iot_device_id', 'person_id', 'session_id'],
    properties: {
      water_now: {
        type: 'boolean',
      },
      time: {
        $ref: '#/components/schemas/DateTime',
      },
      iot_device_id: {
        $ref: '#/components/schemas/GenericId',
      },
      person_id: {
        $ref: '#/components/schemas/GenericId',
      },
      session_id: {
        $ref: '#/components/schemas/Uuid',
      },
    },
  },
  PlantWatered: {
    type: 'object',
    additionalProperties: false,
    required: ['iot_device_id', 'person_id', 'time'],
    properties: {
      iot_device_id: {
        $ref: '#/components/schemas/GenericId',
      },
      person_id: {
        $ref: '#/components/schemas/GenericId',
      },
      time: {
        $ref: '#/components/schemas/DateTime',
      },
    },
  },
  Plant: {
    type: 'object',
    additionalProperties: false,
    required: ['name', 'description', 'watering_interval', 'last_watered'],
    properties: {
      name: {
        type: 'string',
        example: 'kaktus',
        minimum: 1,
        maximum: 255,
      },
      description: {
        type: 'string',
        example: 'en kaktus',
        minimum: 1,
        maximum: 255,
      },
      watering_interval: {
        type: 'integer',
        example: 7,
        minimum: 1,
        maximum: 255,
      },
      last_watered: {
        $ref: '#/components/schemas/DateTime',
      },
      plant_id: {
        $ref: '#/components/schemas/GenericId',
      },
      person_id: {
        $ref: '#/components/schemas/GenericId',
      },
    },
  },
  PlantDateInformation: {
    type: 'object',
    additionalProperties: false,
    required: ['session_id', 'iot_device_id', 'end_date', 'start_date', 'person_id'],
    properties: {
      session_id: {
        $ref: '#/components/schemas/Uuid',
      },
      iot_device_id: {
        $ref: '#/components/schemas/GenericId',
      },
      end_date: {
        $ref: '#/components/schemas/DateTime',
      },
      start_date: {
        $ref: '#/components/schemas/DateTime',
      },
      person_id: {
        $ref: '#/components/schemas/GenericId',
      },
    },
  },
  PlantSettings: {
    type: 'object',
    additionalProperties: false,
    required: ['iot_device_id', 'moist_threshold', 'automatic_mode', 'session_id', 'person_id'],
    properties: {
      person_id: {
        $ref: '#/components/schemas/GenericId',
      },
      iot_device_id: {
        $ref: '#/components/schemas/GenericId',
      },
      moist_threshold: {
        type: 'integer',
      },
      automatic_mode: {
        type: 'boolean',
      },
      session_id: {
        $ref: '#/components/schemas/Uuid',
      },
    },
  },
  PlantSettingsResponse: {
    type: 'object',
    additionalProperties: false,
    required: ['iot_device_id', 'moist_threshold', 'automatic_mode', 'person_id'],
    properties: {
      person_id: {
        $ref: '#/components/schemas/GenericId',
      },
      iot_device_id: {
        $ref: '#/components/schemas/GenericId',
      },
      moist_threshold: {
        type: 'integer',
      },
      automatic_mode: {
        type: 'boolean',
      },
    },
  },
};
