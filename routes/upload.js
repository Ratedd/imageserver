const { Router } = require('express');
const { access, constants } = require('fs');
const multer = require('multer');
const mimeAllowed = ['image/png', 'image/jpeg', 'image/gif', 'video/mp4', 'text/plain'];
const generateFileName = require('../utils/generateFileName');

const storage = multer.diskStorage({
	destination: function (req, file, next) {
		let extension;
		if (file.mimetype !== 'text/plain') {
			extension = file.mimetype.split('/')[1];
		}
		else {
			extension = 'txt';
		}
		next(null, `./uploads/${extension}`);
	},
	filename: async function (req, file, next) {
		let extension;
		if (file.mimetype !== 'text/plain') {
			extension = file.mimetype.split('/')[1];
		} else {
			extension = 'txt';
		}
		const fileName = await generateFileName(extension);
		next(null, fileName);
	},
});

const upload = multer({ 
	storage: storage, 
	fileFilter: (req, file, next) => {
		if (req.body.password !== process.env.PASS) {
			return next(new Error('Wrong password!'), false);
		}
		if (!mimeAllowed.includes(file.mimetype)) {
			return next(new Error('Only image files are allowed!'), false);
		}
		next(null, true);
	}
}).single('item');

const router = Router();

router.post('/upload', (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.status(400);
			res.json({ message: 400 });
		}
		else {
			if (req.file.filename != undefined) {
				const fileName = req.file.filename;
				res.json({ message: `${fileName}` });
			}
		}
	});
});

router.get('/:file', async (req, res) => {
	const fileName = req.params.file;
	const extension = fileName.split('.')[1];
	const exists = await access(`../uploads/${extension}/fileName`, constants.F_OK, (err) => {
		if (!err) {
			resolve(true);
		}
		resolve(false);
	});
	if (exists) {
		return res.sendFile(`/uploads/${extension}/${fileName}`, { root: '.' });
	}
	return res.json({ message: '404' })
});

module.exports = router;

