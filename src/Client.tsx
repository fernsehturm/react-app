import type { ILibrary } from './Library';
import { filterEnvironmentProps } from './Environment';
import { filterCacheableQueryProps } from './CacheableQuery';
import {
    filterAuthProviderProps,
    type IAuthProviderProps
} from './AuthProvider';

import type { CEnvironmentProps, IEnvironmentProps } from './Environment';
import type {
    CCacheableQueryProps,
    ICacheableQueryProps
} from './CacheableQuery';

import type { ISignalsProps } from './Signals';

/**
 * The properties of the Subdomain-Function
 * Extend the interface here!
 * All variables MUST have a value because the transpiler would remove them
 * see: https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 */
export class CClientProps /* extends C_SINGLE_Props */ {
    children?:
        | React.ReactElement<any>
        | Array<React.ReactElement<any>>
        | string;
}

/**
 * This is the pure interface version, to be used/exported
 * When using mutliple parent classes, extend here - but then, we need to apply these in the other steps manually, too
 */
export interface IClientProps
    extends CClientProps,
        CEnvironmentProps,
        CCacheableQueryProps {}

/**
 * The type of an array of the properties
 */
type ArrClientProps = Array<
    keyof CClientProps
> /* &  Array<keyof C_MULTIPLE1_Props> & C_MULTIPLE2_Props */;

/**
 * An array of the properties
 */
export const propsArray: ArrClientProps = Object.keys(
    new CClientProps()
) as ArrClientProps;

/* multiple parent classes
export const propsArray: ArrClientProps = [
    ...Object.keys(new CClientProps()),
    ...Object.keys(new C_MULTIPLE1_Props()),
    ...Object.keys(new C_MULTIPLE2_Props()),
 ] as ArrClientProps; */

/**
 * Get the properties from a bigger object
 */
export const filterClientProps = (
    props: any,
    { fallback = {} as any, override = {} } = {}
) => {
    const data = Object.assign(
        propsArray.reduce((r: IClientProps, k: keyof CClientProps) => {
            // do not overwrite the IEntry values with undefined
            return {
                ...r,
                [k]: (function () {
                    if (
                        props[k] !== undefined &&
                        props[k]?.localeCompare?.('') !== 0
                    ) {
                        return props[k];
                    }
                    if (fallback[k] !== undefined) {
                        return fallback[k];
                    }
                    return undefined;
                })()
            };
        }, new CClientProps()),
        override
    ) as IClientProps;

    return data;
};

export const filterNonClientProps = (props: any) =>
    Object.keys(props).reduce((r: any, k: string) => {
        return {
            ...r,
            [k]: !propsArray.includes(k as keyof CClientProps)
                ? props[k]
                : undefined
        };
    }, {});

type ICreateClient = (
    props: ILibrary,
    AuthProvider: React.FunctionComponent<IAuthProviderProps>,
    Environment: React.FunctionComponent<IEnvironmentProps>,
    CacheableQuery: React.FunctionComponent<ICacheableQueryProps>,
    Signals: React.FunctionComponent<ISignalsProps>,
) => any;

export const createClient: ICreateClient = (
    { React },
    AuthProvider,
    Environment,
    CacheableQuery,
    Signals
) => {
    function Client(props: IClientProps): JSX.Element {
        return (
            <Environment {...filterEnvironmentProps(props)}>
                <Signals>
                    <CacheableQuery {...filterCacheableQueryProps(props)}>
                        <AuthProvider {...filterAuthProviderProps(props)}>
                            {props.children}
                        </AuthProvider>
                    </CacheableQuery>
                </Signals>
            </Environment>
        );
    }

    return Client;
};
