const { Router } = require('express');
const multer = require('multer');
const mimeAllowed = ['image/png', 'image/jpeg', 'image/gif'];
const generateFileName = require('../utils/generateFileName');

const storage = multer.diskStorage({
	destination: function (req, file, next) {
		const extension = file.mimetype.split('/')[1];
		next(null, `./uploads/${extension}`);
	},
	filename: async function (req, file, next) {
		const extension = file.mimetype.split('/')[1];
		const fileName = await generateFileName(extension);
		next(null, fileName);
	}
});

const upload = multer({ 
	storage: storage, 
	fileFilter: (req, file, next) => {
		if (!mimeAllowed.includes(file.mimetype)) {
			return next(new Error('Only image files are allowed!'));
		}
		next(null, true);
	}
});

const router = Router();

router.post('/upload', upload.single('item'), (req, res) => {
	if (req.file.filename != undefined) {
		const fileName = req.file.filename;
		const extension = req.file.mimetype.split('/')[1];
		res.json({ message: `/uploads/${extension}/${fileName}` });
	}
});

router.get('/uploads/:file', (req, res) => {
	const fileName = req.params.file;
	const extension = fileName.split('.')[1];
	res.sendFile(`/uploads/${extension}/${fileName}`, { root: '.' });
});

module.exports = router;

