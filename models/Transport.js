const mongoose = require ("mongoose")
const TransportSchema = new mongoose.Schema({
    bus: {
        type: String
    },

    distance: { type: String },

    time: {
        type: String
    },
    now: {
        type: String,
    },
    message: {
        type: String,
    },
    
    lat: {
        type: String,
    },

    lon: {
        type: String,
    },

    place:{
        type: String
    }
},
{ timestamps: true}
);

module.exports = mongoose.model("Transport", TransportSchema )