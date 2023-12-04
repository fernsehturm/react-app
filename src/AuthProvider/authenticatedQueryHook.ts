import { CAuthenticatedQuery } from './authenticatedQuery';

/**
 * The properties of the actual query
 *
 *
 * Extend the interface here!
 * All variables MUST have a value because the transpiler would remove them
 * see: https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 */
export class CAuthenticatedQueryHook<T> extends CAuthenticatedQuery<T> {
    manual?: boolean = false;

    onLoad?: any | null = null;

    reloadOn?: Array<any> | null = null;
}

/**
 * This is the pure interface version, to be used/exported
 * When using mutliple parent classes, extend here - but then, we need to apply these in the other steps manually, too
 */
export interface IAuthenticatedQueryHook<T>
    extends CAuthenticatedQueryHook<T> /* , C_MULTIPLE1_Props,  C_MULTIPLE2_Props, */ {}

/**
 * The type of an array of the properties
 */
type ArrAuthenticatedQueryHook<T> = Array<
    keyof CAuthenticatedQueryHook<T>
> /* &  Array<keyof C_MULTIPLE1_Props> & C_MULTIPLE2_Props */;

/**
 * An array of the properties
 */
export const propsArray: ArrAuthenticatedQueryHook<any> = Object.keys(
    new CAuthenticatedQueryHook()
) as ArrAuthenticatedQueryHook<any>;

/* multiple parent classes
export const propsArray: ArrAuthenticatedQueryHook = [
    ...Object.keys(new CAuthenticatedQueryHook()),
    ...Object.keys(new C_MULTIPLE1_Props()),
    ...Object.keys(new C_MULTIPLE2_Props()),
 ] as ArrAuthenticatedQueryHook; */

/**
 * Get the properties from a bigger object
 */
export function filterAuthenticatedQueryHook<T>(
    props: any,
    { fallback = {} as any, override = {} } = {}
) {
    const data = Object.assign(
        propsArray.reduce(
            (
                r: IAuthenticatedQueryHook<T>,
                k: keyof CAuthenticatedQueryHook<T>
            ) => {
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
            new CAuthenticatedQueryHook()
        ),
        override
    ) as IAuthenticatedQueryHook<T>;

    return data;
}

export function filterNonAuthenticatedQueryHook<T>(props: any) {
    Object.keys(props).reduce((r: any, k: string) => {
        return {
            ...r,
            [k]: !propsArray.includes(k as keyof CAuthenticatedQueryHook<T>)
                ? props[k]
                : undefined
        };
    }, {});
}
