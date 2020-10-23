let parser = require('./parser');
let srvList = require('./serversList');
const url = 'http://playerlist';

let dgram = require("dgram");
let server = dgram.createSocket("udp4");
let Rcon = require('simple-rcon');
let domain = require('domain').create();
let request = require('request');




server.on("message", (msg, data) => {

    let idx = -1;

    srvList.forEach((srv,i)=>{
            if (srv.ip === data.address && srv.port === data.port) idx = i;
        });


    if (idx > -1) {

        parser.parseLine(msg ,(info) => {
            
            if (info === undefined) return;
            if (!info.hasOwnProperty('event')) return; 
            if (info.event !== 'entered') return;
                      
            let playerSteam = info.player.steamid;
            let playerName = info.player.name;    
            let find = false;
            let teamName = '';
            
            let players='';

            request
                .get(url)
                .on('data',(data) => {
                    players += data;
                })
                .on('end',() => {
                    players = players.replace(/\<br\>/gi,'').trim().replace(/\,$/,'').replace(/\'/gi,'"'); 
                    let playersList = JSON.parse('['+players+']');
            
                    playersList.forEach( (team) => {
                        
                        team.players.forEach( (player) => {
                            
                        if (player.steamID === playerSteam) {
                            teamName = team.teamName;
                            find = true;
                        }
                        
                            
                        });
                    }); 

                    if (find) {
                        
                        if (info.event === 'entered'){
                            domain.run(()=>{
                                
                                let rcon = new Rcon({
                                    host: srvList[idx].ip,
                                    port: srvList[idx].port,
                                    password: srvList[idx].rcon
                                    })
                                    .exec('say player '+playerSteam+' authorized, team ' + teamName, () =>  {
                                        rcon.close();    
                                    })
                                    .connect()
                                    .on('error',(e) => console.log('some error:', e ));
                            });
                        }
                    } else {

                        console.log( playerSteam +' '+playerName + ' not at list' );

                        domain.run(()=>{

                            let rcon = new Rcon({
                                host: srvList[idx].ip,
                                port: srvList[idx].port,
                                password: srvList[idx].rcon
                                })
                                .exec('banid 5 '+playerSteam+' kick', () =>  {
                                    rcon.close();    
                                })
                                .connect()
                                .on('error',(e) => console.log('some error:', e ));
                        });
                    };
                    
                });
            });	
        }

});
    
				



server.bind(27506,function(){
	console.log('listning at 27506');
});

domain.on('error',function(err){
    console.log('error: ', err.message,err.stack);
});