const discord = require('../websites/discord');
const google = require('../websites/google');
const paypal = require('../websites/paypal');
const spotify = require('../websites/spotify');
const Util = require('../../utils');

Util.Website.init(discord);
Util.Website.init(google);
Util.Website.init(paypal);
Util.Website.init(spotify);
