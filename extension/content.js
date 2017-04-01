'use strict';
const $ = document.querySelector.bind(document);

let toggleOn = true;
let hideRegExp;

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

	const rows = document.querySelectorAll('.files tr');
	let i = 0;

	for (const el of rows) {
		const file = el.querySelector('.content > span > :-webkit-any(a, span)');

		if (file) {
			const fileName = file.innerText;

			if (hideRegExp && hideRegExp.test(fileName)) {
				el.classList.add('dimmed');
				el.style.display = toggleOn ? 'none' : 'table-row';
			}
		} else if (++i === 1) {
			// Remove top border
			el.classList.add('first');
		}
	}
}

function reorderFiles() {
	if (!inRootView()) {
		return;
	}

	const rows = document.querySelectorAll('.files .js-navigation-item');
	const dotted = document.createDocumentFragment();
	const normal = document.createDocumentFragment();

	for (const el of rows) {
		const filename = el.querySelector('.content > span > :-webkit-any(a, span)').innerText;

		if (hideRegExp && hideRegExp.test(filename)) {
			dotted.appendChild(el);
		} else {
			normal.appendChild(el);
		}
	}

	const tableBody = $('.files tbody');

	if (tableBody) {
		tableBody.appendChild(dotted);
		tableBody.appendChild(normal);
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
		// Insert at the end of the table
		fileTable.insertBefore(toggleBtn, fileTable.children[0]);
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
	addToggleBtn();
	toggleFiles();
	reorderFiles();
}

document.addEventListener('DOMContentLoaded', () => {
	addToggleBtn();
	toggleFiles();

	const container = $('#js-repo-pjax-container');

	if (!container) {
		return;
	}

	new MutationObserver(trigger).observe(container, {childList: true});

	window.HideFilesOnGitHub.storage.get((err, items) => {
		if (err) {
			throw err;
		}

		hideRegExp = items.hideRegExp === '' ? undefined : new RegExp(items.hideRegExp, 'i');

		window.gitHubInjection(window, () => {
			addToggleBtnEvents();
			trigger();
		});
	});
});
