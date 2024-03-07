import {assertUnreachable} from '@app/functions';
import type * as OAS from '@app/oas';
import type * as RT from '@app/roundTrip';
import {isBoolean} from 'effect/Boolean';
import {isNumber} from 'effect/Number';
import {isRecord} from 'effect/Predicate';
import {isString} from 'effect/String';

export const mapRequestBody = (contentTypeH: RT.Header['value'], body: RT.Request['body']): OAS.RequestBody => {
	if (body === undefined) {
		return {
			required: false,
			content: {
			},
		};
	}

	switch (contentTypeH) {
		case 'application/json': {
			return unserializeApplicationJson(body);
		}

		default:
			return assertUnreachable(`content-type ${contentTypeH} not yet handled`, contentTypeH);
	}
};

// TODO refactor this method
// TODO test this method
export const mapResponseContent = (contentTypeH: RT.Header['value'], body: RT.Response['body']): OAS.ResponseBody => {
	if (body === undefined) {
		return {};
	}

	switch (contentTypeH) {
		case 'application/json':
		case 'application/problem+json': {
			return unserializeApplicationJson(body).content;
		}

		default:
			return assertUnreachable(`content-type ${contentTypeH} not yet handled`, contentTypeH);
	}
};

const unserializeApplicationJson = (body: Omit<RT.Request['body'], 'undefined'>): OAS.RequestBody => ({
	required: true,
	content: {
		'application/json': {
			schema: toOasSchema(typeof body === 'string' ? JSON.parse(body) : body),
		},
	},
});

const toOasSchema = (value: unknown): OAS.Schema => {
	if (Array.isArray(value)) {
		return {
			type: 'array',
			nullable: false,
			items: value.length === 0 ? {} : toOasSchema(value[0]), // TODO map toOASSchema for each items of array, reduce results into one schema
		};
	}

	if (isRecord(value)) {
		const propKeys = Object.keys(value);
		const prop = propKeys
			.map(k => ({[k]: toOasSchema(value[k])}))
			.reduce((pv, cv) => ({...pv, ...cv}), {});

		return {
			type: 'object',
			nullable: false,
			...(propKeys.length > 0 ? {
				required: propKeys,
				properties: prop,
			} : {}),
		};
	}

	if (isBoolean(value)) {
		return {
			type: 'boolean',
			nullable: false,
			enum: [value],
		};
	}

	if (isString(value)) {
		return {
			type: 'string',
			nullable: false,
			enum: [value],
		};
	}

	if (isNumber(value)) {
		const nType = Number.isInteger(value) ? 'integer' : 'number';
		let nFormat = '';
		if (nType === 'integer') {
			nFormat = value < 2147483648 && value > -2147483648 ? 'int32' : 'int64';
		} else if (nType === 'number') {
			nFormat = value.toString().split('.')[1].length > 7 ? 'double' : 'float';
		}

		return {
			type: nType,
			nullable: false,
			format: nFormat,
			enum: [value],
		};
	}

	return {
		nullable: true,
	};
};
