import {CRDStage} from "./relay-diagram.js";
// TODO Add listener for page resize.
// TODO Use "hide" option.
// =============== MAIN ====================================================================================
// sessionStorage.clear();
// localStorage.clear();
CRDStage.initializeResources().then(() => {
    console.log("Resources were marked ready, drawing diagram...");
    new CRDStage(document.getElementById('cognitive-diagram-container'));
});
