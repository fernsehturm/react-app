import type { ILibrary } from '../Library';

import {
    filterAuthenticatedQuery,
    type IAuthenticatedQuery
} from './authenticatedQuery';
import type { IAuthenticatedQueryHook } from './authenticatedQueryHook';

/**
 * The properties of the Subdomain-Function
 * Extend the interface here!
 * All variables MUST have a value because the transpiler would remove them
 * see: https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 */
export class CAuthProviderProps /* extends C_SINGLE_Props */ {
    auChildren?:
        | React.ReactElement<any>
        | Array<React.ReactElement<any>>
        | string = '';

    authKey: string;

    loginRoute: string;

    loginEndpoint: string;

    signupEndpoint: string;
}

/**
 * This is the pure interface version, to be used/exported
 * When using mutliple parent classes, extend here - but then, we need to apply these in the other steps manually, too
 */
export interface IAuthProviderProps
    extends CAuthProviderProps /* , C_MULTIPLE1_Props,  C_MULTIPLE2_Props, */ {}

/**
 * The type of an array of the properties
 */
type ArrAuthProviderProps = Array<
    keyof CAuthProviderProps
> /* &  Array<keyof C_MULTIPLE1_Props> & C_MULTIPLE2_Props */;

/**
 * An array of the properties
 */
export const propsArray: ArrAuthProviderProps = Object.keys(
    new CAuthProviderProps()
) as ArrAuthProviderProps;

/* multiple parent classes
export const propsArray: ArrAuthProviderProps = [
    ...Object.keys(new CAuthProviderProps()),
    ...Object.keys(new C_MULTIPLE1_Props()),
    ...Object.keys(new C_MULTIPLE2_Props()),
 ] as ArrAuthProviderProps; */

/**
 * Get the properties from a bigger object
 */
