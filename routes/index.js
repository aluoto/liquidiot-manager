/**
 * Copyright (c) TUT Tampere University of Technology 2015-2016
 * All rights reserved.
 *
 * Main author(s):
 * Farshad Ahmadi Ghohandizi <farshad.ahmadi.gh@gmail.com>
 * Otto Hylli <otto.hylli@tut.fi>
 */

var express = require('express');
var css2mongo = require( '../utils/css2mongo' );
var router = express.Router();

// Gets the list of devices.
// can be filtered with a device selector string as a query parameter named q
router.get('/', function(req, res) {
    var db = req.db;
    var dbQuery = {};
    // if the request has a query parameter containing a device selector string
    // parse it into a mongodb query
    if ( req.query.q ) {
       try {
          dbQuery = css2mongo( req.query.q );
       }
       
       catch ( error ) {
          res.status( 400 ).send( { 'message': 'selector query parsing failed: ' +error } );
          return;
       }
       
       console.log( dbQuery );
   }

    db.collection('device').find( dbQuery ).toArray(function(err, items){
        if(err){
            res.status(400).send(err.toString());
        } else {
            res.status(200).send(JSON.stringify(items));
        }
    });
});

router.post('/', function(req, res){
    var db = req.db;
    console.log(typeof(req.body) + " : " + JSON.stringify(req.body));
    db.collection('device').insert(req.body, function(err, result){
        if(err){
            res.status(400).send(err.toString());
        } else {
            console.log(result.insertedIds[0]);
            res.status(200).send(JSON.stringify(result.insertedIds[0]));
        }
    });
});

router.get('/id/:id', function(req, res){
    var db = req.db;
    db.collection('device').findById(req.params.id.toString(), function(err, item){
        if(err){
            res.status(400).send(err.toString());
        } else {
            console.log(typeof(item) + " : " + item);
            res.status(200).send(JSON.stringify(item));
        } 
    });
});

router.get("/functionality?", function(req, res){
    var db = req.db;
    var tempSensor = req.query.tempSensor;
    console.log(tempSensor);
    var speaker = req.query.speaker;
    var qs = "";
    if(tempSensor && speaker){
        qs = {"connected-devices": {"temp-sensor": {"model": tempSensor}, "speaker": {"model": speaker} } };
    } else if(tempSensor) {
        qs = {"connected-devices": {"temp-sensor": {"model": tempSensor} } };
    } else if(speaker) {
        qs = {"connected-devices": {"speaker": {"model": speaker} } };
    } else { 
        //qs = {"connected-devices": {"temp-sensor": {"model": tempSensor}, "speaker": {"model": speaker} } };
        qs = {};
    }
    console.log(JSON.stringify(qs));
    //var a = f.split(' ');
    //var qs = { $in : };
    //for(var i in a){
        //if(i + 1 == a.length) {

            //var qs = {"connected-devices": {"temp-sensor":{ "model": f } } };
        //}
    //}
    //var s = 
    db.collection('device').find(qs).toArray(function(err, items){
        if(err){
            res.status(400).send(err.toString());
        } else {
            res.status(200).send(JSON.stringify(items));
        }
    });
});

module.exports = router;
