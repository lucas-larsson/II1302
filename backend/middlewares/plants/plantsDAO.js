const { sendQuery } = require('../../utils/dbIntegration/dbConfig');

const iotExists = async function (iothub_device_id, iothub_device_password) {
  const query = `SELECT * FROM iot_auth WHERE iothub_device_id = $1 AND iothub_device_password = $2`;
  try {
    const result = await sendQuery(query, [iothub_device_id, iothub_device_password]);
    return !!result.rows[0];
  } catch (err) {
    throw err;
  }
};

const updatePlantData = async function (iothub_device_id) {
  const query = `UPDATE plant SET last_watered = NOW() WHERE iothub_device_id = $1`;
  try {
    const result = await sendQuery(query, [iothub_device_id]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const waterPlant = async function (iothub_device_id) {
  const query = `UPDATE plant SET last_watered = NOW() WHERE iothub_device_id = $1`;
  try {
    const result = await sendQuery(query, [iothub_device_id]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  iotExists,
  updatePlantData,
  waterPlant,
};
