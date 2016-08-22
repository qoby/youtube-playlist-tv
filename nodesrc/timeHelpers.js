const YTDurationToSeconds = exports.YTDurationToSeconds = function(duration) {
  let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  let hours = (parseInt(match[1]) || 0);
  let minutes = (parseInt(match[2]) || 0);
  let seconds = (parseInt(match[3]) || 0);
  return hours * 3600 + minutes * 60 + seconds;
};

const secondsToday = exports.secondsToday = function() {
  let d = new Date();
  let thisSecond = ((d.getHours() + 1) * 60 * 60) + (d.getMinutes() * 60);
  return thisSecond;
};
