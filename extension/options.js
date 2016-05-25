'use strict';
let hideRegExpInput;
let shouldHideInput;

document.addEventListener('DOMContentLoaded', () => {
	shouldHideInput = document.querySelector('#hidden');
	hideRegExpInput = document.querySelector('#hideRegExp');

	// Don't allow delimiters in RegExp string
	hideRegExpInput.addEventListener('input', () => {
		const value = hideRegExpInput.value;
		const nodelimiters = /^\/|\/$/;

		if (nodelimiters.test(value)) {
			hideRegExpInput.value = hideRegExpInput.value.replace(/^\/|\/$/, '');
		}
	});

	shouldHideInput.addEventListener('change', saveOptions);
	hideRegExpInput.addEventListener('change', saveOptions);

	restoreOptions();
});

function saveOptions() {
	const shouldHide = shouldHideInput.checked;
	const hideRegExp = hideRegExpInput.value;

	window.HideFilesOnGitHub.storage.set({shouldHide, hideRegExp});
}

function restoreOptions() {
	window.HideFilesOnGitHub.storage.get((err, items) => {
		if (err) {
			throw err;
		}

		shouldHideInput.checked = items.shouldHide;
		hideRegExpInput.value = items.hideRegExp;
	});
}
