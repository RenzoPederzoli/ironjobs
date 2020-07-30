const express = require('express');
const router = express.Router();
const indeed = require('indeed-scraper');

router.get(`/search-results/:location/:searchTerm`, async function(req, res, next){

    let indeedJobs =[]

    const queryOptions = {
        host: 'www.indeed.com',
        query: req.params.searchTerm,
        city: req.params.location,
        radius: '25',
        level: '',
        jobType: '',
        maxAge: '3',
        sort: 'date',
        limit: 25
        };
    
        
        indeed.query(queryOptions).then(response => {
            indeedJobs.push(response)
            res.json(indeedJobs)
            
        })
    })

    module.exports = router;    