'use strict';
const regexField = document.querySelector('#hideRegExp');
const delimiters = /^\/|\/$/;

restoreOptions();
regexField.addEventListener('input', update);

function update() {
	// Don't allow delimiters in RegExp string
	const values = regexField.value.split('\n');
	const hasDelimiters = values.some(line => delimiters.test(line));
	if (hasDelimiters) {
		regexField.value = values
			.map(line => line.replace(delimiters, ''))
			.join('\n');
	}

	saveOptions();
}

function saveOptions() {
	let hideRegExp = regexField.value;
	if (hideRegExp.length === 0) {
		hideRegExp = window.HideFilesOnGitHub.defaults.hideRegExp;
	}
	window.HideFilesOnGitHub.storage.set({hideRegExp});
}

function restoreOptions() {
	window.HideFilesOnGitHub.storage.get().then(items => {
		regexField.value = items.hideRegExp;
	});
}
