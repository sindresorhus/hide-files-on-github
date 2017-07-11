(() => {
	'use strict';

	window.HideFilesOnGitHub = (() => {
		const defaults = {
			hideRegExp: [
				'^\\.',
				'^license',
				'^cname$',
				'^version$',
				'^(patents|authors|contributors|acknowledgments|backers)(\\.|$)',
				'^(issue|pull_request)_template\\.md$',
				'^(appveyor|circle|codecov)\\.yml$',
				'^(yarn|Gemfile)\\.lock$',
				'^package-lock\\.json$',
				'^npm-shrinkwrap\\.json$',
				'\\.sublime-project$',
				'^(tsconfig|typings|tslint|tsfmt)\\.json$', // TypeScript
				'^coffeelint\\.json$',
				'^(karma|protractor|sauce).*\\.js$',
				'^testem(\\.[\\w-]+)?\\.(json|js)$',
				'^yuidoc\\.json$',
				'^stylelint-config\\.json',
				'^humans\\.txt'
			].join('|')
		};

		const api = {
			storage: {
				get: () => new Promise(resolve => window.chrome.storage.sync.get(defaults, resolve)),
				set: obj => {
					window.chrome.storage.sync.set(obj);
				}
			}
		};

		api.defaults = defaults;

		return api;
	})();
})();
