const NodeGeocoder = require('node-geocoder');

//creating options for NodeGeocoder which have all the info required
const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_APIKEY,
  formatter: null,
};
//createing geocoder with all the options
const geocoder = NodeGeocoder(options);
module.exports = geocoder;
