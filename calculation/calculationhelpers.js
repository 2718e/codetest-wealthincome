/**
 * COntains helper functions for calculation of metrics and prediction
 */

/** function for calculating functions that depend on both the value for one year and the previous -
 *  handles checking for null values and missing years,
 *
 * @param {the array of years} years
 * @param {the array of values e.g. wealth or income} values
 * @param {function of a value and the previous value that is to be calculated} fCombineValueWithPrevious
 */
function calculateForTimespan (years, values, fCombineValueWithPrevious) {
  let period = []
  let calculation = []
  let prevYear = years[0]
  let prevValue = values[0]
  for (let i = 1; i < years.length; i++) {
    let year = years[i]
    let value = values[i]
    // only calculate savings capacity when we have all data for 2 consecutive years
    if (prevYear && prevValue && year && value && (year - prevYear === 1)) {
      period.push([prevYear, year])
      calculation.push(fCombineValueWithPrevious(value, prevValue))
    }
    prevYear = year
    prevValue = value
  }
  return {
    period: period,
    result: calculation
  }
}

module.exports = { calculateForTimespan }
