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
	var i = 0;

	[].forEach.call(document.querySelectorAll('.files tr'), function (el) {
		if (el.querySelector('.content a[title^="."')) {
			el.style.display = hidden ? 'none' : 'table-row';
		} else if (++i === 1) {
			// remove top border
			el.classList.add('first');
		}
	});
}

function addToggleBtn() {
	var toggleBtn = createHtml('<a class="hide-files-btn minibutton right" style="margin-right:8px">Toggle dotfiles</a>');
	var btnContainer = document.querySelector('.file-navigation .breadcrumb');

	if (document.querySelector('.hide-files-btn')) {
		return;
	}

	// insert after
	btnContainer.parentNode.insertBefore(toggleBtn, btnContainer.nextSibling);

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
