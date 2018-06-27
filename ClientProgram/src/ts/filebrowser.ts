// © 2018 Joseph Cameron - All Rights Reserved

import resources from "resources"

/**
* @description browse content directory tree. detect file type and open appropriate view (if one exists)
*/
class FileBrowser
{
    static readonly c_DirectoryListsDirectory: string = "json/directorymap/";
    static readonly c_MetaDataDirectory: string =       "json/";
    
    static readonly subDirectoryTableBody: HTMLElement =    document.getElementById("subDirectories"); // If I move towards constructing these (i am) these shuld not be static
    static readonly directoryFilesTableBody: HTMLElement =  document.getElementById("directoryItems");
    static readonly currentDirectoryNameNode: HTMLElement = document.getElementById("directoryName");

    private m_SiteContentRootPath: string;
    
    /**
     * @desc renders the path to the current working directory (relative to content root)
     * @param aFileName 
     * @param aJSONObject
     * @Warn Must be rewritten 
     */
    private renderPathToCurrentDirectory(aFileName: string, aJSONObject: any)
    {
        while (FileBrowser.currentDirectoryNameNode.hasChildNodes()) FileBrowser.currentDirectoryNameNode.removeChild(FileBrowser.currentDirectoryNameNode.lastChild);

        const renderPathSegment = (aDirName: string, aLinkPath: string) =>
        {
            const rootNode = document.createElement("a");
            
            rootNode.textContent = `${aDirName}/`;

            rootNode.addEventListener("click", ()=>
            {
                this.renderDirectory(aLinkPath);
            });

            return rootNode;
        };

        FileBrowser.currentDirectoryNameNode.appendChild(renderPathSegment("Public", "/"));

        let currentPath: string = "";

        aFileName.split("/").forEach((item: string) =>
        {
            if (item.length > 0)
            {
                currentPath += `${item}/`;

                console.log(`item: ${item}, path: ${currentPath}`);

                FileBrowser.currentDirectoryNameNode.appendChild(renderPathSegment(item, `${currentPath}`));
            }
        });
    };
    
    /**
     * @desc adds an individual directory item to the dom  This is messy
     * @param aDirectoryItemTable 
     * @param aItemName 
     * @param aClickCallback 
     */
    private renderDirectoryItem(aDirectoryItemTable: HTMLElement, aItemName: string, aClickCallback: () => void)
    {
        const tableRow = document.createElement("tr");
        const lableData = document.createElement("td");
        const linkData = document.createElement("td");
        const link = document.createElement("a");

        lableData.textContent = "???";

        //link.setAttribute('href', "");
        link.textContent = aItemName;
        link.addEventListener("click", aClickCallback); 

        linkData.appendChild(link);
        tableRow.appendChild(lableData);
        tableRow.appendChild(linkData);
        aDirectoryItemTable.appendChild(tableRow);
    }

    /**
     * @desc Renders current directory contents  This is mEssy
     * @param aHTMLObject 
     * @param aObjectName 
     * @param aRawJSONData 
     * @param aContentDirectory 
     */
    private renderDirectoryContents(aHTMLObject: HTMLElement, aObjectName: any, aRawJSONData: any, aContentDirectory: any)
    {
        switch(aObjectName)
        {
            case("subDirectories"):
            {
                aRawJSONData.forEach((item: any) =>
                {
                    this.renderDirectoryItem(aHTMLObject, item.split("/").pop(), ()=>
                    {
                        this.renderDirectory(item);
                    });
                });
            } 
            break;
            
            case("directoryItems"):
            {
                aRawJSONData.forEach((item: any) =>
                {
                    this.renderDirectoryItem(aHTMLObject, item.split("/").pop(), ()=>
                    {

                        console.log("You clicked a file item!");
                    });
                });
            } 
            break;
        }
    };
    
    /**
     * @desc opens a new tab with the correct view on the selected file
     * @param aFileName 
     * @warn This should be revisited. I no longer like the new tab thing.
     */
    public renderFile(aFileName: string)
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
     * @Warning: This name is incredibly misleading. This just sets up the fetch for the current directory contents and appends the real work as success callbacks
     * name: renderContentFile
     * args: aFileName
     * description: fetches JSON data from the server
     * iterates each key in the JSON object and applies data to document IDs with
     * key name
    */
    public renderDirectory(aFileName: string)
    {
        const contentDirectory = this.m_SiteContentRootPath + aFileName + '/';

        while (FileBrowser.subDirectoryTableBody.hasChildNodes()) FileBrowser.subDirectoryTableBody.removeChild(FileBrowser.subDirectoryTableBody.lastChild);
        while (FileBrowser.directoryFilesTableBody.hasChildNodes()) FileBrowser.directoryFilesTableBody.removeChild(FileBrowser.directoryFilesTableBody.lastChild);
            
        resources.fetchJSONFile
        (
            `${FileBrowser.c_DirectoryListsDirectory}${aFileName}/content.json`, //fileName,
            (jsonData: {[field: string]: string}) =>
            {
                this.renderPathToCurrentDirectory(aFileName,jsonData);
                
                for (const key in jsonData) 
                {
                    if (!jsonData.hasOwnProperty(key)) continue;
                    
                    const documentElement = document.getElementById(key);
                    
                    if (documentElement != null) this.renderDirectoryContents(documentElement, key, jsonData[key], contentDirectory);
                }
            }
        );
        
        resources.writeQueryStringParameter("d", aFileName);
    };
    
    constructor()
    {
        const fileName = `${FileBrowser.c_MetaDataDirectory}/metadata.json`;
        
        resources.fetchJSONFile
        (
            fileName,
            (jsonData: any) =>
            {
                this.m_SiteContentRootPath = jsonData["dropboxPublicRootURL"];

                document.getElementById("timestampValue").innerHTML = jsonData["timestamp"]; //This is ok but should the server really be styling output?
                
                const dir = resources.readQueryStringParameter("d"); 

                this.renderDirectory(dir ? dir : "/");
            }
        );
    }   
}

export default FileBrowser;
