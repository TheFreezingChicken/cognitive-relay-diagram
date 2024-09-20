/*
 * Copyright © 2024, The Freezing Chicken
 * Licensed under CC BY-SA 4.0
 *
 * https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1
 */

import {CRDStage} from "./relay-diagram.js";
// TODO Add listener for page resize.
// =============== MAIN ====================================================================================
// sessionStorage.clear();
// localStorage.clear();
function hideMessage() {
    console.log('hideMessage called');
    document.getElementById('help-text').style.display = 'none';
    localStorage.setItem('helpTextHidden', 'true');
}

// Keep this outside to avoid garbage collection.
let canvases = [];

function whenFontIsLoaded(callback) {
    const fonts = [
        'bold 20px "Fira Code", monospace',
    ];
    
    
    for (const f of fonts) {
        const currentCanvas = document.createElement('canvas');
        canvases.push(currentCanvas);
        const fontContext = currentCanvas.getContext('2d');
        fontContext.font = f;
    }
    
    console.log("Waiting for font to load...");
    function checkFontState() {
        let fontsAreLoaded = true;
        const debugText = document.getElementById('debug-text');
        
        const defaultCanvas = document.createElement('canvas');
        const defaultFontContext = defaultCanvas.getContext('2d');
        defaultFontContext.font = 'bold 20px monospace';
        const STUB_TEXT = 'Some test text;';
        const initialStubTextWidth = defaultFontContext.measureText(STUB_TEXT).width;
        
        for (const c of canvases) {
            const fontContext = c.getContext('2d');
            const stubTextWidth = fontContext.measureText(STUB_TEXT).width;
            console.log(initialStubTextWidth);
            console.log(stubTextWidth);
            fontsAreLoaded = fontsAreLoaded && stubTextWidth !== initialStubTextWidth;
            debugText.innerText += fontContext.font + "\n" + initialStubTextWidth + "\n" + stubTextWidth + "\n" + fontsAreLoaded + "\n";
        }
        debugText.innerText += "\n" + fontsAreLoaded + "\n";
        
        if (fontsAreLoaded) {
            console.log("Font loaded!");
            callback();
        } else {
            console.log("Font not loaded yet...");
            setTimeout(() => {
                checkFontState();
            }, 150);
        }
    }
    
    checkFontState();
}


document.addEventListener('DOMContentLoaded', () => {
    whenFontIsLoaded(() => {
        document.getElementById('loading-text').style.display = 'none';
        // HERE At first rendering, don't show the diagram and try to re-render to see if the text gets fixed.
        
        const helpTextParagraph = document.getElementById('help-text');
        helpTextParagraph.addEventListener('click', hideMessage);
        
        if (localStorage.getItem('helpTextHidden')) {
            document.getElementById('help-text').style.display = 'none';
        }
        
        let startingOpType = undefined;
        // startingOpType = new OpType('Si', 'Te', 'SCBP', 'FF');
        
        CRDStage.initializeResources().then(() => {
            console.log("Resources were marked ready, drawing diagram...");
            new CRDStage(document.getElementById('cognitive-diagram-container'), startingOpType);
        });
    });
});

