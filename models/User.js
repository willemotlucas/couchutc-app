import Realm from 'realm';

const UserSchema = {
  name: 'User',
  properties: {
  	id: 'int',
    firstName: 'string',
    lastName: 'string',
    birthday: 'date',
    gender: 'string',
    profilePicture: {type: 'data', optional: true},
    biography: 'string',
    visitedCountries: 'string',
    smoker: 'bool',
    hosting: 'bool',
    speciality: 'string',
    phoneNumber: 'string',
    createdAt: 'date',
    updatedAt: 'date',
    home: 'Home'
  }
};

class User {
	age() {
		return Math.floor(Math.floor((Date.now() - this.birthday.getTime())) / 31557600000);
	}
}

User.schema = UserSchema;


module.exports = User;