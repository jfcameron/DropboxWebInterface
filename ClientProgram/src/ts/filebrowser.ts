// © 2018 Joseph Cameron - All Rights Reserved

import resources from "resources"
import Spinner from "spinner"
import "imageviewer"

import AbstractViewer from "abstractviewer"
import AudioViewer from "audioviewer"
import DocumentViewer from "documentviewer"
import ImageViewer from "imageviewer"
import VideoViewer from "videoviewer"

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

    private m_Viewers: {[filetype: string]: AbstractViewer} = {
        "image": new ImageViewer(),
        "video": new VideoViewer(),
        "audio": new AudioViewer(),
        "document": new DocumentViewer(),
    };
    
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
            
            case("directoryItems"):
            {
                aRawJSONData.forEach((item: {URL: string, Type: string}) =>
                {
                    renderDirectoryItem(aHTMLObject, item["Type"], item["URL"].split("/").pop(), ()=>
                    {
                        const type = item["Type"];
                        const url = `${this.m_SiteContentRootPath}${item["URL"]}`;

                        if (this.m_Viewers[type] !== undefined) this.m_Viewers[type].view(url); 
                        else console.log(`type: ${type} is not supported`); //should there be a default behaviour?
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
           
        const spinner = new Spinner(FileBrowser.directoryFilesTableBody, {r: 0, g: 0, b: 0, a: 1});
        
        resources.fetchJSONFile
        (
            `${FileBrowser.c_DirectoryListsDirectory}${aDirectoryPath}/content.json`, 
            (jsonData: {[field: string]: any}) =>
            {
                spinner.destruct();

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
