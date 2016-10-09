"use strict";

function PomodoroClock(elem) {
  let showTime = elem.querySelector(".js-show-time");
  let showBreak = elem.querySelector(".js-show-break");
  let showCounterTime = elem.querySelector(".js-counter-time");
  let showCounterName = elem.querySelector(".js-counter-name");
  let showCounterBg = elem.querySelector(".pomodoro__counter-shower-bg");
  let showCounterMain = elem.querySelector(".pomodoro__counter-shower");
  let timeLength = 2;
  let breakLength = 5;
  let isTikTak = false;
  let timersStack = [];
  let timerId;
  let isDone = false;
  // let doneAudio = new Audio('sounds/soft-bells.mp3');
  let doneAudio = new Audio('https://notificationsounds.com/soundfiles/35051070e572e47d2c26c241ab88307f/file-74_bells-message.mp3');
  let startAudio = new Audio('https://notificationsounds.com/soundfiles/ab817c9349cf9c4f6877e1894a1faa00/file-sounds-767-arpeggio.mp3');
  let pauseAudio = new Audio('https://notificationsounds.com/soundfiles/d61e4bbd6393c9111e6526ea173a7c8b/file-4f_here-I-am.mp3');


  const TIME = new Date(1970, 1);
  TIME.setHours(0, 0, 0, 0);


  showTime.innerHTML = timeLength;
  showBreak.innerHTML = breakLength;
  showCounterTime.innerHTML = timeLength;


  let setTimeLengthShowTime = setTimeLengthDecoratorShowResult(setTimeLength, showTime);
  let setTimeLengthShowBreak = setTimeLengthDecoratorShowResult(setTimeLength, showBreak);


  let BreakRun = getTimeMinusOneSecond( getStartTime(TIME, breakLength) );
  BreakRun = getTimeAndBindToTimer(BreakRun, showCounterTime, "Break");
  let timerBreak = timer(BreakRun);
  timerBreak.name = "timerBreak";

  // поставил после break потому что в колбек передается таймер timerBreak
  let TimeRun = getTimeMinusOneSecond( getStartTime(TIME, timeLength) );
  TimeRun = getTimeAndBindToTimer(TimeRun, showCounterTime, "Session", timerBreakCallback, "Session is over");
  let timerTime = timer(TimeRun);
  timerTime.name = "timerTime";

  timersStack.push(timerTime);

  function timerTimeCallback() {
    resetTimeTime();
    timersStack.pop();
    timersStack.push(timerTime);
    timerTime.start();
    changeTheme("time", "break", showCounterMain);
  }

  function timerBreakCallback() {
    resetTimeBreak();
    timersStack.pop();
    timersStack.push(timerBreak);
    timerBreak.start();
    changeTheme("break", "time", showCounterMain);
  }

  elem.addEventListener("click", getElement);

  function getElement(e) {
    var target = e.target;

    while(target !== e.currentTarget) {

      if (target.classList.contains('js-plus-time')) {
        if (isTikTak) {return};
        timeLength = setTimeLengthShowTime(timeLength, "plus");
        resetTimeTime();
        // console.log(timersStack[0].name);
        if (timersStack[0].name === "timerTime") {
          timersStack.pop();
          timersStack.push(timerTime);
        }

        return;
      }

      if (target.classList.contains('js-minus-time')) {
        if (isTikTak) {return};
        timeLength = setTimeLengthShowTime(timeLength, "minus");
        resetTimeTime();
        // console.log(timersStack[0].name);
        if (timersStack[0].name === "timerTime") {
          timersStack.pop();
          timersStack.push(timerTime);
        }

        return;
      }

      if (target.classList.contains('js-plus-break')) {
        if (isTikTak) {return};
        breakLength = setTimeLengthShowBreak(breakLength, "plus");
        resetTimeBreak();
        // console.log(timersStack[0].name);
        if (timersStack[0].name === "timerBreak") {
          timersStack.pop();
          timersStack.push(timerBreak);
        }

        return;
      }

      if (target.classList.contains('js-minus-break')) {
        if (isTikTak) {return};
        breakLength = setTimeLengthShowBreak(breakLength, "minus");
        resetTimeBreak();
        // console.log(timersStack[0].name);
        if (timersStack[0].name === "timerBreak") {
          timersStack.pop();
          timersStack.push(timerBreak);
        }

        return;
      }

      if (target.classList.contains('js-counter')) {
        if (isDone) return;

        if (isTikTak) {
          pauseAudio.play();
          isTikTak = timersStack[0].stop();
          showCounterMain.classList.add("stopped");
          enebleButtons(elem);
        } else {
          startAudio.play();
          clearStyles(showCounterBg, "top");
          isTikTak = timersStack[0].start();
          showCounterMain.classList.remove("stopped");
          disableButtons(elem);
        }

        return;
      }

      target = target.parentNode;
    }
  }

  function disableButtons(elem) {
    let btns = elem.querySelectorAll(".btn");

    btns.forEach(btn => btn.classList.add("disabled"));
  }

  function enebleButtons(elem) {
    let btns = elem.querySelectorAll(".btn");

    btns.forEach(btn => btn.classList.remove("disabled"));
  }

  function resetTimeTime() {
    TimeRun = getTimeMinusOneSecond( getStartTime(TIME, timeLength) );
    TimeRun = getTimeAndBindToTimer(TimeRun, showCounterTime, "Session", timerBreakCallback, "Session is over");
    timerTime = timer(TimeRun);
    timerTime.name = "timerTime";
  }

  function resetTimeBreak() {
    BreakRun = getTimeMinusOneSecond( getStartTime(TIME, breakLength) );
    BreakRun = getTimeAndBindToTimer(BreakRun, showCounterTime, "Break", timerTimeCallback, "Break is over");
    timerBreak = timer(BreakRun);
    timerBreak.name = "timerBreak";
  }

  function setTimeLength(value, expr) {
    // console.log(value);
    if (expr === "plus") return ++value;
    if (expr === "minus" && value === 1) {
      return 1;
    } else {
      return --value;
    }
  }

  function setTimeLengthDecoratorShowResult(f, elem) {
    return function() {
      let result = f.apply(this, arguments);

      if (!result) return;

      elem.innerHTML = result;

      return result;
    }
  }

  function getTimeMinusOneSecond(date) {
    let d = new Date(date);
    let result;

    return function() {
      result = new Date(d.setSeconds(d.getSeconds() - 1));

      if (result.getHours() === 0 &&  result.getMinutes() == 0 && result.getSeconds() === 0) {

        return false;
      }

      return ((result.getHours() > 0) ? result.getHours() + ":" : "")
            + ((result.getMinutes() > 0) ? ((result.getMinutes() < 10) ? "0" + result.getMinutes() + ":" : result.getMinutes()  + ":") : "")
            + ((result.getSeconds() < 10) ? "0" + result.getSeconds() : result.getSeconds());
    }
  }

  function getTimeAndBindToTimer(timer, showerElem, name, callback, message) {
    return function() {
      let time = timer.apply(this, arguments);

      showCounterName.innerHTML = name;

      if (!time) {
        isDone = true;
        showerElem.innerHTML = "done";
        showCounterBg.style.top =  "0";
        doneAudio.play();
        notifyMe(message);

        // here may be an event signaling that session is finished

        setTimeout(function() {  // here is a delay, before callback will be started
          clearStyles(showCounterBg, "top");
          callback();
          isDone = false;
        }, 1500);
      } else {
        showerElem.innerHTML = time;
        if (+time < 60) {
          showCounterBg.style.top =  time * 1.66   + "%";
          // here will be a function call for final session phase during the last 60 seconds (styling or something else)
        }
      }

      return time;
    }
  }

  function clearStyles(elem, ...rest) {
    for (let i = 0; i < rest.length; i++) {
      elem.style[rest[i]] = "";
    }
  }

  function changeTheme(newTheme, oldTeme, elem) {
    elem.classList.add(newTheme);
    elem.classList.remove(oldTeme);
  }

  function getMiliseconds(minutes) {
    return minutes * 60 * 1000;
  }

  function getStartTime(TIME, timeDuration) {
    let timeMiliseconds = getMiliseconds(timeDuration);
    let time = new Date(TIME);

    time.setMilliseconds(timeMiliseconds);
    return time;
  }

  function switcherTimer(timer) {
    let isRun = false;

    return function () {
      if (!isRun) {
        isRun = true;
        return timer.start();
      } else {
        isRun = false;
        return timer.stop();
      }
    }
  }

  /*
   timer
   */
  function timer(f) {

    function start() {
      f();

      timerId = setInterval(function() {
        let result = f();

        if (!result) {
          clearInterval(timerId);
        }

      }, 1000);

      return true;
    }

    function stop() {
      clearInterval(timerId);

      return false;
    }

    return {
      start: start,
      stop: stop
    }
  }
  
  function notifyMe(message) {
    // Проверка поддерживаемости браузером уведомлений
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Проверка разрешения на отправку уведомлений
    else if (Notification.permission === "granted") {
      // Если разрешено то создаем уведомлений
      var notification = new Notification(message);
    }

    // В противном случает мы запрашиваем разрешение
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        // Если пользователь разрешил, то создаем уведомление 
        if (permission === "granted") {
          var notification = new Notification(message);
        }
      });
    }

    // В конечном счете если пользователь отказался от получения 
    // уведомлений, то стоит уважать его выбор и не беспокоить его 
    // по этому поводу .
  }Notification.requestPermission();function spawnNotification(theBody,theIcon,theTitle) {
    var options = {
        body: theBody,
        icon: theIcon
    }
    var n = new Notification(theTitle,options);
  }
}

let pomodorolock = new PomodoroClock(document.querySelector(".pomodoro"));