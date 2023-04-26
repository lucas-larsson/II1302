const { errorCodes } = require('../errorcodes');
const { plantsDAO } = require('./plantsDAO');
const { postRequest } = require('../request');

const initLocals = (req, res, next) => {
  res.locals = {};
  next();
};

const iotExists = async (req, res, next) => {
  const { iot_device_id, iot_device_password } = req.body;
  if (iot_device_id && iot_device_password) {
    const iot_device = await plantsDAO.iotExists(iot_device_id, iot_device_password);
    if (!!iot_device) {
      res.locals.iot_device = iot_device;
      return next();
    } else {
      return next(
        errorCodes.unauthorized({
          req,
          message: `Unauthorized`,
        })
      );
    }
  }
};

const updatePlantData = async (req, res, next) => {
  const { iot_device_id, moisture_level, last_watered } = req.body;
  const { id } = res.locals.iot_device;
  try {
    res.locals.outData = await plantsDAO.updatePlantData(
      iot_device_id,
      moisture_level,
      last_watered,
      id
    );
    console.log(`plant data has been updated`);
    return next();
  } catch (err) {
    console.error('Error in updatePlantData: ', err.message);
    return next(
      errorCodes.serverError({
        req,
        message: 'Could not update plant data',
      })
    );
  }
};

const waterPlant = async (req, res, next) => {
  const { device_id } = res.locals.plant;
  try {
    const response = await postRequest(true);
    if (response === 'success') {
      await plantsDAO.waterPlant(device_id);
      next();
    }
  } catch (err) {
    console.error('Error in waterPlant: ', err.message);
    return next(
      errorCodes.serverError({
        req,
        message: 'Could not water plant',
      })
    );
  }
};

module.exports = {
  initLocals,
  iotExists,
  updatePlantData,
  waterPlant,
};
