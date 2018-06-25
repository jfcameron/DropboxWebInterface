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
    var c_MetaDataDirectory         = "json/";
    
    //*********************
    // Private Data members
    //*********************
    var m_Template = [];
    var m_SiteContentRootPath;// =dropboxRootURL;// = "https://dl.dropboxusercontent.com/u/102655232/";
    
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
        var rValue="";// = aRawJSONData;
        
        switch(aObjectName)
        {
            case("directoryName"):
            {
                rValue+=aRawJSONData;
                
            }
            break;
            
            case("subDirectories"):
            {
                //"<tr><td>Dir</td><td><a href=\"javascript:fileBrowser.renderDirectory('##CONTENT_PATH##')\">##CONTENT_NAME##</a></td></tr>"
                aRawJSONData.forEach(function(item)
                {
                    rValue += "<tr><td>Dir</td><td><a href=\"javascript:fileBrowser.renderDirectory('"
                    +
                        item//"##CONTENT_PATH##"
                    +
                    "')\"><!--<div style='height:100%;width:100%'>-->"
                    +
                        item.split("/").pop()//"##CONTENT_NAME##"
                    +
                    "<!--</div>--></a></td></tr>";
                
                    
                });
                
            } 
            break;
            
            case("directoryItems"):
            {
                aRawJSONData.forEach(function(item)
                {
                    rValue += "<tr><td>File</td><td><a href=\"javascript:fileBrowser.renderFile('"
                    +
                        item//"##CONTENT_PATH##"
                    +
                    "')\"><!--<div style='height:100%;width:100%'>-->"
                    +
                        item.split("/").pop()//"##CONTENT_NAME##"
                    +
                    "<!--</div>--></a></td></tr>";
                
                    
                });
                
            } 
            break;
            
        }
        
        //
        
        if (rValue != "undefined")
            aHTMLObject.innerHTML = rValue;
        
    };
    
    //***************
    // Public methods
    //*************** 
    FileBrowser.prototype.renderFile = function(aFileName)
    {
        var fileType = aFileName.split(".").pop();
        
        //console.log(fileType);
        
        switch(fileType)
        {
            //Image viewer
            case "png":
            case "jpg":
            {
                window.open("./view/image/?f="+aFileName+"",'_blank');
                
            
            } break;
            
            //AVviewer
            case "flv":
            case "mp4":
            case "webm":
            case "mp3":
            {
                window.open("./view/video/?f="+(aFileName),'_blank');
                
            
            } break;
            
            //Document viewer
            case "pdf":
            case "odt":
            case "ods":
            case "odp"://
            case "doc":
            case "txt":
            case "md":
            {
                window.open("./view/document/?f="+(aFileName),'_blank');       
                
            } break;
            
            default:
            {
                window.open(aFileName,'_blank');
                
            }
            
            
            
        }        
        
    };
    
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
                    
                }
                
            }
            
        );
        
        window.history.pushState("object or string", "d", '?d='+aFileName);
                
    };
    
    FileBrowser.prototype.init= function(aDocumentRendererInstance)
    {
        var fileName = c_MetaDataDirectory + "metadata" + ".json";
        
        asyncLoadJSONFile
        (
            fileName,
            function(jsonData)
            {
                m_SiteContentRootPath = jsonData["dropboxPublicRootURL"];
                document.getElementById("timestampValue").innerHTML = jsonData["timestamp"];
                
                aDocumentRendererInstance.renderDirectory($_GET("d")? $_GET("d"): "/",m_SiteContentRootPath);
                
            }
            
        );
        
    };
    
    this.init(this);
    
}
