import {parametersSg} from '@app/semigroup/index';
import type * as OAS from '@app/oas';
import {describe, expect, it} from 'bun:test';

const baseParameter: OAS.ParameterObject = {in: 'header', name: 'anHeader'};

describe('Parameters semigroup', () => {
	it.each([
		[[baseParameter], [baseParameter], [baseParameter]],
	])('base parameters', (x, y, expected) => {
		expect(parametersSg.concat(x, y)).toStrictEqual(expected);
	});
	it.each([
		[[{in: 'header', name: 'Content-type'}], [{in: 'header', name: 'Content-type'}], [{in: 'header', name: 'Content-type'}]],
		[[{in: 'header', name: 'Content-type', description: 'A description'}], [{in: 'header', name: 'Content-type'}], [{in: 'header', name: 'Content-type', description: 'A description'}]],
		[[{in: 'header', name: 'Content-type'}], [{in: 'header', name: 'Content-type', description: 'A description'}], [{in: 'header', name: 'Content-type', description: 'A description'}]],
		[[{in: 'header', name: 'Content-type', description: 'A longer description'}], [{in: 'header', name: 'Content-type', description: 'A description'}], [{in: 'header', name: 'Content-type', description: 'A longer description'}]],
		[[{in: 'header', name: 'Accept', description: 'A longer description'}], [{in: 'header', name: 'Content-type', description: 'A description'}], [{in: 'header', name: 'Accept', description: 'A longer description'}, {in: 'header', name: 'Content-type', description: 'A description'}]],
	])('should concat parameters merging by in and name properties', (x, y, expected) => {
		expect(parametersSg.concat(x, y)).toStrictEqual(expected);
	});
});
