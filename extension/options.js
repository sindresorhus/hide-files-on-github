'use strict';
let hideRegExpInput;

document.addEventListener('DOMContentLoaded', () => {
	hideRegExpInput = document.querySelector('#hideRegExp');

	// Don't allow delimiters in RegExp string
	hideRegExpInput.addEventListener('input', () => {
		const value = hideRegExpInput.value;
		const nodelimiters = /^\/|\/$/;

		if (nodelimiters.test(value)) {
			hideRegExpInput.value = hideRegExpInput.value.replace(/^\/|\/$/, '');
		}
	});

	hideRegExpInput.addEventListener('change', saveOptions);

	restoreOptions();
});

function saveOptions() {
	const hideRegExp = hideRegExpInput.value;
	window.HideFilesOnGitHub.storage.set({hideRegExp});
}

function restoreOptions() {
	window.HideFilesOnGitHub.storage.get((err, items) => {
		if (err) {
			throw err;
		}

		hideRegExpInput.value = items.hideRegExp;
	});
}
