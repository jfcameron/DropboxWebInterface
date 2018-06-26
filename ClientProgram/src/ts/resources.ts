// © 2018 Joseph Cameron - All Rights Reserved

/**
* @description module for loading data
*/
module resources
{
    /**
     * @description retrieves value of param in the query string following the current page url
     * @param param param in the query string following the url of the current page
     * @Warning UB if no query string is present
     * @Warning UB if the requested parameter is not present
     * @Warning This function must be unit tested
     */
    export function readQueryStringParameter(param: string) 
    {
        const vars: {[key: string]: string} = {};
    
	    window.location.href.replace(location.hash, "").replace(/[?&]+([^=&]+)=?([^&]*)?/gi,
            (m: string, key: string, value: string): any =>
            {
                vars[key] = value !== undefined ? value : "";
		    }
	    );

        if (param) return vars[param] ? vars[param] : null;	
    
	    return vars;
    }

    /**
     * @description: asynchronously fetches JSON data from the server 
     * with a name aFileName and calls a function aOnReadyCallbackFunction
     * once the fetched data has been downloaded.
     * @param aFileName name of the file
     * @param aOnReadyCallbackFunction ???
     * @Warning Requires tests
     * @Warning What happens if the call fails? This needs fixing
    */
    export function fetchJSONFile(aFileName: string, aOnReadyCallbackFunction: any)
    {
        const xhttp = new XMLHttpRequest();
        
        xhttp.open("GET", aFileName, true);
        
        xhttp.overrideMimeType("application/json");

        xhttp.onreadystatechange = () =>
        {
            if (xhttp.readyState == 4 && xhttp.status == 200) 
            {
                aOnReadyCallbackFunction(JSON.parse(xhttp.responseText));   
            }  
        };
    
        xhttp.send();
    };
}

export default resources;