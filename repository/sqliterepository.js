/**
* This section of the code handles querying data. The intent is to use a "repository pattern"
* to abstract the store.
*
* this particular implementation uses a single table sqlite database
*
* This may be removed later if it is decided sqlite is not the right database choice
*/
const sqlite3 = require('sqlite3').verbose();
const Sync = require('node-sync');

const createDb = `
CREATE TABLE IF NOT EXISTS wealthincome (
Year INTEGER PRIMARY KEY,
IncomeTop10 REAL,
WealthTop10 REAL,
IncomeBottom50 REAL,
WealthBottom50 REAL
)
`;

const clearTable = `DELETE FROM wealthincome`

const insertStatement = `INSERT INTO wealthincome(Year, IncomeTop10, WealthTop10, IncomeBottom50, WealthBottom50) VALUES(?, ?, ?, ?, ?)`

const selectall = `SELECT Year year, 
IncomeTop10 incomeTop10, 
WealthTop10 wealthTop10, 
IncomeBottom50 incomeBottom50, 
WealthBottom50 wealthBottom50 
FROM wealthincome`;

class SqliteRepository {

    constructor(path) {
        let db = null
        this.init = () => {
            db = new sqlite3.Database(path);
            db.run(createDb);
        }
        const selectPeriod = (start, end) => {
            let result = [];
            Sync(() => {
                db.all.sync("SELECT * FROM wealthincome", [], (err, rows) => {
                    result = rows.map(row => [row.Year, row.IncomeTop10, row.WealthTop10, row.IncomeBottom50, row.WealthBottom50]);
                });
            });
            return result;
        };
        this.setData = (rows) => {
            db.run(clearTable);
            rows.forEach(row => db.run(insertStatement, row, () => { }));
        };
        this.getTop10 = (start, end) => {
            const data = selectPeriod(start, end);
            const result = {
                period: data.map(row => row[0]),
                income: data.map(row => row[1]),
                wealth: data.map(row => row[2])
            }
            return result;
        };
        this.getBottom50 = (start, end) => {
            const data = selectPeriod(start, end);
            const result = {
                period: data.map(row => row[0]),
                income: data.map(row => row[3]),
                wealth: data.map(row => row[4])
            }
            return result;
        };
        this.getIncome = (start, end) => {
            const data = selectPeriod(start, end);
            const result = {
                period: data.map(row => row[0]),
                top10: data.map(row => row[1]),
                bottom50: data.map(row => row[3])
            }
            return result;
        };
        this.getWealth = (start, end) => {
            const data = selectPeriod(start, end);
            const result = {
                period: data.map(row => row[0]),
                top10: data.map(row => row[2]),
                bottom50: data.map(row => row[4])
            }
            return result;
        };
        this.close = () => {
            db.close();
        }
    }

}

module.exports = SqliteRepository;