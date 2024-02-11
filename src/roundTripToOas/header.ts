import type * as OAS from '@app/oas';
import type * as RT from '@app/roundTrip';
import * as E from 'fp-ts/Either';

export const mapRequestHeader = (header: RT.Header): E.Either<Error, OAS.RequestHeader> => {
	if (header.name === '') {
		return E.left(new Error('Header name must be at least 1 byte')); // https://www.rfc-editor.org/rfc/rfc7230#section-3.2.4
	}

	return E.of({
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

export const mapResponseHeader = (header: RT.Header): E.Either<Error, NonNullable<OAS.ResponseObject['headers']>> => {
	if (header.name === '') {
		return E.left(new Error('Header name must be at least 1 byte')); // https://www.rfc-editor.org/rfc/rfc7230#section-3.2.4
	}

	return E.of({
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
