export declare const defaults: {
	filesPreview: boolean;
	hideRegExp: string;
};
export declare const storage: {
	get: () => Promise<{
		filesPreview: boolean;
		hideRegExp: string;
	}>;
	set: (object: {
		filesPreview: boolean;
		hideRegExp: string;
	}) => void;
};
