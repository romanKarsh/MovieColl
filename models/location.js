/* Student mongoose model */
const mongoose = require('mongoose')

const Location = mongoose.model('Location', {
	name: {
		type: String,
		required: true,
		minlegth: 1,
		trim: true,
		unique: true,
	},
	num_movies: {
		type: Number,
		required: true,
		default: 0
	}
})

module.exports = { Location }