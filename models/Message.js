import Realm from 'realm';

const MessageSchema = {
  name: 'Message',
  properties: {
  	id: 'int',
    sendAt: 'date',
    message: 'string',
    createdAt: 'date',
    updatedAt: 'date',
    from_user_id: 'int',
    to_user_id: 'int'
  }
};

class Message {

}

Message.schema = MessageSchema;


module.exports = Message;