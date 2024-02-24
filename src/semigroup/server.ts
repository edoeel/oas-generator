import type * as OAS from '@app/oas';
import type * as Eq from 'fp-ts/Eq';
import * as Sg from 'fp-ts/Semigroup';
import * as N from 'fp-ts/number';
import * as Ord from 'fp-ts/Ord';
import {arrayUniqMergingWithSemigroup, concatRecordOptionalFieldsWithSemigroup} from '@app/functions';

const descriptionSg = Sg.max(Ord.contramap<number, string>(s => s.length)(N.Ord));

const serverSg: Sg.Semigroup<OAS.Server> = {
	concat(x, y) {
		return {
			url: x.url,
			...concatRecordOptionalFieldsWithSemigroup(x, y)('description')(descriptionSg),
		};
	},
};
const serverEq: Eq.Eq<OAS.Server> = {
	equals: (a, b) => a.url === b.url,
};
export const serversSg: Sg.Semigroup<OAS.Server[]> = arrayUniqMergingWithSemigroup(serverEq, serverSg);
