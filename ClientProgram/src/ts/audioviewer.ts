// © 2018 Joseph Cameron - All Rights Reserved

import AbstractViewer from "abstractviewer"
import Spinner from "spinner"

/**
 * HTML5 Audio streamer + Visualizer
 */
class AudioViewer extends AbstractViewer
{
    private animationFunctionHandle: any = null; // Must Clean up via cancelAnimationFrame

    private m_MeterWidthScale = 0.9;
    private m_MeterCount = 20;

    constructor()
    {
        super((aURL: string, aBackground: HTMLDivElement, aSpinner: Spinner) =>
        {
            aSpinner.destruct();

            const container = (() =>
            {
               const container = document.createElement("div");

                container.style.position = "fixed";
                container.style.top = "50%";
                container.style.left = "50%";
                container.style.transform = "translate(-50%, -50%)";
                container.style.top = "40vh";
                container.style.maxHeight = "90vh";
                container.style.maxWidth =  "100vw";
                container.style.padding = "0px";
                container.style.margin = "0px";

                container.onclick = (event: Event) =>
                {
                    event.stopPropagation();
                };

                return container;
            })();

            aBackground.appendChild(container);

            const audio = (() =>   
            {
                const audio = document.createElement("audio");

                audio.crossOrigin = "anonymous";

                audio.innerText = "Your Browser does not support HTML5 audio playback";
            
                const source = document.createElement("source");
                source.src = aURL;
            
                audio.appendChild(source);
                audio.controls = true;
                audio.autoplay = true;

                audio.style.width = "100%";
                audio.style.backgroundColor = "black";

                return audio;
            })();

            const canvas = (() => 
            {
                const canvas = document.createElement("canvas");

                canvas.style.verticalAlign = "bottom";

                const audioContext: AudioContext = new AudioContext();

                audio.oncanplay = () =>
                {
                    const analyser: AnalyserNode = (() => 
                    {
                        const a = audioContext.createAnalyser(); 

                        a.connect(audioContext.destination);

                        return a;
                    })();

                    audioContext.createMediaElementSource(audio).connect(analyser);

                    const cwidth = canvas.width;
                    const cheight = canvas.height;

                    const g2d = canvas.getContext('2d');

                    const meterWidth = cwidth / this.m_MeterCount;
        
                    const gradient = g2d.createLinearGradient(0, 0, 0, 200);

                    gradient.addColorStop(1,   "rgba(0, 0,   0, 1)"); 
                    //gradient.addColorStop(0.5, "rgba(0, 0, 127, 1)");
                    gradient.addColorStop(0,   "rgba(0, 0, 255, 1)");

                    g2d.fillStyle = gradient; 

                    const draw = () =>
                    {
                        g2d.clearRect(0, 0, cwidth, cheight);

                        const array = new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteFrequencyData(array);

                        const step = Math.round(array.length / this.m_MeterCount); 

                        for (let i = 0; i < this.m_MeterCount; ++i) 
                        {
                            const magnitude = array[i * step] * 0.8;

                            g2d.fillRect(
                                i * meterWidth, cheight - magnitude, 
                                meterWidth * this.m_MeterWidthScale, cheight * 1.5);
                        }
            
                        if (this.animationFunctionHandle) // prevent duplicate requests from scrubbing etc.
                            cancelAnimationFrame(this.animationFunctionHandle);

                        this.animationFunctionHandle = requestAnimationFrame(draw);
                    }

                    this.animationFunctionHandle = requestAnimationFrame(draw);
                }

                return canvas;
            })();

            const visualizerContainer = (() =>
            {
                const div = document.createElement("div");

                div.style.padding = "0px";

                return div;
            })();

            const controlsContainer = (() =>
            {
                const div = document.createElement("div");

                div.style.padding = "0px";
                div.style.backgroundColor = "black";

                return div;
            })();

            visualizerContainer.appendChild(canvas);
            controlsContainer.appendChild(audio);

            container.appendChild(visualizerContainer);
            container.appendChild(controlsContainer);
        },
        () =>
        {
            cancelAnimationFrame(this.animationFunctionHandle);
        });
    }
}

export default AudioViewer
