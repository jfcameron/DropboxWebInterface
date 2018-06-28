// © 2018 Joseph Cameron - All Rights Reserved

import resources from "resources"
import "imageviewer"

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
    
    private renderTimeStamp(aTimeStampJSON: any)
    {
        document.getElementById("timestampValue").textContent = (() =>
        { 
            const hour: {number: number, m: string} = (() =>
            {
                let h = aTimeStampJSON["Hour"];

                return h > 12 ? {number: h = h - 12, m: "pm"} : {number: h, m: "am"}; 
            })();
               
            const month = (() =>
            {
                let m = aTimeStampJSON["Month"];

                return m.length > 1 ? m = `0${m}` : m;
            })();

            const minute = aTimeStampJSON["Minute"];
            const second = aTimeStampJSON["Second"];
            const day =    aTimeStampJSON["Day"];
            const year =   aTimeStampJSON["Year"];

            return `${hour.number}:${minute}:${second} ${hour.m}, ${day}日${month}月${year}年`; 
        })();
    }

    /**
     * @desc renders the path to the current working directory (relative to content root)
     * @Warn Must be rewritten 
     */
    private renderPathToCurrentDirectory(aDirectoryPath: string, aJSONObject: any)
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

        aDirectoryPath.split("/").forEach((item: string) =>
        {
            if (item.length > 0)
            {
                currentPath += `${item}/`;

                FileBrowser.currentDirectoryNameNode.appendChild(renderPathSegment(item, currentPath));
            }
        });
    };

    /**
     * @desc Renders current directory contents
     */
    private renderDirectoryContents(aHTMLObject: HTMLElement, aContentList: string, aRawJSONData: [any], aContentDirectory: any)
    {
        /**
         * @desc adds an individual directory item to the dom
         */
        const renderDirectoryItem = (aDirectoryItemTable: HTMLElement, aLabelName: string, aItemName: string, aClickCallback: () => void) =>
        {
            const tableRow = document.createElement("tr");
            const lableData = document.createElement("td");
            const linkData = document.createElement("td");
            const link = document.createElement("a");

            lableData.textContent = aLabelName;

            link.textContent = aItemName;
            link.addEventListener("click", aClickCallback); 

            linkData.appendChild(link);
            tableRow.appendChild(lableData);
            tableRow.appendChild(linkData);
            aDirectoryItemTable.appendChild(tableRow);
        }

        switch(aContentList)
        {
            case("subDirectories"):
            {
                aRawJSONData.forEach((item: string) =>
                {
                    renderDirectoryItem(aHTMLObject, "Dir", item.split("/").pop(), ()=>
                    {
                        this.renderDirectory(item);
                    });
                });
            } 
            break;
            
            case("directoryItems"): //This is most definitely a hack. Improve this.
            {
                aRawJSONData.forEach((item: {URL: string, Type: string}) =>
                {
                    renderDirectoryItem(aHTMLObject, item["Type"], item["URL"].split("/").pop(), ()=>
                    {
                        const type = item["Type"];
                        const url = `${this.m_SiteContentRootPath}${item["URL"]}`;
                        
                        if (type === "image")
                        {
                            const background = (() => 
                            {
                                const background = document.createElement("div");

                                background.style.backgroundColor= "rgba(0, 0, 0, 0.7)"
                                background.style.filter= "alpha(opacity=20)";
                                background.style.width= "100%"; 
                                background.style.height= "100%"; 
                                background.style.zIndex= "10";
                                background.style.top= "0"; 
                                background.style.left= "0"; 
                                background.style.position= "fixed"; 

                                background.onclick = () =>
                                {
                                    console.log ("bg was pressed");
                                    background.remove();
                                };

                                document.body.appendChild(background);

                                return background;
                            })();
                            
                            const image = (() =>
                            {
                                const image = document.createElement("img");

                                image.src = url;

                                image.style.position = "fixed";
                                image.style.top = "50%";
                                image.style.left = "50%";
                                image.style.transform = "translate(-50%, -50%)";

                                image.style.maxHeight = "90vh";
                                image.style.maxWidth =  "100vw";

                                image.onclick = (event: Event) =>
                                {
                                    console.log("image was clicked");

                                    event.stopPropagation();
                                };

                                background.appendChild(image);

                                return image;
                            })();
                        }
                    });
                });
            } 
            break;
        }
    };
    
    /**
     * @desc takes a path to a directory and renders its contents in the dom
     */
    public renderDirectory(aDirectoryPath: string)
    {
        const contentDirectory = `${this.m_SiteContentRootPath}${aDirectoryPath}/`;

        while (FileBrowser.subDirectoryTableBody.hasChildNodes()) FileBrowser.subDirectoryTableBody.removeChild(FileBrowser.subDirectoryTableBody.lastChild);
        while (FileBrowser.directoryFilesTableBody.hasChildNodes()) FileBrowser.directoryFilesTableBody.removeChild(FileBrowser.directoryFilesTableBody.lastChild);
            
        resources.fetchJSONFile
        (
            `${FileBrowser.c_DirectoryListsDirectory}${aDirectoryPath}/content.json`, 
            (jsonData: {[field: string]: any}) =>
            {
                this.renderPathToCurrentDirectory(aDirectoryPath,jsonData);
                
                for (const key in jsonData) 
                {
                    if (!jsonData.hasOwnProperty(key)) continue;
                    
                    const documentElement = document.getElementById(key);
                    
                    if (documentElement != null) this.renderDirectoryContents(documentElement, key, jsonData[key], contentDirectory);
                }
            }
        );
        
        resources.writeQueryStringParameter("d", aDirectoryPath);
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

                this.renderTimeStamp(jsonData["timestamp"]);

                this.renderDirectory((() => 
                {
                    const dir = resources.readQueryStringParameter("d"); 

                    return  dir ? dir : "/";
                })());
            }        
        );
    }   
}

export default FileBrowser;
