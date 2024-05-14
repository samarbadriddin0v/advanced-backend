const postService = require('../service/post.service')

class PostController {
	async getAll(req, res, next) {
		try {
			const allPosts = await postService.getAll()
			res.status(200).json(allPosts)
		} catch (error) {
			next(error)
		}
	}

	async create(req, res, next) {
		try {
			const post = await postService.create(req.body, req.files.picture, req.user.id)
			res.status(201).json(post)
		} catch (error) {
			next(error)
		}
	}

	async delete(req, res, next) {
		try {
			const post = await postService.delete(req.params.id)
			res.status(200).json(post)
		} catch (error) {
			next(error)
		}
	}

	async edit(req, res, next) {
		try {
			const { body, params } = req
			const post = await postService.edit(body, params.id)
			res.status(200).json(post)
		} catch (error) {
			next(error)
		}
	}

	async getOne(req, res, next) {
		try {
			const post = await postService.getOne(req.params.id)
			res.status(200).json(post)
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new PostController()
