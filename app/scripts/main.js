////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// UI SETUP
////////////////////////////////////////////////////////////
$('#message-box').prop('disabled', true);
$('#send-button').prop('disabled', true);

////////////////////////////////////////////////////////////
////////////////////////////////////////////////// VARIABLES
////////////////////////////////////////////////////////////
var strServerURL = 'http://tiny-pizza-server.herokuapp.com/collections/chat-messages/';

////////////////////////////////////////////////////////////
/////////////////////////////////////////////// CONSTRUCTORS
////////////////////////////////////////////////////////////
function Message(strMessage) {
	this.user = objUser.initials;
	this.message = strMessage;
	this.time = Date.now();
	this.meta = "";
	this.appID = "ChatAtcha";
}

function User(strInitials) {
	switch(true) {
		case !(typeof strInitials === "string"):
			throw new Error("Initials may only be in string format!");
			break;

		case strInitials.length !== 2:
			throw new Error("Initials may only be two characters!");
			break;

		default:
			break;
	}

	this.initials = strInitials.toUpperCase();
}

////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// MESSAGES
////////////////////////////////////////////////////////////
var messagesTemplate = _.template($('#messages-template').text());

function renderMessages(objMessage) {
  $('body').prepend(messagesTemplate(objMessage));
};

(function() {
	setInterval(function() {
		$.getJSON(strServerURL).done(function(objMessages) {
			renderMessages(objMessages);
		});
	}, 3000);
})();

////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// BUTTONS
////////////////////////////////////////////////////////////
$('#login-button').click(function() {
	var objUser = new User($('#user-initials-box').val());

	if (objUser) {
		$('#message-box').prop('disabled', false);
		$('#send-button').prop('disabled', false);

		$('#login-box').fadeOut('slow', function() {
			$('#login-box').remove();
		});
	}
});

$('#send-button').click(function() {
	var objMessage = new Message($('#message-box').val());
});