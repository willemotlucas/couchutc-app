import Realm from 'realm';

export default class AuthenticatedUser extends Realm.Object { }
AuthenticatedUser.schema = {
  name: 'AuthenticatedUser',
  properties: {
    id: 'int'
  }
};