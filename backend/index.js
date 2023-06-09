process.env.TZ = 'Europe/Stockholm';
global.__basedir = __dirname;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const app = express();
const db = require('./utils/dbIntegration/dbConfig');
const { firebase } = require('./utils/firebase');

db.connect().then((r) => console.log('postgres db connected'));
firebase.connect().then((r) => console.log('firebase connected'));

const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

routes.init(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
  console.log('******* backend started *******');
});
