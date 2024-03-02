import { arrayUniqMergingWithSemigroup, concatRecordOptionalFieldsWithSemigroup } from '@app/functions';
import * as OAS from '@app/oas';
import * as B from 'fp-ts/boolean';
import * as Sg from 'fp-ts/Semigroup';
import * as S from 'fp-ts/string';
import * as Arr from 'fp-ts/Array';
import * as ROArr from 'fp-ts/ReadonlyArray';
import * as N from 'fp-ts/number';
import { pipe } from 'fp-ts/function';
import * as Ord from 'fp-ts/Ord';
import * as Eq from 'fp-ts/Eq';
import { infoSg } from '@app/semigroup/info';
import assert from 'assert';

const longerString = Sg.max(Ord.contramap<number, string>(s => s.length)(N.Ord));
const schemaEq: Eq.Eq<OAS.Schema> = {
	equals(x, y) {
		return x.type === y.type
	},
}

export const schemaSg: Sg.Semigroup<OAS.Schema> = {
	concat(x, y) {
		if (x.type !== undefined && x.type === y.type) {
			return {
				...concatRecordOptionalFieldsWithSemigroup(x, y)("type")(Sg.first()),
				...concatRecordOptionalFieldsWithSemigroup(x, y)("description")(longerString),
				...concatRecordOptionalFieldsWithSemigroup(x, y)("deprecated")(B.SemigroupAny),
				...concatRecordOptionalFieldsWithSemigroup(x, y)("nullable")(B.SemigroupAny),
				...concatRecordOptionalFieldsWithSemigroup(x, y)("example")(Sg.first()),
				...concatRecordOptionalFieldsWithSemigroup(x, y)("enum")(Arr.getUnionSemigroup(S.Eq)),
			}
		}

		const hasXOneOf = x.oneOf !== undefined && x.oneOf.length > 0;
		const hasYOneOf = y.oneOf !== undefined && y.oneOf.length > 0;
		if (hasXOneOf && hasYOneOf) {
			assert(x.oneOf)
			assert(y.oneOf)
			return {
				...concatRecordOptionalFieldsWithSemigroup(x, y)("description")(longerString),
				...concatRecordOptionalFieldsWithSemigroup(x, y)("deprecated")(B.SemigroupAny),
				...concatRecordOptionalFieldsWithSemigroup(x, y)("nullable")(B.SemigroupAny),
				...concatRecordOptionalFieldsWithSemigroup(x, y)("example")(Sg.first()),
				...concatRecordOptionalFieldsWithSemigroup(x, y)("enum")(Arr.getUnionSemigroup(S.Eq)),
				oneOf: arrayUniqMergingWithSemigroup(schemaEq, schemaSg).concat(x.oneOf, y.oneOf)
			}
		} else if (hasXOneOf) {
			assert(x.oneOf)
			return {
				...concatRecordOptionalFieldsWithSemigroup(x, y)("description")(longerString),
				...concatRecordOptionalFieldsWithSemigroup(x, y)("deprecated")(B.SemigroupAny),
				...concatRecordOptionalFieldsWithSemigroup(x, y)("nullable")(B.SemigroupAny),
				...concatRecordOptionalFieldsWithSemigroup(x, y)("example")(Sg.first()),
				oneOf: arrayUniqMergingWithSemigroup(schemaEq, schemaSg).concat(x.oneOf, [y])
			}
		} else if (hasYOneOf) {
			assert(y.oneOf)
			return {
				...concatRecordOptionalFieldsWithSemigroup(x, y)("description")(longerString),
				...concatRecordOptionalFieldsWithSemigroup(x, y)("deprecated")(B.SemigroupAny),
				...concatRecordOptionalFieldsWithSemigroup(x, y)("nullable")(B.SemigroupAny),
				...concatRecordOptionalFieldsWithSemigroup(x, y)("example")(Sg.first()),
				oneOf: arrayUniqMergingWithSemigroup(schemaEq, schemaSg).concat([x], y.oneOf)
			}
		} else if (x.type === undefined && y.type === undefined) {
			return {};
		}

		return {
			...concatRecordOptionalFieldsWithSemigroup(x, y)("description")(longerString),
			...concatRecordOptionalFieldsWithSemigroup(x, y)("deprecated")(B.SemigroupAny),
			...concatRecordOptionalFieldsWithSemigroup(x, y)("nullable")(B.SemigroupAny),
			...concatRecordOptionalFieldsWithSemigroup(x, y)("example")(Sg.first()),
			...concatRecordOptionalFieldsWithSemigroup(x, y)("enum")(Arr.getUnionSemigroup(S.Eq)),
			oneOf: [x, y]
		}
	},
}

