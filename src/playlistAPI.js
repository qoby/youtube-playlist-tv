import { secondsToday } from './timeHelpers';
import data from '../data/playlist.json';

const PLAYLIST_ID = 'PL4lEESSgxM_5O81EvKCmBIm_JT5Q7JeaI';

export function findCurrentVideo() {
  let seekToTime = secondsToday();
  console.log('Seconds today', seekToTime);
  // let seekToTime = 1000;
  let time = 0;
  for (let index in data[PLAYLIST_ID]) {
    let [id, duration] = data[PLAYLIST_ID][index];
    time += duration;
    // console.log(time, '>', seekToTime, '?', (time > seekToTime));
    if (time > seekToTime) {
      let remainder = duration + seekToTime - time;
      console.log(`Found video location at
                    #${index} ${id}
                    ${remainder}s / ${duration}s
                    out of ${time}s playlist total`);
      return [ PLAYLIST_ID, index, id, remainder ];
    }
  }
  console.log('No suitable video found');
  throw new Error('No suitable video found');
}
