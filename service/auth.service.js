const UserDto = require('../dtos/user.dto')
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')

class AuthService {
	async register(email, password) {
		const existUser = await userModel.findOne({ email })

		if (existUser) {
			throw new Error(`User with existing email ${email} already registered`)
		}

		const hashPassword = await bcrypt.hash(password, 10)
		const user = await userModel.create({ email, password: hashPassword })
		// email service

		// jwt generatsiya

		const userDto = new UserDto(user)

		// token
		return { userDto }
	}

	async activation(userId) {
		const user = await userModel.findById(userId)

		if (!user) {
			throw new Error('User is not defined')
		}

		user.isActivated = true
		await user.save()
	}
}

module.exports = new AuthService()
