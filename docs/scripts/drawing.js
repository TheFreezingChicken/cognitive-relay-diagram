import {DiagramStage} from "./drawing-utils.js";

const diagramContainerElement = document.getElementById('cognitive-diagram-container');

const stage = new DiagramStage(diagramContainerElement);


const functionsStyleSelectionElement = document.getElementById('functions-style');
const observerDeciderSelectionElement = document.getElementById('observer-decider');
const animalStackSelectionElement = document.getElementById('animals');
const quadraSelectionElement = document.getElementById('quadra');

const selectionElements = document.querySelectorAll('.type-selection');

function selectionChangeHandler() {
    
    let areAllSelected = true;
    
    for (const e of selectionElements) {
        if (e.value.toUpperCase() === "NONE") {
            areAllSelected = false;
            break;
        }
    }
    
    if (areAllSelected) {
        stage.redraw(
            functionsStyleSelectionElement.value,
            observerDeciderSelectionElement.value,
            animalStackSelectionElement.value,
            quadraSelectionElement.value
        )
    } else stage.resetToHint();
}


for (const e of selectionElements) e.addEventListener('change', selectionChangeHandler);

// TODO Add listener for page resize.
// TODO Add listener for selection change events.
