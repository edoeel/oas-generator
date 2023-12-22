import {describe, expect, it} from 'bun:test';
import type * as OAS from '@app/oas';
import type * as RT from '@app/roundTrip';
import {mapRequestHeader, mapResponseHeader} from '@app/roundTripToOas/header';
import {Effect} from 'effect';

describe('Map RoundTrip request header to OAS request header', () => {
	it('should map header', () => {
		const rtHeader: RT.Header = {name: 'Content-type', value: 'application/json'};
		const oasHeader: OAS.RequestHeader = {
			in: 'header',
			name: 'Content-type',
			required: true,
			allowEmptyValue: false,
			description: '**header description**',
			example: 'application/json',
			schema: {
				type: 'string',
				description: '**schema description**',
				example: 'application/json',
				nullable: false,
				enum: ['application/json'],
			},
		};

		expect(mapRequestHeader(rtHeader)).toStrictEqual(Effect.succeed(oasHeader));
	});
	it('should map header with an empty value', () => {
		const rtHeader: RT.Header = {name: 'Content-type', value: ''};
		const oasHeader: OAS.RequestHeader = {
			in: 'header',
			name: 'Content-type',
			required: true,
			allowEmptyValue: true,
			description: '**header description**',
			example: '',
			schema: {
				type: 'string',
				description: '**schema description**',
				nullable: false,
				example: '',
				enum: [''],
			},
		};

		expect(mapRequestHeader(rtHeader)).toStrictEqual(Effect.succeed(oasHeader));
	});
	it.skip('should fail mapping header with an empty name', () => {
		const rtHeader: RT.Header = {name: '', value: 'application/json'};

		const result = mapRequestHeader(rtHeader);
		expect(Effect.isSuccess(result)).toBeFalse();
		expect().toStrictEqual(Effect.fail(new Error('Header name must be at least 1 byte')));
	});
});

describe('Map RoundTrip response header to OAS response header', () => {
	it('should map a header', () => {
		const rtHeader: RT.Header = {name: 'Content-type', value: 'application/json'};
		const oasHeader: OAS.ResponseObject['headers'] = {
			'Content-type': {
				required: true,
				allowEmptyValue: false,
				description: '**header description**',
				example: 'application/json',
				schema: {
					type: 'string',
					description: '**schema description**',
					nullable: false,
					example: 'application/json',
					enum: ['application/json'],
				},
			},
		};

		expect(mapResponseHeader(rtHeader)).toStrictEqual(Effect.succeed(oasHeader));
	});
	it('should map a header with an empty value', () => {
		const rtHeader: RT.Header = {name: 'Content-type', value: ''};
		const oasHeader: OAS.ResponseObject['headers'] = {
			'Content-type': {
				required: true,
				allowEmptyValue: true,
				description: '**header description**',
				example: '',
				schema: {
					type: 'string',
					description: '**schema description**',
					nullable: false,
					example: '',
					enum: [''],
				},
			},
		};

		expect(mapResponseHeader(rtHeader)).toStrictEqual(Effect.succeed(oasHeader));
	});
	it.skip('should fail mapping a header with an empty name', () => {
		const rtHeader: RT.Header = {name: '', value: 'application/json'};

		expect(mapResponseHeader(rtHeader)).toStrictEqual(Effect.fail(new Error('Header name must be at least 1 byte')));
	});
});
