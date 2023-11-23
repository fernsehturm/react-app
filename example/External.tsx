/**
 * This module is the interface to the @calliopa/core-webapp library
 * use it like this:
 *   import External from '../External';
 *   const { Seo } = External;
 */

import * as React from 'react';
import * as ReactHelmet from 'react-helmet';
import * as ReactRouterDom from 'react-router-dom';
import axios from 'axios';
import murmurHash3 from 'murmurhash3js';

import { hydrateRoot, createRoot } from 'react-dom/client';

/** Import the default export factory from our library */
import createComponents, {
    CEnvironmentProps, filterEnvironmentProps
} from '../src';



/** Call the factory, passing its dependencies (guaranteed to match what we're bundling) and get back our component */
export default {
    ...createComponents({
        React,
        ReactHelmet,
        ReactRouterDom,
        axios,
        createHash: murmurHash3.x86.hash128,
    }),
    BrowserRouter: ReactRouterDom.BrowserRouter,
    hydrateRoot,
    createRoot,
    CEnvironmentProps,
    filterEnvironmentProps
};
