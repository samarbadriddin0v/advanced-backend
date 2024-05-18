const UserDto = require('../dtos/user.dto')
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const tokenService = require('./token.service')
const mailService = require('./mail.service')
const BaseError = require('../errors/base.error')

class AuthService {
	async register(email, password) {
		const existUser = await userModel.findOne({ email })

		if (existUser) {
			throw BaseError.BadRequest(`User with existing email ${email} already registered`)
		}

		const hashPassword = await bcrypt.hash(password, 10)
		const user = await userModel.create({ email, password: hashPassword })
		const userDto = new UserDto(user)

		await mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activation/${userDto.id}`)

		const tokens = tokenService.generateToken({ ...userDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { user: userDto, ...tokens }
	}

	async activation(userId) {
		const user = await userModel.findById(userId)

		if (!user) {
			throw BaseError.BadRequest('User is not defined')
		}

		user.isActivated = true
		await user.save()
	}

	async login(email, password) {
		const user = await userModel.findOne({ email })
		if (!user) {
			throw BaseError.BadRequest('User is not defined')
		}

		const isPassword = await bcrypt.compare(password, user.password)
		if (!isPassword) {
			throw BaseError.BadRequest('Password is incorrect')
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
			throw BaseError.UnauthorizedError('Bad authorization')
		}

		const userPayload = tokenService.validateRefreshToken(refreshToken)
		const tokenDb = await tokenService.findToken(refreshToken)
		if (!userPayload || !tokenDb) {
			throw BaseError.UnauthorizedError('Bad authorization')
		}

		const user = await userModel.findById(userPayload.id)
		const userDto = new UserDto(user)

		const tokens = tokenService.generateToken({ ...userDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { user: userDto, ...tokens }
	}

	async getUsers() {
		return await userModel.find()
	}

	async forgotPassword(email) {
		if (!email) {
			throw BaseError.BadRequest('Email is required')
		}

		const user = await userModel.findOne({ email })
		if (!user) {
			throw BaseError.BadRequest('User with existing email is not found')
		}

		const userDto = new UserDto(user)

		const tokens = tokenService.generateToken({ ...userDto })

		await mailService.sendForgotPasswordMail(email, `${process.env.CLIENT_URL}/recovery-account/${tokens.accessToken}`)

		return 200
	}

	async recoveryAccount(token, password) {
		if (!token) {
			throw BaseError.BadRequest('Something went wrong with token')
		}

		const userData = tokenService.validateAccessToken(token)
		if (!userData) {
			throw BaseError.BadRequest('Expired access to your account')
		}

		const hashPassword = await bcrypt.hash(password, 10)
		await userModel.findByIdAndUpdate(userData.id, { password: hashPassword })
		return 200
	}
}

module.exports = new AuthService()
