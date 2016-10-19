class DomManipulator {
  changeTheme(newTheme, oldTeme, elem) {
    elem.classList.add(newTheme);
    elem.classList.remove(oldTeme);
  }


  clearStyles(elem, ...rest) {
    for (let i = 0; i < rest.length; i++) {
      elem.style[rest[i]] = "";
    }
  }

  enebleButtons(elem) {
    let btns = elem.querySelectorAll(".btn");

    btns.forEach(btn => btn.classList.remove("disabled"));
  }

  disableButtons(elem) {
    let btns = elem.querySelectorAll(".btn");

    btns.forEach(btn => btn.classList.add("disabled"));
  }
}


