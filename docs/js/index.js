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


document.addEventListener('DOMContentLoaded', () => {
    const helpTextParagraph = document.getElementById('help-text');
    helpTextParagraph.addEventListener('click', hideMessage);
    
    if (localStorage.getItem('helpTextHidden')) {
        document.getElementById('help-text').style.display = 'none';
    }
    
    CRDStage.initializeResources().then(() => {
        console.log("Resources were marked ready, drawing diagram...");
        new CRDStage(document.getElementById('cognitive-diagram-container'));
    });
});

