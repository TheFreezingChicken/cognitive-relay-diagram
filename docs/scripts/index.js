// import {addAllImgLoadEventListener, DIAGRAM_SIZE, DiagramGroup, LegendGroup} from './relay-diagram.js';
import {OpType} from "./op-lib.js";


const DIAGRAM_SETTINGS_STORAGE_KEY = 'diagram_settings';
const OP_TYPE_INPUTS_STORAGE_KEY = 'op_type_inputs';


/**
 * @class
 */
class StoredInputs extends EventTarget {
    _storedInputsObject;
    
    /**
     *
     * @param storage {Storage}
     * @param jsonObjectKey {string}
     * @param elements {...HTMLElement}
     */
    constructor(storage, jsonObjectKey, ...elements) {
        super();
        
        const storedInputsObject = JSON.parse(storage.getItem(jsonObjectKey)) ?? {};
        this._storedInputsObject = storedInputsObject;
    
        for (const e of elements) {
            console.log(`Setting up element '${e.id}...'`);
            
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
                console.log(`Element ${e.id} changed.`);
                
                let value;
                if (e instanceof HTMLInputElement && e.type === 'checkbox') {
                    value = e.checked
                } else {
                    value = e.value;
                }
                storedInputsObject[e.id] = value;
                
                console.log(
                    `Storing value ${value} for element ${e.id}\n`,
                    `Stored value: ${storedInputsObject[e.id]}`
                );
                
                storage.setItem(
                    jsonObjectKey,
                    JSON.stringify(storedInputsObject)
                );
                
                this.dispatchEvent(new Event('change'));
            });
        }
    }
}


/**
 * @class
 */
class DiagramSettings extends StoredInputs {
    
    constructor() {
        console.log("Building diagram settings...");
        
        const functionsStyleSelect = document.getElementById('functions-style');
        const hideAnimalOrderCheckbox = document.getElementById('hide-numeric-animal-order');
        
        super(localStorage, DIAGRAM_SETTINGS_STORAGE_KEY, functionsStyleSelect, hideAnimalOrderCheckbox);
    }
    
}


/**
 * @class
 */
class OpTypeInputs extends StoredInputs {
    /** @type {HTMLSelectElement} */
    #animalStackSelect;
    /** @type {HTMLSelectElement} */
    #saviorsSelect;
    /** @type {HTMLSelectElement} */
    #modalitySelect;
    
    #lastFirstAnimal;
    
