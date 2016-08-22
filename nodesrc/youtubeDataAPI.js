const youtube = require('youtube-api');
const Promise = require('bluebird');
const { YTDurationToSeconds } = require ('./timeHelpers.js');

exports.auth = function(apiKey) {
  console.log('Auth');
  return new Promise(resolve => {
    youtube.authenticate({ type: 'key', key: apiKey });
    return resolve();
  });
};

const getPlaylistDurations = exports.getPlaylistDurations = function(playlistId) {
  console.log('getPlaylistDurations', playlistId);

  return getPlaylist(playlistId)
  .then(filterVideoPlaylistIds)
  .then(requestVideoDetails)
  .then(filterVideoTimes)
  .then((res) => {
    console.log('Found', res.length, 'videos in playlist', playlistId);
    return res;
  });
};

// function sequence(tasks) {
//   let current = Promise.cast(), results = [];
//   for (let k = 0; k < tasks.length; ++k) {
//     results.push(current = current.thenReturn().then(tasks[k]));
//   }
//   return Promise.all(results);
// }

const requestVideoDetails = exports.requestVideoDetails = function(items) {
  console.log('requestVideoDetails');

  let chunked = split(items, 50);
  let args = [];
  for (let chunk of chunked) {
    args.push({
      id: chunk.join(','),
      part: 'contentDetails',
    });
  }

  // This retrieves the detail results from Google in pages
  // and flattens everything into one array.
  let promise = Promise.resolve();

  args.forEach((arg) => {
    promise = promise.then((results = []) =>
      promisify(youtube.videos.list, arg)
      .then((res)=>results.concat(...res.items))
    );
  });

  return promise;

};

// from 'youtube-playlist-info'
const getPlaylist = exports.getPlaylist = function(playlistId, pageToken = null, currentItems = []) {

  process.stdout.write('|');
  return promisify(youtube.playlistItems.list, {
    // part: 'contentDetails',
    part: 'snippet',
    pageToken: pageToken,
    maxResults: 50,
    playlistId: playlistId,
  }).then(data => {
    currentItems.push(...data.items);

    if (data.nextPageToken) {
      return getPlaylist(playlistId, data.nextPageToken, currentItems);
    }

    return currentItems;
  });
};

const filterVideoPlaylistIds = exports.filterVideoPlaylistIds = function(items = []) {
  console.log('filterVideoPlaylistIds');

  let ids = [];
  for (let item of items) {
    if (item.snippet) {
      let videoId = item.snippet.resourceId.videoId;
      ids.push(videoId);
    }
    else {
      console.log('WAT?', item, typeof item);
    }
  }

  return Promise.resolve(ids);
};

const filterVideoTimes = exports.filterVideoTimes = function(items) {
  let videos = [];
  for (let item of items) {
    let duration = YTDurationToSeconds(item.contentDetails.duration);
    videos.push([item.id, duration]);
  }
  return Promise.resolve(videos);
};

function promisify(fn, config) {
  return new Promise((resolve, reject) => {
    fn(config, (err, results) => err ? reject(err) : resolve(results));
  });
};

function split(arr, n) {
  var res = [];
  while (arr.length) {
    res.push(arr.splice(0, n));
  }
  return res;
};
