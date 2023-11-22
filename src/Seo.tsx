/**
 * Make a page SEO-optimized
 */

import { ILibrary } from './Library';

/**
 * The properties of the Seo-Function
 * Extend the interface here!
 */
export class CSeoProps /* extends C_SINGLE_Props */ {
    /**
     * The title tag is your main and most important anchor.
     * The <title> element typically appears as a clickable headline
     * in the SERPs and also shows up on social networks and in browsers.
     */
    title: string = "";

    /**
     * Meta description also resides in the <head> of a webpage and is
     * commonly (though definitely not always) displayed in a SERP snippet along with a title and page URL.
     */
    description: string = "";

    /**
     * Twitter URL
     */
    twitterUrl?: string = "";

    children?: React.ReactElement<any> | Array<React.ReactElement<any>>;
};

/**
 * This is the pure interface version, to be used/exported
 * When using mutliple parent classes, extend here - but then, we need to apply these in the other steps manually, too
 */
export interface ISeoProps extends CSeoProps /*, C_MULTIPLE1_Props,  C_MULTIPLE2_Props, */ { };

/**
 * The type of an array of the properties
 */
type ArrSeoProps = Array<keyof CSeoProps> /* &  Array<keyof C_MULTIPLE1_Props> & C_MULTIPLE2_Props */ ;

/**
 * An array of the properties
 */
export const propsArray: ArrSeoProps = Object.keys(new CSeoProps()) as ArrSeoProps;

/* multiple parent classes
export const propsArray: ArrSeoProps = [
    ...Object.keys(new CSeoProps()),
    ...Object.keys(new C_MULTIPLE1_Props()),
    ...Object.keys(new C_MULTIPLE2_Props()),
] as ArrSeoProps;*/


/**
 * Get the properties from a bigger object
 */
export const filterSeoProps = props => propsArray.reduce((r, k) => {
    r[k] = props[k];
    return r;
}, {}) as ISeoProps;


/**
 * What does the Seo -function return
 */
export interface ISeoResult {

}

/**
 * the overall type of the `Seo`-function
 */
type ISeo = (props: ISeoProps) => JSX.Element;

type ICreateSeo = (props: ILibrary) => ISeo;

export const createSeo: ICreateSeo = ({ React, ReactRouterDom, ReactHelmet }) => {
    
    const Seo: ISeo = (props)  => {
        const location = ReactRouterDom.useLocation();
        
        /*
        const width = getImage(props.data.header)?.width;
        const height = getImage(props.data.header)?.height;
        */
        return <React.Fragment>
            <ReactHelmet.Helmet>
                <title>{props.title}</title>
                <meta name="description" content={ props.description } />

                {/* The Open Graph data used by Facebook, LinkedIn and other social media*/}
                <meta property="og:site_name" content={props.title} />
                <meta property="og:type" content="website" />
                {/* og:title – here you put the title which you want to be displayed when your page is linked to. */ }
                <meta property="og:title" content={props.title} />
                <meta property="og:description" content={props.description} />

                { /** og:url – your page’s URL. */}
                <meta property="og:url" content={location.pathname} />

                { /** // TODO: specify the path to the image 
                <meta property="og:image" content={`${config.siteUrl}${getSrc(props.data.header)}`} />
                <meta property="og:image:width" content={width?.toString()} />
                <meta property="og:image:height" content={height?.toString()} />
                */}

                <meta name="viewport" content="width=device-width, initial-scale=1"/>

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={props.title} />
                <meta name="twitter:description" content={props.description} />
                <meta name="twitter:url" content={location.pathname} />
            
                { /** // TODO: specify the path to the image 
                <meta name="twitter:image" content={`${config.siteUrl}${getSrc(props.data.header)}`} />
                <meta name="twitter:site" content={`@${props.twitterUrl.split('https://twitter.com/')[1]}`} />
                

                <meta http-equiv="Content-Security-Policy"  content="default-src 'self'; img-src https://*; child-src 'none';" />*/}
                
            </ReactHelmet.Helmet>
            { props.children }
        </React.Fragment>
    };

    return Seo;
}

