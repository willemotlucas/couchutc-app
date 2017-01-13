import Realm from 'realm';

export default class HostingRequest extends Realm.Object { }
HostingRequest.schema = {
  name: 'HostingRequest',
  properties: {
    id: 'int',
    startingDate: 'date',
    endingDate: 'date',
    numberOfGuest: 'int',
    message: 'string',
    status: 'string',
    createdAt: 'date',
    updatedAt: 'date',
    guest_id: 'int',
    host_id: 'int'
  }
};