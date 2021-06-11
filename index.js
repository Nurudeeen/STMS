
const express = require('express');
const googleDistanceMatrix = require('google-distance-matrix');
const app = express()
//const key = process.env.API_KEY;
var distance = require('google-distance-matrix');
var Datastore = require('nedb')
require('dotenv').config();
//console.log(process.env);
app.use(express.static('public'));
app.use(express.json())
distance.units('metric');
distance.key(process.env.API_KEY);
distance.mode('driving');

db = new Datastore('datastore.db');
db.loadDatabase();


app.post('/api',(request,response)=>{
//posts location data from front-end or esp 32 postb request
data=request.body    
// console.log(data);
origins = []
origins[0]=(data.lat +", "+data.lon)
console.log(origins)
bus = data.bus
var destinations = ['7.519554708957414, 4.5210832268552394'];

distance.matrix(origins, destinations, function (err, distances) {
    if (err) {
        return console.log(err);
    }
    if(!distances) {
        return console.log('no distances');
    }
    if (distances.status == 'OK') {
                var origin = distances.origin_addresses;
                var destination = distances.destination_addresses;
                if (distances.rows[0].elements[0].status == 'OK') {
                    var time = distances.rows[0].elements[0].duration.text;
                    var distance = distances.rows[0].elements[0].distance.text;
                    console.log('The '+bus+' bus will arrive in '+time);
                    console.log(bus+' bus'+ ' is ' +distance+ ' away');
                    now = new Date ()
                    var info = {bus, distance, time, now}
                    response.json({
                        status: 'Server Connected to Client',
                            distance: info.distance,
                            time: info.time
                    })
                    
                    db.insert(info)
                    
                    // db.update({bus: 'Ikeja'}, {distance: distance, time: time}, {}, function(err, numReplaced){
                    //     if(err) console.log(err);
                        
                    //   });
                } else {
                    console.log(destination + ' is too far from ' + origin);
                    response.json(destination + ' is too far from ' + origin)
                }
            
        
    }
});
});

app.get('/api', (request,response)=>{
   //gets latest input into database from post request
    
    db.find({}).sort({now: -1}).limit(1).exec((err, dat)=>{
        if (err){
            response.end
            return
        }
        console.log(dat[0]);
        response.json(dat[0])
    })
    
});

app.listen(3000, ()=> console.log("app listening on port 3000"));