export const headerSg: Sg.Semigroup<OAS.HeaderObject> = {
	concat(x, y) {
		return {
			...concatRecordOptionalFieldsWithSemigroup(x, y)("description")(longerString),
			...concatRecordOptionalFieldsWithSemigroup(x, y)("required")(B.SemigroupAll),
			...concatRecordOptionalFieldsWithSemigroup(x, y)("deprecated")(B.SemigroupAny),
			...concatRecordOptionalFieldsWithSemigroup(x, y)("allowEmptyValue")(B.SemigroupAny),
			...concatRecordOptionalFieldsWithSemigroup(x, y)("example")(Sg.first()),
			...concatRecordOptionalFieldsWithSemigroup(x, y)("schema")(schemaSg),
		}
	},
}

export const headersSg: Sg.Semigroup<NonNullable<OAS.ExcludeReferenceObject<OAS.ResponsesObject[string]>["headers"]>> = {
	concat(x, y) {
		return pipe(
			getUniqKeysFromObjects([x, y]),
			Arr.map(headerName => {
				if (x[headerName] && y[headerName]) {
					return { [headerName]: headerSg.concat(x[headerName], y[headerName]) };
				}

				if (x[headerName]) {
					return { [headerName]: x[headerName] };
				}

				if (y[headerName]) {
					return { [headerName]: y[headerName] };
				}
			}),
			Arr.reduceRight({}, (pv, cv) => ({ ...pv, ...cv })),
		);
	},
}

export const responseSg: Sg.Semigroup<OAS.ResponsesObject[string]> = {
	concat(x, y) {
		return {
			description: longerString.concat(x.description, y.description),
			...concatRecordOptionalFieldsWithSemigroup(x, y)("headers")(headersSg)
		};
	},
};

export const responsesSg: Sg.Semigroup<OAS.ResponsesObject> = {
	concat(x, y) {
		return pipe(
			getUniqKeysFromObjects([x, y]),
			Arr.map(responseCode => {
				if (x[responseCode] && y[responseCode]) {
					return { [responseCode]: responseSg.concat(x[responseCode], y[responseCode]) };
				}

				if (x[responseCode]) {
					return { [responseCode]: x[responseCode] };
				}

				if (y[responseCode]) {
					return { [responseCode]: y[responseCode] };
				}
			}),
			Arr.reduceRight({}, (pv, cv) => ({ ...pv, ...cv })),
		);
	},
};

export const operationSg: Sg.Semigroup<OAS.OperationObject> = {
	concat(x, y) {
		return {
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
						return { [m]: operationSg.concat(xMethod, yMethod) };
					}

					if (xMethod !== undefined) {
						return { [m]: xMethod };
					}

					if (yMethod !== undefined) {
						return { [m]: yMethod };
					}

					return undefined;
				}),
				ROArr.reduceRight({}, (pv, cv) => ({ ...pv, ...cv })),
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
					return { [path]: pathItemSg.concat(x[path], y[path]) };
				}

				if (x[path]) {
					return { [path]: x[path] };
				}

				if (y[path]) {
					return { [path]: y[path] };
				}
			}),
			Arr.reduceRight({}, (pv, cv) => ({ ...pv, ...cv })),
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
