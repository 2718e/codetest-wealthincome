const express = require('express');
const income = require('./routes/income');
const MongodbRepository = require('./repository/mongodbRepository')
const MetricCalculator = require('./calculation/metriccalculator')
const config = require('config');
const MongoClient = require('mongodb').MongoClient;

const port = config.get('appSettings.port');
const connectionString = config.get('appSettings.database.url')
const dbName = config.get('appSettings.database.dbName')

MongoClient.connect(connectionString, (err, client) => {
    if (err === null) {
        const db = client.db(dbName);
        const app = express();
        const repository = new MongodbRepository(db)
        const calculator = new MetricCalculator(repository)

        // feel like there should be the possiblility of having more than one app run even if the exercise is only one app.
        // for this reason the required methods are implemented as an express router, and the router is mounted on the root of the app.
        const incomeRoutes = income(repository, calculator)
        app.use('/', incomeRoutes);

        const server = app.listen(port, () => {
            console.log("app listening on port " + port);
        });
    }
});