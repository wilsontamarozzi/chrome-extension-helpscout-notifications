	var helpscout = window.helpscout;
	var mailboxes;
	var tempoVerificacao = 6000;
	var oldValue = {'Unassigned' : 0, 'Mine' : 0};

	setTimeout(function() {	
		chrome.storage.sync.get('data', function(items) {
			if(typeof items.data.api_key !== 'undefined') {
				helpscout.API_KEY = items.data.api_key;
				mailboxes = items.data.mailboxes;

				setUrlDashboard(helpscout.BASE_DASHBOARD + mailboxes[0].slug);
				init();
			}
		});
	}, 2000);

	function init() {

		notification(
			'success', 
			'Aplicação Iniciada', 
			'Verificação iniciada.', 
			false, 0, 0
		);

		setInterval(function () {
			checkNewConversation(mailboxes);
		}, tempoVerificacao);
	}

	function setUrlDashboard(url) {		
		chrome.browserAction.onClicked.addListener(function(tab) {
			chrome.tabs.create({
				'url' : url
			}, function(tab) {
			});
		});
	}

	function updateBadge(folder) {

		switch(folder.name) {
			case 'Unassigned':
				oldValue = {
					'Unassigned' : typeof folder.conversations.length == 'undefined' ? 0 : folder.conversations.length,
					'Mine' : oldValue.Mine,
				}
			break;

			case 'Mine':
				oldValue = {
					'Unassigned' : oldValue.Unassigned,
					'Mine' : typeof folder.conversations.length == 'undefined' ? 0 : folder.conversations.length
				}
			break;
		}

		chrome.browserAction.setBadgeText({
			text : oldValue.Unassigned + '/' + oldValue.Mine
		});
	}

	function checkNewConversation(mailboxes) {

		mailboxes.forEach(function(mailbox) {

			mailbox.folders.forEach(function(folder) {

				if(folder.checked == 'checked') {

					var data = helpscout.getListConversationByFolder(mailbox.id, folder.id, false);
				
					data.sort(function(a, b) { 
						return new Date(b.userModifiedAt) - new Date(a.userModifiedAt); 
					});

					folder.conversations = data;

					if(folder.lastCount == null) {
						folder.lastCount = data.length;
					}

					updateBadge(folder);

					if(folder.lastCount != folder.conversations.length) {
						if(folder.conversations.length > folder.lastCount) {
							var email = folder.conversations[0];

							notification(
								'notice', 
								'Novo E-mail - ' + email.subject, 
								email.preview, true, email.id, email.number
							);

						} else {
							notification(
								'success', 
								'E-mail Respondidos - ' + folder.name, 
								'Alguns E-mail foram respondidos.', 
								false, 0, 0
							);
						}

						folder.lastCount = folder.conversations.length;
					}
				}
			});
		});
	}

	function notification(typeMessage, title, message, onClick, conversationId, conversationNumber) {
	
		var pathImage = '/image/notice.png';

		if (!Notification) {
			alert('Sua versão do Google Chrome não suporte esse tipo de Notificação.');
			return;
		}

		if (Notification.permission !== 'granted') {
			Notification.requestPermission();
		}

		switch(typeMessage) {
			case "notice": 
				pathImage = '/image/notice.png';
			break;
			case "success":
				pathImage = '/image/success.png';
			break;
			case "warning":
				pathImage = '/image/warning.png';
			break;
			case "error":
				pathImage = '/image/error.png';
			break;
			default:
				pathImage = '/image/notice.png';
		}
		
		var notification = new Notification(
			title, {
				icon: pathImage,
				body: message
			}
		);

		if(onClick) {
			notification.onclick = function () {
				var url = helpscout.BASE_CONVERSATION + conversationId + '/' + conversationNumber + '/';
				window.open(url);
			}
		}
	}