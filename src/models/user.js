import Model from "./model";

export default class User extends Model {
  default = {
    id: null,
    isLogined: false,
    isGotten: false,
    isConfirmedByAdmin: false,
    isAdmin: false,
    isConfirmedEmail: false,
    joinedDate: '',
    email: "",
    name: "",
    password: "",
    avatarImageId: null,
    title: null,
    completedEvents: [],
    rating: 0,
    position: 0,
  }

  set(data) {
    super.set(data);
    this.isLogined = true;
    this.isGotten = true;
  }

  setDefault() {
    super._setDefault(this);
    this.isGotten = true;
  }

  constructor() {
    super();
    this._setDefault();
  }
}
