const axios = require('axios');

baseURL = 'http://localhost:3000/api/v1'; // change this to process.env.iotDeviceUrl;

const postRequest = async (data) => {
  try {
    const response = await axios.post(baseURL, data);
    return response.statusText;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  postRequest,
};
