'use strict';
let hideRegExpInput;
let visibilityInput;

document.addEventListener('DOMContentLoaded', () => {
	visibilityInput = document.querySelector('#visibilityOption');
	hideRegExpInput = document.querySelector('#hideRegExp');

	// Don't allow delimiters in RegExp string
	hideRegExpInput.addEventListener('input', () => {
		const value = hideRegExpInput.value;
		const nodelimiters = /^\/|\/$/;

		if (nodelimiters.test(value)) {
			hideRegExpInput.value = hideRegExpInput.value.replace(/^\/|\/$/, '');
		}
	});

	visibilityInput.addEventListener('change', saveOptions);
	hideRegExpInput.addEventListener('change', saveOptions);

	restoreOptions();
});

function saveOptions() {
	const visibility = visibilityInput.value;
	const hideRegExp = hideRegExpInput.value;

	window.chrome.storage.sync.set({visibility, hideRegExp}, () => {});
}

function restoreOptions() {
	window.chrome.storage.sync.get({
		visibility: 'hidden',
		hideRegExp: '^\.|^license|^appveyor\.yml'
	}, items => {
		visibilityInput.selectedIndex = items.visibility === 'hidden' ? 0 : 1;
		hideRegExpInput.value = items.hideRegExp;
	});
}

