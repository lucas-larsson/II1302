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
    const plant = await plantsDAO.iotExists(iothub_device_id, iothub_device_password);
    if (!!plant) {
      res.locals.plant = plant;
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
  const { device_id } = res.locals.plant;
  try {
    res.locals.plant = await plantsDAO.updatePlantData(device_id);
    console.log(`plant data has been updated`);
    next();
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
  authorizeIOT,
  updatePlantData,
  waterPlant,
};
