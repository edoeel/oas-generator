import {type OpenAPIV3} from 'openapi-types';

export type ExcludeReferenceObject<T> =
	T extends {$ref: any}
		? never
		: T extends Array<infer U>
			? Array<ExcludeReferenceObject<U>>
			// eslint-disable-next-line @typescript-eslint/ban-types
			: T extends object
				? {[K in keyof T]: ExcludeReferenceObject<T[K]>}
				: T;

export type Method = OpenAPIV3.HttpMethods;
export type Path = keyof OpenAPIV3.PathsObject;
export type StatusCode = keyof OpenAPIV3.ResponsesObject;

export type Oas = ExcludeReferenceObject<OpenAPIV3.Document>;
export type ResponseObject = OpenAPIV3.ResponseObject;
export type RequestHeader = OpenAPIV3.ParameterObject;
export type ResponseHeader = OpenAPIV3.HeaderObject;
export type RequestBody = OpenAPIV3.RequestBodyObject;
export type ResponseBody = OpenAPIV3.ResponseObject['content'];
export type MediaTypeContent = OpenAPIV3.MediaTypeObject;
export type Schema = ExcludeReferenceObject<OpenAPIV3.SchemaObject>;
export type Server = OpenAPIV3.ServerObject;
export type OperationObject = ExcludeReferenceObject<OpenAPIV3.OperationObject>;
export type HttpMethods = OpenAPIV3.HttpMethods;
export type ResponsesObject = ExcludeReferenceObject<OpenAPIV3.ResponsesObject>;
export type ReferenceObject = OpenAPIV3.ReferenceObject;
export type HeaderObject = ExcludeReferenceObject<OpenAPIV3.HeaderObject>;
export type ArraySchemaObject = ExcludeReferenceObject<OpenAPIV3.ArraySchemaObject>;
export type NonArraySchemaObject = ExcludeReferenceObject<OpenAPIV3.NonArraySchemaObject>;
export type ParametersObject = ExcludeReferenceObject<OpenAPIV3.OperationObject['parameters']>;
export type ParameterObject = ExcludeReferenceObject<OpenAPIV3.ParameterObject>;

export type RequestIdentifierPath = Readonly<{readonly path: Path; readonly method: Method}>;
export type ResponseIdentifierPath = Readonly<{readonly path: Path; readonly method: Method; readonly statusCode: StatusCode}>;
export const requestIdentifierPathC = (path: Path, method: Method): RequestIdentifierPath => ({path, method});
export const responseIdentifierPathC = (path: Path, method: Method, statusCode: StatusCode): ResponseIdentifierPath => ({path, method, statusCode});
export const httpMethods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'] as const;
