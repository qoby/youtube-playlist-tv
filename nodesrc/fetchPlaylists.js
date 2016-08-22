const { apiKey, playlistId } = require('../config.json');

const {
  auth,
  getPlaylistDurations,
} = require('./youtubeDataAPI.js');

const jsonfile = require('jsonfile');
const path = require('path');


auth(apiKey)
.then(() => getPlaylistDurations(playlistId))
.then((results) => {
  jsonfile.writeFileSync(path.join(__dirname, '../data/playlist.json'), { [playlistId]: results });
  console.log('Done.');
});
