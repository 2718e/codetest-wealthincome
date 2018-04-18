/**
 * This section of the code handles calculation of metrics e.g. inequality, saving capacity
 * from the raw data
 */
const _ = require('lodash')

class MetricCalculator {

    // Constructor, requires a data access object to be provided (dependency injection pattern).
    constructor(repository){
        this.incomeInequality = (init, end) => {
            const data = repository.getIncome(init,end);
            const inequality = _.range(0, data.period.length).map(index => data.bottom50[index]/data.top10[index]);
            return { period: data.period, factor: inequality };
        };
        this.wealthInequality = (init, end) => {
            const data = repository.getWealth(init,end);
            const inequality = _.range(0, data.period.length).map(index => data.bottom50[index]/data.top10[index]);
            return { period: data.period, factor: inequality };
        };
    }
}

module.exports = MetricCalculator