const { errorCodes } = require('../errorCodes');
const { plantsDAO } = require('./plantsDAO');
const { postRequest } = require('../request');

const initLocals = (req, res, next) => {
  res.locals = {};
  next();
};

const authorizeIOT = async (req, res, next) => {
  const { iothub_device_id, iothub_device_password } = req.body;
  if (iothub_device_id && iothub_device_password) {
    const iotExists = await plantsDAO.iotExists(iothub_device_id, iothub_device_password);
    if (iotExists) {
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
  console.log(`plant data has been updated`);
  // const { iothub_device_id  } = req.body;
  res.locals.plant = await plantsDAO.updatePlantData(iothub_device_id);
  next();
};

const waterPlant = async (req, res, next) => {
  console.log(`plant has been watered`);
  try {
    const response = await postRequest(true);
    if (response === 'success') {
      await plantsDAO.waterPlant();
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
  authorizeIOT,
  updatePlantData,
  waterPlant,
};
