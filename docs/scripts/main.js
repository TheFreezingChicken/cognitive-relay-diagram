import {DiagramStage} from './drawing.js';


const APPEARANCE_SETTING_HTML_CLASS_NAME = '.appearance-setting';
const TYPE_SELECTION_HTML_CLASS_NAME = '.type-selection';



// Query all elements by class.
const allAppearanceElements = document.querySelectorAll(APPEARANCE_SETTING_HTML_CLASS_NAME);
const allSelectionElements = document.querySelectorAll(TYPE_SELECTION_HTML_CLASS_NAME);

// Get appearance settings from local storage (they persist beyond the session) and type selection choices from session
// storage.
const appearanceSettingsJSONData = localStorage.getItem(APPEARANCE_SETTING_HTML_CLASS_NAME);
const typeSelectionJSONData = sessionStorage.getItem(TYPE_SELECTION_HTML_CLASS_NAME);

// Parse the JSON if not null.
const appearanceSettings = appearanceSettingsJSONData === null ? {} : JSON.parse(appearanceSettingsJSONData);
const typeSelection = typeSelectionJSONData === null ? {} : JSON.parse(typeSelectionJSONData);


const diagramContainerElement = document.getElementById('cognitive-diagram-container');
const stage = new DiagramStage(diagramContainerElement);


function selectionChangeHandler() {
    
    let areAllSelected = true;
    
    for (const e of allSelectionElements) {
        if (e.value.toUpperCase() === 'NONE') {
            areAllSelected = false;
            break;
        }
    }
    
    // TODO Take opType creation out of the DiagramStage and put it here.
    // TODO Add double activation numeric hints and masculinity.
    
    if (areAllSelected) {
        stage.redraw(
            functionsStyleSelectionElement.value,
            observerDeciderSelectionElement.value,
            animalStackSelectionElement.value,
            quadraSelectionElement.value
        )
    } else stage.resetToHint();
}


for (const e of allSelectionElements) e.addEventListener('change', selectionChangeHandler);


// TODO Add listener for page resize.
// TODO Add listener for selection change events.
