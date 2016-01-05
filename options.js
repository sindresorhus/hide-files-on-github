'use strict';

document.addEventListener('DOMContentLoaded', () => {
	const saveBtn = document.getElementById('saveBtn');

	if (saveBtn) {
		saveBtn.addEventListener('click', saveOptions);
	}
	restoreOptions();
});

// Saves options to chrome.storage
function saveOptions() {
	const visibility = document.querySelector('input[name=visibilityOption]:checked').value;
	const ignoreRegEx = document.getElementById('ignoreRegExp').value;

	window.chrome.storage.sync.set({
		HFOG_VISIBILITY: visibility,
		HFOG_IGNOREREGEX: ignoreRegEx
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
	// Use default values: { visibility: 'hidden', HFOGIgnoreRegExp: '' }

	window.chrome.storage.sync.get({
		HFOG_VISIBILITY: 'hidden',
		HFOG_IGNOREREGEX: ''
	}, items => {
		// visibility
		document.getElementById(items.HFOG_VISIBILITY).checked = true;

		// regex
		document.getElementById('ignoreRegExp').value = items.HFOG_IGNOREREGEX;
	});
}