    /**
     * @param optGroup {HTMLOptGroupElement}
     * @param textAndValue {string}
     */
    appendSaviorsOption(optGroup, textAndValue) {
        const isSelected = this._storedInputsObject[this.#saviorsSelect.id] === textAndValue;
        optGroup.appendChild(new Option(textAndValue, textAndValue, null, isSelected));
    }
    
    constructor() {
        console.log("Building OP type inputs...");
        
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
    
        
        super(sessionStorage, OP_TYPE_INPUTS_STORAGE_KEY, animalStackSelect, saviorsSelect, modalitySelect);
    
        
        this.#animalStackSelect = animalStackSelect;
        this.#saviorsSelect = saviorsSelect;
        this.#modalitySelect = modalitySelect;
        // Setting to first letter of "NONE" value to make the listener below work correctly.
        this.#lastFirstAnimal = noAnimalsValue[0];
    
    
        // Listen for changes of animal stack selection and fill savior selection options accordingly.
        animalStackSelect.addEventListener('change', () => {
            console.log("Checking if saviors list needs refilling...");
        
            // Get the selected value from 'animals' select
            const selectedStack = animalStackSelect.value;
        
            const isAnimalStackSelected = selectedStack !== noAnimalsValue;
            const newFirstAnimal = selectedStack[0];
        
            // If new selection matches last selection don't do anything and return.
            if (this.#lastFirstAnimal === newFirstAnimal) {
                console.log("Nope.");
                return;
            }
            this.#lastFirstAnimal = newFirstAnimal;
            
            console.log("Yep, it does. Refilling list...");
        
            // Determine appropriate "NONE" value text.
            const noSaviorsText = isAnimalStackSelected ? '-- CHOOSE --' : '-- ☝🏻 --';
        
            // Reset <select> options.
            saviorsSelect.innerHTML = '';
        
            // Add "NONE" value.
            saviorsSelect.add(new Option(noSaviorsText, noSaviorsValue));
        
            const deciderGroup = document.createElement('optgroup');
            const observerGroup = document.createElement('optgroup');
            deciderGroup.label = 'Single Decider';
            observerGroup.label = 'Single Observer';
    
            
            
            // Define options for savior groups based on the first character of selected animal.
            switch (selectedStack[0]) {
                case 'S':
                    this.appendSaviorsOption(deciderGroup, 'Fi/Si');
                    this.appendSaviorsOption(deciderGroup, 'Fi/Ni');
                    this.appendSaviorsOption(deciderGroup, 'Ti/Si');
                    this.appendSaviorsOption(deciderGroup, 'Ti/Ni');
                    this.appendSaviorsOption(observerGroup, 'Si/Fi');
                    this.appendSaviorsOption(observerGroup, 'Si/Ti');
                    this.appendSaviorsOption(observerGroup, 'Ni/Fi');
                    this.appendSaviorsOption(observerGroup, 'Ni/Ti');
                    break;
                case 'C':
                    this.appendSaviorsOption(deciderGroup, 'Fi/Se');
                    this.appendSaviorsOption(deciderGroup, 'Fi/Ne');
                    this.appendSaviorsOption(deciderGroup, 'Ti/Se');
                    this.appendSaviorsOption(deciderGroup, 'Ti/Ne');
                    this.appendSaviorsOption(observerGroup, 'Se/Fi');
                    this.appendSaviorsOption(observerGroup, 'Se/Ti');
                    this.appendSaviorsOption(observerGroup, 'Ne/Fi');
                    this.appendSaviorsOption(observerGroup, 'Ne/Ti');
                    break;
                case 'B':
                    this.appendSaviorsOption(deciderGroup, 'Fe/Si');
                    this.appendSaviorsOption(deciderGroup, 'Fe/Ni');
                    this.appendSaviorsOption(deciderGroup, 'Te/Si');
                    this.appendSaviorsOption(deciderGroup, 'Te/Ni');
                    this.appendSaviorsOption(observerGroup, 'Si/Fe');
                    this.appendSaviorsOption(observerGroup, 'Si/Te');
                    this.appendSaviorsOption(observerGroup, 'Ni/Fe');
                    this.appendSaviorsOption(observerGroup, 'Ni/Te');
                    break;
                case 'P':
                    this.appendSaviorsOption(deciderGroup, 'Fe/Se');
                    this.appendSaviorsOption(deciderGroup, 'Fe/Ne');
                    this.appendSaviorsOption(deciderGroup, 'Te/Se');
                    this.appendSaviorsOption(deciderGroup, 'Te/Ne');
                    this.appendSaviorsOption(observerGroup, 'Se/Fe');
                    this.appendSaviorsOption(observerGroup, 'Se/Te');
                    this.appendSaviorsOption(observerGroup, 'Ne/Fe');
                    this.appendSaviorsOption(observerGroup, 'Ne/Te');
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
            saviorsSelect.dispatchEvent(new Event('change'));
        });
    
        
        // Triggering animal change because of it being restored in the constructor.
        animalStackSelect.dispatchEvent(new Event('change'));
    }
    
    /**
     *
     * @returns {string|null}
     */
    get #animalStack() {
        const value = this.#animalStackSelect.value;
        
        return /[SCBP]/.test(value[0]) ? value : null;
    }
    
    /**
     *
     * @returns {string|null}
     */
    get #saviors() {
        const value = this.#saviorsSelect.value;
        return value.includes('/') ? value : null;
    }
    
    /**
     *
     * @returns {string|null}
     */
    get #modality() {
        const value = this.#modalitySelect.value;
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



// TODO Add listener for page resize.
// TODO Use "hide" option.


// =============== MAIN ====================================================================================

// sessionStorage.clear();
// localStorage.clear();

const settings = new DiagramSettings();
const inputs = new OpTypeInputs();

// HERE Settings seem to be 100% working and ready. Now's time to fix the diagram...

// const diagramStage = new DiagramStage();
// diagramStage.startListening()

