

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
	res.success('You made it to the logIn function in the Parse Cloud Code!')
});
