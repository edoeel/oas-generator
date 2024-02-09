import type * as OAS from '@app/oas';
import type * as RT from '@app/roundTrip';
import {mapServer} from '@app/roundTripToOas/server';
import {mapRequestBody, mapResponseContent} from '@app/roundTripToOas/body';
import {mapRequestHeader, mapResponseHeader} from '@app/roundTripToOas/header';
import {type ReadonlyNonEmptyArray} from 'fp-ts/ReadonlyNonEmptyArray';

export const mapRoundTripToOas = (rt: RT.RoundTrip): OAS.Oas => ({
	openapi: '**3.0.1**',
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
						? {requestBody: mapRequestBody(rt[0].headers.find(h => h.name.toLowerCase() === 'content-type')?.value.toLowerCase()!, rt[0].body)}
						: {}
				),
				...(
					hasHeaders(rt[0].headers)
						? {parameters: rt[0].headers.map(mapRequestHeader).map(v => (v as any).value)} // TODO just pass the main test
						: {}
				),
				responses: {
					[rt[1].statusCode]: {
						description: '**description**',
						...(
							hasHeaders(rt[0].headers)
								? {headers: rt[0].headers.map(mapResponseHeader).reduce((pv, cv) => ({...pv, ...(cv as any).value}), {})}  // TODO just pass the main test
								: {}
						),
						...(
							hasBody(rt[1].body)
								? { content: mapResponseContent(rt[1].headers.find(h => h.name.toLowerCase() === 'content-type')?.value.toLowerCase()!, rt[1].body) }
								: {}
						),
					},
				},
			},
		},
	},
});

const hasBody = (maybeBody: unknown): maybeBody is OAS.RequestBody | OAS.ResponseBody => maybeBody !== undefined;
const hasHeaders = <T>(maybeReqHeaders: readonly T[]): maybeReqHeaders is ReadonlyNonEmptyArray<T> => mapRequestHeader.length > 0;
