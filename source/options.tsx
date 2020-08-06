import React from 'dom-chef';
import fitTextarea from 'fit-textarea';
import {storage, defaults} from './api';

const regexField = document.querySelector<HTMLTextAreaElement>('#hideRegExp')!;
const errorMessage = document.querySelector('#errorMessage')!;
const delimiters = /^\/|\/$/;

void restoreOptions();
document.addEventListener('input', updateOptions);

/* Native validation tooltips don't seem to work */
function setValidity(text: string | Node = ''): void {
	errorMessage.textContent = '';
	errorMessage.append(text);
}

function updateOptions(): void {
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

function saveOptions(): void {
	const previewField = document.querySelector<HTMLInputElement>('[name="filesPreview"]:checked')!;

	storage.set({
		filesPreview: previewField.value === 'true',
		hideRegExp: regexField.value.trim() || defaults.hideRegExp
	});
}

async function restoreOptions(): Promise<void> {
	const items = await storage.get();
	const previewField = document.querySelector<HTMLInputElement>(`[name="filesPreview"][value="${String(items.filesPreview)}"]`)!;
	regexField.value = items.hideRegExp;
	previewField.checked = true;

	fitTextarea.watch(regexField);
}
