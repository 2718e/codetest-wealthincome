# Wealth and Income Rest API

This project exists as an implementation of a coding challenge, the purpose of which was to create a REST API in node.js.

This API provides functions for uploading data about income distributions and computing some statistics about them.

## Installation

This solution requires a mongodb connection to be specified in config. Mongo db must be installed separately (either on the local machine or a separate machine)

Other than that, running npm install should install all required packages

## Roadmap

Remaining tasks

- implement predicitors
- more error checking e.g. is uploaded file correct format
- add unit tests

## Comments

### Predictors

While this part is not complete yet, I think the best way to make a predictor would be to use a (very small) RNN - however this might be limited by only having one dataset (risk of overfitting).

Another way might be to use a function fitter or moving average - which could be implemented quicker but in this case would be even less confident of the results actually being correct.

### Database choice

Given the tiny size of the dataset I'm not entirely sure a database makes sense at all. (e.g. Persisting the csv file to disk and storing in memory would be a suitable choice in this instance)

However, since the exercise specified to use a database, went for mongodb as this works very well with nodejs.

### Design choices

Trying to structure the software around repository, dependency injection / IOC patterns. This is slightly limited in effectiveness by javascript not supporting interfaces.

The repository is responsible for formatting the results of get requests so as to not limit the ability of any database engine to handle as much of the result formatting as the database engine can. 

Similarly, the api is not aware of how the predictor and calculator get the data they depend on - this is again to allow the possibility of implementing arbitrary amounts of the prediction and calculate functions in the database engine rather than in code. E.g. currently can pass an abstract repository to the MetricCalculator class, but it would be equally possible to implement a MetricCalculator that depends on a specific database choice later if that would be more performant.