const moment = require('moment');

function formatMessage(username , text) {
  return {
    username,
    text,
    time: moment().format('Do MMM YY, h:mm a')
  }
}

module.exports = formatMessage;