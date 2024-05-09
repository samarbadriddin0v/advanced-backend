require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const requestTime = require('./middlewares/request-time')

const app = express()

app.use(requestTime)
app.use(express.json())
app.use(express.static('static'))
app.use(fileUpload({}))

// Routes
app.use('/api/post', require('./routes/post.route'))

const PORT = process.env.PORT || 8080

const bootstrap = async () => {
	try {
		await mongoose
			.connect(process.env.DB_URL)
			.then(() => console.log('Connected DB'))

		app.listen(PORT, () =>
			console.log(`Listening on - http://localhost:${PORT}`)
		)
	} catch (error) {
		console.log(`Error connecting with DB: ${error}`)
	}
}

bootstrap()
