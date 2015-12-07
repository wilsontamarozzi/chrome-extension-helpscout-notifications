$(function() {

	var helpscout = window.helpscout;
	var mailboxes;

	if (Notification.permission !== 'granted') {
		Notification.requestPermission();
	}

	$(document).ready(function restoreOptions() {
		chrome.storage.sync.get('data', function(items) {
			if(typeof items.data !== 'undefined') {
				mailboxes = items.data.mailboxes;
				rendererTree(mailboxes);
			}
		});		
	});

	function saveOptions(mailboxes) {
		chrome.storage.sync.set({
			'data' : {
				'api_key' : helpscout.API_KEY,
				'mailboxes' : mailboxes
			}
		}, function() {
			$('#status').text('Opcoes salvas');
			$('#status').delay(2000).fadeOut();
		});
	}

	function buildTree() {
		mailboxes = helpscout.getListMailboxes();

		mailboxes.forEach(function(mailbox) {
			mailbox.folders = helpscout.getListFolders(mailbox.id);
		});

		rendererTree(mailboxes);
	}
	
	function setTextField() {
		$('#apikey').val(helpscout.API_KEY);
	}

	function getTextField() {
		helpscout.API_KEY = $('#apikey').val();
	}

	function getFoldersSelected(mailboxes) {
		folders = [];

		$('.mailboxes input:checked').each(function() {
		    folders.push(parseInt($(this).attr('value')));
		});

		mailboxes.forEach(function(mailbox) {
			mailbox.folders.forEach(function(folder) {
				if(folders.indexOf(folder.id) > -1) {
					folder.checked = 'checked';
				}
			});
		});
	}

	function rendererTree(mailboxes) {

		mailboxes.forEach(function(mailbox) {
			$('.mailboxes').append(
				'<li>' +
					'<span>' +
						'<input type="checkbox"> ' +
						'<i class="glyphicon glyphicon-inbox"></i> ' + mailbox.name + 
					'</span>' +
					'<ul class="folders"></ul>' +
				'</li>'
			);

			mailbox.folders.forEach(function(folder) {
				$('.folders').append(
					'<li>' +
			            '<span>' +
			            	'<input type="checkbox" ' + folder.checked + ' name="' + folder.name + '" value="' + folder.id + '"> ' +
			            	'<i class="glyphicon glyphicon-folder-open"></i> ' + folder.name + 
			            '</span>' +
			        '</li>'
			  	);
			});
		});
	}

	$('#btnLerAPI').on('click', function() {
		getTextField();
		buildTree();
	});

	$('#btnSalvar').on('click', function() {
		getFoldersSelected(mailboxes);
		saveOptions(mailboxes);
	});

	$('#btnReset').on('click', function() {
		saveOptions(null);
	});
});