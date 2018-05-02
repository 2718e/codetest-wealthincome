const express = require('express')
const multer = require('multer')
const _ = require('lodash')
/*
* This section of the code handles the routing logic, validating queries, and sending responses 
* 
*/


function tryParseRange(requestParams) {
    const init = Number(requestParams.init);
    const end = Number(requestParams.end);
    const valid = (init && end && _.isInteger(init) && _.isInteger(end))
    return {
        valid: valid,
        init: init,
        end: end
    };
}

function tryParseGroup(requestParams) {
    const group = Number(requestParams.group);
    const valid = (group && _.isInteger(group) && (group === 50 || group === 10));
    return { valid: valid, group: group };
}

// checks if the query string query contains valid integers as the init and end parameters,
// if so gets data by calling fGetDataForPeriod and sends it to the response stream res.
// if invalid sends a 400 bad request status 
function sendResultOrBadRequest(query, fGetPromiseOfData, res) {
    const { init, end, valid } = tryParseRange(query);
    if (valid) {
        fGetPromiseOfData(init, end).then(
            result => res.send({ data: result }),
            err => console.log(err)
        );
    } else {
        res.sendStatus(400);
    }
}

// factory method to make the router for the income and wealth API
function makeIncomeWealthRouter(repository, calculator) {

    const memoryStorage = multer.memoryStorage()
    const upload = multer({
        storage: memoryStorage,
        limits: { files: 1, fileSize: 10485760 }
    })

    const router = express.Router()
    router.use(express.json());

    router.post('/upload', upload.single('data'), function (req, res) {
        const csvText = req.file.buffer.toString();
        const dataRows = csvText.split('\n') // array of lines
            .map(line => line.trim().split(',').map(Number)); // split each line at commas and convert to number
        repository.setData(dataRows);
        res.send(200);
    })

    router.get('/top10', function (req, res) {
        sendResultOrBadRequest(req.query, repository.getTop10, res);
    });
    router.get('/bottom50', function (req, res) {
        sendResultOrBadRequest(req.query, repository.getBottom50, res);
    });
    router.get('/incomeinequality', function (req, res) {
        sendResultOrBadRequest(req.query, calculator.incomeInequality, res);
    });
    router.get('/wealthinequality', function (req, res) {
        sendResultOrBadRequest(req.query, calculator.wealthInequality, res);
    });
    router.post('/savingcapacity', function (req, res) {
        const parsedRange = tryParseRange(req.body);
        const parsedGroup = tryParseGroup(req.body);
        if (parsedRange.valid && parsedGroup.valid) {
            calculator.savingCapacityNormalized(parsedRange.init, parsedRange.end, parsedGroup.group).then(result => {
                res.send({ data: result });
            });
        } else {
            res.sendStatus(400);
        }
    });

    return router;
}

module.exports = makeIncomeWealthRouter