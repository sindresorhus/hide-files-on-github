'use strict';

var hidden = true;
var isDotfilesRepository = document.querySelector('.js-current-repository[href$="/dotfiles"]');

function createHtml(str) {
	var frag = document.createDocumentFragment();
	var temp = document.createElement('div');

	temp.innerHTML = str;

	while (temp.firstChild) {
		frag.appendChild(temp.firstChild);
	}

	return frag;
}

function toggleFiles() {
	[].forEach.call(document.querySelectorAll('.files tr'), function (el) {
		if (el.querySelector('a[title^="."')) {
			el.style.display = hidden ? 'none' : 'table-row';
		}
	});
}

function addToggleBtn() {
	var toggleBtn = createHtml('<a class="minibutton hide-files-btn" style="margin-right:8px">Toggle dotfiles</a>');
	var btnLocation = document.querySelector('.file-navigation .breadcrumb');
	var toogleBtnCached = document.querySelector('.hide-files-btn');

	if (!toogleBtnCached) {
		btnLocation.parentNode.insertBefore(toggleBtn, btnLocation);
	}

	document.querySelector('.hide-files-btn').addEventListener('click', function () {
		hidden = !hidden;
		toggleFiles();
	});
}

if (!isDotfilesRepository) {
	addToggleBtn();
	toggleFiles();

	new MutationObserver(addToggleBtn).observe(document.querySelector('#js-repo-pjax-container'), {childList: true});
}
