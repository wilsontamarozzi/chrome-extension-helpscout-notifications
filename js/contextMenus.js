chrome.runtime.onInstalled.addListener(function() {	
	
	var respostas = [
		{
			'title' : 'Geral',
			'id' : 'geral',
			'parentId' : 'mainMenu',
			'parents' : [{
				'title' : 'Liberação Sistema',
				'id' : 'liberacao',
				'parentId' : 'geral',
				'text' : 'Olá, <br /><br />' + 
					'Seu sistema foi liberado, por gentileza verifique se já está conseguindo acessa-lo?! <br /><br />' + 
					'Restando duvidas estou a disposição.'
			}]
		},
		{
			'title' : 'Falta de contato',
			'id' : 'faltacontato',
			'parentId' : 'mainMenu',
			'parents' : [{
				'title' : 'Acompanhamento',
				'id' : 'acompanhamento',
				'parentId' : 'faltacontato',
				'text' : 'Olá, <br /><br />Tentamos entrar em contato pelo telefone <b>telefone</b> mas não obtivemos sucesso. <br /><br />' +
					'Por gentileza, entre em contato conosco <b>telefone</b> para que possamos auxiliar em suas duvidas e dar continuidade ao acompanhamento. <br /><br />' + 
					'Em aguardo.'
			}]
		}
	]

	buildContextMenu(respostas);

	function buildContextMenu(respostas) {
		
		chrome.contextMenus.create({
			"title" : "HelpScout",
			"contexts" : ["all"],
			"id" : "mainMenu"
		});

		respostas.forEach(function(item) {
			chrome.contextMenus.create({
				"title" : item.title,
				"contexts" : ["editable"],
				"parentId" : item.parentId, 
				"id" : item.id
			});

			item.parents.forEach(function(item) {
				chrome.contextMenus.create({
					"title" : item.title,
					"contexts" : ["editable"],
					"parentId" : item.parentId, 
					"id" : item.id
				});
			});
		});
	}

	chrome.contextMenus.onClicked.addListener(function(info, tab) {
		respostas.forEach(function(mainMenu) {
			mainMenu.parents.forEach(function(subMenu) {
				if(subMenu.id == info.menuItemId) {
					chrome.tabs.executeScript({
						code:"var x = document.getElementsByClassName('redactor_redactor redactor_editor'); x[0].innerHTML = '" + subMenu.text + "';"
					});
				}
			});
		});
	});
});