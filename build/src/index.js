"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const relay_diagram_1 = require("./relay-diagram");
const op_lib_1 = require("../docs/scripts2/op-lib");
/** @readonly */
const DefaultOpTypeFunctions = [
    new op_lib_1.CognitiveFunction('N'),
    new op_lib_1.CognitiveFunction('T'),
    new op_lib_1.CognitiveFunction('F'),
    new op_lib_1.CognitiveFunction('S')
];
Object.freeze(DefaultOpTypeFunctions);
// TODO Add listener for page resize.
// TODO Use "hide" option.
// =============== MAIN ====================================================================================
// sessionStorage.clear();
// localStorage.clear();
relay_diagram_1.CRDStage.initializeResources().then(() => {
    console.log("Resources were marked ready, drawing diagram...");
    new relay_diagram_1.CRDStage(document.getElementById('cognitive-diagram-container'));
});
