const BaseError = require('../errors/base.error')
const postModel = require('../models/post.model')

module.exports = async function (req, res, next) {
	try {
		const post = await postModel.findById(req.params.id)
		const authorId = req.user.id
		console.log(authorId)
		console.log(post)
		if (post.author.toString() !== authorId) {
			return next(BaseError.BadRequest('Only author can edit this post'))
		}
		next()
	} catch (error) {
		return next(BaseError.BadRequest('Only author can edit this post'))
	}
}
