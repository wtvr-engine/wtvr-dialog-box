import { LitElement, html } from "lit-element";
import { WTVRExpressiveText } from "wtvr-expressive-text";


export class WTVRDialogBox extends LitElement {

    constructor(){
        super();
        this.currentIndex = 0;
        this.lineDelay = 0.4;
        this.getTo(this.currentIndex);
    }
    static get properties() {
        return { 
            currentIndex : { type : Number },
            lineDelay : { type : Number },
        }
    }

    getTo(index){
        let counter = 0;
        if(this.currentLine){
            this.currentLine.removeAttribute("slot");
        }
        for(let i = 0; i < this.childNodes.length; i++){
            if(this.childNodes[i] instanceof WTVRExpressiveText){
                if(counter === index){
                    this.childNodes[i].setAttribute("slot","current-line");
                    this.currentLine = this.childNodes[i];
                    return;
                }
                else {
                    counter += 1;
                }
            }
        }
        this.currentLine = null;
        this.dispatchCustomEvent("end");
    }

    dispatchCustomEvent(eventName){
        let dataArray = [];
        if(this.currentLine){
            const data = this.currentLine.getAttribute("data-event");
            if(data){
                dataArray = data.split(" ");
            }
        }
        let event = new CustomEvent(eventName, {detail: { index : this.currentIndex, element : this.currentLine, data : dataArray}});
        this.dispatchEvent(event);
    }

    next(){
        if(this.currentLine && !this.currentLine.finished){
            this.currentLine.rush();
        }
        else{
            this.currentIndex += 1;
        }
    }

    render(){
        this.getTo(this.currentIndex);
        if(this.currentLine){
            setTimeout(() => {
                this.currentLine.start();
                this.dispatchCustomEvent("line");
            },this.lineDelay * 1000);
        }
        return html`<slot name="current-line"></slot>`;
    }
}