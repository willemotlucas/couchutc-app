import Realm from 'realm';

import Home from './Home';
import HostingRequest from './HostingRequest';
import Message from './Message';
import User from './User';
import Image from './Image';


export default new Realm({ schema: [User, Home, Message, HostingRequest, Image] });