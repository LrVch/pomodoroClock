"use strict";

function PomodoroClock({elem, notifier, domManipulator, countDown, shifterValue, timeCreater}) {
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
  let countDownId;
  let isDone = false;
  let requestPermission = notifier.requestPermission();


  let doneAudio = new Audio('https://notificationsounds.com/soundfiles/35051070e572e47d2c26c241ab88307f/file-74_bells-message.mp3');
  let startAudio = new Audio('https://notificationsounds.com/soundfiles/ab817c9349cf9c4f6877e1894a1faa00/file-sounds-767-arpeggio.mp3');
  let pauseAudio = new Audio('https://notificationsounds.com/soundfiles/d61e4bbd6393c9111e6526ea173a7c8b/file-4f_here-I-am.mp3');


  showTime.innerHTML = timeLength;
  showBreak.innerHTML = breakLength;
  showCounterTime.innerHTML = timeLength;


  let setTimeLengthForShowTime = bindShifterValueToElem(shifterValue.set, showTime);
  let setTimeLengthForShowBreak = bindShifterValueToElem(shifterValue.set, showBreak);


  let BreakRun = timeCreater.getTimeGeneratorFunction(breakLength);
  BreakRun = getTimeAndBindToTimer(BreakRun, showCounterTime, "Break");
  let timerBreak = countDown.init(BreakRun, countDownId);
  timerBreak.name = "timerBreak";

  // поставил после break потому что в колбек передается таймер timerBreak
  let TimeRun = timeCreater.getTimeGeneratorFunction(timeLength);
  TimeRun = getTimeAndBindToTimer(TimeRun, showCounterTime, "Session", timerBreakCallback, "Session is over");
  let timerTime = countDown.init(TimeRun, countDownId);
  timerTime.name = "timerTime";

  timersStack.push(timerTime);

  function timerTimeCallback() {
    resetTimeTime();
    timersStack.pop();
    timersStack.push(timerTime);
    timerTime.start();
    domManipulator.changeTheme("time", "break", showCounterMain);
  }

  function timerBreakCallback() {
    resetTimeBreak();
    timersStack.pop();
    timersStack.push(timerBreak);
    timerBreak.start();
    domManipulator.changeTheme("break", "time", showCounterMain);
  }

  elem.addEventListener("click", getElement);

  function getElement(event) {
    var target = event.target;

    while(target !== event.currentTarget) {

      if (target.classList.contains('js-plus-time')) {
        if (isTikTak) {
          return;
        };

        timeLength = setTimeLengthForShowTime(timeLength, "up");

        resetTimeTime();

        if (timersStack[0].name === "timerTime") {
          timersStack.pop();
          timersStack.push(timerTime);
        }

        return;
      }

      if (target.classList.contains('js-minus-time')) {
        if (isTikTak) {
          return;
        };

        timeLength = setTimeLengthForShowTime(timeLength, "down");

        resetTimeTime();

        if (timersStack[0].name === "timerTime") {
          timersStack.pop();
          timersStack.push(timerTime);
        }

        return;
      }

      if (target.classList.contains('js-plus-break')) {
        if (isTikTak) {
          return;
        };

        breakLength = setTimeLengthForShowBreak(breakLength, "up");

        resetTimeBreak();

        if (timersStack[0].name === "timerBreak") {
          timersStack.pop();
          timersStack.push(timerBreak);
        }

        return;
      }

      if (target.classList.contains('js-minus-break')) {
        if (isTikTak) {
          return;
        };

        breakLength = setTimeLengthForShowBreak(breakLength, "down");

        resetTimeBreak();

        if (timersStack[0].name === "timerBreak") {
          timersStack.pop();
          timersStack.push(timerBreak);
        }

        return;
      }

      if (target.classList.contains('js-counter')) {
        if (isDone) {
          return;
        };

        if (isTikTak) {
          pauseAudio.play();
          isTikTak = timersStack[0].stop();
          showCounterMain.classList.add("stopped");
          domManipulator.enebleButtons(elem);
        } else {
          startAudio.play();
          domManipulator.clearStyles(showCounterBg, "top");
          isTikTak = timersStack[0].start();
          showCounterMain.classList.remove("stopped");
          domManipulator.disableButtons(elem);
        }

        return;
      }

      target = target.parentNode;
    }
  }

  function resetTimeTime() {
    TimeRun =  timeCreater.getTimeGeneratorFunction(timeLength);
    TimeRun = getTimeAndBindToTimer(TimeRun, showCounterTime, "Session", timerBreakCallback, "Session is over");
    timerTime = countDown.init(TimeRun, countDownId);
    timerTime.name = "timerTime";
  }

  function resetTimeBreak() {
    BreakRun = timeCreater.getTimeGeneratorFunction(breakLength);
    BreakRun = getTimeAndBindToTimer(BreakRun, showCounterTime, "Break", timerTimeCallback, "Break is over");
    timerBreak = countDown.init(BreakRun, countDownId);
    timerBreak.name = "timerBreak";
  }

  function bindShifterValueToElem(f, elem) {
    return function() {
      let result = f.apply(this, arguments);

      if (!result) {
        return;
      }

      elem.innerHTML = result;

      return result;
    }
  }

  function getTimeAndBindToTimer(timeFunc, showerElem, name, callback, message) {
    return function() {
      let time = timeFunc.apply(this, arguments);

      showCounterName.innerHTML = name;

      if (!time) {
        isDone = true;
        showerElem.innerHTML = "done";
        showCounterBg.style.top =  "0";
        doneAudio.play();
        notifier.notifyMe(message);

        // here may be an event signaling that session is finished

        setTimeout(function() {  // here is a delay, before callback will be started
          domManipulator.clearStyles(showCounterBg, "top");
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

}

let pomodorolock = new PomodoroClock({
  elem: document.querySelector(".pomodoro"),
  notifier: new Notifier(),
  domManipulator: new DomManipulator(),
  countDown: new CountDown(1000),
  shifterValue: new ShifterValue(),
  timeCreater: new TimeCreater()
});