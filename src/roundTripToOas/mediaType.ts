import {pipe} from 'effect';
import * as O from 'effect/Option';
import type * as OAS from '@app/oas';
import type * as RT from '@app/roundTrip';
import * as String from 'effect/String';
import * as Array from 'effect/ReadonlyArray';

export const mediaType = (contentTypeH: RT.Header['value'], body: RT.Request['body']) => pipe(
	mediaTypeFromContentType(contentTypeH),
	O.flatMap(_ => mediaTypeFromBody(body)),
);

const mediaTypeFromContentType = (contentTypeH: RT.Header['value']): O.Option<string> => pipe(
	contentTypeH,
	String.split(';'),
	Array.get(0),
	O.map(String.trim),
);

const mediaTypeFromBody = (body: RT.Request['body']): O.Option<string> => pipe(
	body,
	O.fromNullable,
	O.flatMap(body => {
		if (typeof body === 'object') {
			return O.some('application/json');
		}

		return jsonParsableBody(body);
	}),
);

const jsonParsableBody = (body: string) => pipe(
	body,
	O.liftThrowable(JSON.parse),
	O.map(_ => 'application/json'),
);
