'use strict';

var hidden = true;
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
var isDotfilesRepository = document.querySelector('.js-current-repository[href$="/dotfiles"]');

function toggleFiles() {
	[].forEach.call(document.querySelectorAll('.files tr'), function (el) {
		if(el.querySelector('a[title^="."')) {
			el.style.display = hidden ? 'none' : 'table-row';
		};
	});
}

function trigger() {
	hidden = !hidden;
	toggleFiles();
}

function addToggleBtn(ee) {
	var _createHTML = function(htmlStr) {
	    var frag = document.createDocumentFragment(),
	        temp = document.createElement('a');
	    temp.innerHTML = htmlStr;
	    while (temp.firstChild) {
	        frag.appendChild(temp.firstChild);
	    }
	    return frag;
	}

	var toggleBtn = _createHTML("<a class='minibutton hide-file-toggle' style='margin-right:8px'>Toggle dotfiles</a>")
	var btnLocation = document.querySelector(".file-navigation .breadcrumb");
	var toogleBtnCached = document.querySelector('.hide-file-toggle');

	if(!toogleBtnCached) btnLocation.parentNode.insertBefore(toggleBtn, btnLocation);
	
	document.querySelector('.hide-file-toggle').addEventListener("click", trigger);

	toggleFiles();
}



if (!isDotfilesRepository) {
	
	addToggleBtn();

	new MutationObserver(addToggleBtn).observe(document.querySelector('#js-repo-pjax-container'), {childList: true});
}
