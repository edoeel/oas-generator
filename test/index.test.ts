import {expect, test} from 'bun:test';
import {x, y} from '../src';

test('2 + 3', () => {
	expect(x + y).toBe(5);
});
