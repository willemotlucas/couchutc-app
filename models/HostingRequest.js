import Realm from 'realm';

const HostingRequestSchema = {
  name: 'HostingRequest',
  properties: {
  	id: 'int',
    startingDate: 'date',
    endingDate: 'date',
    numberOfGuest: 'int',
    message: 'string',
    createdAt: 'date',
    updatedAt: 'date',
    guest_id: 'int',
    host_id: 'int'
  }
};

class HostingRequest {

}

HostingRequest.schema = HostingRequestSchema;


module.exports = HostingRequest;