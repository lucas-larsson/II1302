const { sendQuery } = require('../../utils/dbIntegration/dbConfig');

const iotExists = async function (device_id, device_password) {
  console.log('device_id: ', device_id, 'device_password: ', device_password);
  const query = `SELECT * FROM iot_auth WHERE device_id = $1 AND device_password = $2`;
  try {
    const result = await sendQuery(query, [device_id, device_password]);
    console.log('result.rows: ', result.rows);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const updatePlantData = async function (device_id, moisture_level, last_watered, user_id) {
  const query = `INSERT INTO plant_data (device_id, moisture_level, last_watered, user_id) VALUES ($1, $2, $3, $4) RETURNING *`;
  try {
    const result = await sendQuery(query, [device_id, moisture_level, last_watered, user_id]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const waterPlant = async function (device_id) {
  // temp solution
  // await updatePlantData(device_id);
  return true;
};

module.exports = {
  plantsDAO: {
    iotExists,
    updatePlantData,
    waterPlant,
  },
};
