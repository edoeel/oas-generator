import {type OpenAPIV3} from 'openapi-types';

export type Method = OpenAPIV3.HttpMethods;
export type Path = keyof OpenAPIV3.PathsObject;
export type StatusCode = keyof OpenAPIV3.ResponsesObject;

export type Oas = OpenAPIV3.Document;
export type ResponseObject = OpenAPIV3.ResponseObject;
export type RequestHeader = OpenAPIV3.ParameterObject;
export type ResponseHeader = OpenAPIV3.HeaderObject;
export type RequestBody = OpenAPIV3.RequestBodyObject;
export type ResponseBody = OpenAPIV3.ResponseObject;
export type MediaTypeContent = OpenAPIV3.MediaTypeObject;
export type Schema = OpenAPIV3.SchemaObject;

export type RequestIdentifierPath = Readonly<{readonly path: Path; readonly method: Method}>;
export type ResponseIdentifierPath = Readonly<{readonly path: Path; readonly method: Method; readonly statusCode: StatusCode}>;
export const requestIdentifierPathC = (path: Path, method: Method): RequestIdentifierPath => ({path, method});
export const responseIdentifierPathC = (path: Path, method: Method, statusCode: StatusCode): ResponseIdentifierPath => ({path, method, statusCode});
