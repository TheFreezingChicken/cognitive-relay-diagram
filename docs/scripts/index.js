// import {addAllImgLoadEventListener, DIAGRAM_SIZE, MainRelayDiagram, LegendGroup} from './relay-diagram.js';
import {OpType} from "./op-lib.js";


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
     * @type {MainRelayDiagram}
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
        
        const diagramGroup = new MainRelayDiagram();
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

// HERE Settings seem to be 100% working and ready. Now's time to fix the diagram...

// const diagramStage = new DiagramStage();
// diagramStage.startListening()

