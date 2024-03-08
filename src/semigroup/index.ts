import {arrayUniqMergingWithSemigroup, concatRecordOptionalFieldsWithSemigroup} from '@app/functions';
import * as OAS from '@app/oas';
import * as B from 'fp-ts/boolean';
import * as Sg from 'fp-ts/Semigroup';
import * as S from 'fp-ts/string';
import * as Arr from 'fp-ts/Array';
import * as ROArr from 'fp-ts/ReadonlyArray';
import * as N from 'fp-ts/number';
import {pipe} from 'fp-ts/function';
import * as Ord from 'fp-ts/Ord';
import type * as Eq from 'fp-ts/Eq';
import {infoSg} from '@app/semigroup/info';

const doXAndYHaveTheSameValidType = <T extends {type?: OAS.Schema["type"]}>(x: T, y: T) => ![x.type, y.type].includes(undefined) && x.type === y.type;
const hasOneOfProperty = (maybeOneOf: {oneOf?: OAS.Schema["oneOf"]}): maybeOneOf is Omit<OAS.Schema, "oneOf"> & {oneOf: Array<OAS.Schema>} => maybeOneOf.oneOf !== undefined && maybeOneOf.oneOf.length > 0
const isArraySchema = (maybeArraySchema: OAS.Schema): maybeArraySchema is OAS.ArraySchemaObject => maybeArraySchema.type === "array" && maybeArraySchema.items !== undefined;

const longerString = Sg.max(Ord.contramap<number, string>(s => s.length)(N.Ord));

const schemaEq: Eq.Eq<OAS.Schema> = {
	equals(x, y) {
		return x.type === y.type;
	},
};

export const propertiesSg: Sg.Semigroup<NonNullable<OAS.Schema['properties']>> = {
	concat(x, y) {
		return pipe(
			getUniqKeysFromObjects([x, y]),
			Arr.map(property => {
				if (x[property] && y[property]) {
					return {[property]: schemaSg.concat(x[property], y[property])};
				}

				if (x[property]) {
					return {[property]: x[property]};
				}

				if (y[property]) {
					return {[property]: y[property]};
				}
			}),
			Arr.reduceRight({}, (pv, cv) => ({...pv, ...cv})),
		);
	},
};

export const schemaSg: Sg.Semigroup<OAS.Schema> = {
	concat(x, y) {
		if (doXAndYHaveTheSameValidType(x, y)) {
			const enumP = Arr.getUnionSemigroup(S.Eq).concat(x.enum || [], y.enum || []); 
			return {
				...(isArraySchema(x) && isArraySchema(y)
							? {type: "array", items: schemaSg.concat(x.items, y.items)}
							: concatRecordOptionalFieldsWithSemigroup(x, y)('type')(Sg.first())
				),
				...concatRecordOptionalFieldsWithSemigroup(x, y)('required')(Arr.getIntersectionSemigroup(S.Eq)),
				...concatRecordOptionalFieldsWithSemigroup(x, y)('description')(longerString),
				...concatRecordOptionalFieldsWithSemigroup(x, y)('deprecated')(B.SemigroupAny),
				...concatRecordOptionalFieldsWithSemigroup(x, y)('nullable')(B.SemigroupAny),
				...concatRecordOptionalFieldsWithSemigroup(x, y)('example')(Sg.first()),
				...concatRecordOptionalFieldsWithSemigroup(x, y)('properties')(propertiesSg),
				...(enumP.length > 0 && enumP.length <= 10 ? {enum: enumP} : {})
			};
		}

		const hasXOneOf = hasOneOfProperty(x)
		const hasYOneOf = hasOneOfProperty(y)
		if (hasXOneOf === false && hasYOneOf === false && x.type === undefined && y.type === undefined) {
			return {};
		}

		if (!hasXOneOf && !hasYOneOf) {
			return { oneOf: [x, y] };
		}

		return {
			...concatRecordOptionalFieldsWithSemigroup(x, y)('description')(longerString),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('deprecated')(B.SemigroupAny),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('nullable')(B.SemigroupAny),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('example')(Sg.first()),
			...(hasXOneOf && hasYOneOf // Both x and y have oneOf property: concat that property
						? {oneOf: arrayUniqMergingWithSemigroup(schemaEq, schemaSg).concat(x.oneOf, y.oneOf)}
						: hasXOneOf // Only x has oneOf property, if y is already present in x.oneOf return x.oneOf, otherwise add y into x.oneOf array
							? {oneOf: arrayUniqMergingWithSemigroup(schemaEq, schemaSg).concat(x.oneOf, [y])}
							: hasYOneOf // Only y has oneOf property, if x is already present in y.oneOf return y.oneOf, otherwise add x into y.oneOf array
								? {oneOf: arrayUniqMergingWithSemigroup(schemaEq, schemaSg).concat([x], y.oneOf)}
								: {} // Impossible state
					)
		}
	},
};

