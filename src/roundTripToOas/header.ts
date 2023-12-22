import type * as OAS from '@app/oas';
import type * as RT from '@app/roundTrip';
import {Effect} from 'effect';

export const mapRequestHeader = (header: RT.Header): Effect.Effect<never, Error, OAS.RequestHeader> => {
	if (header.name === '') {
		return Effect.fail(new Error('Header name must be at least 1 byte')); // https://www.rfc-editor.org/rfc/rfc7230#section-3.2.4
	}

	return Effect.succeed({
		in: 'header',
		name: header.name,
		required: true,
		description: '**header description**',
		allowEmptyValue: header.value === '',
		example: header.value,
		schema: {
			type: 'string',
			enum: [header.value],
			description: '**schema description**',
			example: header.value,
			nullable: false,
		},
	});
};

export const mapResponseHeader = (header: RT.Header): Effect.Effect<never, Error, OAS.ResponseObject['headers']> => {
	if (header.name === '') {
		return Effect.fail(new Error('Header name must be at least 1 byte')); // https://www.rfc-editor.org/rfc/rfc7230#section-3.2.4
	}

	return Effect.succeed({
		[header.name]: {
			required: true,
			description: '**header description**',
			allowEmptyValue: header.value === '',
			example: header.value,
			schema: {
				type: 'string',
				enum: [header.value],
				description: '**schema description**',
				example: header.value,
				nullable: false,
			},
		},
	});
};
