'use strict';

var hidden = true;
var isDotfilesRepository = document.querySelector('.js-current-repository[href$="/dotfiles"]');

function toggleFiles() {
	[].forEach.call(document.querySelectorAll('.files tr'), function (el) {
		if (el.querySelector('a[title^="."')) {
			el.style.display = hidden ? 'none' : 'table-row';
		};
	});
}

function addToggleBtn() {

	var _createHTML = function (htmlStr) {
		var frag = document.createDocumentFragment(),
		temp = document.createElement('a');
		temp.innerHTML = htmlStr;
		while (temp.firstChild) {
			frag.appendChild(temp.firstChild);
		}
		return frag;
	};

	var toggleBtn = _createHTML("<a class='minibutton hide-files-btn' style='margin-right:8px'>Toggle dotfiles</a>")
	var btnLocation = document.querySelector(".file-navigation .breadcrumb");
	var toogleBtnCached = document.querySelector('.hide-files-btn');

	if (!toogleBtnCached) btnLocation.parentNode.insertBefore(toggleBtn, btnLocation);
	
	document.querySelector('.hide-files-btn').addEventListener("click", function () {
		hidden = !hidden;
		toggleFiles();
	});

	toggleFiles();
}

if (!isDotfilesRepository) {
	
	addToggleBtn();

	new MutationObserver(addToggleBtn).observe(document.querySelector('#js-repo-pjax-container'), {childList: true});
}
