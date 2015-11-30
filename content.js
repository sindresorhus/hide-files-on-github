'use strict';
let isHidden = true;

function createHtml(str) {
	const frag = document.createDocumentFragment();
	const temp = document.createElement('div');

	temp.innerHTML = str;

	while (temp.firstChild) {
		frag.appendChild(temp.firstChild);
	}

	return frag;
}

function toggleFiles() {
	const rows = Array.from(document.querySelectorAll('.files tr'));
	let i = 0;

	for (const el of rows) {
		if (el.querySelector('.content a[title^="."')) {
			el.style.display = isHidden ? 'none' : 'table-row';
		} else if (++i === 1) {
			// remove top border
			el.classList.add('first');
		}
	}
}

function addToggleBtn() {
	const toggleBtn = createHtml('<a class="hide-files-btn btn btn-sm">Show dotfiles</a>');
	const btnContainer = document.querySelector('.file-navigation .right');

	if (document.querySelector('.hide-files-btn')) {
		return;
	}

	if (btnContainer) {
		// insert after
		btnContainer.insertBefore(toggleBtn, btnContainer.children[0]);

		const btn = document.querySelector('.hide-files-btn');

		btn.addEventListener('click', () => {
			isHidden = !isHidden;
			btn.textContent = isHidden ? 'Show dotfiles' : 'Hide dotfiles';
			toggleFiles();
		});
	}
}

function trigger() {
	addToggleBtn();
	toggleFiles();
}

document.addEventListener('DOMContentLoaded', () => {
	trigger();

	new MutationObserver(trigger).observe(document.querySelector('#js-repo-pjax-container'), {childList: true});
});
