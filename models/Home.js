import Realm from 'realm';

export default class Home extends Realm.Object { }
Home.schema = {
  name: 'Home',
  properties: {
    id: 'int',
    country: 'string',
    city: 'string',
    propertyType: 'string',
    sleepingAccomodation: 'string',
    maxGuestNumber: 'int',
    createdAt: 'date',
    updatedAt: 'date'
  }
};