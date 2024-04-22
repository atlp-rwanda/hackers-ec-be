require("dotenv").config();

module.exports = {
	development: {
		url: process.env.DB_DEV_URL,
	},
	test: {
		url: process.env.DB_TEST_URL,
	},
	production: {
		url: process.env.DB_PROD_URL,
	},
};
