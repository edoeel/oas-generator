import {arrayUniqMergingWithSemigroup, concatRecordOptionalFieldsWithSemigroup} from '@app/functions';
import type * as OAS from '@app/oas';
import * as B from 'fp-ts/boolean';
import * as Sg from 'fp-ts/Semigroup';
import * as S from 'fp-ts/string';
import * as Arr from 'fp-ts/Array';
import * as N from 'fp-ts/number';
import {pipe} from 'fp-ts/function';
import * as Ord from 'fp-ts/Ord';
import assert from 'assert';
import {serversSg} from '@app/concat/server';
import {infoSg} from '@app/concat/info';

const methodSg: Sg.Semigroup<NonNullable<OAS.Oas['paths'][string]>[OAS.Method]> = undefined as any;
const pathSg: Sg.Semigroup<OAS.Oas['paths'][string]> = undefined as any

const pathsSg: Sg.Semigroup<OAS.Oas['paths']> = {
	concat(x, y) {
		return pipe(
			Object.keys(x),
			Arr.concat(Object.keys(y)),
			Arr.uniq(S.Eq),
			Arr.map(path => {
				if (x[path] && y[path]) {
					return {[path]: pathSg.concat(x[path], y[path])};
				}

				if (x[path]) {
					return {[path]: x[path]};
				}

				if (y[path]) {
					return {[path]: y[path]};
				}
			}),
			Arr.foldRight(() => ({}), (pv, cv) => ({...pv, ...cv})),
		);
	},
};

const oasSg: Sg.Semigroup<OAS.Oas> = Sg.struct({
	info: infoSg,
	openapi: Sg.first<string>(),
	paths: pathsSg,
});

// Import { arrayUniqMergingWithSemigroup, concatRecordOptionalFieldsWithSemigroup } from '@app/functions';
// import type * as OAS from '@app/oas';
// import * as B from "fp-ts/boolean";
// import * as Sg from "fp-ts/Semigroup";
// import * as S from "fp-ts/string";
// import * as N from "fp-ts/number";
// import * as Ord from "fp-ts/Ord";
// import assert from "assert";

// const longerString = Sg.max(Ord.contramap<number, string>((s) => s.length)(N.Ord));
// // const responsesSg: Sg.Semigroup<OAS.OperationObject["responses"]> = {
// //   concat(x, y) {
// //     Object.keys(x).map((code) => y[code] !== undefined ? responseSg.concat(x[code], y[code]))
// //     return {}
// //   },
// // }

// const schemaSg: Sg.Semigroup<OAS.Schema> = {
//   concat(x, y) {
//     assert(x)
//     assert(y)
//     assert(!isReferenceObject(x))
//     assert(!isReferenceObject(y))
//     assert(x.properties === undefined)
//     assert(x.type !== "array")
//     assert(y.properties === undefined)
//     assert(y.type !== "array")
//     return {
//       ...concatRecordOptionalFieldsWithSemigroup(x, y)("type")(Sg.first<OAS.NonArraySchemaObjectType>()),
//       ...concatRecordOptionalFieldsWithSemigroup(x, y)("example")(Sg.first<string>()),
//       ...concatRecordOptionalFieldsWithSemigroup(x, y)("nullable")(B.SemigroupAll),
//       ...concatRecordOptionalFieldsWithSemigroup(x, y)("required")(arrayUniqMergingWithSemigroup(S.Eq, S.Semigroup)),
//       ...concatRecordOptionalFieldsWithSemigroup(x, y)("required")(arrayUniqMergingWithSemigroup(S.Eq, S.Semigroup)),
//     }
//   },
// }

// const headerSg: Sg.Semigroup<OAS.HeaderObject> = {
//   concat(x, y) {
//     assert(!isReferenceObject(x.schema))
//     assert(!isReferenceObject(y.schema))
//     return {
//       ...concatRecordOptionalFieldsWithSemigroup(x, y)("allowEmptyValue")(B.SemigroupAll),
//       ...concatRecordOptionalFieldsWithSemigroup(x, y)("description")(longerString),
//       ...concatRecordOptionalFieldsWithSemigroup(x, y)("example")(Sg.first<string>()),
//       ...concatRecordOptionalFieldsWithSemigroup(x, y)("required")(B.SemigroupAll),
//       ...concatRecordOptionalFieldsWithSemigroup(x, y)("schema")(schemaSg.concat(x, y)),
//     }
//   },
// }

// const responseSg: Sg.Semigroup<OAS.OperationObject["responses"][string]> = {
//   concat(x, y) {
//     assert(!isReferenceObject(x))
//     assert(!isReferenceObject(y))
//     return {
//       ...concatRecordOptionalFieldsWithSemigroup(x, y)("description")(longerString),
//       ...concatRecordOptionalFieldsWithSemigroup(x, y)("headers")(headerSg.concat(x, y)),
//     }
//   },
// }

// const operationSg: Sg.Semigroup<OAS.OperationObject> = {
//   concat(x, y) {
//     return {
//       ...concatRecordOptionalFieldsWithSemigroup(x, y)("description")(longerString),
//       ...concatRecordOptionalFieldsWithSemigroup(x, y)("summary")(longerString),
//       ...concatRecordOptionalFieldsWithSemigroup(x, y)("tags")(arrayUniqMergingWithSemigroup(S.Eq, S.Semigroup)),
//       responses: responsesSg.concat(x.responses, y.responses),
//     }
//   },
// }

// const isReferenceObject = (maybeReferenceObj: unknown): maybeReferenceObj is OAS.ReferenceObject => maybeReferenceObj !== null && typeof maybeReferenceObj === "object" && "$ref" in maybeReferenceObj
