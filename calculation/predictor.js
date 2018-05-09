
const _ = require('lodash')
const helpers = require('./calculationhelpers')

/**
 * Attempts to predict wealth and income by taking a weighted average of historical values of the first derivative
 */
class MovingAverageDPredictor {
  /**
     *
     * @param {the data access object} repository
     * @param {a value between 0 and 1 indicating how strongly the most recent value is weighted. Or alternately how fast the weight of older values decays} decay
     * @param {how many years to look back when getting averages for the prediction} lookback
     * @param {what year to generate predictions from} predictFrom
     */
  constructor (repository, decay, lookback, predictFrom) {
    const initialYear = predictFrom - lookback

    const predictSequence = (nYears, period, values) => {
      const firstDerivative = helpers.calculateForTimespan(period, values, (value, prev) => value - prev)
      let movingAverageOfDerivative = 0
      const updateAverage = (newValue) => { movingAverageOfDerivative = movingAverageOfDerivative * (1 - decay) + decay * newValue }
      let year
      let index = 0
      for (year = initialYear; year < predictFrom; year++) {
        // if we had all the data to compute the change between this year and the next, update the moving average.
        // otherwise by default assume there is no change (i.e. 1st derivative = 0).
        if (year === firstDerivative.period[index][0]) {
          updateAverage(firstDerivative.result[index] || 0)
          index++
        } else {
          updateAverage(0)
        }
      }
      let prediction = []
      let currentPrediction = _.findLast(values, x => x) // predict based of the most recent non null value
      for (let i = 1; i <= nYears; i++) {
        currentPrediction += movingAverageOfDerivative
        prediction.push(currentPrediction)
        updateAverage(0)
      }
      return prediction
    }

    this.predictWealth = (group, nYears) =>
      repository.getWealth(initialYear, predictFrom).then(data => {
        const prediction = predictSequence(nYears, data.period, group === 10 ? data.top10 : data.bottom50)
        return {
          Group: group,
          prediction: prediction
        }
      })

    this.predictIncome = (group, nYears) =>
      repository.getIncome(initialYear, predictFrom).then(data => {
        const prediction = predictSequence(nYears, data.period, group === 10 ? data.top10 : data.bottom50)
        return {
          Group: group,
          prediction: prediction
        }
      })
  }
}

module.exports = { MovingAverageDPredictor }
