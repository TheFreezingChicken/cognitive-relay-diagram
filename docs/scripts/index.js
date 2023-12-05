import {addAllImgLoadEventListener, DIAGRAM_SIZE, DiagramGroup, LegendGroup} from './relay-diagram.js';
import * as OP from "./op-lib.js";


const DIAGRAM_SETTINGS_STORAGE_KEY = 'diagram_settings';
const OP_TYPE_INPUTS_STORAGE_KEY = 'op_type_inputs';




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
    
        for (const e of elements) {
            const storedValue = storedInputsObject[e.id];
            
            if (storedValue != null) {
                if (e instanceof HTMLInputElement) {
                    e.checked = storedValue;
                } else {
                    e.value = storedValue;
                }
            }
    
            console.log(`Stored value for ${e.id} is ${storedValue}`);
            
            e.addEventListener('change', () => {
                // HERE Save the new value.
            });
        }
    }
}



class DiagramSettings extends StoredInputs {
}


class OpTypeInputs extends StoredInputs {
    
    constructor() {
        const animals = document.getElementById('animals');
        /** @type {HTMLSelectElement} */
        const saviors = document.getElementById('saviors');
        /** @type {HTMLSelectElement} */
        const modality = document.getElementById('modality');
        // const socialType = document.getElementById('social').value;
        
        super(sessionStorage, OP_TYPE_INPUTS_STORAGE_KEY, animals, saviors, modality);
    
        // HERE Add listeners to apply changes to fields. Storing itself is already done in the superclass.
    }
    
    /**
     * @type {OpType}
     */
    get opType() {
        throw Error("Not implemented.")
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
            DIAGRAM_SETTINGS_STORAGE_KEY,
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

