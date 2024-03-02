import { documentSg } from '@app/semigroup/index';
import { describe, expect, it } from 'bun:test';
import type * as OAS from '@app/oas';

describe('OAS semigroup', () => {
	it('should concat 2 OAS into 1 OAS', () => {
		const x: OAS.Oas = {
			openapi: '3.0.1',
			info: { title: 'example', version: '0.0.1' },
			paths: {
				'/quote': {
					'get': {
						responses: {
							'200': {
								description: '',
								headers: {
									'Content-type': {
										required: true,
										schema: {
											type: 'string',
											enum: ["application/json"]
										}
									}
								}
							}
						}
					}
				}
			}
		}
		const y: OAS.Oas = {
			openapi: '3.0.1',
			info: { title: 'example', version: '0.0.1' },
			paths: {
				'/quote': {
					'get': {
						responses: {
							'200': {
								description: '',
								headers: {
									'Content-type': {
										required: false,
										schema: {
											type: 'boolean'
										}
									}
								}
							}
						}
					}
				}
			}
		}
		expect(documentSg.concat(x, y)).toStrictEqual({
			openapi: '3.0.1',
			info: { title: 'example', version: '0.0.1' },
			paths: {
				'/quote': {
					'get': {
						responses: {
							'200': {
								description: '',
								headers: {
									'Content-type': {
										required: false,
										schema: {
											oneOf: [
												{ type: 'string', enum: ["application/json"] },
												{ type: 'boolean' }
											]
										}
									}
								}
							}
						}
					}
				}
			}
		});
	})
});
