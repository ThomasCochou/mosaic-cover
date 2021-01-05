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
            json: true,
          };

        const responsePlaylist = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`, options);

        const resultPlaylist = await responsePlaylist.json();

        if(resultPlaylist.error){
            console.log(resultPlaylist);
            return;
        }

        const playlistName = resultPlaylist.name;

        const playlistSize = resultPlaylist.tracks.total;


        mkdirp(`../${playlistName}`, function(err) { 

            // path exists unless there was an error
            console.error('error', err);
        
        });

        var offset = 0;

        while (offset <= playlistSize ) {
            const responseTracks = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?offset=${offset}`, options);

            const resultTracks = await responseTracks.json();
    
    
            resultTracks.items.forEach(track => {
                download(track.track.album.images[0].url, `../${playlistName}/${track.track.name}.jpg`, function(){
                    console.log(`${track.track.name}`);
                });      
            });

            offset = offset + 100;
        }
        
    return null;

    } catch (error) {

        console.error('error', error);

        return null;
    }
};

var access_token = "BQC27zgsP4zR8P1Ow0cnMoy7f8_lS5kVB2lg2MDtfkETY8AcLSMiFdZsLuKjFUnBUOu0fSLIufIb1cKT2pNbj-TBqZW_fQyKoq5NWJb5aJPhAm7G69ml_zSr-zQV1EFFDkHClJ-G2bI85usfz6f9nCBLOuYPWlGMKQ";
var playlist_id = "2EoRtpagm7ncZQVsjKvvtc"

getPlaylist(access_token, playlist_id);


