import type { ILibrary } from './Library';

/**
 * The properties of the Subdomain-Function
 * Extend the interface here!
 * All variables MUST have a value because the transpiler would remove them
 * see: https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 */
export class C_TEMPLATE_Props /* extends C_SINGLE_Props */ {
    children?:
        | React.ReactElement<any>
        | Array<React.ReactElement<any>>
        | string | null = null;

}

/**
 * This is the pure interface version, to be used/exported
 * When using mutliple parent classes, extend here - but then, we need to apply these in the other steps manually, too
 */
export interface I_TEMPLATE_Props
    extends C_TEMPLATE_Props /* , C_MULTIPLE1_Props,  C_MULTIPLE2_Props, */ {}

/**
 * The type of an array of the properties
 */
type Arr_TEMPLATE_Props = Array<
    keyof C_TEMPLATE_Props
> /* &  Array<keyof C_MULTIPLE1_Props> & C_MULTIPLE2_Props */;

/**
 * An array of the properties
 */
export const propsArray: Arr_TEMPLATE_Props = Object.keys(
    new C_TEMPLATE_Props()
) as Arr_TEMPLATE_Props;

/* multiple parent classes
export const propsArray: Arr_TEMPLATE_Props = [
    ...Object.keys(new C_TEMPLATE_Props()),
    ...Object.keys(new C_MULTIPLE1_Props()),
    ...Object.keys(new C_MULTIPLE2_Props()),
 ] as Arr_TEMPLATE_Props; */

/**
 * Get the properties from a bigger object
 */
export const filter_TEMPLATE_Props = (
    props: any,
    { fallback = {} as any, override = {} } = {}
) => {
    const data = Object.assign(
        propsArray.reduce(
            (r: I_TEMPLATE_Props, k: keyof C_TEMPLATE_Props) => {
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
            new C_TEMPLATE_Props()
        ),
        override
    ) as I_TEMPLATE_Props;

    return data;
};

export const filterNon_TEMPLATE_Props = (props: any) =>
    Object.keys(props).reduce((r: any, k: string) => {
        return {
            ...r,
            [k]: !propsArray.includes(k as keyof C_TEMPLATE_Props)
                ? props[k]
                : undefined
        };
    }, {});

type ICreate_TEMPLATE_ = (props: ILibrary) => any;


/**
 * static properties of the _TEMPLATE_
 */
type I_TEMPLATE_<P> = React.FunctionComponent<P> & {
    //    Fieldset: string; // add this
};
// _TEMPLATE_.Fieldset = "PanelFieldset";



export const create_TEMPLATE_: ICreate_TEMPLATE_ = ({ React }) => {
    const _TEMPLATE_Context = React.createContext(null);

    function _TEMPLATE_(props: I_TEMPLATE_Props): JSX.Element {
        const value = {}

        return (
            <_TEMPLATE_Context.Provider value={value}>
                { props.children }
            </_TEMPLATE_Context.Provider>
        );
    }

    const use_TEMPLATE_: any = () => {
        return React.useContext(_TEMPLATE_Context);
    };

    return { _TEMPLATE_, use_TEMPLATE_ };
};
