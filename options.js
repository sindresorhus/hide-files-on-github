'use strict';

document.addEventListener('DOMContentLoaded', () => {
	const saveBtn = document.getElementById('saveBtn');

	if (saveBtn) {
		saveBtn.addEventListener('click', saveOptions);
	}

	restoreOptions();

	// Don't allow delimiters in RegExp string
	const ignoreRegExpField = document.querySelector('#ignoreRegExp');
	ignoreRegExpField.addEventListener('keyup', () => {
		const value = ignoreRegExpField.value;
		const nodelimiters = /^\/|\/$/;

		if (nodelimiters.test(value)) {
			ignoreRegExpField.value = ignoreRegExpField.value.replace(/^\/|\/$/, '');
		}
	});
});

// Saves options to chrome.storage
function saveOptions() {
	const visibility = document.querySelector('input[name=visibilityOption]:checked').value;
	const ignoreRegEx = document.querySelector('#ignoreRegExp').value;

	window.chrome.storage.sync.set({
		visibility,
		ignoreRegEx
	}, () => {
		// Update status to let user know options were saved.
		const status = document.querySelector('#status');

		status.textContent = 'Options saved.';
		setTimeout(() => {
			status.textContent = '';
		}, 750);
	});
}

function restoreOptions() {
	window.chrome.storage.sync.get({
		visibility: 'hidden',
		ignoreRegEx: ''
	}, items => {
		// visibility
		document.querySelector(`#${items.visibility}`).checked = true;

		// regex
		document.querySelector('#ignoreRegExp').value = items.ignoreRegEx;
	});
}

