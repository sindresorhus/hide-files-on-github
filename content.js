'use strict';
let isHidden = true;
const injector = window.gitHubInjection;

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
	const toggleBtn = createHtml(`<a class="hide-files-btn btn btn-sm">${label()}</a>`);
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
			btn.textContent = label();
			toggleFiles();
		});
	}
}

function label() {
	return isHidden ? 'Show dotfiles' : 'Hide dotfiles';
}

function trigger() {
	addToggleBtn();
	toggleFiles();
}

document.addEventListener('DOMContentLoaded', () => {
	new MutationObserver(trigger).observe(document.querySelector('#js-repo-pjax-container'), {childList: true});

	injector(window, err => {
		if (err) {
			return console.error(err);
		}
		trigger();
	});
});
