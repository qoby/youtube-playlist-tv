import { findCurrentVideo } from './playlistAPI';
import {
  createPlayer,
  cuePlaylist,
  loadYoutubeAPI,
  playVideo,
  getVideoData,
} from './youtubeIframeAPI';

import promisePolyfill from 'es6-promise';
promisePolyfill.polyfill();

const showThumb = (YTid) => {
  if (!YTid) return;
  document.getElementById('thumb')
          .style
          .backgroundImage = `url(https://img.youtube.com/vi/${YTid}/hqdefault.jpg)`;
};

const handlePlaying = () => document.body.className = 'playing';
const handleBuffering = (ev) =>  {
  document.body.className = 'buffering';
  showThumb(getVideoData().video_id);
};
const handleReady = (ev) => {
  document.body.className = 'ready';
  showThumb(getVideoData().video_id);
};



Promise.resolve()
.then(()=>showThumb(findCurrentVideo()[2]))
.then(loadYoutubeAPI)
.then(() => createPlayer({
  // onReady: handleReady,
  onPlay: handlePlaying,
  onPause: handleReady,
  onBuffer: handleBuffering,
  onQueue: handleReady,
  // onEnd: playNext,
}))
.then(() => findCurrentVideo())
.then(([playlistId, index, videoId, startSeconds]) => {
  return cuePlaylist({
    list: playlistId,
    index: index,
    startSeconds,
  });
});
