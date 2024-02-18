import type * as OAS from '@app/oas';
import * as Sg from 'fp-ts/Semigroup';

export const infoSg: Sg.Semigroup<OAS.Oas['info']> = Sg.struct({
	title: Sg.first<string>(),
	version: Sg.first<string>(),
});
