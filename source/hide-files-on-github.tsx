import React from 'dom-chef';
import select from 'select-dom';
import elementReady from 'element-ready';

import {storage} from './api';

let willPreviewFiles: boolean;
let hideRegExp: RegExp;

function overflowsParent(element: Element): boolean {
	return element.getBoundingClientRect().right > element.parentElement!.getBoundingClientRect().right;
}

function updateUI(): void {
	const hiddenFiles =
		select.all('.files .js-navigation-item .content > span > *')
			.filter(element => hideRegExp.test(element.textContent!));

	if (hiddenFiles.length === 0) {
		return;
	}

	const hidden = document.createDocumentFragment();
	let previewList: HTMLElement | undefined;

	if (willPreviewFiles) {
		previewList = <span className="hide-files-list"/>;
	}

	for (const file of hiddenFiles) {
		const row = file.closest('tr')!;
		row.classList.add('dimmed');

		// If there's just one hidden file, there's no need to move it
		if (hiddenFiles.length === 1) {
			continue;
		}

		hidden.append(row);
		if (willPreviewFiles && previewList) {
			const node = file.cloneNode(true) as HTMLElement;
			delete node.id;
			node.tabIndex = -1;
			previewList.append(node);
		}
	}

	if (hiddenFiles.length < 2) {
		return;
	}

	// The first tbody contains the .. link if it's a subfolder.
	select('.files tbody:last-child')!.prepend(hidden);

	// Add it at last to make sure it's prepended to everything
	addToggleBtn(previewList);
}

function addToggleBtn(previewList?: Element): void {
	const btnRow = select('.hide-files-row')!;
	const tbody = select('table.files tbody')!;
	if (btnRow) {
		// This is probably inside a pjax event.
		// Make sure it's still on top.
		tbody.prepend(btnRow);
		return;
	}

	select('table.files')!.before(
		<input type="checkbox" id="HFT" className="hide-files-toggle" checked/>
	);

	tbody.prepend(
		<tr className="hide-files-row dimmed">
			<td colspan="5">
				<label for="HFT" className="hide-files-btn">
					{previewList ? <svg aria-hidden="true" height="16" width="10"><path d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6z" /></svg> : ''}
				</label>
			</td>
		</tr>
	);

	if (!previewList) {
		select('.hide-files-row')!.prepend(<td className="icon"/>);
		return;
	}

	select('.hide-files-btn')!.after(previewList);

	// Drop extra links on long lists
	let moreBtn;
	while (overflowsParent(previewList)) {
		if (!moreBtn) {
			moreBtn = true;
			previewList.append(<label for="HFT"><a>etc...</a></label>);
		}

		previewList.querySelector(':scope > a:last-of-type')!.remove();
	}
}

async function init(): Promise<void> {
	const settings = await storage.get();
	willPreviewFiles = settings.filesPreview;
	hideRegExp = new RegExp(settings.hideRegExp.replace(/\n+/g, '|'), 'i');

	const observer = new MutationObserver(updateUI);
	const observeFragment = (): void => {
		const ajaxFiles = select('#files ~ include-fragment[src*="/file-list/"]');
		if (ajaxFiles) {
			observer.observe(ajaxFiles.parentNode!, {
				childList: true
			});
		}
	};

	await elementReady('.files');

	updateUI();
	observeFragment();
	document.addEventListener('pjax:end', updateUI); // Update on page change
	document.addEventListener('pjax:end', observeFragment);
}

init();
