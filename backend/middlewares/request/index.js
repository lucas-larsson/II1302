const axios = require('axios');

const baseURL = 'http://localhost:3000/api/v1'; // change this to process.env.iotDeviceUrl;
const testURL = 'https://ii1302-backend-wdsryxs5fa-lz.a.run.app/api/errorcodes/';

(async () => {
  try {
    const response = await axios.get(testURL);
    console.log(JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error(err);
  }
})();
const postRequest = async (waterNow) => {
  const body = {
    water: waterNow,
  };
  try {
    const response = await axios.post(baseURL, body);
    return response.statusText;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  postRequest,
};
