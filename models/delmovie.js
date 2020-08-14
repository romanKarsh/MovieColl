/* Movie mongoose model */
const mongoose = require('mongoose')

const Delmovie = mongoose.model('Delmovie', {
	name: {
		type: String,
		required: true,
		minlegth: 1,
		trim: true
	},
	location: {
		type: String,
		required: true,
		minlegth: 1,
		trim: true
	},
	location_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	dvd: {
		type: Boolean,
		required: true
	},
	bluray: {
		type: Boolean,
		required: true
	},
	datedel: {
		type: Date,
		required: true
	},
	path: {
		type: String
	},
	number: {
		type: Number
	}
})

module.exports = { Delmovie }