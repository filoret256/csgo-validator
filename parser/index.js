
let parseutils = require('./putil2.js');

module.exports.parseLine = ( parseLine, callback ) => {
  
  const line = (Buffer.isBuffer(line) === true) ? parseLine.toString('utf8') : parseLine;
  const startingpoint = line.indexOf('L ');

  if (startingpoint !== -1) {
    const parseLine = line.substring(startingpoint).replace(/(\r\n|\n|\r|\u0000)/gm,"").trim();
    parseutils.parseLineInfo( parseLine, callback(result) );
  } else {
    return callback(false);
  }

}
