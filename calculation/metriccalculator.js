/**
 * This section of the code handles calculation of metrics e.g. inequality, saving capacity
 * from the raw data
 */
const _ = require('lodash')

class MetricCalculator {

    // Constructor, requires a data access object to be provided as the repository parameter.
    constructor(repository) {
        this.sigmoid = (x) => 1 / (1 + Math.exp(-x));
        this.incomeInequality = (init, end) => {
            return repository.getIncome(init, end).then(data => {
                const inequality = _.range(0, data.period.length).map(index => data.bottom50[index] / data.top10[index]);
                return { period: data.period, factor: inequality };
            });
        };
        this.wealthInequality = (init, end) => {
            return repository.getWealth(init, end).then(data => {
                const inequality = _.range(0, data.period.length).map(index => data.bottom50[index] / data.top10[index]);
                return { period: data.period, factor: inequality };
            })
        };
        // gets the ratio of (share of) wealth in one year to the previous year
        this.savingCapacityRaw = (init, end, group) => {
            let dataPromise = null;
            if (group === 10) {
                dataPromise = repository.getTop10(init, end);
            } else if (group === 50) {
                dataPromise = repository.getBottom50(init, end);
            } else {
                throw "Invalid group"
            }
            return dataPromise.then(data => {
                let period = [], savingCapacity = [];
                if (!_.isEmpty(data.period)) {
                    let prevYear = data.period[0];
                    let prevWealth = data.wealth[0]
                    for (let i = 1; i < data.period.length; i++) {
                        let year = data.period[i];
                        let wealth = data.wealth[i];
                        // only calculate savings capacity when we have all data for 2 consecutive years
                        if (prevYear && prevWealth && year && wealth && (year - prevYear == 1)) {
                            period.push([prevYear, year]);
                            savingCapacity.push(wealth / prevWealth);
                        }
                        prevYear = year;
                        prevWealth = wealth;
                    }
                }
                return {
                    Group: group,
                    period: period,
                    savingcapacity: savingCapacity
                };
            });
        };

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
            });
        };
    }
}

module.exports = MetricCalculator