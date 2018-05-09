# Wealth and Income Rest API

This project exists as an implementation of a coding challenge, the purpose of which was to create a REST API in node.js.

This API provides functions for uploading data about income distributions and computing some statistics about them.

## Installation

This solution requires a mongodb connection to be specified in config. Mongo db must be installed separately (either on the local machine or a separate machine)

Other than that, running npm install should install all required packages

## Roadmap

Possible improvements

- more error checking e.g. is uploaded file correct format.
- add proper unit tests (i.e. that can be run with npm test) rather than just the Postman collection used for dev testing.
- linting and code formatting.

## Comments

### Known issues

The saved collection of Postman calls used for dev testing didn't export the path to the test data file

### Predictors

In order to implement something quickly prediction was done by taking a weighted average of the 1st derivative and using that to predict future values. However I feel this could be done better given more time.

What I would have ideally liked to do would be to 

- get additional datasets from public sources
- use these to train a recurrent neural net
- import the trained model into the application and use it for prediction

This approach however was constrained both by time and by it being unclear if tensorflow.js worked under node.js or if it was browser only.

Also, in this approach I would have wanted to use all values (i.e. both the wealth and income of the top 10 and bottom 50) as an input vector rather than predict one sequece in isolation (as we would expect e.g. income ratio in one year to affect change in wealth in the next.)

### Database choice

Given the tiny size of the dataset I'm not entirely sure a database makes sense at all. (e.g. Persisting the csv file to disk and storing in memory would be a suitable choice in this instance)

However, since the exercise specified to use a database, went for mongodb as this works very well with nodejs.

### Design choices

Trying to structure the software around repository, dependency injection / IOC patterns. This is slightly limited in effectiveness by javascript not supporting interfaces.

The repository is responsible for formatting the results of get requests so as to not limit the ability of any database engine to handle as much of the result formatting as the database engine can. 

Similarly, the api is not aware of how the predictor and calculator get the data they depend on - this is again to allow the possibility of implementing arbitrary amounts of the prediction and calculate functions in the database engine rather than in code. E.g. currently can pass an abstract repository to the MetricCalculator class, but it would be equally possible to implement a MetricCalculator that depends on a specific database choice later if that would be more performant.