import {describe, expect, it} from 'bun:test';
import type * as OAS from '@app/oas';
import type * as RT from '@app/roundTrip';
import {mapRequestBody} from '@app/roundTripToOas/body';

describe('Map RoundTrip request body to OAS request body', () => {
	it('should map application/json body ', () => {
		const rtBody: RT.Request['body'] = JSON.stringify({
			first: 42,
			second: 'A valid string',
			third: true,
			fourth: [],
			fifth: [true, false],
			sixth: {},
			seventh: {
				eighth: null,
			},
			nineth: 42.2,
		});
		const oasBody: OAS.RequestBody = {
			required: true,
			content: {
				'application/json': {
					schema: {
						type: 'object',
						nullable: false,
						required: [
							'first',
							'second',
							'third',
							'fourth',
							'fifth',
							'sixth',
							'seventh',
							'nineth',
						],
						properties: {
							first: {
								type: 'integer',
								nullable: false,
								format: 'int32',
								enum: [42],
							},
							second: {
								type: 'string',
								nullable: false,
								enum: ['A valid string'],
							},
							third: {
								type: 'boolean',
								nullable: false,
								enum: [true],
							},
							fourth: {
								type: 'array',
								nullable: false,
								items: {},
							},
							fifth: {
								type: 'array',
								nullable: false,
								items: {
									type: 'boolean',
									nullable: false,
									enum: [true],
								},
							},
							sixth: {
								type: 'object',
								nullable: false,
							},
							seventh: {
								type: 'object',
								nullable: false,
								required: ['eighth'],
								properties: {
									eighth: {
										nullable: true,
									},
								},
							},
							nineth: {
								type: 'number',
								nullable: false,
								format: 'float',
								enum: [42.2],
							},
						},
					},
				},
			},
		};
		expect(JSON.stringify(mapRequestBody('application/json', rtBody))).toEqual(JSON.stringify(oasBody));
	});
});
