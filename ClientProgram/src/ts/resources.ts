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
    export function readQueryStringParameter(param: string): string | undefined
    {
        const vars: {[key: string]: string} = {};
    
	    window.location.href.replace(location.hash, "").replace(/[?&]+([^=&]+)=?([^&]*)?/gi, //replace is being used to iterate substrings not replace. replace replace with something else
            (substring: string, key: string, value: string): any =>
            {
                vars[key] = value !== undefined ? value : "";
		    }
	    );
            
        return vars[param]; //the intention here is to return undefined if vars does not contain param. This must be tested
    }

    /**
     * @description writes a value to a param in the query string following the current page url
     * @Warning This does not work as intended.
     * @Warning This needs unit tests
     */
    export function writeQueryStringParameter(name: string, value: string): void
    {
        //1: convert query string into a {[name: string]: string}
        //2: iterate ^ if ^[name] then write value else append to end

        window.history.pushState("object or string", "d", `?${name}=${value}`); //This only supports one param...  
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
    export function fetchJSONFile(aFileName: string, aOnReadyCallbackFunction: (jsonData: any) => void)
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