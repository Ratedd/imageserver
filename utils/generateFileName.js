const { access, constants } = require('fs');
const { v4: uuidv4 } = require('uuid');
const { join } = require('path');

const checkFileExist = (fileName, extension) => {
	return new Promise((resolve) => {
		const filePath = join(__dirname, '..', 'uploads', extension, fileName);
		access(filePath, constants.F_OK, (err) => {
			if (err) {
				resolve(false);
			}
			resolve(true);
		});
	});
};

const generateFileName = async (extension) => {
	const fileName = `${uuidv4()}.${extension}`;
	const isFileExist = await checkFileExist(fileName, extension);
	if (isFileExist) {
		return generateFileName(extension);
	}
	return fileName;
};

module.exports = generateFileName