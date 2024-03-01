import { schemaSg } from '@app/semigroup/index';
import { describe, expect, it } from 'bun:test';
import * as OAS from '@app/oas';

describe('Schema semigroup', () => {
	it('should concat 2 schema into 1 schema', () => {
		const x: OAS.Schema = { type: 'boolean' }
		const y: OAS.Schema = { type: 'boolean' }
		const expected: OAS.Schema = { type: 'boolean' }
		expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 schema into 1 schema', () => {
		const x: OAS.Schema = {}
		const y: OAS.Schema = {}
		const expected: OAS.Schema = {}
		expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 schema into 1 schema', () => {
		const x: OAS.Schema = { type: 'number' }
		const y: OAS.Schema = { type: 'boolean' }
		const expected: OAS.Schema = { oneOf: [{ type: 'number' }, { type: 'boolean' }] }
		expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 schema into 1 schema', () => {
		const x: OAS.Schema = { type: 'boolean' }
		const y: OAS.Schema = { type: 'number' }
		const expected: OAS.Schema = { oneOf: [{ type: 'boolean' }, { type: 'number' }] }
		expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 schema into 1 schema', () => {
		const x: OAS.Schema = { type: 'array', items: {} }
		const y: OAS.Schema = { type: 'number' }
		const expected: OAS.Schema = { oneOf: [{ type: 'array', items: {} }, { type: 'number' }] }
		expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 schema into 1 schema', () => {
		const x: OAS.Schema = { type: 'number' }
		const y: OAS.Schema = { type: 'array', items: {} }
		const expected: OAS.Schema = { oneOf: [{ type: 'number' }, { type: 'array', items: {} }] }
		expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 schema into 1 schema', () => {
		const x: OAS.Schema = { oneOf: [{ type: 'string' }] }
		const y: OAS.Schema = { type: 'boolean' }
		const expected: OAS.Schema = { oneOf: [{ type: 'string' }, { type: 'boolean' }] }
		expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 schema into 1 schema', () => {
		const x: OAS.Schema = { type: 'boolean' }
		const y: OAS.Schema = { oneOf: [{ type: 'string' }] }
		const expected: OAS.Schema = { oneOf: [{ type: 'boolean' }, { type: 'string' }] }
		expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 schema into 1 schema', () => {
		const x: OAS.Schema = { oneOf: [{ type: 'string' }, { type: 'boolean' }] }
		const y: OAS.Schema = { type: 'number' }
		const expected: OAS.Schema = { oneOf: [{ type: 'string' }, { type: 'boolean' }, { type: 'number' }] }
		expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 schema into 1 schema', () => {
		const x: OAS.Schema = { type: 'number' }
		const y: OAS.Schema = { oneOf: [{ type: 'string' }, { type: 'boolean' }] }
		const expected: OAS.Schema = { oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'boolean' }] }
		expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	});
	it('should concat 2 schema into 1 schema', () => {
		const x: OAS.Schema = { oneOf: [{ type: 'string' }] }
		const y: OAS.Schema = { oneOf: [{ type: 'string' }] }
		const expected: OAS.Schema = { oneOf: [{ type: 'string' }] }
		expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	});
	it.skip('should concat 2 schema into 1 schema', () => {
		const x: OAS.Schema = { oneOf: [{ type: 'string' }, { type: 'boolean' }] }
		const y: OAS.Schema = { oneOf: [{ type: 'string' }] }
		const expected: OAS.Schema = { oneOf: [{ type: 'string' }, { type: 'boolean' }] }
		expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	});
	it.skip('should concat 2 schema into 1 schema', () => {
		const x: OAS.Schema = { oneOf: [{ type: 'string' }] }
		const y: OAS.Schema = { oneOf: [{ type: 'string' }, { type: 'boolean' }] }
		const expected: OAS.Schema = { oneOf: [{ type: 'string' }, { type: 'boolean' }] }
		expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	});
	it.skip('should concat 2 schema into 1 schema', () => {
		const x: OAS.Schema = { oneOf: [{ type: 'string' }, { type: 'boolean' }] }
		const y: OAS.Schema = { oneOf: [{ type: 'string' }, { type: 'boolean' }] }
		const expected: OAS.Schema = { oneOf: [{ type: 'string' }, { type: 'boolean' }] }
		expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	});



	// it('should concat 2 schema into 1 schema', () => {
	// 	const x: OAS.Schema = {
	// 		type: 'boolean',
	// 		description: '',
	// 	}
	// 	const y: OAS.Schema = {
	// 		type: 'boolean',
	// 		description: 'A longer description',
	// 	}
	// 	const expected: OAS.Schema = {
	// 		type: 'boolean',
	// 		description: 'A longer description',
	// 	}
	// 	expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	// });
	// it('should concat 2 schema into 1 schema', () => {
	// 	const x: OAS.Schema = {
	// 		type: 'boolean',
	// 		description: '',
	// 	}
	// 	const y: OAS.Schema = {
	// 		type: 'string',
	// 		description: 'A longer description',
	// 	}
	// 	const expected: OAS.Schema = {
	// 		oneOf: [x, y]
	// 	}
	// 	expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	// });
	// it('should concat 2 schema into 1 schema', () => {
	// 	const x: OAS.Schema = {
	// 		oneOf: [{
	// 			type: 'boolean',
	// 			description: '',
	// 		}, {
	// 			type: 'string',
	// 			description: 'A longer description',
	// 		}],
	// 	}
	// 	const y: OAS.Schema = {
	// 		type: 'number',
	// 		description: '',
	// 	}
	// 	const expected: OAS.Schema = {
	// 		...x,
	// 		oneOf: x.oneOf?.concat(y)
	// 	}
	// 	expect(schemaSg.concat(x, y)).toStrictEqual(expected);
	// });
	// it('should concat 2 schema into 1 schema', () => {
	// 	const x: OAS.Schema = {
	// 		type: 'number',
	// 		description: '',
	// 	}
	// 	const y: OAS.Schema = {
	// 		oneOf: [{
	// 			type: 'boolean',
	// 			description: '',
	// 		}, {
	// 			type: 'string',
	// 			description: 'A longer description',
	// 		}],
	// 	}
	// 	const expected: OAS.Schema = {
	// 		...y,
	// 		oneOf: y.oneOf?.concat(x)
	// 	}
	// 	expect(schemaSg.concat(x, y)).toStrictEqual(expected);

	// 	const a = schemaSg.concat(schemaSg.concat(x, y), y);
	// 	const b = schemaSg.concat(x, schemaSg.concat(x, y));
	// 	console.log("HERE", schemaSg.concat(x, y))
	// 	expect(a).toStrictEqual(b);
	// });
});
