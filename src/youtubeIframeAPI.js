var
  player = null,
  // window.player = null,
  done = false,
  events = {};

// https://code.google.com/p/gdata-issues/issues/detail?id=4697
window.YTConfig = {
  'host': 'https://www.youtube.com',
};

// function serialize(obj) {
//   var str = [];
//   for (let p in obj) {
//     if (obj.hasOwnProperty(p)) {
//       str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
//     }
//   }
//   return str.join('&');
// };

export function loadYoutubeAPI() {
  var p = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => resolve();
  });
  console.log('loadYoutubeAPI');
  return p;
}

export function createPlayer(setupEvents) {
  events = setupEvents;
  return new Promise((resolve) => {
    console.log('setting up YT player...');
    window.player = new YT.Player('videoContainer', {
      // When no existing iframe is present
      height: '100%',
      width: '100%',
      playerVars: {
        autoplay: '0',
        controls: '0',
        enablejsapi: '1',
        modestbranding: '1',
        showinfo: '0',
      },
      events: {
        'onReady': (ev) => {
          events.onReady && events.onReady();
          resolve(ev);
        },
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError,
      },

    // BUG: we force this because of above
    // resolve();
    });
  });
}
export const cuePlaylist = (config) =>
  loadPlaylist({ ...config, autoplay: '0' });

export const loadPlaylist = (config) => {

  // // BUG: existing iframe style because of API bug
  // let url = 'https://www.youtube.com/embed/?' +
  //   serialize({
  //     autoplay: config.autoplay || '1',
  //     controls: '0',
  //     enablejsapi: '1',
  //     index: config.index,
  //     list: config.list,
  //     listType: 'playlist',
  //     start: config.startSeconds,
  //   });
  //
  // document.getElementById('player').src = url;
  // console.log('Iframe has url', document.getElementById('player').src);
  // return Promise.resolve();

  // BUG: API style, which has bugs with index: > 200
  // https://code.google.com/p/gdata-issues/issues/detail?id=8482

  window.player.cuePlaylist({
    ...config,
    index: config.index,
    list: config.list,
    listType: 'playlist',
    start: config.startSeconds,
    playlistType: 'playlist',
  });
};
export const stopVideo = () => window.player.stopVideo();
export const playVideo = () => window.player.playVideo();

export const getVideoData = () => window.player.getVideoData();

function onPlayerError(event) {
  console.log('Player error', event);
  events.onError && events.onError(event);
}

const EXPLAIN_CODE = ['Unstart', 'End', 'Play', 'Pause', 'Buffer', 'UnknownCode', 'Queue'];

function onPlayerStateChange(event) {
  if (typeof event.data === 'number' && EXPLAIN_CODE[(event.data + 1)]) {
    let code = event.data + 1;
    let wcode = EXPLAIN_CODE[code];
    console.log('YT event', wcode);
    events['on' + wcode] && events['on' + wcode](event);
  }
  else
  {
    console.log('Unknown YT event code', event.data);
  }
}
