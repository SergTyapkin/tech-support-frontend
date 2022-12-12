export default class Model {
  default = {
  }

  _setDefault(cls = this) {
    for (const key in cls.default) {
      this[key] = cls.default[key];
    }
  }

  setDefault(cls = this) {
    this._setDefault(cls)
  }

  constructor() {
    this._setDefault();
  }

  set(data, cls = this) {
    for (let key in cls.default) {
      if (this.default.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }
}
