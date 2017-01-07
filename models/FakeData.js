import Realm from 'realm';
import User from './User';
import Home from './Home';
import Message from './Message';
import HostingRequest from './HostingRequest';

let realm = new Realm({schema: [User, Home, HostingRequest, Message]});

const FakeData = {

	writeHostingRequests: function() {
		const hostingRequests = [
			{
	        	id: 1,
	        	startingDate: new Date('2016-01-14'),
			    endingDate: new Date('2016-01-15'),
			    numberOfGuest: 1,
			    message: 'Le petit message de test',
			    createdAt: new Date(),
			    updatedAt: new Date(),
			    guest_id: 1,
			    host_id: 3
	    	},
	    	{
	    		id: 2,
			    startingDate: new Date('2016-01-20'),
			    endingDate: new Date('2016-01-22'),
			    numberOfGuest: 1,
			    message: 'Le petit message de test',
			    createdAt: new Date(),
			    updatedAt: new Date(),
			    guest_id: 2,
			    host_id: 1
    		}
		];

        realm.write(() => {
            hostingRequests.forEach((hostingRequest) => {
                realm.create('HostingRequest', hostingRequest);
            });
        });
    },

	writeUsersWithHomes: function() {
		const hostingRequests = realm.objects('HostingRequest');
		const hostingRequest1 = hostingRequests.filtered('id = ' + 1);
		const hostingRequest2 = hostingRequests.filtered('id = ' + 2);

 		const users = [
			{
	            id: 1,
	            firstName:  'Lucas',
	            lastName: 'Willemot',
	            birthday: new Date('1994-04-30'),
	            gender: 'Male',
	            biography: 'Je vous attends !',
	            visitedCountries: 'France, Allemagne, Indonésie, Croatie, Portugal, Italie',
	            smoker: false,
	            hosting: true,
	            speciality: 'Génie Informatique',
	            phoneNumber: '0661065110',
	            createdAt: new Date(),
	            updatedAt: new Date(),
	            home: {
	                id: 1,
	                country: 'France',
	                city: 'Blois',
	                propertyType: 'Appartement',
	                sleepingAccomodation: 'Pièce public',
	                maxGuestNumber: 2,
	                createdAt: new Date(),
	                updatedAt: new Date(),
	            }
	        },
	        {
	            id: 2,
	            firstName:  'Valentin',
	            lastName: 'Paul',
	            birthday: new Date('1994-05-14'),
	            gender: 'Male',
	            biography: 'Je vous attends !',
	            visitedCountries: 'France, Allemagne, Indonésie, Croatie, Portugal, Italie',
	            smoker: false,
	            hosting: true,
	            speciality: 'Génie Informatique',
	            phoneNumber: '0661065110',
	            createdAt: new Date(),
	            updatedAt: new Date(),
	            home: {
	                id: 2,
	                country: 'Canada',
	                city: 'Montréal',
	                propertyType: 'Appartement',
	                sleepingAccomodation: 'Chambre privée',
	                maxGuestNumber: 3,
	                createdAt: new Date(),
	                updatedAt: new Date(),
	            }
	        },
	        {
	            id: 3,
	            firstName:  'Alexandra',
	            lastName: 'Duval',
	            birthday: new Date('1994-08-13'),
	            gender: 'Female',
	            biography: 'Je vous attends !',
	            visitedCountries: 'France, Allemagne, Indonésie, Croatie, Portugal, Italie',
	            smoker: false,
	            hosting: true,
	            speciality: 'Génie Informatique',
	            phoneNumber: '0661065110',
	            createdAt: new Date(),
	            updatedAt: new Date(),
	            home: {
	                id: 3,
	                country: 'France',
	                city: 'Rennes',
	                propertyType: 'Maison',
	                sleepingAccomodation: 'Chambre privée',
	                maxGuestNumber: 4,
	                createdAt: new Date(),
	                updatedAt: new Date(),
	            }
	        }
		];

		realm.write(() => {
            users.forEach((user) => {
                realm.create('User', user);
            });
        });
	},

	writeMessages: function() {
		const messages = [
			{
	        	id: 1,
			    sendAt: new Date('2016-01-20'),
			    message: 'Coucou, je voulais des infos',
			    createdAt: new Date('2016-01-20'),
			    updatedAt: new Date('2016-01-20'),
			    from_user_id: 1,
			    to_user_id: 3
	    	},
	    	{
	    		id: 1,
			    sendAt: new Date('2016-01-21'),
			    message: 'Salut, que veux-tu savoir ?',
			    createdAt: new Date('2016-01-21'),
			    updatedAt: new Date('2016-01-21'),
			    from_user_id: 3,
			    to_user_id: 1
    		}
		];

        realm.write(() => {
            messages.forEach((message) => {
                realm.create('Message', message);
            });
        });
    },

	write: function(){
		if(realm.objects('User').length == 0){
			this.writeHostingRequests();
			this.writeUsersWithHomes();
			this.writeMessages();
		}
	}
}

module.exports = FakeData;