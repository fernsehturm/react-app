import type { ILibrary } from './Library';

/**
 * The properties of the Subdomain-Function
 * Extend the interface here!
 * All variables MUST have a value because the transpiler would remove them
 * see: https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 */
export class CSignalsProps /* extends C_SINGLE_Props */ {
    children?:
        | React.ReactElement<any>
        | Array<React.ReactElement<any>>
        | string | null = null;

}

/**
 * This is the pure interface version, to be used/exported
 * When using mutliple parent classes, extend here - but then, we need to apply these in the other steps manually, too
 */
export interface ISignalsProps
    extends CSignalsProps /* , C_MULTIPLE1_Props,  C_MULTIPLE2_Props, */ {}

/**
 * The type of an array of the properties
 */
type ArrSignalsProps = Array<
    keyof CSignalsProps
> /* &  Array<keyof C_MULTIPLE1_Props> & C_MULTIPLE2_Props */;

/**
 * An array of the properties
 */
export const propsArray: ArrSignalsProps = Object.keys(
    new CSignalsProps()
) as ArrSignalsProps;

/* multiple parent classes
export const propsArray: ArrSignalsProps = [
    ...Object.keys(new CSignalsProps()),
    ...Object.keys(new C_MULTIPLE1_Props()),
    ...Object.keys(new C_MULTIPLE2_Props()),
 ] as ArrSignalsProps; */

/**
 * Get the properties from a bigger object
 */
export const filterSignalsProps = (
    props: any,
    { fallback = {} as any, override = {} } = {}
) => {
    const data = Object.assign(
        propsArray.reduce(
            (r: ISignalsProps, k: keyof CSignalsProps) => {
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
            new CSignalsProps()
        ),
        override
    ) as ISignalsProps;

    return data;
};

export const filterNonSignalsProps = (props: any) =>
    Object.keys(props).reduce((r: any, k: string) => {
        return Object.assign(r, 
            !propsArray.includes(k as keyof CSignalsProps) ? { [k]: props[k] } : {}
        )

    }, {});

    
type ICreateSignals = (props: ILibrary) => any;


/**
 * static properties of the Signals
 */
type ISignals<P> = React.FunctionComponent<P> & {
    //    Fieldset: string; // add this
};
// Signals.Fieldset = "PanelFieldset";



export const createSignals: ICreateSignals = ({ React }) => {
    const SignalsContext = React.createContext(null);

    function Signals(props: ISignalsProps): JSX.Element {
        const [signals, setSignals] = React.useState({});

        const registerSignal = (key: string, value: any) => {
            setSignals(Object.assign({}, signals, {
                [key]: value,
            }));
            
        }

        return (
            <SignalsContext.Provider value={{ ...signals, registerSignal: registerSignal }}>
                { props.children }
            </SignalsContext.Provider>
        );
    }

    const useSignals: any = () => {
        return React.useContext(SignalsContext);
    };

    return { Signals, useSignals };
};
