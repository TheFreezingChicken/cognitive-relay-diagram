import {CRDStage} from "./relay-diagram.js";
// TODO Add listener for page resize.
// =============== MAIN ====================================================================================
// sessionStorage.clear();
// localStorage.clear();

document.addEventListener('DOMContentLoaded', () => {
    CRDStage.initializeResources().then(() => {
        console.log("Resources were marked ready, drawing diagram...");
        new CRDStage(document.getElementById('cognitive-diagram-container'));
    });
});
