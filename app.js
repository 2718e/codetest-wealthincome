const express = require('express');
const income = require('./routes/income');
const MockRepository = require('./repository/mockrepository')
const MetricCalculator = require('./calculation/metriccalculator')

const app = express();
const repository = new MockRepository()
const calculator = new MetricCalculator(repository)

// feel like there should be the possiblility of having more than one app run even if the exercise is only one app.
// for this reason the required methods are implemented as an express router, and the router is mounted on the root of the app.
const incomeRoutes = income(repository, calculator)
app.use('/', incomeRoutes);

app.listen(3000, () => console.log("app listening on port 3000"));