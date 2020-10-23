# csgo-validator
steamID validator

##

1. download 
2. edit serverList
  where is object
>[
>  { ip: <IP>,
>    port: <port>,
>    rcon: <rcon>
>  }
>  ...
>]

that list for filtering different trafic and ban&kick players not in the list

3. at index.js edit
> const url = 'http://playerlist';
  this is a foreign list of authorized players, at this example list is not at json format -)
  if you have own list at some DB just change block
  
>            request
>                .get(url)
>                .on('data',(data) => {
>                    players += data;
>                })
>                .on('end',() => {
>                    players = players.replace(/\<br\>/gi,'').trim().replace(/\,$/,'').replace(/\'/gi,'"'); 
>                    let playersList = JSON.parse('['+players+']');
