import { ILibrary } from './Library';
import { createClient } from './Client';
import { createEnvironment } from './Environment';
import { createCacheableQuery } from './CacheableQuery';
import { createAuthProvider } from './AuthProvider';
import { createProtectedRoute } from './ProtectedRoute';
import { createSeo } from './Seo';
import { createSignals } from './Signals';

export { CLibrary } from './Library';
export {
    CEnvironmentProps,
    filterEnvironmentProps,
    filterNonEnvironmentProps
} from './Environment';
export {
    CClientProps,
    filterClientProps,
    filterNonClientProps
} from './Client';

export type { ILibrary } from './Library';
export type { IEnvironmentProps } from './Environment';
export type { IClientProps } from './Client';

export default (props: ILibrary) => {
    const { Environment, useEnvironment } = createEnvironment(props);
    const { AuthProvider, useAuth } = createAuthProvider(
        props,
        useEnvironment
    );

    const { CacheableQuery, useCacheableQuery } = createCacheableQuery(
        props,
        useEnvironment
    );

    const { Signals, useSignals } = createSignals(props)

    return {
        AuthProvider,
        Client: createClient(props, AuthProvider, Environment, CacheableQuery, Signals),
        Environment,
        ProtectedRoute: createProtectedRoute(props, useAuth),
        Seo: createSeo(props),
        Protected: createProtectedRoute(props, useAuth),
        useAuth,
        useCacheableQuery,
        useEnvironment,
        Signals,
        useSignals
    };
};

