import * as Arr from 'fp-ts/Array';
import type * as Eq from 'fp-ts/Eq';
import type * as Sg from 'fp-ts/Semigroup';
import assert from 'assert';

export const assertUnreachable = (message: string, _: any): never => {
	throw new Error(`Didn't expect to be here: ${message}`);
};

// TODO test + document this fn
export const concatRecordOptionalFieldsWithSemigroup = <A>(x: A, y: A) => <K extends keyof A>(optionalField: K) => (sg: Sg.Semigroup<NonNullable<A[K]>>): Record<string, unknown> => {
	if (x[optionalField] === undefined && y[optionalField] === undefined) {
		return {};
	}

	if (x[optionalField] === undefined) {
		return {[optionalField]: y[optionalField]};
	}

	if (y[optionalField] === undefined) {
		return {[optionalField]: x[optionalField]};
	}

	const xx = x[optionalField];
	const yy = y[optionalField];
	assert(xx);
	assert(yy);
	return {[optionalField]: sg.concat(xx, yy)};
};

// TODO test + document this fn
export const arrayUniqMergingWithSemigroup = <A>(E: Eq.Eq<A>, Sg: Sg.Semigroup<A>): Sg.Semigroup<A[]> => ({
	concat(x, y) {
		const concatenated = Arr.concat(y)(x);
		const uniq = Arr.uniq(E)(concatenated);
		return uniq
			.map(
				uniqElem => concatenated
					.filter(repeatedElem => E.equals(uniqElem, repeatedElem))
					.reduce(Sg.concat),
			);
	},
});
