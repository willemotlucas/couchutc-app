import Realm from 'realm';

import Home from './Home';
import HostingRequest from './HostingRequest';
import Message from './Message';
import User from './User';


export default new Realm({ schema: [User, Home, Message, HostingRequest] });