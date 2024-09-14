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

function whenFontIsLoaded(callback) {
    const stubCanvas = document.createElement('canvas');
    const fontContext = stubCanvas.getContext('2d');
    
    // Measuge text with monospace and then set actual font (with monospace fallback to match initial measurement).
    fontContext.font = 'bold 20px monospace';
    const STUB_TEXT = 'Some test text;';
    const initialStubTextWidth = fontContext.measureText(STUB_TEXT).width;
    const fonts = [
        'bold 20px "Fira Code", monospace',
        'bold 20px "Liberation Mono Custom", monospace'
    ]
    
    console.log("Waiting for font to load...");
    function checkFontState() {
        let fontsAreLoaded = true;
        let a = 1;
        for (const f of fonts) {
            fontContext.font = f;
            const stubTextWidth = fontContext.measureText(STUB_TEXT).width;
            console.log(initialStubTextWidth);
            console.log(stubTextWidth);
            fontsAreLoaded = fontsAreLoaded && stubTextWidth !== initialStubTextWidth;
            document.getElementById('debug-text').innerText += initialStubTextWidth + " " + stubTextWidth + " a";
        }
        
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

