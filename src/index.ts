import {CRDStage} from "./relay-diagram";
import {CognitiveFunction} from "../docs/scripts2/op-lib";


/** @readonly */
const DefaultOpTypeFunctions = [
    new CognitiveFunction('N'),
    new CognitiveFunction('T'),
    new CognitiveFunction('F'),
    new CognitiveFunction('S')
]
Object.freeze(DefaultOpTypeFunctions);


// TODO Add listener for page resize.
// TODO Use "hide" option.

// =============== MAIN ====================================================================================

// sessionStorage.clear();
// localStorage.clear();

CRDStage.initializeResources().then(() => {
    console.log("Resources were marked ready, drawing diagram...");
    new CRDStage(document.getElementById('cognitive-diagram-container') as HTMLElement);
});