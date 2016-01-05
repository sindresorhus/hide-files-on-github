'use strict';
let visibility;
let ignoreRegExp;
let toggleOn = true;

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
			if (visibility === 'hidden') {
				el.style.display = toggleOn ? 'none' : 'table-row';
			} else if (visibility === 'dimmed') {
				if (toggleOn) {
					el.classList.add('dimmed');
				} else {
					el.classList.remove('dimmed');
				}
			}
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
		addToggleBtnEvents();
		return;
	}

	if (btnContainer) {
		// insert after
		btnContainer.insertBefore(toggleBtn, btnContainer.children[0]);
		addToggleBtnEvents();
	}
}

function addToggleBtnEvents() {
	const btn = document.querySelector('.hide-files-btn');

	if (btn) {
		btn.addEventListener('click', () => {
			toggleOn = !toggleOn;
			btn.textContent = label();
			toggleFiles();
		});
	}
}

function label() {
	return toggleOn ? 'Show dotfiles' : 'Hide dotfiles';
}

function trigger() {
	addToggleBtn();
	toggleFiles();
}

document.addEventListener('DOMContentLoaded', () => {
	trigger();

	new MutationObserver(trigger).observe(document.querySelector('#js-repo-pjax-container'), {childList: true});

	window.chrome.storage.sync.get({
		HFOG_VISIBILITY: 'hidden',
		HFOG_IGNOREREGEX: ''
	}, items => {
		visibility = items.HFOG_VISIBILITY;
		ignoreRegExp = items.HFOG_IGNOREREGEX;

		injector(window, err => {
			if (err) {
				return console.error(err);
			}
			trigger();
		});
	});
});
