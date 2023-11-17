import { ILibrary } from './Library';
import { createClient } from './Client';
import { createEnvironment } from './Environment';
import { createCacheableQuery } from './CacheableQuery';

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
    const { CacheableQuery, useCacheableQuery } = createCacheableQuery(
        props,
        useEnvironment
    );

    return {
        Client: createClient(props, Environment, CacheableQuery),
        Environment,
        useEnvironment
    };
};

/*
import { CLibraryProps } from './LibraryProps';
import { createUserInterface } from './UserInterface';
import { createSeo } from './Seo';
import { createResponsiveLayout } from './ResponsiveLayout';
import { createStickyHeader } from './StickyHeader';
import { createTitle } from './Title';
import { createSubtitle } from './Subtitle';
import { createStageTeaser } from './StageTeaser';
import { createContainer } from './Container';
import { createSubmittableInput } from './SubmittableInput';
import { createInput } from './Input';
import { createRadio } from './Radio';
import { createAuthProvider } from './AuthProvider';
import { createProtectedRoute } from './ProtectedRoute';

import { createCachableQuery } from './CachableQuery';
import { createFileUploadButton } from './FileUploadButton';
import { createButton } from './Button';

export { CLibraryProps } from './LibraryProps';
export { parseResponsiveStyle } from './ResponsiveLayout';
export { unfoldResponsiveUiData } from './ResponsiveUi';
export { IInputProps, filterInputProps } from './Input';

export default (props: CLibraryProps) => {

    const { ResponsiveLayout, useBreakpoints, useResponsiveStyle } = createResponsiveLayout(props);
    const { Environment, useEnvironment } = createEnvironment(props);
    const { AuthProvider, useAuth } = createAuthProvider(props, useEnvironment);
    const { CachableQueryProvider, useCachableQuery } = createCachableQuery(props, useEnvironment);

    return {
        Button: createButton(props, useResponsiveStyle),
        UserInterface: createUserInterface(props),
        Seo: createSeo(props),
        ResponsiveLayout: ResponsiveLayout,
        useBreakpoints: useBreakpoints,
        useResponsiveStyle: useResponsiveStyle,
        StickyHeader: createStickyHeader(props, useBreakpoints),
        Title: createTitle(props, useBreakpoints),
        StageTeaser: createStageTeaser(props, useBreakpoints),
        Subtitle: createSubtitle(props, useBreakpoints),
        Container: createContainer(props, useBreakpoints),
        SubmittableInput: createSubmittableInput(props, useBreakpoints),
        Input: createInput(props, useResponsiveStyle),
        Radio: createRadio(props, useBreakpoints),
        AuthProvider: AuthProvider,
        useAuth: useAuth,
        ProtectedRoute: createProtectedRoute(props, useAuth),
        Environment: Environment,
        useEnvironment: useEnvironment,
        CachableQueryProvider: CachableQueryProvider,
        useCachableQuery: useCachableQuery,
        FileUploadButton: createFileUploadButton(props, useAuth)
    }
}
*/
