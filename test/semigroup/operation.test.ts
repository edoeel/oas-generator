import {operationSg} from '@app/semigroup/index';
import {describe, expect, it} from 'bun:test';

const emptyOperation = {description: ''};

describe('Operation semigroup', () => {
	it('should concat 2 operations into 1 operation', () => {
		expect(operationSg.concat({
			responses: {
				200: emptyOperation,
			},
		}, {responses: {}})).toStrictEqual({
			responses: {
				200: emptyOperation,
			},
		});
	});
	it('should concat 2 operations into 1 operation', () => {
		expect(operationSg.concat({
			responses: {
			},
		}, {
			responses: {
				200: emptyOperation,
			},
		})).toStrictEqual({
			responses: {
				200: emptyOperation,
			},
		});
	});
	it('should concat 2 operations into 1 operation', () => {
		expect(operationSg.concat({
			responses: {
				200: emptyOperation,
			},
		}, {
			responses: {
				200: {description: 'A longer description'},
			},
		})).toStrictEqual({
			responses: {
				200: {description: 'A longer description'},
			},
		});
	});
	it('should concat 2 operations into 1 operation', () => {
		expect(operationSg.concat({
			responses: {
				200: emptyOperation,
				400: emptyOperation,
			},
		}, {
			responses: {
				200: {description: 'A longer description'},
			},
		})).toStrictEqual({
			responses: {
				200: {description: 'A longer description'},
				400: emptyOperation,
			},
		});
	});
});
