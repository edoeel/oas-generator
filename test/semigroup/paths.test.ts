import {pathsSg} from '@app/semigroup/index';
import {describe, expect, it} from 'bun:test';

const emptyOperation = {responses: {}};

describe('Paths semigroup', () => {
	it('should concat 2 paths into 1 paths', () => {
		expect(pathsSg.concat({
			'/quote': {
				get: emptyOperation,
			},
		}, {})).toStrictEqual({
			'/quote': {
				get: emptyOperation,
			},
		});
	});
	it('should concat 2 paths into 1 paths', () => {
		expect(pathsSg.concat({}, {
			'/quote': {
				get: emptyOperation,
			},
		})).toStrictEqual({
			'/quote': {
				get: emptyOperation,
			},
		});
	});
	it('should concat 2 paths into 1 paths', () => {
		expect(pathsSg.concat({
			'/quote': {
				get: emptyOperation,
			},
		}, {
			'/quote': {
				post: emptyOperation,
			},
		})).toStrictEqual({
			'/quote': {
				get: emptyOperation,
				post: emptyOperation,
			},
		});
	});
	it('should concat 2 paths into 1 paths', () => {
		expect(pathsSg.concat({
			'/quote': {
				get: emptyOperation,
			},
			'/pay': {
				get: emptyOperation,
			},
		}, {
			'/quote': {
				post: emptyOperation,
			},
		})).toStrictEqual({
			'/quote': {
				get: emptyOperation,
				post: emptyOperation,
			},
			'/pay': {
				get: emptyOperation,
			},
		});
	});
});
