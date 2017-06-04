/* converts given number of seconds to standard time display format
 * http://goo.gl/kEvnKn
 */
function convertToTime (number) {
  const mins = Math.floor(number / 60);
  const secs = (number % 60).toFixed();
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default convertToTime;
