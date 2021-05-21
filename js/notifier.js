'use strict'

class Notifier {
  notifyMe(message) {
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
  }

  requestPermission() {
    Notification.requestPermission();
  }
}

