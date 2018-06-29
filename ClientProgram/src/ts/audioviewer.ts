// © 2018 Joseph Cameron - All Rights Reserved

import AbstractViewer from "abstractviewer"
import Spinner from "spinner"

/**
 * 
 */
class AudioViewer extends AbstractViewer
{
    constructor()
    {
        super((aURL: string, aBackground: HTMLDivElement, aSpinner: Spinner) =>
        {
            aSpinner.destruct();

            const audio = document.createElement("audio");
            audio.innerText = "Your Browser does not support HTML5 audio playback";
            
            const source = document.createElement("source");
            source.src = aURL;

            audio.appendChild(source);
            audio.controls = true;
            audio.autoplay = true;

            audio.style.position = "fixed";
            audio.style.top = "50%";
            audio.style.left = "50%";
            audio.style.transform = "translate(-50%, -50%)";
            audio.style.maxHeight = "90vh";
            audio.style.maxWidth =  "100vw";

            audio.onclick = (event: Event) =>
            {
                event.stopPropagation();
            };

            aBackground.appendChild(audio); 
        });
    }
}

export default AudioViewer
