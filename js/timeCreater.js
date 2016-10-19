class TimeCreater {
  constructor(args) {
    const TIME = new Date(1970, 1);
    TIME.setHours(0, 0, 0, 0);

    this._TIME = TIME;
  }

  _getMiliseconds(minutes) {
    return minutes * 60 * 1000;
  }

  _getStartTime(TIME, timeDuration) {
    let timeMiliseconds = this._getMiliseconds(timeDuration);
    let time = new Date(TIME);

    time.setMilliseconds(timeMiliseconds);

    return time;
  }


  getTimeGeneratorFunction(timeDuration) {
    let date = this._getStartTime(this._TIME, timeDuration);
    let d = new Date(date);
    let result;
    let self = this;

    return function() {
      result = new Date(d.setSeconds(d.getSeconds() - 1));

      if (result.getHours() === 0 &&  result.getMinutes() == 0 && result.getSeconds() === 0) {
        return false;
      }

      let hours = result.getHours();
      let minutes = result.getMinutes();
      let seconds = result.getSeconds();

      return ((hours > 0) ? `${hours}:` : "")
            + ((minutes > 0 || hours > 0) ? `${ self._addLeadingZero(minutes) }:` : "")
            + self._addLeadingZero(seconds);
    }
  }


  _addLeadingZero(num) {
    return (num < 10) ? `0${num}` : num;
  }
}