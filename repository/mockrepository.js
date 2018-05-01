/**
* This section of the code handles querying data. The intent is to use a "repository pattern"
* to abstract the store.
*
* this particular implementation is a mock that just stores the database as an array in memory*
*/
const _ = require('lodash')

class InMemoryRepository {

    constructor() {
        let store = [];
        const selectPeriod = (start, end) => {
            return _.range(start, end + 1)
                .filter(year => !_.isUndefined(store[year]))
                .map(year => [year].concat(store[year]));
        };
        this.setData = (rows) => {
            store = []
            rows.forEach(row => store[row[0]] = row.slice(1));
        };
        this.getTop10 = (start, end) => {
            const data = selectPeriod(start,end);
            const result = {
                period: data.map(row => row[0]),
                income: data.map(row => row[1]),
                wealth: data.map(row => row[2])
            }
            return result;
        };
        this.getBottom50 = (start,end) => {
            const data = selectPeriod(start,end);
            const result = {
                period: data.map(row => row[0]),
                income: data.map(row => row[3]),
                wealth: data.map(row => row[4])
            }
            return result;
        };
        this.getIncome = (start,end) => {
            const data = selectPeriod(start,end);
            const result = {
                period: data.map(row => row[0]),
                top10: data.map(row => row[1]),
                bottom50: data.map(row => row[3])
            }
            return result;
        };
        this.getWealth = (start,end) => {
            const data = selectPeriod(start,end);
            const result = {
                period: data.map(row => row[0]),
                top10: data.map(row => row[2]),
                bottom50: data.map(row => row[4])
            }
            return result;
        };
    }
}

module.exports = InMemoryRepository