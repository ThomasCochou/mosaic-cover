const fetch = require("node-fetch");
var fs = require('fs'), request = require('request');
var mkdirp = require('mkdirp');

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
  
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

const getPlaylist = async (access_token, playlist_id) => {
    try {

        var options = {
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };

        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`, options);

        const result = await response.json();

        const tracks = result.tracks;

        mkdirp(`${result.name}`, function(err) { 

            // path exists unless there was an error
            console.error('error', err);
        
        });

        tracks.items.forEach(track => {
            // trackCover.push(track.track.album.images[0].url)
            download(track.track.album.images[0].url, `${result.name}/${track.track.name}.jpg`, function(){
                console.log(`${track.track.name} - done`);
            });      
        });

          
        return result;

    } catch (error) {

        console.error('error', error);

        return null;
    }
};

var access_token = "BQDuwCaAuc3CZ1rwFHRmiSAVpQONsdDv2AUa_HnK2vfidyhBL0rG28782vQbpejJs3ugt8hIDsfHAxITHijIV59lfsIZ3ecjsyjfYTZyFNMdr2C461sZaXUoqqEdJChPfs8jz1vEmjL0QrJk3TeIqejh8wmINne0yA";
var playlist_id = "4Tztc4rPUAen00AfpLc5sc"

getPlaylist(access_token, playlist_id);


