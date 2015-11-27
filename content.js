'use strict';
var isHidden = true;

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
			el.style.display = isHidden ? 'none' : 'table-row';
		} else if (++i === 1) {
			// remove top border
			el.classList.add('first');
		}
	});
}

function addToggleBtn() {
	var toggleBtn = createHtml('<a class="hide-files-btn btn btn-sm">Show .files</a>');
	var btnContainer = document.querySelector('.file-navigation .right');

	if (document.querySelector('.hide-files-btn')) {
		return;
	}

	if (btnContainer) {
		// insert after
		btnContainer.insertBefore(toggleBtn, btnContainer.children[0]);

		document.querySelector('.hide-files-btn').addEventListener('click', function (e) {
			isHidden = !isHidden;
			this.textContent = isHidden ? 'Show .files' : 'Hide .files';
			toggleFiles();
		});
	}
}

function trigger() {
	addToggleBtn();
	toggleFiles();
}

document.addEventListener('DOMContentLoaded', function () {
	trigger();

	new MutationObserver(trigger).observe(document.querySelector('#js-repo-pjax-container'), {childList: true});
});
