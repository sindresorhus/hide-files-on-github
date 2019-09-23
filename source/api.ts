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
	async get(): Promise<typeof defaults> {
		return new Promise(resolve => {
			// Drop `as` when `.get` rightfully resolves to `typeof defaults` instead of `AnyObject`
			chrome.storage.sync.get(defaults, options => resolve(options as typeof defaults));
		});
	},
	set(object: typeof defaults) {
		chrome.storage.sync.set(object);
	}
};
