import {addAllImgLoadEventListener, DIAGRAM_SIZE, DiagramGroup, LegendGroup} from './relay-diagram.js';
import * as OP from "./op-lib.js";
import {OpType} from "./op-lib.js";


const DIAGRAM_SETTINGS_STORAGE_KEY = 'diagram_settings';
const OP_TYPE_INPUTS_STORAGE_KEY = 'op_type_inputs';

const CHANGE_EVENT = new Event('change');

/**
 * @class
 */
class StoredInputs extends EventTarget {
    
    /**
     *
     * @param storage {Storage}
     * @param jsonObjectKey {string}
     * @param elements {...HTMLElement}
     */
    constructor(storage, jsonObjectKey, ...elements) {
        super();
        
        const storedInputsObject = JSON.parse(storage.getItem(jsonObjectKey));
        this.#storedInputsObject = storedInputsObject;
    
        for (const e of elements) {
            const storedValue = storedInputsObject[e.id];
            
            if (storedValue != null) {
                if (e instanceof HTMLInputElement && e.type === 'checkbox') {
                    e.checked = storedValue;
                } else {
                    e.value = storedValue;
                }
            }
    
            console.log(`Stored value for ${e.id} is ${storedValue}`);
            
            e.addEventListener('change', () => {
                let value;
                if (e instanceof HTMLInputElement && e.type === 'checkbox') {
                    value = e.checked
                } else {
                    value = e.value;
                }
                storedInputsObject[e.id] = value;
                
                console.log(
                    `Storing value ${value} for element ${e.id}`,
                    `Stored value: ${storedInputsObject[e.id]}`
                );
                
                storage.setItem(
                    jsonObjectKey,
                    JSON.stringify(storedInputsObject)
                );
                
                this.dispatchEvent(CHANGE_EVENT);
            });
        }
    }
}


/**
 * @class
 */
class DiagramSettings extends StoredInputs {
    
    constructor() {
        const functionsStyleSelect = document.getElementById('functions-style');
        const hideAnimalOrderCheckbox = document.getElementById('hide-numeric-animal-order');
        
        super(localStorage, DIAGRAM_SETTINGS_STORAGE_KEY, functionsStyleSelect, hideAnimalOrderCheckbox);
    }
    
}


/**
 * @class
 */
class OpTypeInputs extends StoredInputs {
    #lastFirstAnimal;
    
    constructor() {
        /** @type {HTMLSelectElement} */
        const animalStackSelect = document.getElementById('animals');
        /** @type {HTMLSelectElement} */
        const saviorsSelect = document.getElementById('saviors');
        /** @type {HTMLSelectElement} */
        const modalitySelect = document.getElementById('modality');
        // const socialType = document.getElementById('social').value;
    
        // "NONE" (or similar neutral value) is always the first option in the list.
        const noAnimalsValue = animalStackSelect.options[0].value;
        const noSaviorsValue = saviorsSelect.options[0].value;
    
        // Listen for changes of animal stack selection and fill savior selection options accordingly.
        animalStackSelect.addEventListener('change', () => {
            // Get the selected value from 'animals' select
            const selectedStack = animalStackSelect.value;
            
            const isAnimalStackSelected = selectedStack !== noAnimalsValue;
            const newFirstAnimal = selectedStack[0];
            
            // If new selection matches last selection don't do anything and return.
            if (this.#lastFirstAnimal === newFirstAnimal) return;
            this.#lastFirstAnimal = newFirstAnimal;
            
            // Determine appropriate "NONE" value text.
            const noSaviorsText = isAnimalStackSelected ? '-- CHOOSE --' : '-- ☝🏻 --';
            
            // Reset <select> options.
            saviorsSelect.innerHTML = '';
        
            // Add "NONE" value.
            saviorsSelect.add(new Option(noSaviorsValue, noSaviorsText));
            
            const deciderGroup = document.createElement('optgroup');
            const observerGroup = document.createElement('optgroup');
            deciderGroup.label = 'Single Decider';
            observerGroup.label = 'Single Observer';
            
            // Define options for savior groups based on the first character of selected animal.
            switch (selectedStack[0]) {
                case 'S':
                    deciderGroup.appendChild(new Option('Fi/Si', 'Fi/Si'));
                    deciderGroup.appendChild(new Option('Fi/Ni', 'Fi/Ni'));
                    deciderGroup.appendChild(new Option('Ti/Si', 'Ti/Si'));
                    deciderGroup.appendChild(new Option('Ti/Ni', 'Ti/Ni'));
                    observerGroup.appendChild(new Option('Si/Fi', 'Si/Fi'));
                    observerGroup.appendChild(new Option('Si/Ti', 'Si/Ti'));
                    observerGroup.appendChild(new Option('Ni/Fi', 'Ni/Fi'));
                    observerGroup.appendChild(new Option('Ni/Ti', 'Ni/Ti'));
                    break;
                case 'C':
                    deciderGroup.appendChild(new Option('Fi/Se', 'Fi/Se'));
                    deciderGroup.appendChild(new Option('Fi/Ne', 'Fi/Ne'));
                    deciderGroup.appendChild(new Option('Ti/Se', 'Ti/Se'));
                    deciderGroup.appendChild(new Option('Ti/Ne', 'Ti/Ne'));
                    observerGroup.appendChild(new Option('Se/Fi', 'Se/Fi'));
                    observerGroup.appendChild(new Option('Se/Ti', 'Se/Ti'));
                    observerGroup.appendChild(new Option('Ne/Fi', 'Ne/Fi'));
                    observerGroup.appendChild(new Option('Ne/Ti', 'Ne/Ti'));
                    break;
                case 'B':
                    deciderGroup.appendChild(new Option('Fe/Si', 'Fe/Si'));
                    deciderGroup.appendChild(new Option('Fe/Ni', 'Fe/Ni'));
                    deciderGroup.appendChild(new Option('Te/Si', 'Te/Si'));
                    deciderGroup.appendChild(new Option('Te/Ni', 'Te/Ni'));
                    observerGroup.appendChild(new Option('Si/Fe', 'Si/Fe'));
                    observerGroup.appendChild(new Option('Si/Te', 'Si/Te'));
                    observerGroup.appendChild(new Option('Ni/Fe', 'Ni/Fe'));
                    observerGroup.appendChild(new Option('Ni/Te', 'Ni/Te'));
                    break;
                case 'P':
                    deciderGroup.appendChild(new Option('Fe/Se', 'Fe/Se'));
                    deciderGroup.appendChild(new Option('Fe/Ne', 'Fe/Ne'));
                    deciderGroup.appendChild(new Option('Te/Se', 'Te/Se'));
                    deciderGroup.appendChild(new Option('Te/Ne', 'Te/Ne'));
                    observerGroup.appendChild(new Option('Se/Fe', 'Se/Fe'));
                    observerGroup.appendChild(new Option('Se/Te', 'Se/Te'));
                    observerGroup.appendChild(new Option('Ne/Fe', 'Ne/Fe'));
                    observerGroup.appendChild(new Option('Ne/Te', 'Ne/Te'));
                    break;
                default:
                    // Keep empty.
                    break;
            }
    
            // Add option groups to saviors <select>.
            saviorsSelect.add(deciderGroup);
            saviorsSelect.add(observerGroup);
            
            // Enable saviors selection only when an animal stack is selected.
            saviorsSelect.disabled = !isAnimalStackSelected;
        });
        
        super(sessionStorage, OP_TYPE_INPUTS_STORAGE_KEY, animalStackSelect, saviorsSelect, modalitySelect);
    
        /** @type {HTMLSelectElement} */
        this.animalStackSelect = animalStackSelect;
        /** @type {HTMLSelectElement} */
        this.saviorsSelect = saviorsSelect;
        /** @type {HTMLSelectElement} */
        this.modalitySelect = modalitySelect;
    }
    
    /**
     *
     * @returns {string|null}
     */
    get #animalStack() {
        const value = this.animalStackSelect.value;
        
        return /[SCBP]/.test(value[0]) ? value : null;
    }
    
