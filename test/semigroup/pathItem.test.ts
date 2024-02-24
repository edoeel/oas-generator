import {pathItemSg} from '@app/semigroup/index';
import {describe, expect, it} from 'bun:test';

const emptyOperation = {responses: {}};

describe('Path item semigroup', () => {
	it('should concat 2 path item into 1 path item', () => {
		expect(pathItemSg.concat({
			get: emptyOperation,
			post: emptyOperation,
		}, {})).toStrictEqual({
			get: emptyOperation,
			post: emptyOperation,
		});
	});
	it('should concat 2 path item into 1 path item', () => {
		expect(pathItemSg.concat({}, {
			get: emptyOperation,
			post: emptyOperation,
		})).toStrictEqual({
			get: emptyOperation,
			post: emptyOperation,
		});
	});
	it('should concat 2 path item into 1 path item', () => {
		expect(pathItemSg.concat({
			get: emptyOperation,
			post: emptyOperation,
		}, {
			get: emptyOperation,
			put: emptyOperation,
		})).toStrictEqual({
			get: emptyOperation,
			post: emptyOperation,
			put: emptyOperation,
		});
	});
	it('should concat 2 path item into 1 path item', () => {
		expect(pathItemSg.concat({
			get: emptyOperation,
			post: emptyOperation,
		}, {
			put: emptyOperation,
			delete: emptyOperation,
		})).toStrictEqual({
			get: emptyOperation,
			post: emptyOperation,
			put: emptyOperation,
			delete: emptyOperation,
		});
	});
});
