import type { ILibrary } from '../Library';
import type { ICacheableQuery } from './cacheableQuery';
import type { ICacheableQueryHook } from './cachableQueryHook';

import { filterCacheableQuery } from './cacheableQuery';

/**
 * The CacheableQuery supports using SSR
 *
 * Extend the interface here!
 * All variables MUST have a value because the transpiler would remove them
 * see: https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 */
export class CCacheableQueryProps /* extends C_SINGLE_Props */ {
    children?:
        | React.ReactElement<any>
        | Array<React.ReactElement<any>>
        | string = '';

    onQuery: any;

    /** are we in SSR mode at the server? */
    isSsr: boolean = false;

    /** the content of the cache when rendering at the server */
    ssrCache: any;
}

/**
 * This is the pure interface version, to be used/exported
 * When using mutliple parent classes, extend here - but then, we need to apply these in the other steps manually, too
 */
export interface ICacheableQueryProps
    extends CCacheableQueryProps /* , C_MULTIPLE1_Props,  C_MULTIPLE2_Props, */ {}

/**
 * The type of an array of the properties
 */
type ArrCacheableQueryProps = Array<
    keyof CCacheableQueryProps
> /* &  Array<keyof C_MULTIPLE1_Props> & C_MULTIPLE2_Props */;

/**
 * An array of the properties
 */
export const propsArray: ArrCacheableQueryProps = Object.keys(
    new CCacheableQueryProps()
) as ArrCacheableQueryProps;

/* multiple parent classes
export const propsArray: ArrCacheableQueryProps = [
    ...Object.keys(new CCacheableQueryProps()),
    ...Object.keys(new C_MULTIPLE1_Props()),
    ...Object.keys(new C_MULTIPLE2_Props()),
 ] as ArrCacheableQueryProps; */

/**
 * Get the properties from a bigger object
 */
export const filterCacheableQueryProps = (
    props: any,
    { fallback = {} as any, override = {} } = {}
) => {
    const data = Object.assign(
        propsArray.reduce(
            (r: ICacheableQueryProps, k: keyof CCacheableQueryProps) => {
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
            },
            new CCacheableQueryProps()
        ),
        override
    ) as ICacheableQueryProps;

    return data;
};

export const filterNonCacheableQueryProps = (props: any) =>
    Object.keys(props).reduce((r: any, k: string) => {
        return {
            ...r,
            [k]: !propsArray.includes(k as keyof CCacheableQueryProps)
                ? props[k]
                : undefined
        };
    }, {});

type ICreateCacheableQuery = (props: ILibrary, useEnvironment) => any;

export const createCacheableQuery: ICreateCacheableQuery = (
    { axios, React, createHash },
    useEnvironment
) => {
    const CacheableQueryContext = React.createContext(null);

    function CacheableQuery(props: ICacheableQueryProps): JSX.Element {
        const environment = useEnvironment();

        

        function cachableQueryPromise<T>(args: ICacheableQuery<T>) {
            
            return axios({
                url: `${
                    args.apiIdentifier && environment[args.apiIdentifier]
                        ? environment[args.apiIdentifier]
                        : environment.dataUrl
                }${args.endpoint}`,
                method: args.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: args.querydata
            });
        }

        // console.log('isDevelopment: ', isDevelopment);
        const parsedCache = (function () {
            try {
                /* if (!props.isSsr) {
                    // console.log(window.__CACHE__)
                    return window.__CACHE__;
                } */

                return props?.ssrCache !== undefined
                    ? JSON.parse(props.ssrCache)
                    : undefined;
            } catch (error) {
                return undefined;
            }
        })();

        function cachableQueryHook<T>(args: ICacheableQueryHook<T>) {
            const hash = createHash(JSON.stringify(filterCacheableQuery(args)));

            /**
             * in capture mode, we don't do anything
             */
            if (props.isSsr && props.onQuery !== undefined) {
                props.onQuery(
                    new Promise((resolve, reject) => {
                        cachableQueryPromise(filterCacheableQuery(args))
                            .then((response) =>
                                resolve({ hash, data: response?.data })
                            )
                            .catch(reject);
                    })
                );

                return [{ data: undefined, loading: false, error: 'SSR' }];
            }

            const item = parsedCache?.find(
                (i) => i?.hash.localeCompare(hash) === 0
            );

            const [result, setResult] = React.useState({
                data: item?.data,
                loading: undefined,
                error: undefined
            });
            const [cnt, setCnt] = React.useState(0);

            React.useEffect(
                () => {
                    const fetchData = async () => {
                        if ((args.manual && cnt === 0) || result.loading) {
                            return;
                        }
                        setResult({
                            data: result.data,
                            loading: true,
                            error: false
                        });

                        cachableQueryPromise(filterCacheableQuery(args))
                            .then((response) => {
                                if (args.onLoad !== undefined) {
                                    args?.onLoad?.(response);
                                }
                                setResult({
                                    data: response?.data,
                                    loading: false,
                                    error: false
                                });
                            })
                            .catch((err) => {
                                console.error(err);
                                setResult({
                                    data: result.data,
                                    loading: false,
                                    error: err
                                });
                            });
                    };
                    fetchData();
                },
                [cnt].concat(
                    args?.reloadOn !== undefined ? args.reloadOn : [] ?? []
                )
            );

            return [result, () => setCnt(cnt + 1), cnt];
        }

        const value = {
            cachableQuery: cachableQueryHook,
            cachablePromise: cachableQueryPromise
        };

        return (
            <CacheableQueryContext.Provider value={value}>
                {props.children}
            </CacheableQueryContext.Provider>
        );
    }

    const useCacheableQuery: any = () => {
        return React.useContext(CacheableQueryContext);
    };

    return { CacheableQuery, useCacheableQuery };
};
