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

  enebleElems(elem, cssClass) {
    let elems = elem.querySelectorAll(`.${cssClass}`);

    elems.forEach(el => el.classList.remove("disabled"));
  }

  disableElems(elem, cssClass) {
    let elems = elem.querySelectorAll(`.${cssClass}`);

    elems.forEach(el => el.classList.add("disabled"));
  }
}
