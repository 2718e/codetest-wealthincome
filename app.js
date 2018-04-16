const income = require('./areas/income');
const express = require('express');

const app = express();

// feel like there should be the possiblility of having more than one app run even if the exercise is only one app.
// for this reason the required methods are implemented as an express router, and the router is mounted on the root of the app.
app.use('/', income);
app.listen(3000, () => console.log("app listening on port 3000"));