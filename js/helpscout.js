var helpscout = {

	API_KEY: null,
	BASE_URI: 'https://api.helpscout.net/v1',
	BASE_DASHBOARD : 'https://secure.helpscout.net/mailbox/',
	BASE_CONVERSATION : 'https://secure.helpscout.net/conversation/',

	getListMailboxes: function() {
		var data = this.connectToWebservice('/mailboxes.json')

		var mailboxes = data['items'];

		return mailboxes
	},

	getListFolders: function (mailboxId) {
		var data = this.connectToWebservice('/mailboxes/' + mailboxId + '/folders.json');

		var folders = data['items'];

		return folders;
	},

	getListConversationByFolder: function(mailboxId, folderId, isDraft) {
		var data = this.connectToWebservice('/mailboxes/' + mailboxId + '/folders/' + folderId + '/conversations.json');

		var conversations = [];

		data['items'].forEach(function(entry) {
			if (entry['isDraft'] == isDraft || isDraft == null) {
				conversations.push(entry);	
			}
		});

		return conversations;
	},

	connectToWebservice: function(url) {
		var auth = this.API_KEY + ':' + 'X';

		var data = $.ajax({
		    type: 'GET',
		    url: this.BASE_URI + url,
		    dataType: 'json',
		    async: false,
		    error : function() {
		    	console.log('Houve um erro ao receber dados.');
		    },
		    beforeSend: function(xhr) {
			    xhr.setRequestHeader ('Authorization', 'Basic ' + btoa(auth));
			}
		});

		return $.parseJSON(data.responseText);
	}
}