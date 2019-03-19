/* global HideFilesOnGitHub, escapeTag */
'use strict';
const regexField = document.querySelector('#hideRegExp');
const errorMessage = document.querySelector('#errorMessage');
const delimiters = /^\/|\/$/;

restoreOptions();
document.addEventListener('input', update);
document.addEventListener('change', update);

/* Native validation tooltips don't seem to work */
function setValidity(text = '') {
	errorMessage.innerHTML = text;
	regexField.setCustomValidity(errorMessage.textContent); /* Triggers :invalid */
}

function update() {
	for (const line of regexField.value.split('\n')) {
		// Don't allow delimiters in RegExp string
		if (delimiters.test(line)) {
			return setValidity(escapeTag`Use <code>${line.replace(/^\/|\/$/g, '')}</code> instead of <code>${line}</code>. Slashes are not required.`);
		}

		// Fully test each RegExp
		try {
			// eslint-disable-next-line no-new
			new RegExp(line);
		} catch (error) {
			return setValidity(error.message);
		}
	}

	setValidity();
	saveOptions();
}

function saveOptions() {
	const previewField = document.querySelector('[name="filesPreview"]:checked');

	HideFilesOnGitHub.storage.set({
		filesPreview: previewField.value === 'true',
		hideRegExp: regexField.value.trim() || HideFilesOnGitHub.defaults.hideRegExp
	});
}

function restoreOptions() {
	(async () => {
		const items = await HideFilesOnGitHub.storage.get();
		const previewField = document.querySelector(`[name="filesPreview"][value="${String(items.filesPreview)}"]`);
		regexField.value = items.hideRegExp;
		previewField.checked = true;
	})();
}
