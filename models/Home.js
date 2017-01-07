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
    updatedAt: 'date'
  }
};

class Home {

}

Home.schema = HomeSchema;


module.exports = Home;