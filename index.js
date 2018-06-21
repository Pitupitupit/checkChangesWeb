var fetchUrl = require("fetch").fetchUrl,
	beep = require('beepbeep'),
	nodemailer = require('nodemailer'),
	fs = require('fs');

var urlContent,
	secInterval = 4,
	url = "http://dream.ict.pwr.wroc.pl/soi/",
	password;

fetchUrl(url, function(err, meta, body){
	//console.log(body.toString());
	if(err){
		console.log(err);
		process.exit(1);
	}
	else {
		urlContent = body.toString();
		fs.readFile('haslo.txt', 'utf8', function(err,data){
			if(err) {
				console.log(err);
			}
			password = data;
			//console.log(password);
		});
		myLoop();
	}
});
                 
function myLoop () {           
	setTimeout(function () {     
		fetchUrl(url, function(err, meta, body){
			if(err){
				console.log("BŁĄD: " + err);
			}
			else {
				if(body.toString().localeCompare(urlContent) != 0){
					console.log("różne");
					send(function(){
						beep(2);
						process.exit(0);
					});
				} 
				else
				{
					console.log("takie same");
					myLoop();
				}
			}
		});	
    }, secInterval*1000)
}

var mailOptions = {
  from: 'wiarygodnyimejl@gmail.com',
  to: 'piotrekgrochalski@gmail.com',
  subject: 'SPRAWDZIŁ COŚ',
  text: url
};

function send(callback){
	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
		user: 'wiarygodnyimejl@gmail.com',
		pass: password
	  }
	});
	
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
		console.log(error);
	  } else {
		console.log('Email sent: ' + info.response);
	  }
	  callback();
	});
}	