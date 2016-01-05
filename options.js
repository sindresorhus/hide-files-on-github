'use strict';

document.addEventListener('DOMContentLoaded', () => {
	const saveBtn = document.getElementById('saveBtn');

	if (saveBtn) {
		saveBtn.addEventListener('click', saveOptions);
	}

	restoreOptions();

	// Don't allow delimiters in RegExp string
	const ignoreRegExpField = document.getElementById('ignoreRegExp');
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
	const ignoreRegEx = document.getElementById('ignoreRegExp').value;

	window.chrome.storage.sync.set({
		visibility,
		ignoreRegEx
	}, () => {
		// Update status to let user know options were saved.
		const status = document.getElementById('status');

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
		document.getElementById(items.visibility).checked = true;

		// regex
		document.getElementById('ignoreRegExp').value = items.ignoreRegEx;
	});
}

