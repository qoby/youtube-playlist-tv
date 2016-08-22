import {
  YTDurationToSeconds,
} from './timeHelpers';

// Define some variables used to remember state.
var playlistId, nextPageToken;

export function loadYoutubeAPI() {
  gapi.client.setApiKey(window.apiKey);
  return gapi.client.load('youtube', 'v3');
}

// Retrieve the list of videos in the specified playlist.
export function requestVideoPlaylist(playlistId, pageToken) {
  console.log('requestVideoPlaylist');

  if (!gapi.client.youtube) {
    console.log('no youtube');
    throw new Error('Youtube library not loaded.');
  }

  let requestOptions = {
    playlistId: playlistId,
    part: 'snippet',
    // maximum allowed
    maxResults: 50,
  };
  if (pageToken) requestOptions.pageToken = pageToken;

  let request = gapi.client.youtube.playlistItems.list(requestOptions);
  return new Promise(resolve => request.execute(resolve));
}

export function filterVideoPlaylistIds(response) {
  console.log('filterVideoPlaylistIds');
  nextPageToken = response.result.nextPageToken;
  let playlistItems = response.result.items;
  let items = [];
  for (let item of playlistItems) {
    let videoId = item.snippet.resourceId.videoId;
    items.push(videoId);
  }
  return Promise.resolve(items);
}

export function requestNextVideoPlaylist(plastlistId) {
  return requestVideoPlaylist(playlistId, nextPageToken);
}

export function requestVideoDetails(items) {
  console.log('requestVideoDetails', items);
  let request = gapi.client.youtube.videos.list({
    id: items.join(','),
    part: 'contentDetails',
  });
  return new Promise(resolve => request.execute(resolve));
}

export function filterVideoTimes(response) {
  let videos = [];
  for (let item of response.items) {
    let duration = YTDurationToSeconds(item.contentDetails.duration);
    videos.push([item.id, duration]);
  }
  return Promise.resolve(videos);
}
