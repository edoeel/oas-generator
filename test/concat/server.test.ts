import {serversSg} from '@app/concat/server';
import {describe, expect, it} from 'bun:test';

describe('Servers semigroup', () => {
	it('should concat 2 empty servers into 1 empty server', () => {
		expect(serversSg.concat([], [])).toStrictEqual([]);
	});
	it('should concat 2 same servers into 1 server keeping as much information as possible', () => {
		const url1 = {url: 'u1'};
		expect(serversSg.concat([url1], [url1])).toStrictEqual([url1]);
		expect(serversSg.concat([{...url1, description: 'd1'}], [url1])).toStrictEqual([{...url1, description: 'd1'}]);
		expect(serversSg.concat([url1], [{...url1, description: 'd1'}])).toStrictEqual([{...url1, description: 'd1'}]);
		expect(serversSg.concat([{...url1, description: 'd1'}], [{...url1, description: 'd2'}])).toStrictEqual([{url: 'u1', description: 'd1'}]);
		expect(serversSg.concat([{...url1, description: 'aa'}], [{...url1, description: 'z'}])).toStrictEqual([{url: 'u1', description: 'aa'}]);
		expect(serversSg.concat([{...url1, description: 'should skip this description'}], [{...url1, description: 'should keep this description because it is more complete than the other'}])).toStrictEqual([{...url1, description: 'should keep this description because it is more complete than the other'}]);
	});
	it('should keep 2 different servers', () => {
		expect(serversSg.concat([{url: 'u1'}], [{url: 'u2'}])).toStrictEqual([{url: 'u1'}, {url: 'u2'}]);
		expect(serversSg.concat([{url: 'u1', description: 'd1'}], [{url: 'u2'}])).toStrictEqual([{url: 'u1', description: 'd1'}, {url: 'u2'}]);
	});
});
