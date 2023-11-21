

import type { ILibrary } from './Library';


/**
 * The properties of the ProtectedRoute-Function
 * Extend the interface here!
 */
export class CProtectedRouteProps /* extends C_SINGLE_Props */ {
    children?: React.ReactElement<any> | Array<React.ReactElement<any>> | String;
    loginRoute: string;
};

/**
 * This is the pure interface version, to be used/exported
 * When using mutliple parent classes, extend here - but then, we need to apply these in the other steps manually, too
 */
export interface IProtectedRouteProps extends CProtectedRouteProps /*, C_MULTIPLE1_Props,  C_MULTIPLE2_Props, */ { };

/**
 * The type of an array of the properties
 */
type ArrProtectedRouteProps = Array<keyof CProtectedRouteProps> /* &  Array<keyof C_MULTIPLE1_Props> & C_MULTIPLE2_Props */ ;

/**
 * An array of the properties
 */
export const propsArray: ArrProtectedRouteProps = Object.keys(new CProtectedRouteProps()) as ArrProtectedRouteProps;

/* multiple parent classes
export const propsArray: ArrProtectedRouteProps = [
    ...Object.keys(new CProtectedRouteProps()),
    ...Object.keys(new C_MULTIPLE1_Props()),
    ...Object.keys(new C_MULTIPLE2_Props()),
 ] as ArrProtectedRouteProps;*/


/**
 * Get the properties from a bigger object
 */
export const filterProtectedRouteProps = props => propsArray.reduce((r, k) => {
    r[k] = props[k];
    return r;
}, {}) as IProtectedRouteProps;


/**
 * What does the ProtectedRoute -function return
 */
export interface IProtectedRouteResult {

}

/**
 * the overall type of the `ProtectedRoute`-function
 */
type IProtectedRoute = (props: IProtectedRouteProps) => JSX.Element;


type ICreateProtectedRoute = (props: ILibrary, useAuth) => IProtectedRoute;


export const createProtectedRoute: ICreateProtectedRoute = ({ React, ReactRouterDom }, useAuth) => {

    const ProtectedRoute: IProtectedRoute = (props)  => {

        const { token } = useAuth();
        const location = ReactRouterDom.useLocation();

        if (!token) {
            return <ReactRouterDom.Navigate to={props.loginRoute} replace state={{ from: location }} />;
        }

        return <>
        { props.children }
        </>
    };

    return ProtectedRoute;
}
