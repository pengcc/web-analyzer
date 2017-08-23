const express  = require('express');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');
const docParser = require('./docparser.js');
const app = express();
const Config = {
	port: 3000,
	env: 'PROD'
};
const static_path = {
	DEV: path.join(__dirname, 'dest'),
	PROD: path.join(__dirname, 'build')
};

app.post('/analysis', bodyParser.json(), (req, res) => {
	let data = req.body;
	let url = data.pageurl;
	let report_data = {
		succeed: true,
		report: {
		}
	};

	request(url, (error, response, html) => {
		if (!error && response && response.statusCode === 200) {
			let parser = docParser(html);
			let doctype = parser.getDoctype();
			let pagetitle = parser.getPagetitle();
			let headings = parser.getHeadings();
			let links = parser.getLinks(url);
			let loginform = parser.getLoginForm();

			report_data.report = { doctype, pagetitle, headings, links, loginform};
			res.json(report_data);
		} else {
			report_data.succeed = false;
			let statusCode,
		 		errormessage;
			if (response) {
				statusCode = response.statusCode;
				errormessage = error;
			} else {
				statusCode = 'ERR_NAME_NOT_RESOLVED';
				errormessage = 'This site can’t be reached';
			}
			report_data.report.statusCode = statusCode;
			report_data.report.errormessage = errormessage;
			res.json(report_data);
		}
	});

});


// set the static folder path for the development and production
app.use('/', express.static(static_path[Config.env]));

app.listen(Config.port);
console.log(`Server is listening on ${Config.port}.`);
