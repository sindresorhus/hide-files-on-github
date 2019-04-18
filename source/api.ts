export const defaults = {
	filesPreview: true,
	hideRegExp: `
		^\\.
		^license
		^cname$
		^version$
		^(patents|authors|contributors|acknowledgments|backers)(\\.|$)
		^(issue|pull_request)_template\\.md$
		^(appveyor|circle|codecov)\\.yml$
		^(yarn|Gemfile)\\.lock$
		^package-lock\\.json$
		^npm-shrinkwrap\\.json$
		\\.sublime-project$
		^(tsconfig|typings|tslint|tsfmt)\\.json$
		^coffeelint\\.json$
		^(karma|protractor|sauce).*\\.js$
		^testem(\\.[\\w-]+)?\\.(json|js)$
		^yuidoc\\.json$
		^stylelint-config\\.json$
		^humans\\.txt$
		^readme\\.md$
	`.replace(/\n\t+/g, '\n').trim()
};

export const storage = {
	get: (): Promise<typeof defaults> => new Promise(resolve => {
		chrome.storage.sync.get(defaults, resolve);
	}),
	set: (object: typeof defaults) => {
		chrome.storage.sync.set(object);
	}
};
