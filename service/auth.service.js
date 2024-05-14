const UserDto = require('../dtos/user.dto')
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const tokenService = require('./token.service')
const mailService = require('./mail.service')

class AuthService {
	async register(email, password) {
		const existUser = await userModel.findOne({ email })

		if (existUser) {
			throw new Error(`User with existing email ${email} already registered`)
		}

		const hashPassword = await bcrypt.hash(password, 10)
		const user = await userModel.create({ email, password: hashPassword })
		const userDto = new UserDto(user)

		await mailService.sendMail(email, `${process.env.API_URL}/api/auth/activation/${userDto.id}`)

		const tokens = tokenService.generateToken({ ...userDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { user: userDto, ...tokens }
	}

	async activation(userId) {
		const user = await userModel.findById(userId)

		if (!user) {
			throw new Error('User is not defined')
		}

		user.isActivated = true
		await user.save()
	}

	async login(email, password) {
		const user = await userModel.findOne({ email })
		if (!user) {
			throw new Error('User is not defined')
		}

		const isPassword = await bcrypt.compare(password, user.password)
		if (!isPassword) {
			throw new Error('Password is incorrect')
		}

		const userDto = new UserDto(user)

		const tokens = tokenService.generateToken({ ...userDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { user: userDto, ...tokens }
	}

	async logout(refreshToken) {
		return await tokenService.removeToken(refreshToken)
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw new Error('Bad authorization')
		}

		const userPayload = tokenService.validateRefreshToken(refreshToken)
		const tokenDb = await tokenService.findToken(refreshToken)
		if (!userPayload || !tokenDb) {
			throw new Error('Bad authorization')
		}

		const user = await userModel.findById(userPayload.id)
		const userDto = new UserDto(user)

		const tokens = tokenService.generateToken({ ...userDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { user: userDto, ...tokens }
	}
}

module.exports = new AuthService()
