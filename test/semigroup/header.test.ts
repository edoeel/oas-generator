import {headerSg} from '@app/semigroup/index';
import {describe, expect, it} from 'bun:test';

const emptyHeader = {description: ''};

describe('Header semigroup', () => {
	it('should concat 2 header into 1 header', () => {
		const x = emptyHeader;
		const y = {};
		const expected = emptyHeader;
		expect(headerSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 header into 1 header', () => {
		const x = {};
		const y = emptyHeader;
		const expected = emptyHeader;
		expect(headerSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 header into 1 header', () => {
		const x = {description: "A longer description"};
		const y = emptyHeader;
		const expected = {description: "A longer description"};
		expect(headerSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 header into 1 header', () => {
		const x = emptyHeader;
		const y = {description: "A longer description"};
		const expected = {description: "A longer description"};
		expect(headerSg.concat(x, y)).toStrictEqual(expected);
	});
});
