import { WTVRElement } from "wtvr-element";
import { WTVRExpressiveText } from "wtvr-expressive-text";

export class WTVRDialogBox extends WTVRElement {
    constructor(){
        super();
        this.currentLine = 0;
        this.init();
        this.getNumberAttribute("autoplay",-1);
        this.getNumberAttribute("linedelay",0.4);
        this.autoPlayTimer = null;
    }

    init(){
        for(let child of this.children){
            child.hidden = true;
        }
    }

    start(){
        super.start();
        this.displayLine();
    }

    displayLine(){
        if(this.children.length > this.currentLine){
            let currentSentence = this.children[this.currentLine];
            currentSentence.hidden = false;
            let event = new CustomEvent("line", {detail: { index : this.currentLine, element : currentSentence}});
            this.dispatchEvent(event);
            if(this.currentLine > 0){
                this.children[this.currentLine-1].hidden = true;
            }
            if(currentSentence instanceof WTVRExpressiveText){
                setTimeout(() => {
                currentSentence.start();
                },this.linedelay *1000);
                if(this.autoplay > 0){
                    currentSentence.addEventListener("end", (e) => {
                        this.autoPlayTimer = setTimeout(() => {
                            this.next();
                        },this.autoplay * 1000)
                    })
                }
            }
        }
    }

    onEnd(){
        let event = new CustomEvent("end", {detail: {}});
        this.dispatchEvent(event);
    }
    
    next(){
        if(this.autoPlayTimer){
            clearTimeout(this.autoPlayTimer);
        }
        let currentSentence = this.children[this.currentLine];
        if(currentSentence instanceof WTVRExpressiveText && !currentSentence.finished){
            currentSentence.rush();
            return;
        }else if(this.currentLine == this.children.length - 1){
            this.children[this.currentLine].hidden = true;
            this.onEnd();
            return;
        }
        this.currentLine++;
        this.displayLine();
    }

}