'use strict';

const select = document.querySelector.bind(document);
select.all = document.querySelectorAll.bind(document);

let hideRegExp;
const settingsPromise = window.HideFilesOnGitHub.storage.get();

function overflowsParent(el) {
	return el.getBoundingClientRect().right > el.parentNode.getBoundingClientRect().right;
}

function update() {
	const files = select.all('.files .js-navigation-item .content > span > :-webkit-any(a, span)');
	const hidden = document.createDocumentFragment();
	const links = document.createDocumentFragment();

	for (const file of files) {
		const fileName = file.textContent;
		const row = file.closest('tr');

		if (hideRegExp.test(fileName)) {
			row.classList.add('dimmed');
			hidden.appendChild(row);
			links.appendChild(file.cloneNode(true));
		}
	}

	if (hidden.children.length === 0) {
		return;
	}

	// The first tbody contains the .. link if it's a subfolder.
	select('.files tbody:last-child').prepend(hidden);

	// Add it at last to make sure it's prepended to everything
	addToggleBtn(links);
}

function addToggleBtn(links) {
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
		<tr class="hide-files-row">
			<td colspan="5">
				<a><label for="HFT" class="hide-files-btn"><svg aria-hidden="true" height="16" viewBox="0 0 10 16" width="10"><path d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6z"></path></svg></label></a>
				<span class="hide-files-list"></span>
			</td>
		</tr>
	`);

	const wrapper = select('.hide-files-row .hide-files-list');
	wrapper.append(links);

	// Drop extra links on long lists
	let moreBtn;
	while(overflowsParent(wrapper)) {
		if (!moreBtn) {
			moreBtn = `<label for="HFT"><a>etc...</a></label>`;
			wrapper.insertAdjacentHTML('beforeEnd', moreBtn);
		}
		wrapper.querySelector(':scope > a:last-of-type').remove();
	}
}

async function init() {
	const settings = await settingsPromise;
	if (settings.hideRegExp) {
		hideRegExp = new RegExp(settings.hideRegExp, 'i');
		update();
		document.addEventListener('pjax:end', update);
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
