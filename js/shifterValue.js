class ShifterValue {
  set(value, expr) {
    if (expr === "up") {
      return ++value;
    }

    if (expr === "down" && value !== 1) {
      return --value;
    } else {
      return 1;
    }
  }
}