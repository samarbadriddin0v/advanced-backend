const logger = function (req, res, next) {
	console.log('Post request')
	next()
}

module.exports = logger
