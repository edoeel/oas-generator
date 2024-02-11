import type * as OAS from '@app/oas';
import type * as RT from '@app/roundTrip';
import {mapServer} from '@app/roundTripToOas/server';
import {mapRequestBody, mapResponseContent} from '@app/roundTripToOas/body';
import {mapRequestHeader, mapResponseHeader} from '@app/roundTripToOas/header';
import { mediaType } from '@app/roundTripToOas/mediaType';
import {type ReadonlyNonEmptyArray} from 'fp-ts/ReadonlyNonEmptyArray';
import * as E from 'fp-ts/Either';
import * as Arr from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';
import assert from 'node:assert';

/*
- request content-type MUST BE type always present
*/

export const mapRoundTripToOas = (rt: RT.RoundTrip): OAS.Oas => {
	const reqHeadersE = pipe(rt[0].headers.map(mapRequestHeader), Arr.sequence(E.Applicative));
	assert(reqHeadersE._tag === 'Right'); // TODO refactor: at the moment I want to pass the test

	const reqMediaType = mediaType(rt[0].headers.find(searchForContentType)?.value.toLowerCase()!, rt[0].body);
	assert(reqMediaType._tag === "Some"); // TODO refactor: at the moment I want to pass the test

	const resheadersE = pipe(rt[0].headers.map(mapResponseHeader), Arr.sequence(E.Applicative), E.map(l => l.reduce((pv, cv) => ({...pv, ...cv}), {})));
	assert(resheadersE._tag === 'Right'); // TODO refactor: at the moment I want to pass the test

	const resMediaType = mediaType(rt[1].headers.find(searchForContentType)?.value.toLowerCase()!, rt[1].body);
	assert(resMediaType._tag === "Some"); // TODO refactor: at the moment I want to pass the test
	
	return {
		openapi: '3.0.1',
		info: {
			title: '**title**',
			version: '**version**',
		},
		servers: [mapServer(rt[0].host)],
		paths: {
			[rt[0].path]: {
				[rt[0].method.toLowerCase()]: {
					description: '**description**',
					summary: '**summary**',
					...(
						hasBody(rt[0].body)
							? {requestBody: mapRequestBody(reqMediaType.value, rt[0].body)}
							: {}
					),
					...(
						hasHeaders(rt[0].headers)
							? {parameters: reqHeadersE.right}
							: {}
					),
					responses: {
						[rt[1].statusCode]: {
							description: '**description**',
							...(
								hasHeaders(rt[0].headers)
									? {headers: resheadersE.right}
									: {}
							),
							...(
								hasBody(rt[1].body)
									? {content: mapResponseContent(resMediaType.value, rt[1].body)}
									: {}
							),
						},
					},
				},
			},
		},
	};
};

const hasBody = (maybeBody: unknown): maybeBody is OAS.RequestBody | OAS.ResponseBody => maybeBody !== undefined;
const hasHeaders = <T>(maybeReqHeaders: readonly T[]): maybeReqHeaders is ReadonlyNonEmptyArray<T> => mapRequestHeader.length > 0;
const searchForContentType = (h: RT.Header) => h.name.toLowerCase() === 'content-type';
