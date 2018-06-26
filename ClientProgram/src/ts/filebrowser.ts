// © 2018 Joseph Cameron - All Rights Reserved

import resources from "resources"

/**
* @description Renders directories as html lists
*/
class FileBrowser
{
    static readonly c_DirectoryListsDirectory: string   = "json/directorymap/";
    static readonly c_MetaDataDirectory: string         = "json/";
    
    private m_Template: any = [];
    private m_SiteContentRootPath: any;
    
    private appendProceduralDataToJSONObject(aFileName: string, aJSONObject: any)
    {
        let buffer = "";
        let path = "";

        buffer += "<a href='javascript:fileBrowser.renderDirectory(\"" + path + "\")'>"
        buffer += "Public";
        buffer += "</a> / ";
            
        aFileName.split("/").forEach((item: string) =>
        {
            if (item.length > 0)
            {
                path += item + "/";
                    
                buffer += "<a href='javascript:fileBrowser.renderDirectory(\"" + path + "\")'>";
                buffer += item;
                buffer += "</a> / ";
            }
        });
            
        aJSONObject.directoryName = buffer;
    };
    
    private decorateJSONData(aHTMLObject: any, aObjectName: any, aRawJSONData: any, aContentDirectory: any)
    {
        let rValue = "";
        
        switch(aObjectName)
        {
            case("directoryName"):
            {
                rValue += aRawJSONData;
            }
            break;
            
            case("subDirectories"):
            {
                aRawJSONData.forEach((item: any) =>
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
                aRawJSONData.forEach((item: any) =>
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
        
        if (rValue !== undefined) aHTMLObject.innerHTML = rValue;
    };
    
    public renderFile(aFileName: any)
    {
        const fileType = aFileName.split(".").pop();
      
        switch(fileType)
        {
            //Image viewer
            case "png":
            case "jpg":
            {
                window.open("./view/image/?f=" + aFileName + "", '_blank');
            } 
            break;
            
            //AV viewer
            case "flv":
            case "mp4":
            case "webm":
            case "mp3":
            {
                window.open("./view/video/?f=" + (aFileName), '_blank');
            } 
            break;
            
            //Document viewer
            case "pdf":
            case "odt":
            case "ods":
            case "odp":
            case "doc":
            case "txt":
            case "md":
            {
                window.open("./view/document/?f=" + (aFileName), '_blank');
            } 
            break;
            
            default:
            {
                window.open(aFileName, '_blank');
            }
        }        
    };
    
    /**
     * name: renderContentFile
     * args: aFileName
     * description: fetches JSON data from the server
     * iterates each key in the JSON object and applies data to document IDs with
     * key name
    */
    public renderDirectory(aFileName: any)
    {
        //convert directory name in arg to json content name format
        var fileName = aFileName;
        fileName = FileBrowser.c_DirectoryListsDirectory + fileName + "/content.json";
        
        //generate content directory for links
        var contentDirectory = this.m_SiteContentRootPath + aFileName + '/';
            
        resources.fetchJSONFile
        (
            fileName,
            (jsonData: any) =>
           {
                this.appendProceduralDataToJSONObject(aFileName,jsonData);
                
                for (const key in jsonData) 
                {
                    if (!jsonData.hasOwnProperty(key)) continue;
                    
                    const documentElement = document.getElementById(key);
                    
                    if (documentElement != null) this.decorateJSONData(documentElement, key, jsonData[key], contentDirectory);
                }
            }
        );
        
        window.history.pushState("object or string", "d", '?d=' + aFileName);   
    };
    
    constructor()
    {
        const fileName = FileBrowser.c_MetaDataDirectory + "metadata" + ".json";
        
        resources.fetchJSONFile
        (
            fileName,
            (jsonData: any) =>
            {
                this.m_SiteContentRootPath = jsonData["dropboxPublicRootURL"];

                document.getElementById("timestampValue").innerHTML = jsonData["timestamp"];
                
                this.renderDirectory(resources.readQueryStringParameter("d")? resources.readQueryStringParameter("d"): "/");
            }
        );
    }   
}

export default FileBrowser;