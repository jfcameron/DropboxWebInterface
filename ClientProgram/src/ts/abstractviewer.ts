// © 2018 Joseph Cameron - All Rights Reserved

import Spinner from "spinner"

/**
 * 
 */
abstract class AbstractViewer
{
    private m_ConcreteViewBehaviour: (aURL: string, aBackground: HTMLDivElement, aSpinner: Spinner) => void;

    public view(aURL: string)
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
                background.remove();
            };

            document.body.appendChild(background);

            return background;
        })();

        this.m_ConcreteViewBehaviour(
            aURL,
            background,
            new Spinner(background, {r: 255, g: 255, b: 255, a: 1})
        );
    }

    constructor(aViewBehaviour: (aURL: string, aBackground: HTMLDivElement, aSpinner: Spinner) => void)
    {
        this.m_ConcreteViewBehaviour = aViewBehaviour;
    }
}

export default AbstractViewer;