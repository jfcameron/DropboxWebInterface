// © 2018 Joseph Cameron - All Rights Reserved

import AbstractViewer from "abstractviewer"
import Spinner from "spinner"

/**
 * 
 */
class VideoViewer extends AbstractViewer
{
    constructor()
    {
        super((aURL: string, aBackground: HTMLDivElement, aSpinner: Spinner) =>
        {
            const video = document.createElement("video");      
            video.innerText = "Your Browser does not support HTML5 Video playback";

            const source = document.createElement("source");
            source.src = aURL;

            video.appendChild(source);
            video.controls = true;
            video.autoplay = true;

            video.style.position = "fixed";
            video.style.top = "50%";
            video.style.left = "50%";
            video.style.transform = "translate(-50%, -50%)";
            video.style.maxHeight = "90vh";
            video.style.maxWidth =  "100vw";

            video.onclick = (event: Event) =>
            {
                event.stopPropagation();
            };

            aBackground.appendChild(video);
        });
    }
}

export default VideoViewer;
