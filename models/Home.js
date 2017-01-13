import Realm from 'realm';

const HomeSchema = {
  name: 'Home',
  properties: {
  	id: 'int',
    country: 'string',
    city: 'string',
    propertyType: 'string',
    sleepingAccomodation: 'string',
    maxGuestNumber: 'int',
    createdAt: 'date',
    updatedAt: 'date',
    photos: {type: 'list', objectType: 'Image'}
  }
};

class Home {

}

Home.schema = HomeSchema;


module.exports = Home;