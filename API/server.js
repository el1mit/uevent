require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/ErrorMiddleware');
const eventService = require('./services/EventService');

const PORT = process.env.SERVER_URL.split(':')[2] || 8080;
const app = express();

app.use(fileUpload());
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: [process.env.CLIENT_URL],
		credentials: true,
		optionsSuccessStatus: 200,
	})
);
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
	try {
		await mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		app.listen(PORT, () => {
			console.log(`Server started on PORT ${PORT}\n${process.env.SERVER_URL}`);
		});
	} catch (e) {
		console.log(e);
	}
	setInterval(function () {
		eventService.setActiveEventsInactive();
	}, 60 * 1000); // every minute
};

start();
