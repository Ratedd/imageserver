const { access, constants } = require('fs');
const { v4: uuidv4 } = require('uuid');

const checkFileExist = (fileName, extension) => {
	return new Promise((resolve, reject) => {
		access(`../uploads/${extension}/fileName`, constants.F_OK, (err) => {
			if (!err) {
				resolve(true);
			}
			resolve(false);
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