export const exampleSg: Sg.Semigroup<NonNullable<OAS.HeaderObject["examples"]>[string]> = {
	concat(x, y) {
		return {
			...concatRecordOptionalFieldsWithSemigroup(x, y)('summary')(longerString),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('description')(longerString),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('value')(longerString),
		}
	},
}

export const examplesSg: Sg.Semigroup<NonNullable<OAS.HeaderObject["examples"]>> = {
	concat(x, y) {
		return pipe(
			getUniqKeysFromObjects([x, y]),
			Arr.map(headerName => {
				if (x[headerName] && y[headerName]) {
					return {[headerName]: exampleSg.concat(x[headerName], y[headerName])};
				}

				if (x[headerName]) {
					return {[headerName]: x[headerName]};
				}

				if (y[headerName]) {
					return {[headerName]: y[headerName]};
				}
			}),
			Arr.reduceRight({}, (pv, cv) => ({...pv, ...cv})),
		);
	},
};

export const headerSg: Sg.Semigroup<OAS.HeaderObject> = {
	concat(x, y) {
		return {
			...concatRecordOptionalFieldsWithSemigroup(x, y)('description')(longerString),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('required')(B.SemigroupAll),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('deprecated')(B.SemigroupAny),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('allowEmptyValue')(B.SemigroupAny),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('examples')(examplesSg),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('schema')(schemaSg),
		};
	},
};

export const headersSg: Sg.Semigroup<NonNullable<OAS.ExcludeReferenceObject<OAS.ResponsesObject[string]>['headers']>> = {
	concat(x, y) {
		return pipe(
			getUniqKeysFromObjects([x, y]),
			Arr.map(headerName => {
				if (x[headerName] && y[headerName]) {
					return {[headerName]: headerSg.concat(x[headerName], y[headerName])};
				}

				if (x[headerName]) {
					return {[headerName]: x[headerName]};
				}

				if (y[headerName]) {
					return {[headerName]: y[headerName]};
				}
			}),
			Arr.reduceRight({}, (pv, cv) => ({...pv, ...cv})),
		);
	},
};

export const responseSg: Sg.Semigroup<OAS.ResponsesObject[string]> = {
	concat(x, y) {
		return {
			description: longerString.concat(x.description, y.description),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('headers')(headersSg),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('content')(contentSg),
		};
	},
};

export const responsesSg: Sg.Semigroup<OAS.ResponsesObject> = {
	concat(x, y) {
		return pipe(
			getUniqKeysFromObjects([x, y]),
			Arr.map(responseCode => {
				if (x[responseCode] && y[responseCode]) {
					return {[responseCode]: responseSg.concat(x[responseCode], y[responseCode])};
				}

				if (x[responseCode]) {
					return {[responseCode]: x[responseCode]};
				}

				if (y[responseCode]) {
					return {[responseCode]: y[responseCode]};
				}
			}),
			Arr.reduceRight({}, (pv, cv) => ({...pv, ...cv})),
		);
	},
};

export const parameterEq: Eq.Eq<OAS.ParameterObject> = {
	equals(x, y) {
		return x.in === y.in && x.name === y.name;
	},
};

