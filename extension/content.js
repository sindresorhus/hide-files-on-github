'use strict';
const $ = document.querySelector.bind(document);

let visibility;
let hideRegExp;
let toggleOn = true;

function createHtml(str) {
	const frag = document.createDocumentFragment();
	const temp = document.createElement('tr');

	temp.innerHTML = str;

	while (temp.firstChild) {
		frag.appendChild(temp.firstChild);
	}

	return frag;
}

function toggleFiles() {
	if (!inRootView()) {
		return;
	}

	// TODO: remove `Array.from` when Chrome 51 is target
	const rows = Array.from(document.querySelectorAll('.files tr'));
	let i = 0;

	// TODO: use `rows.entries()` when Chrome 51 is target
	for (const el of rows) {
		if (el.querySelector('.content a')) {
			const fileName = el.querySelector('td.content a').innerText;

			if (hideRegExp && hideRegExp.test(fileName)) {
				if (visibility === 'hidden') {
					el.style.display = toggleOn ? 'none' : 'table-row';
				} else if (visibility === 'dimmed') {
					el.classList.add('dimmed');
				}
			}
		} else if (++i === 1) {
			// remove top border
			el.classList.add('first');
		}
	}
}

function addToggleBtn() {
	const toggleBtn = createHtml(`
		<td class="icon"></td>
		<td class="content">
			<a href="#" class="hide-files-btn">${label()}</a>
		</td>
		<td class="message"></td>
		<td class="age"></td>
	`);

	const fileTable = $('.files');

	if ($('.hide-files-btn')) {
		addToggleBtnEvents();
		return;
	}

	if (fileTable && inRootView()) {
		// insert at the end of the table
		fileTable.insertBefore(toggleBtn, fileTable.children[fileTable.rows.length - 1]);
		addToggleBtnEvents();
	}
}

function inRootView() {
	return !$('tr.up-tree');
}

function addToggleBtnEvents() {
	const btn = $('.hide-files-btn');

	if (btn) {
		btn.addEventListener('click', e => {
			e.preventDefault();
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
	if (visibility === 'hidden') {
		addToggleBtn();
	}

	toggleFiles();
}

document.addEventListener('DOMContentLoaded', () => {
	trigger();

	const container = $('#js-repo-pjax-container');

	if (!container) {
		return;
	}

	new MutationObserver(trigger).observe(container, {childList: true});

	window.HideFilesOnGitHub.storage.get((err, items) => {
		if (err) {
			throw err;
		}

		visibility = items.visibility;
		hideRegExp = items.hideRegExp === '' ? undefined : new RegExp(items.hideRegExp, 'i');

		window.gitHubInjection(window, () => {
			addToggleBtnEvents();
			trigger();
		});
	});
});
