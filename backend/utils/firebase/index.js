const admin = require('firebase-admin');

const serviceAccount = require('../../serviceAccountKey.json');
const RTDB_URL = process.env.RTDB_URL;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: RTDB_URL,
});

const db = admin.database();
const connect = async () => {
  try {
    await db.ref('.info/connected').once('value');
    console.log('Connected to the Realtime Database');
  } catch (error) {
    console.log('Not connected to the Realtime Database');
  }
};

// Write data to the Realtime Database
// the path is plants/plant_id. The data is the plant object
const writeData = async (path, data) => {
  try {
    await db.ref(path).set(data);
    console.log('Data written to the Realtime Database');
  } catch (error) {
    console.error('Error writing to the Realtime Database:', error);
  }
};

// Read data from the Realtime Database
// the path is plants/plant_id. The data is the plant object
const readData = async (path) => {
  try {
    const snapshot = await db.ref(path).once('value');
    console.log('Data read from the Realtime Database');
    return snapshot.val();
  } catch (error) {
    console.error('Error reading from the Realtime Database:', error);
  }
};

// Update data in the Realtime Database
// the path is plants/plant_id. The data is the plant object
const updateData = async (path, data) => {
  try {
    await db.ref(path).update(data);
    console.log('Data updated in the Realtime Database');
  } catch (error) {
    console.error('Error updating data in the Realtime Database:', error);
  }
};

const waterPlant = async (plant_id) => {
  return await updateData(`plants/${plant_id}`, { shower: true });
};

const setPlantSettings = async (plant_id, settings) => {
  return await updateData(`plants/${plant_id}`, { settings: settings });
};

const getPlantSettings = async (plant_id) => {
  return await readData(`plants/${plant_id}/settings`);
};

module.exports = {
  firebase: {
    connect,
    waterPlant,
    setPlantSettings,
    getPlantSettings,
  },
};