export const parameterSg: Sg.Semigroup<OAS.ParameterObject> = {
	concat(x, y) {
		return {
			in: x.in,
			name: x.name,
			...concatRecordOptionalFieldsWithSemigroup(x, y)('description')(longerString),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('required')(B.SemigroupAll),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('deprecated')(B.SemigroupAny),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('allowEmptyValue')(B.SemigroupAny),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('examples')(examplesSg),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('schema')(schemaSg),
		};
	},
};

export const parametersSg: Sg.Semigroup<NonNullable<OAS.ParametersObject>> = {
	concat(x, y) {
		return arrayUniqMergingWithSemigroup(parameterEq, parameterSg).concat(x, y);
	},
};

export const mediaTypeSg: Sg.Semigroup<OAS.MediaTypeObject> = {
	concat(x, y) {
		return {
			...concatRecordOptionalFieldsWithSemigroup(x, y)('example')(Sg.first()),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('schema')(schemaSg),
		};
	},
};

export const contentSg: Sg.Semigroup<OAS.RequestBodyObject['content']> = {
	concat(x, y) {
		return pipe(
			getUniqKeysFromObjects([x, y]),
			Arr.map(contentT => {
				if (x[contentT] && y[contentT]) {
					return {[contentT]: mediaTypeSg.concat(x[contentT], y[contentT])};
				}

				if (x[contentT]) {
					return {[contentT]: x[contentT]};
				}

				if (y[contentT]) {
					return {[contentT]: y[contentT]};
				}
			}),
			Arr.reduceRight({}, (pv, cv) => ({...pv, ...cv})),
		);
	},
};

export const requestBodySg: Sg.Semigroup<OAS.RequestBodyObject> = {
	concat(x, y) {
		return {
			...concatRecordOptionalFieldsWithSemigroup(x, y)('description')(longerString),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('required')(B.SemigroupAll),
			content: contentSg.concat(x.content, y.content),
		};
	},
};

export const operationSg: Sg.Semigroup<OAS.OperationObject> = {
	concat(x, y) {
		return {
			...concatRecordOptionalFieldsWithSemigroup(x, y)('description')(longerString),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('requestBody')(requestBodySg),
			...concatRecordOptionalFieldsWithSemigroup(x, y)('parameters')(parametersSg),
			responses: responsesSg.concat(x.responses, y.responses),
		};
	},
};

export const pathItemSg: Sg.Semigroup<OAS.Oas['paths'][string]> = {
	concat(x, y) {
		if (x !== undefined && y !== undefined) {
			return pipe(
				OAS.httpMethods,
				ROArr.map(m => {
					const xMethod = x[m];
					const yMethod = y[m];
					if (xMethod !== undefined && yMethod !== undefined) {
						return {[m]: operationSg.concat(xMethod, yMethod)};
					}

					if (xMethod !== undefined) {
						return {[m]: xMethod};
					}

					if (yMethod !== undefined) {
						return {[m]: yMethod};
					}

					return undefined;
				}),
				ROArr.reduceRight({}, (pv, cv) => ({...pv, ...cv})),
			);
		}

		return x || y;
	},
};

export const pathsSg: Sg.Semigroup<OAS.Oas['paths']> = {
	concat(x, y) {
		return pipe(
			getUniqKeysFromObjects([x, y]),
			Arr.map(path => {
				if (x[path] && y[path]) {
					return {[path]: pathItemSg.concat(x[path], y[path])};
				}

				if (x[path]) {
					return {[path]: x[path]};
				}

				if (y[path]) {
					return {[path]: y[path]};
				}
			}),
			Arr.reduceRight({}, (pv, cv) => ({...pv, ...cv})),
		);
	},
};

export const documentSg: Sg.Semigroup<OAS.Oas> = Sg.struct({
	info: infoSg,
	openapi: Sg.first<string>(),
	paths: pathsSg,
});

const getUniqKeysFromObjects = (a: Array<Record<string, unknown>>): string[] => pipe(
	a,
	Arr.flatMap(obj => Object.keys(obj)),
	Arr.uniq(S.Eq),
);
