const { sendQuery } = require('../../utils/dbIntegration/dbConfig');

const iotExists = async function (device_id, device_password) {
  const query = `SELECT * FROM iot_auth WHERE device_id = $1 AND device_password = $2`;
  try {
    const result = await sendQuery(query, [device_id, device_password]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const updatePlantData = async function (device_id) {
  const query = `UPDATE plant SET last_watered = NOW() WHERE device_id = $1`;
  try {
    const result = await sendQuery(query, [device_id]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const waterPlant = async function (device_id) {
  // temp solution
  await updatePlantData(device_id);
};

module.exports = {
  iotExists,
  updatePlantData,
  waterPlant,
};
