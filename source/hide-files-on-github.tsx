import React from 'dom-chef';
import select from 'select-dom';
import elementReady from 'element-ready';

import {storage} from './api';

const ellipsisWidth = 70;
let willPreviewFiles: boolean;
let hideRegExp: RegExp;

function updateUI(): void {
	const hiddenFiles =
		select.all('[aria-labelledby="files"] .js-navigation-open')
			.filter(element => hideRegExp.test(element.title));

	if (hiddenFiles.length === 0) {
		return;
	}

	const hidden = document.createDocumentFragment();
	let previewList: HTMLElement[] | undefined;

	if (willPreviewFiles) {
		previewList = [];
	}

	for (const file of hiddenFiles) {
		const row = file.closest('[role="row"]')!;
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
			previewList.push(node);
		}
	}

	if (hiddenFiles.length < 2) {
		return;
	}

	// The first table contains the .. link if it's a subfolder.
	select('[aria-labelledby="files"]')!.prepend(hidden);

	// Add it at last to make sure it's prepended to everything
	addToggleBtn(previewList);
}

function addToggleBtn(previewList?: HTMLElement[]): void {
	const btnRow = select('.hide-files-row')!;
	const table = select('[aria-labelledby="files"]')!;
	if (btnRow) {
		// This is probably inside a pjax event.
		// Make sure it's still on top.
		table.prepend(btnRow);
		return;
	}

	select('[aria-labelledby="files"]')!.before(
		<input checked type="checkbox" id="HFT" className="hide-files-toggle"/>
	);

	table.prepend(
		<div role="row" className="hide-files-row Box-row py-2 d-flex position-relative dimmed">
			<div role="gridcell" className="flex-shrink-0 mr-3">
				<label htmlFor="HFT" className="hide-files-btn">
					{previewList ? <svg aria-hidden="true" height="16" width="16" viewBox="-3 0 16 16"><path d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6z"/></svg> : ''}
				</label>
			</div>
			<div role="gridcell" className="hide-files-preview-list flex-auto min-width-0 "/>
		</div>
	);

	if (!previewList) {
		select('.hide-files-row')!.prepend(<div role="gridcell"/>);
		return;
	}

	const container = select('.hide-files-preview-list')!;
	container.append(...previewList);

	if (navigator.userAgent.includes('Firefox/')) {
		// Due to FOUC on Firefox #93
		setTimeout(addEllipsis, 100, container, previewList);
	} else {
		addEllipsis(container, previewList);
	}
}

function addEllipsis(container: HTMLElement, previewList: HTMLElement[]): void {
	const availableWidth = container.getBoundingClientRect().width;
	if (availableWidth === container.scrollWidth) {
		return; // No overflow = No ellipsis necessary
	}

	let ellipsis = false;
	for (const file of previewList.slice(5)) {
		if (ellipsis) {
			// Remove extra files when the ellipsis is added
			file.remove();
		} else if (file.offsetLeft + file.offsetWidth > availableWidth - ellipsisWidth) {
			// We found the first element in the unsafe/overflowing area
			container.append(<label htmlFor="HFT"><a>etc...</a></label>);
			ellipsis = true;
			file.remove();
		}
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

	// TODO: drop `*` after https://github.com/sindresorhus/element-ready/issues/29
	await elementReady('[aria-labelledby="files"] + *');

	updateUI();
	observeFragment();
	document.addEventListener('pjax:end', updateUI); // Update on page change
	document.addEventListener('pjax:end', observeFragment);
}

void init();
