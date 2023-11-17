/**
 * The Entrypoint of the WebApp
 * tighlty coupled with the `index.html` because we load the
 * Environment variables from the `window`-object.
 */

declare const window: any;

import * as React from 'react';

import External from './External';
const { Client, hydrateRoot, createRoot } = External;

// increase the stack trace
Error.stackTraceLimit = 25;

const WebApp = <Client
    devSubdomain="a"
    domain={typeof window ? window?.__DOMAIN__ : undefined}
    apis={{
        apiExample: typeof window ? window?.__API_EXAMPLE__ : undefined
    }}
    nodeEnv={typeof window ? window?.__NODE_ENV__ : undefined}
>App</Client>

const rootElement = document.getElementById('root');
if (rootElement?.hasChildNodes()) {
    hydrateRoot(rootElement, WebApp);
} else {
    const root = createRoot(document.getElementById('root'));
    root.render(WebApp);
}
