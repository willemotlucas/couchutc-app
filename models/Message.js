import Realm from 'realm';

export default class Message extends Realm.Object { }
Message.schema = {
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