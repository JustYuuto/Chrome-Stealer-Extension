const discord = require('../websites/discord');
const google = require('../websites/google');
const Util = require('../../utils');

Util.Website.init(discord);
Util.Website.init(google);
