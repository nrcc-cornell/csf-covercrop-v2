///
///

import moment from 'moment';

function shiftDataBackOneDay(data) {
    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------

    function subtractOneDayFromDateString(d) {
      let result = moment(d,'YYYY-MM-DD').subtract(1,'days').format('YYYY-MM-DD')
      return result
    }

    let dataShifted = data.map(item => [subtractOneDayFromDateString(item[0]),item[1],item[2]])
    // only return data starting with expected first date
    return dataShifted.slice(1)
}

function getCropModel(crop) {
    let crop_models = {
        'rye':{'gdd_base':42, 'gdd_thresh':300, 'stop_at_freeze':null},
        'buckwheat':{'gdd_base':50, 'gdd_thresh':700, 'stop_at_freeze':24},
        'mustard':{'gdd_base':32, 'gdd_thresh':1800, 'stop_at_freeze':24},
    }

    return crop_models[crop]
}

function runCropModel(data,model) {
    // run crop model on data provided

    function isInYear(value,index,array){
        return (value[0].slice(0,4)===this)
    }

    function calcGdd(mx,mn,b,limits=null) {
        if (limits) {
            let mx_lim = limits[0]
            let mn_lim = limits[1]
            mx = mx>mx_lim ? mx_lim : mx
            mn = mn<mn_lim ? mn_lim : mn
        }
        return Math.max(...[((mx+mn)/2.) - b, 0])
    }

    function isBelowFreezeThreshold(value,index,array){
        return value[2]<=model['stop_at_freeze']
    }

    function transpose(m) {
        // transpose 2-d array m
        return m[0].map((col, i) => m.map(row => row[i]));
    }

    // get available years
    let years = [...new Set(data.map(x => x[0].slice(0,4)))]
    years.sort()

    // calculate accumulated GDDs, in reverse, from end of year to all dates
    let dataForYear, dates, dailyGDD, fallFreezes, firstFreezeDate, idxOfFirstFreezeDate, dailyGDD_acc, sum
    let idxStartDate
    let datesAllYears = []
    let gddAllYears = []
    years.forEach((y) => {
        dataForYear = data.filter(isInYear,y);
        dates = dataForYear.map(x => x[0])

        // calculate daily GDD
        dailyGDD = null
        dailyGDD = dataForYear.map(x => calcGdd(x[1],x[2],model['gdd_base']))

        // find index of first freezing temp, if applicable
        fallFreezes = null
        firstFreezeDate = null
        idxOfFirstFreezeDate = null
        if (model['stop_at_freeze']) {
            fallFreezes = dataForYear.slice(180).filter(isBelowFreezeThreshold)
            firstFreezeDate = fallFreezes[0][0]
            idxOfFirstFreezeDate = dates.indexOf(firstFreezeDate)
	}

        // zero out daily GDD after and including first freezing temp
        if (idxOfFirstFreezeDate) {
            dailyGDD = [...dailyGDD.slice(0,idxOfFirstFreezeDate) , ...Array(dailyGDD.length - idxOfFirstFreezeDate).fill(0.)]
        }

	// Accumulate GDD from the end of the year, backward.
        // reverse daily GDD time series, accumulate, and reverse accumulated GDD series back
        dailyGDD.reverse()
        dailyGDD_acc = dailyGDD.map((sum = 0, item => sum += item)).reverse()

        // Append the backward's accumulated GDD array (from May 1 to Dec 31) to list
        idxStartDate = dates.indexOf(y+'-05-01')
        datesAllYears.push(dates.slice(idxStartDate))
        gddAllYears.push(dailyGDD_acc.slice(idxStartDate))
    })

    // Calculate probability of reaching crop model's GDD threshold if planting occurred on specific date.
    // This probability is calculated for each date throughout the year, and saved in array.
    let idxStartYear, idxEndYear, dataToAnalyze
    let datesMMDD = []
    let probs_por = []
    let probs_15 = []
    let probs_30 = []
    Array.from(Array(datesAllYears[0].length).keys()).forEach((idxDate) => {
        // date array in format MM/DD
        datesMMDD.push(datesAllYears[0][idxDate].slice(5,7)+'/'+datesAllYears[0][idxDate].slice(8))

        // extract GDD accumulation for this calendar date index, each year.
        // dataToAnalyze will contain one value for each year, for this date.
        dataToAnalyze = gddAllYears.map(item => item[idxDate])
        // calculate probability of reaching GDD threshold in past 15 years
        probs_15.push(100.*dataToAnalyze.slice(-15).filter(x => x>=model['gdd_thresh']).length/dataToAnalyze.slice(-15).length)

        // calculate probability of reaching GDD threshold within 30-year normal period
        idxStartYear = years.indexOf("1991")
        idxEndYear = years.indexOf("2020")
        probs_30.push(100.*dataToAnalyze.slice(idxStartYear,idxEndYear+1).filter(x => x>=model['gdd_thresh']).length/dataToAnalyze.slice(idxStartYear,idxEndYear+1).length)

        // calculate probability of reaching GDD threshold over entire period of record
        probs_por.push(100.*dataToAnalyze.filter(x => x>=model['gdd_thresh']).length/dataToAnalyze.length)
    })

    // Only retain probability and GDD data between the latest 100% occurrence and the earliest 0% occurrence.
    // These will be provided for display in the chart time series.
    let idxFirst = null
    let idxLast = null
    Array.from(Array(datesMMDD.length).keys()).forEach((idxDate) => {
        // 1. find the earliest date to display by finding the latest date that all three probabilities are equal to 100%.
        if (!idxFirst) {
            if (probs_por[idxDate]<100 || probs_15[idxDate]<100 || probs_30[idxDate]<100) {
                idxFirst = idxDate - 1
            }
        }
        // 2. find the latest date to display by finding the earliest date that all three probabilities are equal to 0%.
        if (!idxLast) {
            if (probs_por[idxDate]===0 && probs_15[idxDate]===0 && probs_30[idxDate]===0) {
                idxLast = idxDate
            }
        }
    })
    let dates_forDisplay = datesMMDD.slice(idxFirst,idxLast+1)
    let probs_forDisplay_por = probs_por.slice(idxFirst,idxLast+1)
    let probs_forDisplay_30 = probs_30.slice(idxFirst,idxLast+1)
    let probs_forDisplay_15 = probs_15.slice(idxFirst,idxLast+1)
    let gdd_forDisplay = transpose(gddAllYears).slice(idxFirst,idxLast+1)

    return {
        // data for top probability chart in display
        'dates': dates_forDisplay,
        'probs_por': probs_forDisplay_por,
        'probs_30': probs_forDisplay_30,
        'probs_15': probs_forDisplay_15,
        // data for bottom time series chart in display
        'gdd_base': model['gdd_base'].toString(),
        'gdd_thresh': model['gdd_thresh'].toString(),
        'years': years,
        'gdd': gdd_forDisplay,
    }

}

export function processWeatherData(dataDailyExtremes,crop) {

    // ------------------------------------------------------------------------
    //
    //
    //
    // ------------------------------------------------------------------------

    var results = {}

    // crop model to use
    let cropModel = getCropModel(crop)

    // Shift dates back one day, since data reflect morning observations, and we want GDD obs
    // dates to reflect when the heating occurred.
    let dataDailyExtremesShifted = shiftDataBackOneDay(dataDailyExtremes)

    results = {
        ...results,
        ...runCropModel(dataDailyExtremesShifted,cropModel),
     }

    return results

}

