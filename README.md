# OAS Generator
This software tool is designed to generate OpenAPI specifications based on HTTP communication tracing. It takes a list of documents as input, where each document represents the tracing of an HTTP request. The output is an OpenAPI specification.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Document format](#document-format)
- [Contributing](#contributing)
- [Resources](#resources)
- [Roadmap](#roadmap)

### Installation

1. Clone the repository:
```sh
git clone https://github.com/edoardomistretta/oas-generator.git
```

2. Navigate to the project directory:
```sh
cd oas-generator
```

### Usage

To use this software, follow these steps:

1. Prepare a JSON file containing a list of documents. Each document represents the tracing of an HTTP request and it must follow a precise [format](#document-format)
2. Create a new folder `/input` in the project root.
3. Place the documents in the new `/input` directory.
4. Run the following command:
```sh
docker-compose up
```
5. If everything went well, you will find your OpenAPI specification inside the `/output` folder. Otherwise, please take a look at the shell from which you launched the command as it might contain helpful logs.

### Document format
Each document must adhere to this format consistently:
```ts
type Document = {
  request: Request;
  response?: Response;
}

type Header = {name: string; value: string};
type Request = {
  method: 
    | "get"
    | "head"
    | "post"
    | "put"
    | "delete"
    | "options"
    | "patch"
    | "purge"
    | "link"
    | "unlink";
  host: string;
  path: string;
  headers: Array<Header>;
  body?: unknown;
};
type Response = {
  statusCode: number;
  headers: Array<Header>;
  body?: unknown;
};
```
Here are some important notes regarding the format:

- `request.path` MUST start with a forward slash, for example: `/product`.
- `request.host` MUST include the protocol. It CAN also include the port.
- The optionality of `response` is due to the possibility of network issues, server errors, or if the request times out without receiving a response.

Here are a good example of `input.json` file:
```json
[
  {
    "request": {
      "host": "https://example.com:443",
      "path": "/products",
      "method": "get",
      "headers": [
        {
          "name": "content-type",
          "value": "application/json"
        }
      ],
      "body": {
        "foo": "bar"
      }
    },
    "response": {
      "statusCode": 200,
      "headers": [
        {
          "name": "content-type",
          "value": "application/json"
        }
      ],
      "body": {
        "foo": "bar"
      }
    }
  }
]
```

### Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvement, please open an issue [here](https://github.com/edoardomistretta/oas-generator/issues). Pull requests are also appreciated.

When contributing, please ensure that your code adheres to the [project's coding conventions](https://github.com/edoardomistretta/oas-generator/blob/master/CONTRIBUTING.md) and follows the existing style.

### License

This project is licensed under the [MIT License](https://github.com/edoardomistretta/oas-generator/blob/master/LICENSE.md). Feel free to modify and distribute it as needed.

### Resources
- https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md
- https://editor.swagger.io/
- https://www.rfc-editor.org/rfc/rfc9110.html

### Roadmap
- map function to convert a document representing an HTTP transaction (roundtrip) into an OpenAPI document
- define an instance of Monoid for an OpenAPI document in order to mappend a list of OpenAPI documents
- ...
