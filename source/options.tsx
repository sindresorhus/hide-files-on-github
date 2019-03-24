/* global HideFilesOnGitHub, escapeTag */
'use strict';
const regexField = document.querySelector<HTMLTextAreaElement>('#hideRegExp');
const errorMessage = document.querySelector('#errorMessage');
const delimiters = /^\/|\/$/;

restoreOptions();
document.addEventListener('change', updateOptions);

/* Native validation tooltips don't seem to work */
function setValidity(text = '') {
	errorMessage.innerHTML = text;
}

function updateOptions() {
	for (const line of regexField.value.split('\n')) {
		// Don't allow delimiters in RegExp string
		if (delimiters.test(line)) {
			return setValidity(<>Use <code>{line.replace(/^\/|\/$/g, '')}</code> instead of <code>{line}</code>. Slashes are not required.</>);
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
	const previewField = document.querySelector<HTMLInputElement>('[name="filesPreview"]:checked');

	HideFilesOnGitHub.storage.set({
		filesPreview: previewField.value === 'true',
		hideRegExp: regexField.value.trim() || HideFilesOnGitHub.defaults.hideRegExp
	});
}

async function restoreOptions() {
	const items = await HideFilesOnGitHub.storage.get();
	const previewField = document.querySelector<HTMLInputElement>(`[name="filesPreview"][value="${String(items.filesPreview)}"]`);
	regexField.value = items.hideRegExp;
	previewField.checked = true;
}
