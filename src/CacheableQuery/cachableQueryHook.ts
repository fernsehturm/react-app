import { CCacheableQuery } from './cacheableQuery';

/**
 * The properties of the actual query
 *
 *
 * Extend the interface here!
 * All variables MUST have a value because the transpiler would remove them
 * see: https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 */
export class CCacheableQueryHook<T> extends CCacheableQuery<T> {
    manual?: boolean = false;

    onLoad?: any = null;

    reloadOn?: Array<any> | null = null;

    constructor() {
        super()
    }
}

/**
 * This is the pure interface version, to be used/exported
 * When using mutliple parent classes, extend here - but then, we need to apply these in the other steps manually, too
 */
export interface ICacheableQueryHook<T>
    extends CCacheableQueryHook<T> /* , C_MULTIPLE1_Props,  C_MULTIPLE2_Props, */ {}

/**
 * The type of an array of the properties
 */
type ArrCacheableQueryHook<T> = Array<
    keyof CCacheableQueryHook<T>
> /* &  Array<keyof C_MULTIPLE1_Props> & C_MULTIPLE2_Props */;

/**
 * An array of the properties
 */
export const propsArray: ArrCacheableQueryHook<any> = Object.keys(
    new CCacheableQueryHook()
) as ArrCacheableQueryHook<any>;

/* multiple parent classes
export const propsArray: ArrCacheableQueryHook = [
    ...Object.keys(new CCacheableQueryHook()),
    ...Object.keys(new C_MULTIPLE1_Props()),
    ...Object.keys(new C_MULTIPLE2_Props()),
 ] as ArrCacheableQueryHook; */

/**
 * Get the properties from a bigger object
 */
export function filterCacheableQueryHook<T>(
    props: any,
    { fallback = {} as any, override = {} } = {}
) {
    const data = Object.assign(
        propsArray.reduce(
            (r: ICacheableQueryHook<T>, k: keyof CCacheableQueryHook<T>) => {
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
            new CCacheableQueryHook()
        ),
        override
    ) as ICacheableQueryHook<T>;

    return data;
}

export function filterNonCacheableQueryHook<T>(props: any) {
    Object.keys(props).reduce((r: any, k: string) => {
        return {
            ...r,
            [k]: !propsArray.includes(k as keyof CCacheableQueryHook<T>)
                ? props[k]
                : undefined
        };
    }, {});
}
