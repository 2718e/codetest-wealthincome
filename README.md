# Wealth and Income Rest API

This project exists as an implementation of a coding challenge, the purpose of which was to create a REST API in node.js.

This API provides functions for uploading data about income distributions and computing some statistics about them.

## Roadmap

Remaining tasks

- connect to an actual database instead of a mock, possibly change database abstraction to be asynchronous.
- implement predicitors
- more error checking e.g. is uploaded file correct format
- add unit tests

## Comments

### Predictors

While this part is not complete yet, I think the best way to make a predictor would be to use a (very small) RNN - however this might be limited by only having one dataset (risk of overfitting).

### Database choice

Given the tiny size of the data I think the most appropriate database choice is not to use one at all and store all the data in process memory, and persist to a file to handle restarts. 

However, for the sake of the exercise could use either SQLite ( as this is a traditional choice for database as a file format) or mongodb.

### Design choices

Trying to structure the software around repository, dependency injection / IOC patterns. This is slightly limited in effectiveness by javascript not supporting interfaces.

The repository is responsible for formatting the results of get requests so as to not limit the ability of any database engine to handle as much of the result formatting as the database engine can. 

Similarly, the api is not aware of how the predictor and calculator get the data they depend on - this is again to allow the possibility of implementing arbitrary amounts of the prediction and calculate functions in the database engine rather than in code.

Because the data being predicted is all somewhat interrelated the interface to the predictor should be such that the a prediction is made for the wealth and income of both groups at the same time, then only the desired data is returned.