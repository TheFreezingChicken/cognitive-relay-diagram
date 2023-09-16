import {DiagramStage} from './drawing.js';
import {OpType} from "./op-lib.js";


const APPEARANCE_SETTING_HTML_CLASS_NAME = '.appearance-setting';
const TYPE_SELECTION_HTML_CLASS_NAME = '.type-selection';

// sessionStorage.clear();
// localStorage.clear();

// Query all elements by class.
const allAppearanceElements = document.querySelectorAll(APPEARANCE_SETTING_HTML_CLASS_NAME);
const allSelectionElements = document.querySelectorAll(TYPE_SELECTION_HTML_CLASS_NAME);

// Get appearance settings from local storage (they persist beyond the session) and type selection choices from session
// storage.
const appearanceSettingsJSONData = localStorage.getItem(APPEARANCE_SETTING_HTML_CLASS_NAME);
const typeSelectionJSONData = sessionStorage.getItem(TYPE_SELECTION_HTML_CLASS_NAME);

// Parse the JSON if not null.
const appearanceSettings = appearanceSettingsJSONData !== null ? JSON.parse(appearanceSettingsJSONData) : null;
const typeSelection = typeSelectionJSONData !== null ? JSON.parse(typeSelectionJSONData) : null;

if (appearanceSettings !== null) {
    for (const e of allAppearanceElements) {
        const storedValue = appearanceSettings[e.id];
        e.value = storedValue;
        console.log(`Stored value for ${e.id} is ${storedValue}`);
    }
}

if (typeSelection !== null) {
    for (const e of allSelectionElements) {
        const storedValue = typeSelection[e.id];
        e.value = storedValue;
        console.log(`Stored value for ${e.id} is ${storedValue}`);
    }
}


const diagramContainerElement = document.getElementById('cognitive-diagram-container');
const stage = new DiagramStage(diagramContainerElement);


function redraw() {
    let areAllSelected = true;
    
    for (const e of allSelectionElements) {
        if (e.value.toUpperCase() === 'NONE') {
            areAllSelected = false;
            break;
        }
    }
    
    
    // Redrawing diagram if a full OP type can be built, or resets to hint to the user to complete the selection.
    if (areAllSelected) {
        const observerDecider = document.getElementById('observer-decider').value;
        const animals = document.getElementById('animals').value;
        const quadra = document.getElementById('quadra').value;
        
        const isSingleObserver = observerDecider === 'odd';
        
        const opType = new OpType(quadra, isSingleObserver, animals, "MM", "#1");
        // TODO Add background triangle to quickly tell apart demon animals.
        // TODO Add double activation numeric hints and masculinity.
        
        stage.redraw(opType)
    } else {
        stage.resetToHint();
    }
}


function storeChangedUserInput(isStoringAppearance) {
    // Storing changed elements as a JSON containing all the elements of the same category. The key is the class name.
    const dataToStore = {};
    if (isStoringAppearance) {
        for (const e of allAppearanceElements) {
            dataToStore[e.id] = e.value;
            console.log(
                `Storing value ${e.value} for element ${e.id}`,
                `Stored value: ${dataToStore[e.id]}`
            );
        }
        
        
        localStorage.setItem(
            APPEARANCE_SETTING_HTML_CLASS_NAME,
            JSON.stringify(dataToStore)
        )
    } else {
        for (const e of allSelectionElements) {
            dataToStore[e.id] = e.value;
            console.log(
                `Storing value ${e.value} for element ${e.id}`,
                `Stored value: ${dataToStore[e.id]}`
            );
        }
        
        sessionStorage.setItem(
            TYPE_SELECTION_HTML_CLASS_NAME,
            JSON.stringify(dataToStore)
        )
    }
}

function selectionChangeHandler(event) {
    const isChangeInAppearance = event?.target?.id === 'functions-style';
    
    redraw();
    
    storeChangedUserInput(isChangeInAppearance);
}

for (const e of allAppearanceElements) e.addEventListener('change', selectionChangeHandler);
for (const e of allSelectionElements) e.addEventListener('change', selectionChangeHandler);

selectionChangeHandler(null);
// TODO Add listener for page resize.
