import {responsesSg} from '@app/semigroup/index';
import {describe, expect, it} from 'bun:test';

const emptyOperation = {description: ''};

describe('Responses semigroup', () => {
	it('should concat 2 responses into 1 responses', () => {
		const x = {200: emptyOperation};
		const y = {};
		const expected = {200: emptyOperation};
		expect(responsesSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 responses into 1 responses', () => {
		const x = {};
		const y = {200: emptyOperation};
		const expected = {200: emptyOperation};
		expect(responsesSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 responses into 1 responses', () => {
		const x = {200: emptyOperation};
		const y = {200: {description: 'A longer description'}};
		const expected = {200: {description: 'A longer description'}};
		expect(responsesSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 responses into 1 responses', () => {
		const x = {200: emptyOperation, 400: emptyOperation};
		const y = {200: {description: 'A longer description'}};
		const expected = {200: {description: 'A longer description'}, 400: emptyOperation};
		expect(responsesSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 responses into 1 responses', () => {
		const x = {200: {description: 'A longer description'}};
		const y = {200: emptyOperation, 400: emptyOperation};
		const expected = {200: {description: 'A longer description'}, 400: emptyOperation};
		expect(responsesSg.concat(x, y)).toStrictEqual(expected);
	});
});
