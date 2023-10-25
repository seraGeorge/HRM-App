// Create a class for the element
export class PopUpInfo extends HTMLElement {
  static get observedAttributes() {
    return ["info"];
  }

  constructor() {
    // Always call super first in constructor
    super();
    console.log(this)


  }
  connectedCallback() {
    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    // Create spans
    const wrapper = document.createElement("span");
    wrapper.setAttribute("class", "wrapper");

    const infoContainer = document.createElement("span");
    infoContainer.setAttribute("class", "info-container");

    // Take attribute content and put it inside the info span
    const text = this.getAttribute("info");
    console.log(text)

    infoContainer.textContent = text;

    // Create some CSS to apply to the shadow dom
    const style = document.createElement("style");

    style.textContent = `
      .wrapper {
        position: relative;
      }

      .info {
        font-size: 0.8rem;
        width: 200px;
        display: inline-block;
        border: 1px solid black;
        padding: 10px;
        background: white;
        border-radius: 10px;
        opacity: 0;
        transition: 0.6s all;
        position: absolute;
        bottom: 20px;
        left: 10px;
        z-index: 3;
      }
    `;
    // Attach the created elements to the shadow dom
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(infoContainer);

    console.log("Custom square element added to page.");
  }
}

