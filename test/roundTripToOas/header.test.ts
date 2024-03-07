import {describe, expect, it} from 'bun:test';
import type * as OAS from '@app/oas';
import type * as RT from '@app/roundTrip';
import {mapRequestHeader, mapResponseHeader} from '@app/roundTripToOas/header';
import * as E from 'fp-ts/Either';

describe('Map RoundTrip request header to OAS request header', () => {
	it('should map header', () => {
		const rtHeader: RT.Header = {name: 'Content-type', value: 'application/json'};
		const oasHeader: OAS.RequestHeader = {
			in: 'header',
			name: 'Content-type',
			required: true,
			allowEmptyValue: false,
			example: 'application/json',
			schema: {
				type: 'string',
				example: 'application/json',
				nullable: false,
				enum: ['application/json'],
			},
		};

		expect(mapRequestHeader(rtHeader)).toStrictEqual(E.of(oasHeader));
	});
	it('should map header with an empty value', () => {
		const rtHeader: RT.Header = {name: 'Content-type', value: ''};
		const oasHeader: OAS.RequestHeader = {
			in: 'header',
			name: 'Content-type',
			required: true,
			allowEmptyValue: true,
			example: '',
			schema: {
				type: 'string',
				nullable: false,
				example: '',
				enum: [''],
			},
		};

		expect(mapRequestHeader(rtHeader)).toStrictEqual(E.of(oasHeader));
	});
	it.skip('should fail mapping header with an empty name', () => {
		const rtHeader: RT.Header = {name: '', value: 'application/json'};

		const result = mapRequestHeader(rtHeader);
		expect(E.isRight(result)).toBeFalse();
		expect().toStrictEqual(E.left(new Error('Header name must be at least 1 byte')));
	});
});

describe('Map RoundTrip response header to OAS response header', () => {
	it('should map a header', () => {
		const rtHeader: RT.Header = {name: 'Content-type', value: 'application/json'};
		const oasHeader: OAS.ResponseObject['headers'] = {
			'Content-type': {
				required: true,
				allowEmptyValue: false,
				example: 'application/json',
				schema: {
					type: 'string',
					nullable: false,
					example: 'application/json',
					enum: ['application/json'],
				},
			},
		};

		expect(mapResponseHeader(rtHeader)).toStrictEqual(E.of(oasHeader));
	});
	it('should map a header with an empty value', () => {
		const rtHeader: RT.Header = {name: 'Content-type', value: ''};
		const oasHeader: OAS.ResponseObject['headers'] = {
			'Content-type': {
				required: true,
				allowEmptyValue: true,
				example: '',
				schema: {
					type: 'string',
					nullable: false,
					example: '',
					enum: [''],
				},
			},
		};

		expect(mapResponseHeader(rtHeader)).toStrictEqual(E.of(oasHeader));
	});
	it.skip('should fail mapping a header with an empty name', () => {
		const rtHeader: RT.Header = {name: '', value: 'application/json'};

		expect(mapResponseHeader(rtHeader)).toStrictEqual(E.left(new Error('Header name must be at least 1 byte')));
	});
});
