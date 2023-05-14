const { errorCodes } = require('../errorcodes');
const { plantsDAO } = require('./plantsDAO');
const { firebase } = require('../../utils/firebase');

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

const iotExistsByDeviceId = async (req, res, next) => {
  const { plant_id } = req.params;
  const iotDeviceExist = await plantsDAO.iotExistsByDeviceId(plant_id);
  if (iotDeviceExist) {
    res.locals.device_id = plant_id;
    return next();
  } else {
    return next(
      errorCodes.notFound({
        req,
        message: `not found`,
      })
    );
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
  const { iot_device_id } = req.body;
  try {
    await firebase.waterPlant(iot_device_id);
    res.locals.outData = req.body;
    next();
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

const getPlantData = async (req, res, next) => {
  const device_id = res.locals.device_id;
  try {
    res.locals.outData = await plantsDAO.getPlantData(device_id);
    return next();
  } catch (err) {
    console.error('Error in getPlantData: ', err.message);
    return next(
      errorCodes.serverError({
        req,
        message: 'Could not get plant data',
      })
    );
  }
};

const getPlantDataWithDate = async (req, res, next) => {
  const { start_date, end_date, iot_device_id } = req.body;
  try {
    res.locals.outData = await plantsDAO.getPlantDataWithDate(iot_device_id, start_date, end_date);
    return next();
  } catch (err) {
    console.error('Error in getPlantDataWithDate: ', err.message);
    return next(
      errorCodes.serverError({
        req,
        message: 'Could not get plant data',
      })
    );
  }
};

module.exports = {
  initLocals,
  iotExists,
  updatePlantData,
  waterPlant,
  iotExistsByDeviceId,
  getPlantData,
  getPlantDataWithDate,
};
