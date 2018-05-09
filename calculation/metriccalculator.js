/**
 * This section of the code handles calculation of metrics e.g. inequality, saving capacity
 * from the raw data
 */
const _ = require('lodash')
const helpers = require('./calculationhelpers')

class MetricCalculator {
  // Constructor, requires a data access object to be provided as the repository parameter.
  constructor (repository) {
    this.sigmoid = (x) => 1 / (1 + Math.exp(-x))
    this.incomeInequality = (init, end) => {
      return repository.getIncome(init, end).then(data => {
        const inequality = _.range(0, data.period.length).map(index => data.bottom50[index] / data.top10[index])
        return { period: data.period, factor: inequality }
      })
    }
    this.wealthInequality = (init, end) => {
      return repository.getWealth(init, end).then(data => {
        const inequality = _.range(0, data.period.length).map(index => data.bottom50[index] / data.top10[index])
        return { period: data.period, factor: inequality }
      })
    }
    // gets the ratio of (share of) wealth in one year to the previous year
    this.savingCapacityRaw = (init, end, group) => {
      let dataPromise = null
      if (group === 10) {
        dataPromise = repository.getTop10(init, end)
      } else if (group === 50) {
        dataPromise = repository.getBottom50(init, end)
      } else {
        throw new Error('Invalid group')
      }
      return dataPromise.then(data => {
        const results = helpers.calculateForTimespan(data.period, data.wealth, (wealth, prevWealth) => wealth / prevWealth)
        return {
          Group: group,
          period: results.period,
          savingcapacity: results.result
        }
      })
    }

    /** gets the ratio of (share of) wealth in one year to the previous year, then maps the result into a
        * [0,1] range using a sigmoid function
        * the raw ratio is shifted by -1 so that no change in wealth corresponds to the middle value of the sigmoid.
        *
        * From an exploratory analysis of raw saving capacity it is a slight edge case where the share of relative wealth increases
        * or decreases by more than 50% - which corresponds to range in the shifted ratio of -0.5 to +0.5 - to map this onto
        * the -1 to 1 range of a standard sigmoid, the raw saving capacity is doubled after shifting.
        */
    this.savingCapacityNormalized = (init, end, group) => {
      return this.savingCapacityRaw(init, end, group).then(rawResult => {
        return {
          Group: rawResult.Group,
          period: rawResult.period,
          savingcapacity: rawResult.savingcapacity.map(x => this.sigmoid(2 * (x - 1)))
        }
      })
    }
  }
}

module.exports = MetricCalculator
