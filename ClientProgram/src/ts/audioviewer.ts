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
                //audio.controls = true;
                audio.autoplay = true;

                audio.style.width = "100%";
                audio.style.backgroundColor = "black";

                return audio;
            })();

            //
            // Visualizer
            //
            const visualizerContainer = (() =>
            {
                const div = document.createElement("div");

                div.style.padding = "0px";

                return div;
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

                    gradient.addColorStop(1, "rgba(0, 0,   0, 1)"); 
                    gradient.addColorStop(0, "rgba(0, 0, 255, 1)");

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

            visualizerContainer.appendChild(canvas);

            //CONTROLS
            const controlsContainer = (() =>
            {
                const controlsContainer = document.createElement("div");

                controlsContainer.style.padding = "0px";
                controlsContainer.style.backgroundColor = "black";
                controlsContainer.style.display = "flex";
                controlsContainer.style.verticalAlign = "middle";

                //
                // Play, Pause
                //
                {
                    const playsvg = `
<svg
    height = "100%"
    width = "100%"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    id="play-icon"
    version="1.1"
    height="50"
    width="50"
    viewBox="0 0 1200 1200">
    <path
        d="M 600,1200 C 268.65,1200 0,931.35 0,600 0,268.65 268.65,0 600,0 c 331.35,0 600,268.65 600,600 0,331.35 -268.65,600 -600,600 z M 450,300.45 450,899.55 900,600 450,300.45 z"
        id="path16995" />
</svg>`;
                    const pausesvg = `
<svg
    height ="100%"
    width = "100%"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    id="pause-icon"
    version="1.1"
    height="50"
    width="50"
    viewBox="0 0 1200 1200">
    <path
        id="path15778"
        d="M 600,0 C 268.62914,0 0,268.62914 0,600 c 0,331.37086 268.62914,600 600,600 331.37086,0 600,-268.62914 600,-600 C 1200,268.62914 931.37086,0 600,0 z m -269.16515,289.38 181.71397,0 0,621.24 -181.71397,0 0,-621.24 z m 356.61633,0 181.71399,0 0,621.24 -181.71399,0 0,-621.24 z" />
</svg>
                    `;

                    const playbutton = document.createElement("button");

                    playbutton.style.display = "inline;"
                    playbutton.style.height = "1.5em";
                    playbutton.style.width = "1.5em";
                    playbutton.style.margin = "0px";
                    playbutton.style.padding = "0px";
                    playbutton.style.border = "none";
                    playbutton.style.textAlign = "center";
                    playbutton.style.display = "inline-block";
                    //playbutton.style.backgroundColor = "#4CAF50";
                    //playbutton.style.background = "black";
                    playbutton.style.margin = "0em 0.5em  0em 0em";
                    
                    enum PlaybuttonState {
                        Play = 0,
                        Pause
                    };

                    let state = PlaybuttonState.Pause;

                    playbutton.innerText = "Pause";
                    playbutton.innerHTML = pausesvg;

                    playbutton.onclick = () => 
                    {
                        switch (state)
                        {
                            case PlaybuttonState.Play:
                            {
                                playbutton.innerText = "Pause";
                                playbutton.innerHTML = pausesvg;

                                state = PlaybuttonState.Pause;

                                audio.play();
                            }
                            break;

                            case PlaybuttonState.Pause:
                            {
                                playbutton.innerText = "Play";
                                playbutton.innerHTML = playsvg;

                                state = PlaybuttonState.Play;

                                audio.pause();
                            }
                            break;
                        }
                        
                    };

                    controlsContainer.appendChild(playbutton);
                }

                //
                // Scrubber
                //
                {
                    const scrubcontainer = document.createElement("div");

                    scrubcontainer.style.display = "flex";
                    scrubcontainer.style.alignItems = "center";

                    const slider = document.createElement("input");

                    slider.style.width = "7em";
                    
                    slider.type = "range";
                    slider.min = "0";
                    slider.className = "slider";

                    //slider.style.border = "1px solid #CECECE";
                    //slider.style.mozRangeProgress;

                    audio.addEventListener("durationchange",() =>
                    {
                        slider.max = `${audio.duration}`;
                    });

                    audio.addEventListener("timeupdate", () =>
                    {
                        slider.value = `${audio.currentTime}`;
                    });

                    slider.addEventListener("change", () =>
                    {
                        audio.currentTime = Number(slider.value);
                    });                    
                    
                    scrubcontainer.appendChild(slider);
                    controlsContainer.appendChild(scrubcontainer);
                }

                //
                // Rendering the current time and total duration in text
                //
                {
                    const duration = document.createElement("div");

                    duration.style.color = "white";
                    duration.style.fontSize = "0.8em";
                    duration.style.margin = "0em 1em  0em 1em";

                    duration.style.display = "flex";
                    duration.style.alignItems = "center";
                    
                    let totalTime = "";

                    const renderCurrentTimeAndDuration = (aCurrentTime: number, aDuration: number) =>
                    {
                        const renderRawSecondsToHourMinuteSecondString = (rawSeconds: number): string =>
                        {
                            const rawMinutes: number = Math.floor(rawSeconds / 60);

                            const hours: number = Math.floor(rawSeconds / 60 / 60);
                            const minutes = rawMinutes - (hours * 60);
                            const seconds = Math.floor(rawSeconds - (minutes * 60) - (hours * 60 * 60));

                            return `${hours}:${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}`}`;
                        };

                        duration.innerHTML = `${renderRawSecondsToHourMinuteSecondString(aCurrentTime)} / ${renderRawSecondsToHourMinuteSecondString(aDuration)}`;
                    };

                    audio.addEventListener("durationchange",() =>
                    {   
                        renderCurrentTimeAndDuration(0, audio.duration);

                    });

                    audio.addEventListener("timeupdate", () =>
                    {
                        renderCurrentTimeAndDuration(audio.currentTime, audio.duration);
                    });

                    controlsContainer.appendChild(duration);
                }

                //
                // Volume control
                //
                {
                    const volumecontainer = document.createElement("div");

                    volumecontainer.style.display = "flex";
                    volumecontainer.style.alignItems = "center";

                    const volumeslider = document.createElement("input");

                    volumeslider.style.width = "3.0em";

                    const sliderrange = 100;

                    volumeslider.type = "range";
                    
                    volumeslider.min = "0";
                    volumeslider.max = `${sliderrange}`;

                    volumeslider.style.border = "1px solid #CECECE";

                    volumeslider.addEventListener("change", () => //mouseup
                    {
                        console.log("change");
                        audio.volume = Number(volumeslider.value) / sliderrange;
                    });

                    audio.addEventListener("volumechange", () =>
                    {
                        volumeslider.value = `${sliderrange * audio.volume}`;
                    });

                    volumeslider.value = `${audio.volume * sliderrange}`;
                    
                    volumecontainer.appendChild(volumeslider);
                    controlsContainer.appendChild(volumecontainer);
                }

                return controlsContainer;
            })();

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
