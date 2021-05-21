class CountDown {
  constructor(ms) {
    this._ms = ms;
  }

  init(f, countDownId) {
    let self = this;

    if (!countDownId) {
      let countDownId;
    }

    function start() {
      f();

      countDownId = setInterval(function() {
        let result = f();

        if (!result) {
          clearInterval(countDownId);
        }

      }, self._ms);

      return true;
    }

    function stop() {
      clearInterval(countDownId);

      return false;
    }

    return {
      start: start,
      stop: stop
    }
  }
}
