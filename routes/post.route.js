const express = require('express')
const postController = require('../controllers/post.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const authorMiddleware = require('../middlewares/author.middleware')

const router = express.Router()

router.get('/get', postController.getAll)
router.post('/create', postController.create)
router.delete('/delete/:id', postController.delete)
router.put('/edit/:id', postController.edit)
router.get('/get-one/:id', postController.getOne)

module.exports = router
