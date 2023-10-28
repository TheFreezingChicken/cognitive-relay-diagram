import {addAllImgLoadEventListener, DIAGRAM_SIZE, DiagramGroup, LegendGroup} from './relay-diagram.js';
import * as OP from "./op-lib.js";


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
    
        if (e instanceof HTMLInputElement) e.checked = storedValue
        else e.value = storedValue;
        
        console.log(`Stored value for ${e.id} is ${storedValue}`);
    }
}

if (typeSelection !== null) {
    for (const e of allSelectionElements) {
        const storedValue = typeSelection[e.id];
    
        if (e instanceof HTMLInputElement) e.checked = storedValue
        else e.value = storedValue;
    
        console.log(`Stored value for ${e.id} is ${storedValue}`);
    }
}



class DiagramStage extends Konva.Stage {
    /**
     *
     * @private
     * @type {Konva.Layer}
     */
    #diagramLayer;
    
    /**
     *
     * @private
     * @type {DiagramGroup}
     */
    #diagramGroup;
    
    /**
     *
     * @private
     * @type {LegendGroup}
     */
    #legendGroup;
    
    
    constructor(htmlElement) {
        super({
            container: htmlElement.id,
            width: DIAGRAM_SIZE,
            height: DIAGRAM_SIZE
        });
        
        const diagramGroup = new DiagramGroup();
        this.#diagramGroup = diagramGroup;
        
        const diagramLayer = new Konva.Layer();
        diagramLayer.add(diagramGroup);
        this.#diagramLayer = diagramLayer;
    
    
        const fillHintLayer = new Konva.Layer();
        fillHintLayer.add(
            new Konva.Text({
                x: 0,
                y: 50,
                width: this.width(),
            
                fontSize: 25,
                fontFamily: 'Fira Code,Roboto Mono,Liberation Mono,Consolas,monospace',
                fontStyle: 'bold',
                fill: 'black',
                stroke: 'white',
                strokeWidth: 1,
            
                align: 'center',
                verticalAlign: 'middle',
            
                text: "Fill all the dropdown menus...",
            })
        )
        this._fillHintLayer = fillHintLayer;
    
    
        this.add(diagramLayer, fillHintLayer);
    }
    
    
    /**
     *
     * @param {PartialOpType} opType
     */
    redraw(
        opType
    ) {
        this.#diagramGroup.updateType(opType);
        
        this.#diagramLayer.visible(true);
        this._fillHintLayer.visible(false);
        this.draw();
    }
    
    resetToHint() {
        this.#diagramLayer.visible(false);
        this._fillHintLayer.visible(true);
        this.draw();
    }
}


// MAIN START (everything is loaded above) =============================================================

const diagramContainerElement = document.getElementById('cognitive-diagram-container');

const diagramStage = new DiagramStage(diagramContainerElement);



function updateDiagram() {
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
        const modality = document.getElementById('modality').value;
        const socialType = document.getElementById('social').value;
        
        const isSingleObserver = observerDecider === 'ODD';
        
        const opType = new OP.PartialOpType(quadra, isSingleObserver, animals, modality, socialType);
        // TODO Add double activation numeric hints and masculinity.
        
        diagramStage.redraw(opType)
    } else {
        diagramStage.resetToHint();
    }
}


function storeChangedUserInput(isStoringAppearance) {
    // Storing changed elements as a JSON containing all the elements of the same category. The key is the class name.
    const dataToStore = {};
    if (isStoringAppearance) {
        for (const e of allAppearanceElements) {
            let value;
            if (e instanceof HTMLInputElement) value = e.checked
            else value = e.value;
            dataToStore[e.id] = value;
            console.log(
                `Storing value ${value} for element ${e.id}`,
                `Stored value: ${dataToStore[e.id]}`
            );
        }
        
        
        localStorage.setItem(
            APPEARANCE_SETTING_HTML_CLASS_NAME,
            JSON.stringify(dataToStore)
        )
    } else {
        for (const e of allSelectionElements) {
            let value;
            if (e instanceof HTMLInputElement) value = e.checked
            else value = e.value;
            dataToStore[e.id] = value;
            console.log(
                `Storing value ${value} for element ${e.id}`,
                `Stored value: ${dataToStore[e.id]}`
            );
        }
        
        sessionStorage.setItem(
            TYPE_SELECTION_HTML_CLASS_NAME,
            JSON.stringify(dataToStore)
        )
    }
}

/**
 *
 * @param {Event | string | null} event - Is either an event, null, or a 'skipStoring' string.
 */
function selectionChangeHandler(event) {
    const isChangeInAppearance = event?.target?.className === 'appearance-setting';
    
    updateDiagram();
    
    // noinspection EqualityComparisonWithCoercionJS
    if (event != 'skipStoring') storeChangedUserInput(isChangeInAppearance);
}

for (const e of allAppearanceElements) e.addEventListener('change', selectionChangeHandler);
for (const e of allSelectionElements) e.addEventListener('change', selectionChangeHandler);
addAllImgLoadEventListener(() => {
    selectionChangeHandler('skipStoring');
});

selectionChangeHandler(null);
// TODO Add listener for page resize.
// TODO Use "hide" option.
