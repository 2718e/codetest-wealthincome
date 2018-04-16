const express = require('express')
const router = express.Router()

router.get('/top10', function(req, res){
    const query = req.query;
    // stub to echo the query parameters
    res.send('init: ' + query.init + ' end: ' + query.end);
});

module.exports = router