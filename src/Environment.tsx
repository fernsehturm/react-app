import type { ILibrary } from './Library';

declare let window: any;
declare let process: any;

/**
 * The properties of the Subdomain-Function
 * Extend the interface here!
 * All variables MUST have a value because the transpiler would remove them
 * see: https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 */
export class CEnvironmentProps /* extends C_SINGLE_Props */ {
    children?:
        | React.ReactElement<any>
        | Array<React.ReactElement<any>>
        | string = '';

    domain?: string | null = null; // the main domain, e.g. calliopa.com

    subdomain?: string = ''; // e.g. "a"

    devSubdomain?: string = ''; // the subdomain to use during development

    /**
     * an object with the apis, key:
     */
    apis?: any = {};

    /**
     * the string defining the NODE_ENV environment variable
     */
    nodeEnv?: string = '';
}

/**
 * This is the pure interface version, to be used/exported
 * When using mutliple parent classes, extend here - but then, we need to apply these in the other steps manually, too
 */
export interface IEnvironmentProps
    extends CEnvironmentProps /* , C_MULTIPLE1_Props,  C_MULTIPLE2_Props, */ {}

/**
 * The type of an array of the properties
 */
type ArrEnvironmentProps = Array<
    keyof CEnvironmentProps
> /* &  Array<keyof C_MULTIPLE1_Props> & C_MULTIPLE2_Props */;

/**
 * An array of the properties
 */
export const propsArray: ArrEnvironmentProps = Object.keys(
    new CEnvironmentProps()
) as ArrEnvironmentProps;

/* multiple parent classes
export const propsArray: ArrEnvironmentProps = [
    ...Object.keys(new CEnvironmentProps()),
    ...Object.keys(new C_MULTIPLE1_Props()),
    ...Object.keys(new C_MULTIPLE2_Props()),
 ] as ArrEnvironmentProps; */

/**
 * Get the properties from a bigger object
 */
export const filterEnvironmentProps = (
    props: any,
    { fallback = {} as any, override = {} } = {}
) => {
    const data = Object.assign(
        propsArray.reduce(
            (r: IEnvironmentProps, k: keyof CEnvironmentProps) => {
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
            new CEnvironmentProps()
        ),
        override
    ) as IEnvironmentProps;

    return data;
};

export const filterNonEnvironmentProps = (props: any) =>
    Object.keys(props).reduce((r: any, k: string) => {
        return {
            ...r,
            [k]: !propsArray.includes(k as keyof CEnvironmentProps)
                ? props[k]
                : undefined
        };
    }, {});

type ICreateEnvironment = (props: ILibrary) => any;

export const createEnvironment: ICreateEnvironment = ({ React }) => {
    const EnvironmentContext = React.createContext(null);

    function Environment(props: IEnvironmentProps): JSX.Element {
        const value = (function () {
            const objApis =
                props.apis !== undefined
                    ? Object.keys(props.apis).map(
                          (key: string) => `http://${props.apis?.[key]}`
                      )
                    : {};

            // TODO remove comment here
            console.log(objApis);

            try {
                // we try to get the data from the window object
                const isDevelopment =
                    props.nodeEnv?.localeCompare('development') === 0;

                // typeof window && window?.__NODE_ENV__?.localeCompare('development') === 0;

                // console.log('isDevelopment: ', isDevelopment);

                // from here on, we're sure in the browser
                return {
                    /** during development, we use a fixed subdomain */
                    subdomain: (function () {
                        if (isDevelopment) {
                            return props.devSubdomain;
                        }
                        const { hostname } = window.location;
                        const subdomain = hostname
                            .split('.')
                            .slice(0, -2)
                            .join('_');
                        const maindomain = hostname
                            .split('.')
                            .slice(-2)
                            .join('.');

                        if (
                            subdomain === 'www' &&
                            props.domain !== maindomain
                        ) {
                            return maindomain.split('.')[0];
                        }

                        return subdomain;
                    })(),
                    isDevelopment,

                    isBrowser: true,

                    // this is the address of the API, also look at AuthProvider!
                    dataUrl: isDevelopment ? `http://${props.domain}` : '',
                    ...objApis
                };
            } catch {
                // this is the server-side code
                const isDevelopment =
                    typeof process &&
                    process?.env?.NODE_ENV?.localeCompare('development') === 0;

                return {
                    subdomain: props.subdomain,
                    isDevelopment,
                    // at the server, we need to work with absolute URLs
                    dataUrl: isDevelopment
                        ? `http://${props.domain}`
                        : `https://${props.subdomain}.${props.domain}`,
                    isBrowser: false,
                    // pyApi: `http://${props.pyApi}`
                    ...objApis
                };
            }
        })();

        return (
            <EnvironmentContext.Provider value={value}>
                {props.children}
            </EnvironmentContext.Provider>
        );
    }

    const useEnvironment: any = () => {
        return React.useContext(EnvironmentContext);
    };

    return { Environment, useEnvironment };
};
