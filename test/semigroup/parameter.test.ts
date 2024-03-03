import {parameterSg} from '@app/semigroup/index';
import type * as OAS from '@app/oas';
import {describe, expect, it} from 'bun:test';

const baseParameter: OAS.ParameterObject = {in: 'header', name: 'anHeader'};

describe('Parameter semigroup', () => {
	it.each([
		[baseParameter, baseParameter, baseParameter],
	])('base parameter', (x, y, expected) => {
		expect(parameterSg.concat(x, y)).toStrictEqual(expected);
	});
	it.each([
		[{...baseParameter, description: 'A longer description'}, baseParameter, {...baseParameter, description: 'A longer description'}],
		[baseParameter, {...baseParameter, description: 'A longer description'}, {...baseParameter, description: 'A longer description'}],
	])('should concat description property', (x, y, expected) => {
		expect(parameterSg.concat(x, y)).toStrictEqual(expected);
	});
	it.each([
		[{...baseParameter, required: true}, {...baseParameter, required: true}, {...baseParameter, required: true}],
		[{...baseParameter, required: false}, {...baseParameter, required: false}, {...baseParameter, required: false}],
		[{...baseParameter, required: true}, {...baseParameter, required: false}, {...baseParameter, required: false}],
		[{...baseParameter, required: false}, {...baseParameter, required: true}, {...baseParameter, required: false}],
		[baseParameter, {...baseParameter, required: true}, {...baseParameter, required: true}],
		[{...baseParameter, required: true}, baseParameter, {...baseParameter, required: true}],
		[baseParameter, {...baseParameter, required: false}, {...baseParameter, required: false}],
		[{...baseParameter, required: false}, baseParameter, {...baseParameter, required: false}],
	])('should concat required property', (x, y, expected) => {
		expect(parameterSg.concat(x, y)).toStrictEqual(expected);
	});
	it.each([
		[{...baseParameter, deprecated: true}, {...baseParameter, deprecated: true}, {...baseParameter, deprecated: true}],
		[{...baseParameter, deprecated: false}, {...baseParameter, deprecated: false}, {...baseParameter, deprecated: false}],
		[{...baseParameter, deprecated: true}, {...baseParameter, deprecated: false}, {...baseParameter, deprecated: true}],
		[{...baseParameter, deprecated: false}, {...baseParameter, deprecated: true}, {...baseParameter, deprecated: true}],
		[baseParameter, {...baseParameter, deprecated: true}, {...baseParameter, deprecated: true}],
		[{...baseParameter, deprecated: true}, baseParameter, {...baseParameter, deprecated: true}],
		[baseParameter, {...baseParameter, deprecated: false}, {...baseParameter, deprecated: false}],
		[{...baseParameter, deprecated: false}, baseParameter, {...baseParameter, deprecated: false}],
	])('should concat deprecated property', (x, y, expected) => {
		expect(parameterSg.concat(x, y)).toStrictEqual(expected);
	});
	it.each([
		[{...baseParameter, allowEmptyValue: true}, {...baseParameter, allowEmptyValue: true}, {...baseParameter, allowEmptyValue: true}],
		[{...baseParameter, allowEmptyValue: false}, {...baseParameter, allowEmptyValue: false}, {...baseParameter, allowEmptyValue: false}],
		[{...baseParameter, allowEmptyValue: true}, {...baseParameter, allowEmptyValue: false}, {...baseParameter, allowEmptyValue: true}],
		[{...baseParameter, allowEmptyValue: false}, {...baseParameter, allowEmptyValue: true}, {...baseParameter, allowEmptyValue: true}],
		[baseParameter, {...baseParameter, allowEmptyValue: true}, {...baseParameter, allowEmptyValue: true}],
		[{...baseParameter, allowEmptyValue: true}, baseParameter, {...baseParameter, allowEmptyValue: true}],
		[baseParameter, {...baseParameter, allowEmptyValue: false}, {...baseParameter, allowEmptyValue: false}],
		[{...baseParameter, allowEmptyValue: false}, baseParameter, {...baseParameter, allowEmptyValue: false}],
	])('should concat allowEmptyValue property', (x, y, expected) => {
		expect(parameterSg.concat(x, y)).toStrictEqual(expected);
	});
	it.each([
		[{...baseParameter, example: 1}, {...baseParameter, example: 2}, {...baseParameter, example: 1}],
		[{...baseParameter, example: 2}, {...baseParameter, example: 1}, {...baseParameter, example: 2}],
		[{...baseParameter, example: true}, {...baseParameter, example: false}, {...baseParameter, example: true}],
		[{...baseParameter, example: false}, {...baseParameter, example: true}, {...baseParameter, example: false}],
		[{...baseParameter, example: 'a'}, {...baseParameter, example: 'A longer example'}, {...baseParameter, example: 'a'}],
		[{...baseParameter, example: false}, {...baseParameter, example: 'a'}, {...baseParameter, example: false}],
		[baseParameter, {...baseParameter, example: 1}, {...baseParameter, example: 1}],
		[{...baseParameter, example: 1}, baseParameter, {...baseParameter, example: 1}],
	])('should concat example property', (x, y, expected) => {
		expect(parameterSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat schema property', () => {
		const x: OAS.ParameterObject = {...baseParameter, schema: {type: 'string', description: 'A description'}};
		const y: OAS.ParameterObject = {...baseParameter, schema: {type: 'string', description: 'A longer description'}};
		const expected: OAS.ParameterObject = {...baseParameter, schema: {type: 'string', description: 'A longer description'}};
		expect(parameterSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat schema property', () => {
		const x: OAS.ParameterObject = {...baseParameter, schema: {type: 'string'}};
		const y: OAS.ParameterObject = {...baseParameter, schema: {type: 'boolean'}};
		const expected: OAS.ParameterObject = {...baseParameter, schema: {oneOf: [{type: 'string'}, {type: 'boolean'}]}};
		expect(parameterSg.concat(x, y)).toStrictEqual(expected);
	});
});
