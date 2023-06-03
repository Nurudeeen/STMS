const express = require('express');
const app = express();
const morgan = require('morgan')

const distance = require('google-distance-matrix');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
//var Datastore = require('nedb')

require('dotenv').config();
const port = process.env.PORT;

const mongoose = require('mongoose');
const MONG_URL = process.env.LOCAL_MONGO_URI;

const Transport = require('./models/Transport');
// const cors = require("cors");

// app.use(cors(
//     {
//         credentials: true
//     }
// ));

app.use(express.static('public'));
app.use(express.json());
distance.units('metric');
distance.key(process.env.API_KEY);
distance.mode('driving');

// db = new Datastore('datastore.db');
// db.loadDatabase();

app.post('/api', (req, res) => {
  //posts location data from front-end or esp 32 postb request
  let data = req.body;

  let origins = [];
  origins[0] = data.lat + ', ' + data.lon;
  bus = data.bus;
  var destinations = [
    '7.519554708957414, 4.5210832268552394',
    '7.499780, 4.452675',
    '7.550273, 4.510744',
    '7.486708, 4.547672',
    '7.540701, 4.578502',
  ];

  distance.matrix(origins, destinations, async (err, distances) => {
    if (err) {
      return console.log(err);
    }
    if (!distances) {
      return console.log('no distances');
    }
    if (distances.status == 'OK') {
      var origin = distances.origin_addresses;
      var destination = distances.destination_addresses;

      for (let i = 1; i < destinations.length; i++) {
        if (distances.rows[0].elements[i].status == 'OK') {
          var distance = distances.rows[0].elements[i].distance.text;
          var time = distances.rows[0].elements[0].duration.text;
          distanceNumber = distance.split(' ');
          var dist = distanceNumber[0];
          if (Number(dist) >= 20) {
            var now = new Date();
            var info = { bus, distance, time, now, message: 'out of coverage' };
            //db.insert(info)
            const newTransport = new Transport(info);
            try {
              const transport = await newTransport.save();
              return res.json({
                status: 'Server Connected to Client',
                distance: info.distance,
                message: info.message,
              });
            } catch (err) {
              console.log(err);
              res.status(500).json({ error: err });
            }
          }
          continue;
        }
        console.log(destination + ' is too far from ' + origin);
        res.json(destination + ' is too far from ' + origin);
      }
      if (distances.rows[0].elements[0].status == 'OK') {
        var time = distances.rows[0].elements[0].duration.text;
        var distance = distances.rows[0].elements[0].distance.text;
        var now = new Date();
        var info = { bus, distance, time, now, message: 'all good' };
        //db.insert(info)
        const newTransport = new Transport(info);
        try {
          const transport = await newTransport.save();
          return res.json({
            status: 'Server Connected to Client',
            distance: info.distance,
            message: info.message,
          });
        } catch (err) {
          console.log(err);
          res.status(500).json({ error: err });
        }
      }
      console.log(destination + ' is too far from ' + origin);
      res.json(destination + ' is too far from ' + origin);
    }
  });
});
app.post('/place', (req, res) => {
  //posts location data from front-end or esp 32 postb request
  data = req.body;
  // console.log(data);
  origins = [];
  origins[0] = data.place;
  console.log(origins);
  bus = data.bus;
  var destinations = ['7.519554708957414, 4.5210832268552394'];

  distance.matrix(origins, destinations, async function (err, distances) {
    if (err) {
      return console.log(err);
    }
    if (!distances) {
      return console.log('no distances');
    }
    if (distances.status == 'OK') {
      var origin = distances.origin_addresses;
      var destination = distances.destination_addresses;
      if (distances.rows[0].elements[0].status == 'OK') {
        var time = distances.rows[0].elements[0].duration.text;
        var distance = distances.rows[0].elements[0].distance.text;
        // console.log('The '+bus+' bus will arrive in '+time);
        // console.log(bus+' bus'+ ' is ' +distance+ ' away');
        now = new Date();
        var info = { bus, distance, time, now };
        const newTransport = new Transport(info);
        try {
          const transport = await newTransport.save();
          return res.json({
            status: 'Server Connected to Client',
            distance: info.distance,
            message: info.message,
          });
        } catch (err) {
          console.log(err);
          res.status(500).json({ error: err });
        }

        //db.insert(info)

        // db.update({bus: 'Ikeja'}, {distance: distance, time: time}, {}, function(err, numReplaced){
        //     if(err) console.log(err);

        //   });
      } else {
        console.log(destination + ' is too far from ' + origin);
        response.json(destination + ' is too far from ' + origin);
      }
    }
  });
});
app.get('/api', (req, res) => {
  //gets latest input into database from post request

  // db.find({}).sort({ now: -1 }).limit(1).exec((err, dat) => {
  //     if (err) {
  //         console.log(err)

  //         return res.status(400).send(err)
  //     }
  //     console.log(dat[0]);
  //     return res.status(200).json(dat[0])
  // })
  Transport.findOne()
    .sort({ $natural: -1 })
    .limit(1)
    .then((data) => {
      return res.status(200).json(data);
    });
});
app.get('/api/busOne', (req, res) => {
  //gets latest input into database from post request

  Transport.findOne({ bus: 'busOne' })
    .sort({ $natural: -1 })
    .limit(1)
    .then((data) => {
      return res.status(200).json(data);
    });
});
app.get('/api/busTwo', (req, res) => {
  //gets latest input into database from post request
  Transport.findOne({ bus: 'busTwo' })
    .sort({ $natural: -1 })
    .limit(1)
    .then((data) => {
      return res.status(200).json(data);
    });
});

app.get('/api/MCIP_Bus', (req, res) => {
  //gets latest input into database from post request

  Transport.findOne({ bus: 'MCIP_Bus' })
    .sort({ $natural: -1 })
    .limit(1)
    .then((data) => {
      return res.status(200).json(data);
    });
});

mongoose
  .connect(MONG_URL)
  .then(() => {
    console.log('DB connected successfully');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port || 3000, () => console.log('app listening on port 3000'));
