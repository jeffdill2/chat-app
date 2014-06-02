////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// UI SETUP
////////////////////////////////////////////////////////////
$(document).ready(function() {
	$('#message-input-box').prop('disabled', true);
	$('#send-button').prop('disabled', true);
	$('#auto-scroll').prop('checked', true);

	$('#user-initials-box').focus();
});

////////////////////////////////////////////////////////////
////////////////////////////////////////////////// VARIABLES
////////////////////////////////////////////////////////////
var strChatMessagesURL = 'http://tiny-pizza-server.herokuapp.com/collections/chat-messages/';
var objUser = new User();

////////////////////////////////////////////////////////////
/////////////////////////////////////////////// CONSTRUCTORS
////////////////////////////////////////////////////////////
function Message(strMessage) {
	switch(true) {
		case !(typeof strMessage === "string"):
			throw new Error("The message may only be in string format!");
			break;

		case strMessage.length <= 0:
			throw new Error("The message must have some content to it!");
			break;

		default:
			break;
	}

	this.user = objUser.getInitials();
	this.message = strMessage;
	this.time = Date.now();
	this.meta = "";
	this.appID = "ChatAtcha";
}

function User() {
	this.setInitials = function(strInitials) {
		switch(true) {
			case !(typeof strInitials === "string"):
				alert("You must put in your initials (first name & last name) before logging in to chat...");
				throw new Error("Initials may only be in string format!");
				break;

			case strInitials.length !== 2:
				alert("You must put in your initials (first name & last name) before logging in to chat...");
				throw new Error("Initials may only be two characters!");
				break;

			default:
				break;
		}

		this.initials = strInitials.toUpperCase();
	};

	this.getInitials = function() {
		return this.initials;
	}
}

////////////////////////////////////////////////////////////
//////////////////////////////////////////// MESSAGE LOADING
////////////////////////////////////////////////////////////
var messagesTemplate = _.template($('#messages-template').text());

function renderMessages(objMessage) {
	$('#messages-container').append(messagesTemplate(objMessage));
}

function messageLoader() {
	var strLastMessageID;

	retrieveData(strChatMessagesURL).done(function(data) {
		data.forEach(function(objMessage) {
			if (verifyMessages(objMessage)) {
				objMessage.time = moment(parseInt(objMessage.time)).format("MMMM Do YYYY, hh:mm a");

				renderMessages(objMessage);
			}

			strLastMessageID = objMessage._id;
		});
	});

	window.scrollTo(0,document.body.scrollHeight);

	setInterval(function() {
		var bolNewMessages = false;

		retrieveData(strChatMessagesURL).done(function(data) {
			data.forEach(function(objMessage) {
				if (bolNewMessages) {
					if (verifyMessages(objMessage)) {
						objMessage.time = moment(parseInt(objMessage.time)).format("MMMM Do YYYY, hh:mm a");

						renderMessages(objMessage);
					}

					strLastMessageID = objMessage._id;
				}

				if (!bolNewMessages && (objMessage._id === strLastMessageID)) {
					bolNewMessages = true;
				}
			});
		});

		if (bolAutoRefresh()) {
			window.scrollTo(0,document.body.scrollHeight);
		}
	}, 100);
}

function retrieveData(strDataURL) {
	return $.getJSON(strDataURL).done(function(data) {
		return data.reverse();
	});
}

function verifyMessages(objMessage) {
	switch (true) {
		case typeof objMessage.time === 'undefined':
			return false;
			break;

		case typeof objMessage.message === 'undefined':
			return false;
			break;

		case typeof objMessage.user === 'undefined':
			return false;
			break;

		case typeof objMessage.appID === 'undefined':
			return false;
			break;

		default:
			return true;
			break;
	}
}

function postMessage(objMessage) {
	$.post(strChatMessagesURL, objMessage);
}

function bolAutoRefresh() {
	if ($('#auto-scroll').prop('checked')) {
		return true;
	} else {
		return false;
	}
}

////////////////////////////////////////////////////////////
//////////////////////////////////////////////// KEY PRESSES
////////////////////////////////////////////////////////////
$('#message-input-box').keypress(function(key) {
	if (key.keyCode == '13') {
		key.preventDefault();
        
        $('#send-button').trigger('click');
	}
});

$('#user-initials-box').keypress(function(key) {
	if (key.keyCode == '13') {
		key.preventDefault();

		$('#login-button').trigger('click');
	}
});

////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// BUTTONS
////////////////////////////////////////////////////////////
$('#login-button').click(function() {
	objUser.setInitials($('#user-initials-box').val());

	if (objUser) {
		$('#message-input-box').prop('disabled', false);
		$('#send-button').prop('disabled', false);

		$('#login-box').fadeOut('slow', function() {
			$('#login-box').remove();
		});

		$('#message-input-box').focus();

		messageLoader();
	}
});

$('#send-button').click(function() {
	var objMessage = new Message($('#message-input-box').val());

	postMessage(objMessage);

	$('#message-input-box').val('');
});