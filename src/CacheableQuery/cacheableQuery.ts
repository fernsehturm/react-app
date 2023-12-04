/**
 * The properties of the actual query
 *
 *
 * Extend the interface here!
 * All variables MUST have a value because the transpiler would remove them
 * see: https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 */
export class CCacheableQuery<T> /* extends C_SINGLE_Props */ {
    method: string | null = null;

    endpoint: string | null = null;

    querydata: T | null = null;

    apiIdentifier: string | null = null;
}

/**
 * This is the pure interface version, to be used/exported
 * When using mutliple parent classes, extend here - but then, we need to apply these in the other steps manually, too
 */
export interface ICacheableQuery<T>
    extends CCacheableQuery<T> /* , C_MULTIPLE1_Props,  C_MULTIPLE2_Props, */ {}

/**
 * The type of an array of the properties
 */
type ArrCacheableQuery<T> = Array<
    keyof CCacheableQuery<T>
> /* &  Array<keyof C_MULTIPLE1_Props> & C_MULTIPLE2_Props */;

/**
 * An array of the properties
 */
export const propsArray: ArrCacheableQuery<any> = Object.keys(
    new CCacheableQuery()
) as ArrCacheableQuery<any>;

/* multiple parent classes
export const propsArray: ArrCacheableQuery = [
    ...Object.keys(new CCacheableQuery()),
    ...Object.keys(new C_MULTIPLE1_Props()),
    ...Object.keys(new C_MULTIPLE2_Props()),
 ] as ArrCacheableQuery; */

/**
 * Get the properties from a bigger object
 */
export function filterCacheableQuery<T>(
    props: any,
    { fallback = {} as any, override = {} } = {}
) {
    const data = Object.assign(
        propsArray.reduce(
            (r: ICacheableQuery<T>, k: keyof CCacheableQuery<T>) => {
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
            new CCacheableQuery()
        ),
        override
    ) as ICacheableQuery<T>;

    return data;
}

export function filterNonCacheableQuery<T>(props: any) {
    Object.keys(props).reduce((r: any, k: string) => {
        return {
            ...r,
            [k]: !propsArray.includes(k as keyof CCacheableQuery<T>)
                ? props[k]
                : undefined
        };
    }, {});
}