export const filterAuthProviderProps = (
    props: any,
    { fallback = {} as any, override = {} } = {}
) => {
    const data = Object.assign(
        propsArray.reduce(
            (r: IAuthProviderProps, k: keyof CAuthProviderProps) => {
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
            new CAuthProviderProps()
        ),
        override
    ) as IAuthProviderProps;

    return data;
};

export const filterNonAuthProviderProps = (props: any) =>
    Object.keys(props).reduce((r: any, k: string) => {
        return {
            ...r,
            [k]: !propsArray.includes(k as keyof CAuthProviderProps)
                ? props[k]
                : undefined
        };
    }, {});

type ICreateAuthProvider = (props: ILibrary, useEnvironment) => any;

export const METADATA_KEY = 'metadata';
export const UPLOAD_ID = 'uploadid';
export const FORMDATA_FILE = 'file';

export const createAuthProvider: ICreateAuthProvider = (
    { axios, React, ReactRouterDom },
    useEnvironment
) => {
    const useLocalStorage = (storageKey, fallbackState) => {
        // checking the type of localStorage doesn't work
        // therefore, we handle the exception
        const storedValue = (function () {
            try {
                return localStorage.getItem(storageKey);
            } catch {
                return undefined;
            }
        })();

        const [value, setValue] = React.useState(
            storedValue
                ? (() => {
                      try {
                          /** if it is an object */
                          return JSON.parse(storedValue);
                      } catch (error) {
                          /** if it is a string */
                          return storedValue;
                      }
                      /** if not stored */
                  })()
                : fallbackState
        );

        React.useEffect(() => {
            if (value !== undefined) {
                localStorage.setItem(storageKey, JSON.stringify(value));
            } else {
                localStorage.removeItem(storageKey);
            }
        }, [value, storageKey]);

        return [value, setValue];
    };

    const AuthProviderContext = React.createContext(null);

    function AuthProvider(props: IAuthProviderProps): JSX.Element {
        const environment = useEnvironment();

        const navigate = ReactRouterDom.useNavigate();
        const location = ReactRouterDom.useLocation();
        const [token, setToken] = useLocalStorage(props.authKey, undefined);

        React.useEffect(() => {
            if (token !== undefined) {
                localStorage.setItem(props.authKey, token);
            }
        }, [token]);

        const handleLogout = () => {
            setToken(null);
        };

        /**
         * Handles signup and signIn events
         * @param endpoint
         * @returns
         */
        const handleEvent = (endpoint: string) => async (user: any) => {
            axios
                .post(`${environment.dataUrl}${endpoint}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: user
                })
                .then(async (response) => {
                    if (response?.data?.token !== undefined) {
                        setToken(response.data.token);
                        const origin = location.state?.from?.pathname || '/';
                        navigate(origin);
                    }
                })
                .catch((err) => {
                    if (err?.response?.status === 498) {
                        setToken(null);
                        navigate(props.loginRoute);
                    }
                });
        };

        function authenticatedQueryPromise<T>(args: IAuthenticatedQuery<T>) {
            return new Promise((resolve, reject) => {
                axios({
                    url: `${
                        args.apiIdentifier && environment[args.apiIdentifier]
                            ? environment[args.apiIdentifier]
                            : environment.dataUrl
                    }${args.endpoint}`,
                    method: args.method,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: token,
                        subdomain: environment.subdomain
                    },
                    data: args.querydata
                })
                    .then(resolve)
                    .catch((err) => {
                        if (err?.response?.status === 498) {
                            setToken(null);
                            navigate(props.loginRoute);
                        } else {
                            console.error(err);
                            reject(err);
                        }
                    });
            });
        }

        function authenticatedFilePromise<T>(
            args: IAuthenticatedQuery<T>,
            file: any
        ) {
            // const  = (method: string, endpoint: string, , querydata = {}, usePyapi: boolean = false) =>

            return new Promise((resolve, reject) => {
                const formData = new FormData();

                formData.append(FORMDATA_FILE, file?.file ?? file);

                if (args.querydata !== undefined) {
                    formData.append(
                        METADATA_KEY,
                        JSON.stringify(args.querydata)
                    );
                }

                axios({
                    url: `${
                        args.apiIdentifier && environment[args.apiIdentifier]
                            ? environment[args.apiIdentifier]
                            : environment.dataUrl
                    }${args.endpoint}`,
                    method: args.method,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        authorization: token
                    },
                    data: formData
                })
                    .then(resolve)
                    .catch((err) => {
                        if (err?.response?.status === 498) {
                            setToken(null);
                            navigate(props.loginRoute);
                        } else {
                            reject(err);
                        }
                    });
            });
        }

        function authenticatedQueryHook<T>(args: IAuthenticatedQueryHook<T>) {
            // const authenticatedQueryHook = (method: string, endpoint: string, querydata = {}, manual = false, onLoad = undefined, usePyapi: boolean = false, refetchOn = []) => {
            const [result, setResult] = React.useState({
                data: undefined,
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
                            data: undefined,
                            loading: true,
                            error: false
                        });

                        authenticatedQueryPromise(
                            filterAuthenticatedQuery(args)
                        )
                            .then((response: any) => {
                                if (args.onLoad !== undefined) {
                                    args.onLoad?.(response);
                                }
                                setResult({
                                    data: response?.data,
                                    loading: false,
                                    error: false
                                });
                            })
                            .catch((err) => {
                                // console.log(err)
                                if (err?.response?.status === 498) {
                                    setToken(null);
                                } else {
                                    setResult({
                                        data: undefined,
                                        loading: false,
                                        error: err
                                    });
                                }
                            });
                    };
                    fetchData();
                },
                [cnt].concat(args?.reloadOn ? args?.reloadOn : [])
            );

            return [result, () => setCnt(cnt + 1), cnt];
        }

        const value = {
            token,
            onSignUp: handleEvent(props.signupEndpoint),
            onLogin: handleEvent(props.loginEndpoint),
            onLogout: handleLogout,
            authQuery: authenticatedQueryHook,
            authPromise: authenticatedQueryPromise,
            authFilePromise: authenticatedFilePromise
        };

        return (
            <AuthProviderContext.Provider value={value}>
                {props.auChildren}
            </AuthProviderContext.Provider>
        );
    }

    const useAuth: any = () => {
        return React.useContext(AuthProviderContext);
    };

    return { AuthProvider, useAuth };
};
