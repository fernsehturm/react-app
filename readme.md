# @fernsehturm/react-app

Scaffolder of a React-App that

- loads environment variables during the build-process and passes them to the app running in the browser
- supports SSR (cacheableQuery)

## Installation

`npm install --save @fernsehturm/react-app`

The components to support a React web app and connect to its environment and other components.

## Development Guidelines

Babel for transpiling, `tsc` for types: https://www.typescriptlang.org/docs/handbook/babel-with-typescript.html

- typescript/tsc: types
- babel: transpiling
- linting + prettier
- semantic release

Link library:

1. in library: run `npm link`
2. in project run `npm link @calliopa/core-webapp`

see: https://sparkbox.com/foundry/test_project_changes_in_real_time_by_linking_your_component_library_and_project_with_npm_link
