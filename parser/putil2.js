function parseTime(line) {
  let result = line.match(/^L (\d\d)\/(\d\d)\/(\d\d\d\d) - (\d\d):(\d\d):(\d\d): /);
  if (!result || result.length == 0) return false;
  return new Date(parseInt(result[3],10), parseInt(result[1],10)-1, parseInt(result[2],10), parseInt(result[4],10), parseInt(result[5],10), parseInt(result[6],10), 0);
};


function parsePlayer(line) {

  let result = line.match(/(.+)<(\d+)><(.+)><(.+)>/);
  if (result) { 
	return {'name':result[1],'id':parseInt(result[2],10),'steamid':result[3],'team':result[4]};
	};

  let result = line.match(/(.+)<(\d+)><(.+)>\<\>/);
  if (result) { 
	return {'name':result[1],'id':parseInt(result[2],10),'steamid':result[3]};
	};

	let result = line.match(/(.+)<(\d+)><(.+)>/);
  if (result) { 
	return {'name':result[1],'id':parseInt(result[2],10),'steamid':result[3]};
	};
	
  return false;
  
};

function parseIP(line){
	let result = line.match(/(.+):(.+)/);
	if (result) {
	return {'ip':result[1],'port':result[2]} 
	} else {
	return line;
	}
};

function parseArgs(args) {
  let result = args.match(/[(]([^"]|\\")+ ["]([^"]|\\")+["][)]/g);
  return result;
};

module.exports.parseLineInfo = function(line,callback) {

  let EvDate = parseTime(line);

  let result = line.match(/ Log file started /);
  if (result !== null) {
    return callback({'date':EvDate,'event':'startLog'});
  }  
  
  let result = line.match(/ Log file closed$/);
  if (result !== null) {
    return callback({'date':EvDate,'event':'closeLog'});
  }

  let result = line.match(/^L (\d\d\/\d\d\/\d\d\d\d) - (\d\d:\d\d:\d\d:) ["](.+)["] connected, address ["](.+)["]$/);
  if (result !== null) {
    return callback({'date':EvDate,'event':'connected','player':parsePlayer(result[3])});  
  }

  let result = line.match(/^L (\d\d\/\d\d\/\d\d\d\d) - (\d\d:\d\d:\d\d:) ["](.+)["] disconnected [(]reason "(.+)"[)]$/);
  if (result !== null) {
    return callback({'date':EvDate,'event':'disconnected','player':parsePlayer(result[3]),'reason':result[4]});  
  }

  let result = line.match(/^L (\d\d\/\d\d\/\d\d\d\d) - (\d\d:\d\d:\d\d:) ["](.+)["] entered the game$/);
  if (result !== null) {
    return callback({'date':EvDate,'event':'entered','player':parsePlayer(result[3])});  
  }
  
  return false;
  
};


