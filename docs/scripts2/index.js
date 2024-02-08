import {DIAGRAM_SIZE, DiagramGroup, diagramResources} from "./relay-diagram.js";


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
    
        
        const diagramGroup = new DiagramGroup();
        this.#diagramGroup = diagramGroup;
        
        const diagramLayer = new Konva.Layer();
        diagramLayer.add(diagramGroup);
        this.#diagramLayer = diagramLayer;
    
    
        // const fillHintLayer = new Konva.Layer();
        // fillHintLayer.add(
        //     new Konva.Text({
        //         x: 0,
        //         y: 50,
        //         width: this.width(),
        //
        //         fontSize: 25,
        //         fontFamily: 'Fira Code,Roboto Mono,Liberation Mono,Consolas,monospace',
        //         fontStyle: 'bold',
        //         fill: 'black',
        //         stroke: 'white',
        //         strokeWidth: 1,
        //
        //         align: 'center',
        //         verticalAlign: 'middle',
        //
        //         text: "Fill all the dropdown menus...",
        //     })
        // )
        // this._fillHintLayer = fillHintLayer;
    
    
        this.add(diagramLayer);
    }
}



// TODO Add listener for page resize.
// TODO Use "hide" option.


// =============== MAIN ====================================================================================

// sessionStorage.clear();
// localStorage.clear();

diagramResources.initializeAsync().then(() => {
    console.log("Resources were marked ready, drawing diagram...");
    new DiagramStage();
})