/* global HideFilesOnGitHub */

'use strict';
const regexField = document.querySelector('#hideRegExp');
const errorMessage = document.querySelector('#errorMessage');
const delimiters = /^\/|\/$/;

restoreOptions();
regexField.addEventListener('input', update);

/* Native validation tooltips don't seem to work */
function setValidity(text = '') {
	errorMessage.innerHTML = text;
	regexField.setCustomValidity(text); /* Triggers :invalid */
}

function update() {
	for (const line of regexField.value.split('\n')) {
		// Don't allow delimiters in RegExp string
		if (delimiters.test(line)) {
			return setValidity(`Use <code>${line.replace(/^\/|\/$/g, '')}</code> instead of <code>${line}</code>. Slashes are not required.`);
		}

		// Fully test each RegExp
		try {
			// eslint-disable-next-line no-new
			new RegExp(line);
		} catch (err) {
			return setValidity(err.message);
		}
	}

	setValidity();
	saveOptions();
}

function saveOptions() {
	const defaults = HideFilesOnGitHub.defaults;

	HideFilesOnGitHub.storage.set({
		hideRegExp: regexField.value.trim() || defaults.hideRegExp
	});
}

function restoreOptions() {
	HideFilesOnGitHub.storage.get().then(items => {
		regexField.value = items.hideRegExp;
	});
}
