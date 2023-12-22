# OAS Generator
This software tool is designed to generate OpenAPI specifications based on HTTP communication tracing. It takes a list of documents as input, where each document represents the tracing of an HTTP request. The output is an OpenAPI specification.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
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
