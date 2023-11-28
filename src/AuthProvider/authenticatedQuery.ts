/**
 * The properties of the actual query
 *
 *
 * Extend the interface here!
 * All variables MUST have a value because the transpiler would remove them
 * see: https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 */
export class CAuthenticatedQuery<T> /* extends C_SINGLE_Props */ {
    method: string | null = null;

    endpoint: string | null = null;

    queryData: T | null = null;

    apiIdentifier: string | null = null;
}

/**
 * This is the pure interface version, to be used/exported
 * When using mutliple parent classes, extend here - but then, we need to apply these in the other steps manually, too
 */
export interface IAuthenticatedQuery<T>
    extends CAuthenticatedQuery<T> /* , C_MULTIPLE1_Props,  C_MULTIPLE2_Props, */ {}

/**
 * The type of an array of the properties
 */
type ArrAuthenticatedQuery<T> = Array<
    keyof CAuthenticatedQuery<T>
> /* &  Array<keyof C_MULTIPLE1_Props> & C_MULTIPLE2_Props */;

/**
 * An array of the properties
 */
export const propsArray: ArrAuthenticatedQuery<any> = Object.keys(
    new CAuthenticatedQuery()
) as ArrAuthenticatedQuery<any>;

/* multiple parent classes
export const propsArray: ArrAuthenticatedQuery = [
    ...Object.keys(new CAuthenticatedQuery()),
    ...Object.keys(new C_MULTIPLE1_Props()),
    ...Object.keys(new C_MULTIPLE2_Props()),
 ] as ArrAuthenticatedQuery; */

/**
 * Get the properties from a bigger object
 */
export function filterAuthenticatedQuery<T>(
    props: any,
    { fallback = {} as any, override = {} } = {}
) {
    const data = Object.assign(
        propsArray.reduce(
            (r: IAuthenticatedQuery<T>, k: keyof CAuthenticatedQuery<T>) => {
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
            new CAuthenticatedQuery()
        ),
        override
    ) as IAuthenticatedQuery<T>;

    return data;
}

export function filterNonAuthenticatedQuery<T>(props: any) {
    Object.keys(props).reduce((r: any, k: string) => {
        return {
            ...r,
            [k]: !propsArray.includes(k as keyof CAuthenticatedQuery<T>)
                ? props[k]
                : undefined
        };
    }, {});
}
