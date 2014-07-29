'use strict';

function hideFiles() {
	[].forEach.call(document.querySelectorAll('.files tr'), function (el) {
		if (el.querySelector('a[title^="."')) {
			el.remove();
		}
	});
}

hideFiles();

new MutationObserver(hideFiles).observe(document.querySelector('#js-repo-pjax-container'), {childList: true});
