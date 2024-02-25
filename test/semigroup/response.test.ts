import {responseSg} from '@app/semigroup/index';
import {describe, expect, it} from 'bun:test';

const emptyOperation = {description: ''};

describe('Response semigroup', () => {
	it('should concat 2 response into 1 response', () => {
		const x = emptyOperation;
		const y = {description: 'A longer description'};
		const expected = {description: 'A longer description'};
		expect(responseSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 response into 1 response', () => {
		const x = {description: 'A longer description'};
		const y = emptyOperation;
		const expected = {description: 'A longer description'};
		expect(responseSg.concat(x, y)).toStrictEqual(expected);
	});
});
