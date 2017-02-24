/* 
 *  Filename: DocumentRenderer.js
 *  Description: application code
 * 
*/
function FileBrowser()
{
    //**********
    // Constants
    //**********
    var c_TemplateContentNameSymbol = "##CONTENT_NAME##";
    var c_TemplateContentPathSymbol = "##CONTENT_PATH##";
    
    var c_TemplateDirectory         = "json/templates/";
    var c_DirectoryListsDirectory   = "json/directorymap/";
    
    //*********************
    // Private Data members
    //*********************
    var m_Template = [];
    var m_SiteContentRootPath = "https://dl.dropboxusercontent.com/u/102655232/";
    
    
    //****************
    // Private methods
    //****************
    /*
     * name: asyncLoadJSONFile
     * args: aFileName, aOnReadyCallbackFunction
     * description: asynchronously fetches JSON data from the server
     *  with a name aFileName and calls a function aOnReadyCallbackFunction
     *  once the fetched data has been downloaded.
     *
    */
    asyncLoadJSONFile = function (aFileName, aOnReadyCallbackFunction)
    {
        var xhttp = new XMLHttpRequest();
        
        //init request
        xhttp.open("GET", aFileName, true);
        xhttp.overrideMimeType("application/json");
        xhttp.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                aOnReadyCallbackFunction(JSON.parse(this.responseText));
                
            }
            
        };
    
        //send request
        xhttp.send();
    
    };
    
    appendProceduralDataToJSONObject = function(aFileName, aJSONObject)
    {
        //Calc current directory path
        {        
            var buffer ="";
            
            var path="";//"?d=";
            
            buffer += "<a href='javascript:fileBrowser.renderDirectory(\""+path+"\")'>"
            buffer += "Public";
            buffer += "</a> / ";
            
            aFileName.split("/").forEach(function (item)
            {
                if (item.length > 0)
                {
                    path+=item+"/";
                    
                    buffer += "<a href='javascript:fileBrowser.renderDirectory(\""+path+"\")'>";//"<a href="+path+">";
                    buffer += item;
                    buffer += "</a> / ";
                
                }                 
 
            });
            
            
                    
            aJSONObject.directoryName = buffer;
        
        }
        
    };
    
    decorateJSONData = function(aHTMLObject,aObjectName,aRawJSONData,aContentDirectory)
    {
        var rValue = aRawJSONData;
        
        for (var key in m_Template)     
            if (m_Template.hasOwnProperty(key))
                if (key == aObjectName)
                    //array case
                    if (typeof rValue == 'object')
                    {
                        var buffer = "";
                        
                        for (var i = 0; i < rValue.length; i++)
                        {
                            buffer += m_Template[key];
                            
                            //buffer += m_Template[key].replace(c_TemplateContentNameSymbol,rValue[i]);
                            
                            while(buffer.indexOf(c_TemplateContentNameSymbol)> 0)
                                buffer = buffer.replace(c_TemplateContentNameSymbol,rValue[i]);
                            
                            buffer = buffer.replace(c_TemplateContentPathSymbol,/*aContentDirectory+*/rValue[i]);
                            
                        }
                            
                        rValue = buffer;
                                                
                    }
                    ////string case
                    //else
                    //{
                    //    //rValue = m_Template[key].replace(c_TemplateContentSymbol,rValue);
                    //    //rValue = rValue.replace(c_TemplateContentPathSymbol,/*aContentDirectory+*/rValue[i]);
                    //
                    //}
        
        //aHTMLObject.innerHTML ="";
        aHTMLObject.innerHTML = rValue;
        
    };
    
    loadTemplateFile = function(aFileName)
    {
        //convert directory name in arg to json content name format
        var fileName = c_TemplateDirectory + aFileName + ".json";
           
        asyncLoadJSONFile
        (
            fileName,
            function(jsonData)
            {
                for (var key in jsonData) 
                {
                    if (!jsonData.hasOwnProperty(key))
                        continue;
                    
                    //if (!m_Template[key])
                        
                
                    m_Template[key] = jsonData[key];
                                        
                }
                
            }
            
        );
        
    };
    
    //***************
    // Public methods
    //***************    
    /*
     * name: renderContentFile
     * args: aFileName
     * description: fetches JSON data from the server
     *  iterates each key in the JSON object and applies data to document IDs with
     *  key name
     *
    */
    FileBrowser.prototype.renderDirectory = function(aFileName)
    {
        //convert directory name in arg to json content name format
        var fileName = aFileName;//.split('/').join('_');
        fileName = c_DirectoryListsDirectory + fileName + "/content.json";
        
        //generate content directory for links
        var contentDirectory = m_SiteContentRootPath+aFileName+'/';
            
        asyncLoadJSONFile
        (
            fileName,
            function(jsonData)
            {
                appendProceduralDataToJSONObject(aFileName,jsonData);
                
                for (var key in jsonData) 
                {
                    if (!jsonData.hasOwnProperty(key))
                        continue;
                    
                    //ID case
                    var documentElement = document.getElementById(key);
                    
                    if (documentElement != null)
                        decorateJSONData(documentElement,key,jsonData[key],contentDirectory);
                    
                    //Class case
                    documentElement = document.getElementsByClassName(key);
                    
                    if (documentElement != null)
                        for (var i = 0; i < documentElement.length; i++)
                            decorateJSONData(documentElement[i],key,jsonData[key],contentDirectory);
                    
                }
                
            }
            
        );
        
        //if (window.location.href.indexOf('#') <= 0)
        //{
        //    window.location.href = window.location.href + '#?!';
        //    
        //}
        //
        //var params = getQueryParameters();
        ////if(params.d != "") 
        //{
        //    params.d = aFileName;
        //    setQueryParameters(params);
        //
        //}
        
        
        
        window.history.pushState("object or string", "d", '?d='+aFileName);
                
    };
    
    //
    //
    //
    loadTemplateFile("FileBrowser");
    
}
