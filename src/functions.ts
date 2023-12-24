export const assertUnreachable = (_: any): never => {
	throw new Error('Didn\'t expect to be here');
};
