(function () {
	'use strict';

	describe('Chat Atcha -- the supreme messaging application', function () {
		describe('Message Constructor', function () {
			it('should receive a single parameter as a string', function () {
				var badFunctionCall = function() {
					var objMessage = new Message([]);
				};

				expect(badFunctionCall).to.throw(Error);
			});

			it('should require the string parameter to not be empty', function() {
				var badFunctionCall = function() {
					var objMessage = new Message('');
				};

				expect(badFunctionCall).to.throw(Error);
			});
		});

		describe('User Constructor', function() {
			it('should require a single parameter as a string', function() {
				var badFunctionCall = function() {
					var objUser = new User([]);
				};

				expect(badFunctionCall).to.throw(Error);
			});

			it('should require the string to be two characters in length', function() {
				var badFunctionCall = function() {
					var objUser = new User('123');
				};

				expect(badFunctionCall).to.throw(Error);
			});
		});

		describe('User Interface', function() {
			it('should require user initials before enabling the message box', function() {

			});

			it('should require user initials before enabling the send button', function() {

			});
		});
	});
})();