require("../app.js")

//Parse.serverURL = 'https://glo-app.heroku.com/parse'
//Parse.serverURL = 'http://glo-app.heroku.com/parse';
var twilioAccountSid = 'AC00005f471ceffbd434f16b13f4ac2fc0';
var twilioAuthToken = '7072c3bd9cf623af8de3bf54c051f113';
var twilioPhoneNumber = '+16512044949';
var secretPasswordToken = 's0ftlyAs1f1PlayPianoInTh3D@rk';

var twilio = require('twilio')(twilioAccountSid, twilioAuthToken);

//Parse.serverURL = 'https://glo-app.heroku.com/parse/'

Parse.Cloud.define("logIn", function(req, res) {
/*	Parse.Cloud.useMasterKey();

		var phoneNumber = req.params.phoneNumber;
			phoneNumber = phoneNumber.replace(/\D/g, '');

			if (phoneNumber && req.params.codeEntry) {
				Parse.User.logIn(phoneNumber, secretPasswordToken + req.params.codeEntry).then(function (user) {
					res.success(user.getSessionToken());
				}, function (err) {
					res.error(err);
				});
			} else {
				res.error('Invalid parameters.');
			}
			*/
	console.log('Here I am in the Parse Cloud Code Login Function');
	
	var testObject = new Parse.Object('TestObject')
        testObject.set('Turd', 'Ferguson');
        console.log('Made it past creating the new Parse Object');
        testObject.save(null, {
		   useMasterKey: true,
                   success: function(testObject) {
                                        // Execute any logic that should take place after the object is saved.
                                        alert('New object created with objectId: ' + testObject.id);
					res.success('You made it to the logIn function in the Parse Cloud Code!');
                                         },
                   error: function(testObject, error) {
                                      // Execute any logic that should take place if the save fails.
                                     // error is a Parse.Error with an error code and message.
                                      alert('Failed to create new object, with error code: ' + error.message);
				      res.error('Ay Dios Mio');
                                       }
        });

});

Parse.Cloud.define("sendCode", function(req, res) {
	console.log('Enter the sendCode function')
	//res.success('You made it to the sendCode function in the Parse Cloud Code!')
	
	//var user = req.user; // request.user replaces Parse.User.current()
	//var token = user.getSessionToken(); // get session token from request.user

	var phoneNumber = req.params.phoneNumber;
	phoneNumber = phoneNumber.replace(/\D/g, '');
	console.log('heres the given phone number: ' + phoneNumber)
	//var lang = req.params.language;
	//if(lang !== undefined && languages.indexOf(lang) != -1) {
	//	language = lang;
	//}

	//Parse.Cloud.useMasterKey();

	if (!phoneNumber || phoneNumber.length != 10) return res.error('Invalid Parameters');
	console.log('about to start the parse user query')
	//Parse.Cloud.useMasterKey();
	var query = new Parse.Query(Parse.User);
	//query.equalTo({ useMasterKey: true });
	console.log('query was just defined');
	query.equalTo('username', phoneNumber + "");
	/*
	query.first({ useMasterKey: true,
		success: function(results) {
			console.log('Inside Success for cloud query ' + results)
			res.success('Aww Yissss')
		},
		error: function(error) {
			error.message("Query failed");
			res.error(error);
		}
	});
	*/
	
	/*
	.then(function(result){
		if (result) {
			console.log('im in it and I cant get out')
			res.success()
		} else {
			console.log('oh no itzan error');
			res.error()
		}
	
	}, function (err) {
		res.error(err);
	});
	*/
	query.first({ useMasterKey: true }).then(function(result) {
		console.log('proceeding to generate random 4-digit code')
		var min = 1000; var max = 9999;
		var num = Math.floor(Math.random() * (max - min + 1)) + min;
		if (result) {
			console.log('get a query result: ' + result);
			result.setPassword(secretPasswordToken + num);
			//result.set("language", language);
			result.save().then(function() {
				return sendCodeSms(phoneNumber, num);
			}).then(function() {
				res.success({});
			}, function(err) {
				res.error(err);
			});
		} else {
			console.log('Proceeding to sendSMS')		
			sendCodeSms(phoneNumber, num);
		}
			/* Going to simply try sending a message here first, then will go into creating a user with provided credentials
			var user = new Parse.User();
			user.setUsername(phoneNumber);
			user.setPassword(secretPasswordToken + num);
			//user.set("language", language);
			user.setACL({});
			user.save().then(function(a) {
				return sendCodeSms(phoneNumber, num);
			}).then(function() {
				res.success({});
			}, function(err) {
				res.error(err);
			});
			
		}
	}, function (err) {
		res.error(err);
	});
	*/
	}
});


function sendCodeSms(phoneNumber, code) {
	var prefix = "+1";
/* Commenting out the language choosing section, this app will only be for US to start
		if(typeof language !== undefined && language == "ja") {
			prefix = "+81";
		} else if (typeof language !== undefined && language == "kr") {
			prefix = "+82";
			phoneNumber = phoneNumber.substring(1);
		} else if (typeof language !== undefined && language == "pt-BR") {
			prefix = "+55";
		}
*/
	var promise = new Parse.Promise();

	console.log('about to send a twilio SMS')

	twilio.sendSms({
		//to: prefix + phoneNumber.replace(/\D/g, ''),
		to: prefix + phoneNumber.replace(/\D/g, ''),
		from: twilioPhoneNumber.replace(/\D/g, ''),
		body: 'Your login code for GLO is ' + code
	}, function(err, responseData) {
		if (err) {
			console.log(err);
			promise.reject(err.message);
		} else {
			promise.resolve();
		}
	});
	return promise;
}


