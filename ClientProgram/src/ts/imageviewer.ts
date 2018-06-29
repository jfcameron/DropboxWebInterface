// © 2018 Joseph Cameron - All Rights Reserved

import AbstractViewer from "abstractviewer"
import Spinner from "spinner"

/**
 * View an image
 */
class ImageViewer extends AbstractViewer
{
    constructor()
    {
        super((aURL: string, aBackground: HTMLDivElement, aSpinner: Spinner) =>
        {
            const image = document.createElement("img");

            image.src = aURL;

            image.style.position = "fixed";
            image.style.top = "50%";
            image.style.left = "50%";
            image.style.transform = "translate(-50%, -50%)";
            image.style.maxHeight = "90vh";
            image.style.maxWidth =  "100vw";

            image.onload = () =>
            {
                aSpinner.destruct();   
            };

            image.onclick = (event: Event) =>
            {
                event.stopPropagation();
            };

            aBackground.appendChild(image);
        });
    }
}

export default ImageViewer;
