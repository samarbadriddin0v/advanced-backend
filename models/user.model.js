const { Schema, model } = require('mongoose')

const UserSchema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		isActivated: { type: Boolean, default: false },
	},
	{ timestamps: true }
)

module.exports = model('User', UserSchema)
