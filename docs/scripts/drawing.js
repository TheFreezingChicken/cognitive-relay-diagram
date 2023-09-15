import {DiagramStage} from "./drawing-utils.js";

const diagramContainerElement = document.getElementById('cognitive-diagram-container');

const stage = new DiagramStage(diagramContainerElement);


const functionsStyleSelectionElement = document.getElementById('functions-style');
const observerDeciderSelectionElement = document.getElementById('observer-decider');
const animalStackSelectionElement = document.getElementById('animals');
const quadraSelectionElement = document.getElementById('quadra');

stage.redraw(
    functionsStyleSelectionElement.value,
    observerDeciderSelectionElement.value,
    animalStackSelectionElement.value,
    quadraSelectionElement.value
)

// TODO Add listener for page resize.
// TODO Add listener for selection change events.
