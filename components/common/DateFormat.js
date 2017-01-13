const longMonths = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const shortMonths = ["Jan.", "Fev.", "Mar.", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Dec."];
const longWeekDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const shortWeekDays = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];

const DateFormat = {
	// Example: 16 Janvier
	getDateInLongString: (date) => {
		return date.getDate() + ' ' + longMonths[date.getMonth()];
	},

	// Example: 16 Jan.
	getDateInShortString: (date) => {
		return date.getDate() + ' ' + shortMonths[date.getMonth()];
	},

	// Example: Lun. 16 Janvier
	getDateInLongStringWithDay: (date) => {
		return shortWeekDays[date.getDay()] + ' ' + date.getDate() + ' ' + longMonths[date.getMonth()];
	},

	// Return ["Janvier", "Février" ...]
	getLongMonths: () => {
		return longMonths;
	},

	// Return ["Jan.", "Fev." ...]
	getShortWeekDays: () => {
		return shortWeekDays;
	}
}

module.exports = DateFormat;