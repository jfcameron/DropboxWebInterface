// © 2018 Joseph Cameron - All Rights Reserved

import Spinner from "spinner"

/**
 * Base type for all viewers.
 * A viewer allows the user to consume a filetype of some kind
 * e.g: videoviewer streams video files.
 */
abstract class AbstractViewer
{
    private m_ConcreteViewBehaviour: (aURL: string, aBackground: HTMLDivElement, aSpinner: Spinner) => void;
    private m_DestructBehaviour: () => void | undefined;

    public view(aURL: string)
    {
        const destruct = () =>
        {
            if (this.m_DestructBehaviour) this.m_DestructBehaviour();

            background.remove();
        };

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
                destruct();
            };

            document.body.appendChild(background);

            return background;
        })();

        //background.appendChild(container);

        const handle = window.addEventListener("keyup", (event: KeyboardEvent): void =>
        {
            if (event.key === "Escape") destruct();
        });

        this.m_ConcreteViewBehaviour(
            aURL,
            background,
            new Spinner(background, {r: 255, g: 255, b: 255, a: 1})
        );
    }

    constructor(aViewBehaviour: (aURL: string, aBackground: HTMLDivElement, aSpinner: Spinner) => void)
    constructor(aViewBehaviour: (aURL: string, aBackground: HTMLDivElement, aSpinner: Spinner) => void, aDestructBehaviour: () => void)
    constructor(aViewBehaviour: any, aDestructBehaviour?: any)
    {
        this.m_ConcreteViewBehaviour = aViewBehaviour;

        if (arguments.length === 2) this.m_DestructBehaviour = aDestructBehaviour;
    }
}

export default AbstractViewer;