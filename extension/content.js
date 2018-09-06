/* global HideFilesOnGitHub */

'use strict';

const select = document.querySelector.bind(document);
select.all = document.querySelectorAll.bind(document);

let settings;
const settingsPromise = HideFilesOnGitHub.storage.get().then(retrieved => {
	settings = retrieved;
	settings.hideRegExp = new RegExp(settings.hideRegExp.replace(/\n+/g, '|'), 'i');
});

const domLoaded = new Promise(resolve => {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', resolve);
	} else {
		resolve();
	}
});

function overflowsParent(el) {
	return el.getBoundingClientRect().right > el.parentNode.getBoundingClientRect().right;
}

function update() {
	let {filesPreview, hideRegExp} = settings;
	const files = select.all('.files .js-navigation-item .content > span > :-webkit-any(a, span)');
	const hidden = document.createDocumentFragment();
	if (filesPreview) {
		filesPreview = document.createElement('span');
		filesPreview.className = 'hide-files-list';
	}

	for (const file of files) {
		const fileName = file.textContent;
		const row = file.closest('tr');

		if (hideRegExp.test(fileName)) {
			row.classList.add('dimmed');
			hidden.appendChild(row);
			if (filesPreview) {
				const node = file.cloneNode(true);
				delete node.id;
				node.tabIndex = -1;
				filesPreview.appendChild(node);
			}
		}
	}

	if (hidden.children.length === 0) {
		return;
	}

	// The first tbody contains the .. link if it's a subfolder.
	select('.files tbody:last-child').prepend(hidden);

	// Add it at last to make sure it's prepended to everything
	addToggleBtn(filesPreview);
}

function addToggleBtn(filesPreview) {
	const btnRow = select('.hide-files-row');
	const tbody = select('table.files tbody');
	if (btnRow) {
		// This is probably inside a pjax event.
		// Make sure it's still on top.
		tbody.prepend(btnRow);
		return;
	}

	select('table.files').insertAdjacentHTML('beforeBegin', `
		<input type="checkbox" id="HFT" class="hide-files-toggle" checked />
	`);

	tbody.insertAdjacentHTML('afterBegin', `
		<tr class="hide-files-row dimmed">
			<td colspan="5">
				<label for="HFT" class="hide-files-btn"></label>
			</td>
		</tr>
	`);

	if (!filesPreview) {
		select('.hide-files-row').insertAdjacentHTML('afterBegin', `
			<td class="icon"></td>
		`);

		return;
	}

	const btn = select('.hide-files-btn');
	btn.insertAdjacentHTML('afterBegin', `
		<svg aria-hidden="true" height="16" viewBox="0 0 10 16" width="10"><path d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6z"></path></svg>
	`);

	btn.insertAdjacentElement('afterEnd', filesPreview);

	// Drop extra links on long lists
	let moreBtn;
	while (overflowsParent(filesPreview)) {
		if (!moreBtn) {
			moreBtn = '<label for="HFT"><a>etc...</a></label>';
			filesPreview.insertAdjacentHTML('beforeEnd', moreBtn);
		}
		filesPreview.querySelector(':scope > a:last-of-type').remove();
	}
}

function init() {
	// Update on fragment update
	const observer = new MutationObserver(update);
	const observeFragment = () => {
		const ajaxFiles = select('include-fragment.file-wrap');
		if (ajaxFiles) {
			observer.observe(ajaxFiles.parentNode, {
				childList: true
			});
		}
	};

	update();
	observeFragment();
	document.addEventListener('pjax:end', update); // Update on page change
	document.addEventListener('pjax:end', observeFragment);
}

Promise.all([domLoaded, settingsPromise]).then(init);
