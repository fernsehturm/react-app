/**
 * Specify the global libraries we are using, see:
 * https://stackoverflow.com/a/37404364
 */
export class CLibrary /* extends C_SINGLE_Props */ {
    React: any = {};

    ReactHelmet: any = {};

    ReactRouterDom: any = {};

    axios: any = {};

    createHash: (input: string) => string;
}

/**
 * This is the pure interface version, to be used/exported
 * When using mutliple parent classes, extend here - but then, we need to apply these in the other steps manually, too
 */
export interface ILibrary
    extends CLibrary /* , C_MULTIPLE1_Props,  C_MULTIPLE2_Props, */ {}

/**
 * The type of an array of the properties
 */
type ArrLibrary = Array<
    keyof CLibrary
> /* &  Array<keyof C_MULTIPLE1_Props> & C_MULTIPLE2_Props */;

/**
 * An array of the properties
 */
export const propsArray: ArrLibrary = Object.keys(new CLibrary()) as ArrLibrary;

/* multiple parent classes
export const propsArray: ArrLibrary = [
    ...Object.keys(new CLibrary()),
    ...Object.keys(new C_MULTIPLE1_Props()),
    ...Object.keys(new C_MULTIPLE2_Props()),
 ] as ArrLibrary; */

/**
 * Get the properties from a bigger object
 */
export const filterLibrary = (
    props: any,
    { fallback = {} as any, override = {} } = {}
) => {
    const data = Object.assign(
        propsArray.reduce((r: ILibrary, k: keyof CLibrary) => {
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
        }, new CLibrary()),
        override
    ) as ILibrary;

    return data;
};

export const filterNonLibrary = (props: any) =>
    Object.keys(props).reduce((r: any, k: string) => {
        return {
            ...r,
            [k]: !propsArray.includes(k as keyof CLibrary)
                ? props[k]
                : undefined
        };
    }, {});
