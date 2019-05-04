// TODO: Drop when this bug is fixed
// https://github.com/vadimdemedes/dom-chef/issues/36
declare namespace JSX {
	interface Element extends SVGElement, HTMLElement, DocumentFragment {}
	type LabelIntrinsicElement = IntrinsicElements['label'];
	type TdIntrinsicElement = IntrinsicElements['td'];
	interface IntrinsicElements {
		'label': LabelIntrinsicElement & {for?: string}; // https://github.com/vadimdemedes/dom-chef/issues/37
		'td': TdIntrinsicElement & {colspan?: string}; // https://github.com/vadimdemedes/dom-chef/issues/36#issuecomment-488721539
	}
}
