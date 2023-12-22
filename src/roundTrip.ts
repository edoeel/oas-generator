export type RoundTrip = readonly [Request, Response];
export type Request = {
	readonly headers: Headers;
	readonly host: string;
	readonly path: string;
	readonly method: Method;
	readonly body?: unknown;
};
export type Response = {
	readonly headers: Headers;
	readonly statusCode: StatusCode;
	readonly body?: unknown;
};
export type Headers = readonly Header[];
export type StatusCode = number;
const methods = [
	'get',
	'post',
] as const;
export type Method = Readonly<typeof methods[number]>;
export type Header = Readonly<{readonly name: string; readonly value: string}>;
