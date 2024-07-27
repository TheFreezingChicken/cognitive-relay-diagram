import {CRDStage} from "./relay-diagram.js";
import {OpType} from "./op-lib.js";
// TODO Add listener for page resize.
// =============== MAIN ====================================================================================
// sessionStorage.clear();
// localStorage.clear();
const startingOpType = new OpType('Ti', 'Se', 'SB/C', 'MM');
CRDStage.initializeResources().then(() => {
    console.log("Resources were marked ready, drawing diagram...");
    new CRDStage(document.getElementById('cognitive-diagram-container'), startingOpType);
});
