import WTVRElement from "./node_modules/wtvr-element/wtvr-element.js";
import WTVRExpressiveText from "./node_modules/wtvr-expressive-text/wtvr-expressive-text.js";

export default class WTVRDialogBox extends WTVRElement {
    constructor(){
        super();
        this.currentLine = 0;
        this.init();
    }

    init(){
        for(let child of this.children){
            child.hidden = true;
        }
        if(this.children.length > 0){
            let lastChild = this.children[this.children.length - 1];
            if(lastChild instanceof WTVRExpressiveText){
                this.children[this.children.length - 1].addEventListener("end",() => {
                    this.onEnd();
                });
            }
            this.displayLine();
            
        }
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
                currentSentence.start();
            }
        }
    }

    onEnd(){
        let event = new CustomEvent("end", {detail: {}});
        this.dispatchEvent(event);
    }
    
    next(){
        let currentSentence = this.children[this.currentLine];
        if(currentSentence instanceof WTVRExpressiveText && !currentSentence.finished){
            currentSentence.rush();
            return;
        }else if(this.currentLine + 1 == this.children.length - 1){
            this.onEnd();
        }
        this.currentLine++;
        this.displayLine();
    }

}