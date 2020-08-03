const express = require('express');
const router = express.Router();
const indeed = require('indeed-scraper');

router.get(`/indeed-results/:location/:searchTerm`, async function(req, res, next){

    const queryOptions = {
        host: 'www.indeed.com',
        query: req.params.searchTerm,
        city: req.params.location,
        radius: '25',
        level: '',
        jobType: '',
        maxAge: '',
        sort: '',
        limit: 50
        };
    
        
        indeed.query(queryOptions).then(response => {
            res.json(response) 
        })
    })

    module.exports = router;    