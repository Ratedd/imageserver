const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(helmet());
app.use('/', require('./routes/upload'));

app.listen(3000, () => {
	console.log('Server started on port 3000');
});
