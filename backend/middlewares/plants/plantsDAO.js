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

// TODO: Maybe remove
const waterPlant = async function (deviceData) {
  return await updatePlantData(deviceData.iot_device_id, deviceData.time, deviceData.person_id);
};

const iotExistsByDeviceId = async (device_id) => {
  console.log('device_id: ', device_id);
  const query = `SELECT * FROM iot_auth WHERE device_id = $1`;
  try {
    const result = await sendQuery(query, [device_id]);
    console.log('result.rows[0].length: ', result.rows.length);
    return !!result.rows.length;
  } catch (err) {
    throw err;
  }
};

const getPlantData = async (device_id) => {
  const query = `SELECT * FROM plant_data WHERE device_id = $1 ORDER BY last_watered DESC LIMIT 1`;
  try {
    return (await sendQuery(query, [device_id])).rows[0];
  } catch (err) {
    throw err;
  }
};

const getPlantDataWithDate = async (device_id, start_date, end_date) => {
  const query = `SELECT * FROM plant_data WHERE device_id = $1 AND last_watered BETWEEN $2 AND $3 ORDER BY last_watered DESC`;
  try {
    return (await sendQuery(query, [device_id, start_date, end_date])).rows;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  plantsDAO: {
    iotExists,
    updatePlantData,
    waterPlant,
    iotExistsByDeviceId,
    getPlantData,
    getPlantDataWithDate,
  },
};