    /**
     *
     * @returns {string|null}
     */
    get #saviors() {
        const value = this.saviorsSelect.value;
        return value.includes('/') ? value : null;
    }
    
    /**
     *
     * @returns {string|null}
     */
    get #modality() {
        const value = this.modalitySelect.value;
        return /[FM]{2}/.test(value[0]) ? value : null;
    }
    
    /**
     * Returns true if there's enough data to build a 128-type.
     */
    get #is128Valid() {
        return this.#animalStack != null && this.#saviors != null;
    }
    
    
    /**
     * @type {OpType|undefined}
     */
    get opType() {
        return this.#is128Valid ? OpType.build512Type(this.#animalStack, this.#saviors, this.#modality) : undefined;
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
     * @type {DiagramSettings}
     */
    #diagramSettings;
    
    /**
     * @type {OpTypeInputs}
     */
    #typeInputs;
    
    /**
     *
     * @private
     * @type {LegendGroup}
     */
    #legendGroup;
    
    
    constructor() {
        const diagramContainer = document.getElementById('cognitive-diagram-container');
        
        super({
            container: diagramContainer.id,
            width: DIAGRAM_SIZE,
            height: DIAGRAM_SIZE
        });
    
    
        const diagramSettings = new DiagramSettings();
        const diagramInputs = new OpTypeInputs();
        this.#diagramSettings = diagramSettings;
        this.#typeInputs = diagramInputs;
        
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
    
    
    startListening() {
        this.#diagramSettings.addEventListener('change', () => {
            this.#drawWithInputs()
        });
        this.#typeInputs.addEventListener('change', () => {
            this.#drawWithInputs()
        });
        throw Error("Not implemented.")
    }
    
    #resetToHint() {
        this.#diagramLayer.visible(false);
        this._fillHintLayer.visible(true);
        this.draw();
    }
    
    /**
     * @param opType {OpType}
     */
    #drawType(opType) {
    
    
        this.#diagramGroup.updateType(opType);
    
        this.#diagramLayer.visible(true);
        this._fillHintLayer.visible(false);
        this.draw();
    }
    
    #drawWithInputs() {
        const settings = this.#diagramSettings;
        const typeInputs = this.#typeInputs;
        if (typeInputs.areRequiredMissing) {
            this.#resetToHint();
        } else this.#drawType(typeInputs.opType);
    }
    
    
    
    
    
}


// ===== OLD MAIN START (will slowly deleted when each part is replaced/moved) =========================================



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
        
        const isSingleObserver = observerDecider === 'ODD';
        
        const opType = new OP.OpType(quadra, isSingleObserver, animals, modality, socialType);
        // TODO Add double activation numeric hints and masculinity.
        
        diagramStage.#drawWithInputs()
    } else {
        diagramStage.#resetToHint();
    }
}


function storeChangedUserInput(isStoringAppearance) {
    // Storing changed elements as a JSON containing all the elements of the same category. The key is the class name.
    const dataToStore = {};
    if (isStoringAppearance) {
        for (const e of allAppearanceElements) {
        }
        
        
        localStorage
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
            OP_TYPE_INPUTS_STORAGE_KEY,
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


// =============== MAIN ====================================================================================

// sessionStorage.clear();
// localStorage.clear();

const diagramStage = new DiagramStage();
diagramStage.startListening()

