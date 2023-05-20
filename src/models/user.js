import Model from "./model";

export default class User extends Model {
  default = {
    id: null,
    isLogined: false,
    isGotten: false,
    isConfirmedByAdmin: false,
    isConfirmedEmail: false,
    joinedDate: '',
    email: "",
    telegram: "",
    firstName: "",
    secondName: "",
    thirdName: "",
    password: "",
    avatarImageId: null,
    title: null,
    completedEvents: [],
    rating: 0,
    position: 0,

    canEditAchievements: false,
    canAssignAchievements: false,
    canConfirmNewUsers: false,
    canEditEvents: false,
    canEditUsersTitles: false,
    canEditParticipations: false,
    canEditDocs: false,
    canEditPlaces: false,
    canEditPositions: false,
    canExecuteSQL: false,

    canAccessAdminPage: false,
  }

  set(data) {
    super.set(data);
    this.isLogined = true;
    this.isGotten = true;
    this.name = this.firstName + " " + (this.thirdName ? this.thirdName : '');
    this.canAccessAdminPage =
      this.canEditAchievements ||
      this.canAssignAchievements ||
      this.canConfirmNewUsers ||
      this.canEditEvents ||
      this.canEditUsersTitles ||
      this.canEditParticipations ||
      this.canEditDocs ||
      this.canEditPlaces ||
      this.canEditPositions ||
      this.canExecuteSQL;
  }

  setDefault() {
    super._setDefault(this);
    this.isGotten = true;
    this.name = ""
  }

  constructor() {
    super();
    this._setDefault();
  }
}
