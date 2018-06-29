// © 2018 Joseph Cameron - All Rights Reserved
// Graphic is based on work from https://codepen.io/aurer/pen/jEGbA

/**
 * @desc Used to indicate user of ongoing asynchronous load
 */
class Spinner
{
    private m_Rotation: number = 0;

    private m_SpinnerGraphic: HTMLDivElement;

    constructor(aParentNode: HTMLElement, aColorRGBA255: {r: number, g: number, b: number, a: number})
    {
        this.m_SpinnerGraphic = (() => 
        {
            const graphic = document.createElement("div");

            graphic.setAttribute("title", "1");

            // This is done in html because setAttribute was changing the case of attributes, breaking the assignments (June 2018)
            graphic.innerHTML = `
            <svg 
                version="1.1" 
                xmlns="http://www.w3.org/2000/svg" 
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 50 50" 
                style="enable-background:new 0 0 50 50;" 
                xml:space="preserve">
                <path 
                    fill="rgba(${aColorRGBA255.r}, ${aColorRGBA255.g}, ${aColorRGBA255.b}, ${aColorRGBA255.a})" 
                    d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                    <animateTransform 
                        attributeType="xml"
                        attributeName="transform"
                        type="rotate"
                        from="0 25 25"
                        to="360 25 25"
                        dur="0.6s"
                        repeatCount="indefinite"/>
                </path>
            </svg>`;

            graphic.style.position = "fixed";
            graphic.style.top =  "50%";
            graphic.style.left = "50%";
            graphic.style.transform = "translate(-50%, -50%)";

            graphic.style.width =  "40px";
            graphic.style.height = "40px";

            return graphic;
        })();
        
        aParentNode.appendChild(this.m_SpinnerGraphic);
    }

    public destruct()
    {
        this.m_SpinnerGraphic.remove();
    }
}

export default Spinner;
