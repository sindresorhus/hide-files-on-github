'use strict';
let ignoreRegExpInput;
let visibilityInput;

document.addEventListener('DOMContentLoaded', () => {
	visibilityInput = document.querySelector('#visibilityOption');
	ignoreRegExpInput = document.querySelector('#ignoreRegExp');

	// Don't allow delimiters in RegExp string
	ignoreRegExpInput.addEventListener('keyup', () => {
		const value = ignoreRegExpInput.value;
		const nodelimiters = /^\/|\/$/;

		if (nodelimiters.test(value)) {
			ignoreRegExpInput.value = ignoreRegExpInput.value.replace(/^\/|\/$/, '');
		}
	});

	visibilityInput.addEventListener('change', saveOptions);
	ignoreRegExpInput.addEventListener('change', saveOptions);

	restoreOptions();
});

function saveOptions() {
	const visibility = visibilityInput.value;
	const ignoreRegEx = ignoreRegExpInput.value;

	window.chrome.storage.sync.set({visibility, ignoreRegEx}, () => {});
}

function restoreOptions() {
	window.chrome.storage.sync.get({
		visibility: 'hidden',
		ignoreRegEx: ''
	}, items => {
		visibilityInput.selectedIndex = items.visibility === 'hidden' ? 0 : 1;
		ignoreRegExpInput.value = items.ignoreRegEx;
	});
}

