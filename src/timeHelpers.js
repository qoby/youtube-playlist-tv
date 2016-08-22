export function YTDurationToSeconds(duration) {
  let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  let hours = (parseInt(match[1]) || 0);
  let minutes = (parseInt(match[2]) || 0);
  let seconds = (parseInt(match[3]) || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

export function secondsToday() {
  let dt = new Date();
  let secs = dt.getUTCSeconds() + (60 * dt.getUTCMinutes()) + (60 * 60 * dt.getUTCHours());
  return secs;
}
