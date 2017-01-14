import Realm from 'realm';

export default class User extends Realm.Object { 
  age() {
    return Math.floor(Math.floor((Date.now() - this.birthday.getTime())) / 31557600000);
  }
}

User.schema = {
  name: 'User',
  properties: {
    id: 'int',
    firstName: 'string',
    lastName: 'string',
    birthday: 'date',
    gender: 'string',
    profilePicture: {type: 'Image', optional: true},
    biography: 'string',
    visitedCountries: 'string',
    smoker: 'bool',
    hosting: 'bool',
    speciality: 'string',
    phoneNumber: 'string',
    createdAt: 'date',
    updatedAt: 'date',
    home: 'Home',
    mail:'string',
    password:'string'
  }
};