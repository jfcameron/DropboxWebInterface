// © 2018 Joseph Cameron - All Rights Reserved

import AbstractViewer from "abstractviewer"
import Spinner from "spinner"

/**
 * View an image
 */
class DocumentViewer extends AbstractViewer
{
    constructor()
    {
        super((aURL: string, aBackground: HTMLDivElement, aSpinner: Spinner) =>
        {
            const doc: HTMLIFrameElement = document.createElement("iframe");

            doc.src = aURL;

            doc.style.position = "fixed";
            doc.style.backgroundColor = "rgba(255, 255, 255, 1)";
            doc.style.width = "80vw";
            doc.style.height = "100vh";
            doc.style.left = "10vw";
            doc.style.top = "0vh";

            doc.onload = () =>
            {
                aSpinner.destruct();   
            };

            doc.onclick = (event: Event) =>
            {
                event.stopPropagation();
            };

            aBackground.appendChild(doc);
        });
    }
}

export default DocumentViewer;
