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
	// Don't allow delimiters in RegExp string
	for (const line of regexField.value.split('\n')) {
		if (delimiters.test(line)) {
			return setValidity(`Use <code>${line.replace(/^\/|\/$/g, '')}</code> instead of <code>${line}</code>. Slashes are not required.`);
		}
	}
	}

	setValidity();
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
