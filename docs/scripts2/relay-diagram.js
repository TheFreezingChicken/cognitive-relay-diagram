import {AnimalGrantPosition, OpTypeChangeEvents} from "./op-lib.js";

const devTest = false;

let isLibraryReady = false;

// To change the base size of each circle (before scaling is applied).
const CIRCLE_BASE_RADIUS = 60;
// Multiplier applied to CIRCLE_BASE_RADIUS to get the width of each circle stroke.
const CIRCLE_STROKE_FACTOR = 0.15;
const CIRCLE_STROKE_WIDTH = CIRCLE_BASE_RADIUS * CIRCLE_STROKE_FACTOR;

const CONTROL_CIRCLE_BASE_RADIUS = 25;


// To change the distante between circles on the same "axis".
const OPPOSITE_CIRCLE_DISTANCE = 350;
// Width and height of the diagram stage.
export const DIAGRAM_SIZE = OPPOSITE_CIRCLE_DISTANCE + CIRCLE_BASE_RADIUS * 4;
const DIAGRAM_CENTER = DIAGRAM_SIZE / 2;

/**
 * @readonly
 */
const FunctionCirclePositions = Object.freeze([
    // First
    Object.freeze({
        x: DIAGRAM_CENTER,
        y: DIAGRAM_CENTER - OPPOSITE_CIRCLE_DISTANCE / 2
    }),
    // Second
    Object.freeze({
        x: DIAGRAM_CENTER - OPPOSITE_CIRCLE_DISTANCE / 2,
        y: DIAGRAM_CENTER
    }),
    // Third
    Object.freeze({
        x: DIAGRAM_CENTER + OPPOSITE_CIRCLE_DISTANCE / 2,
        y: DIAGRAM_CENTER
    }),
    // Last
    Object.freeze({
        x: DIAGRAM_CENTER,
        y: DIAGRAM_CENTER + OPPOSITE_CIRCLE_DISTANCE / 2
    })
]);

/**
 * @readonly
 */
const FunctionCircleScaleFactors = Object.freeze([
    1,
    0.82,
    0.68,
    0.53
])

/** @type {Map<Readonly<AnimalGrantPosition>, {x: number, y: number}>} */
const AnimalCenterOffsets = new Map([
    [AnimalGrantPosition.STRONGER_INFO, {x: 50, y: 50}],
    [AnimalGrantPosition.STRONGER_ENERGY, {x: -50, y: 50}],
    [AnimalGrantPosition.WEAKER_ENERGY, {x: 50, y: -50}],
    [AnimalGrantPosition.WEAKER_INFO, {x: -50, y: -50}],
]);

const COGFUN_BASE_FONT_SIZE = 58;
const ANIMAL_LETTER_BASE_FONT_SIZE = 20;
const ANIMAL_LETTER_OFFSET_FROM_LINE = -15;

// Offset of the semi-transparent colored triangles from the lines.
const ANIMAL_BG_TRIANGLE_OFFSET = 17;

const FIRST_ANIMAL_STROKE_WIDTH = 5;
const SECOND_ANIMAL_STROKE_WIDTH = 3;
const THIRD_ANIMAL_STROKE_WIDTH = 2;
const THIRD_ANIMAL_DASH_PATTERN = [10, 2];
const LAST_ANIMAL_STROKE_WIDTH = 1;
const LAST_ANIMAL_DASH_PATTERN = [6, 17];

const SAVIOR_ANIMAL_TRIANGLE_COLOR = "green";
const DEMON_ANIMAL_TRIANGLE_COLOR = "red";

const FIRST_ANIMAL_TRIANGLE_OPACITY = 0.1;
const SECOND_ANIMAL_TRIANGLE_OPACITY = 0.05;
const THIRD_ANIMAL_TRIANGLE_OPACITY = 0.03;
const LAST_ANIMAL_TRIANGLE_OPACITY = 0.05;

const LAST_ANIMAL_LINE_OPACITY = 0.4;



const CogFunFillColors = Object.freeze({
    F: '#c82323',
    T: '#6c6c6c',
    S: '#f3ca24',
    N: '#944cd2',
    O: '#929292',
    D: '#929292'
});

const CogFunStrokeColors = Object.freeze({
    F: '#881a1a',
    T: '#292929',
    S: '#c0912c',
    N: '#522c73',
    O: 'black',
    D: 'black'
});




const IMG_DIR_PATH = './img';

// REM Leave "new Image" in case we need to use different types of resources.
const DiagramResources = {
    BIG_DEMON_BG_IMG: new Image(),
    LITTLE_DEMON_BG_IMG: new Image(),
    MASCULINE_FUNCTION_BG_IMG: new Image(),
    FUNCTION_POINTER_GRID_IMG: new Image(),
    FUNCTION_POINTER_ARROW_IMG: new Image()
}


class ResourceLoader {
    
    /**
     * Asynchronously initializes all resources needed to render diagrams.
     * @returns {Promise<undefined[]>}
     */
    async initializeAsync() {
        console.log("Initializing resources...")
        
        /**
         * Return a promise which resolves when image is loaded or failed.
         * @param img {HTMLImageElement}
         * @param path {string}
         * @returns {Promise<undefined>}
         */
        const loadImg = (img, path) => new Promise((resolve, reject) => {
            img.onload = () => {
                img.onload = null;
                img.onerror = null;
                resolve();
            };
    
            img.onerror = () => {
                img.onload = null;
                img.onerror = null;
                reject()
            };
    
            img.src = path;
        });
    
        // Load all images concurrently. When all are finished set library as ready. Returns the end Promise.
        return Promise.all([
            loadImg(DiagramResources.LITTLE_DEMON_BG_IMG, `${IMG_DIR_PATH}/Demon3.png`),
            loadImg(DiagramResources.BIG_DEMON_BG_IMG, `${IMG_DIR_PATH}/Demon4.png`),
            loadImg(DiagramResources.MASCULINE_FUNCTION_BG_IMG, `${IMG_DIR_PATH}/Muscles.png`),
            loadImg(DiagramResources.FUNCTION_POINTER_GRID_IMG, `${IMG_DIR_PATH}/pointer-grid.png`),
            loadImg(DiagramResources.FUNCTION_POINTER_ARROW_IMG, `${IMG_DIR_PATH}/blue-arrow.png`)
        ]).then(() => {
            // REM Add any other resource initialization here.
            console.log("Resources fully initialized.")
            isLibraryReady = true
        });
    }
}

export const diagramResources = new ResourceLoader();




// ERR Find calls to previous OpTypeEvents and use these instead.
const DiagramEvents = {
    // Contains "grantOrder"
    LETTER_SWITCH: 'letterSwitch',
    CHARGE_SWITCH: 'chargeSwitch',
    MAIN_AXIS_SWITCH: 'mainAxisSwitch',
    MAKE_MASCULINE: 'makeMasculine',
    SET_ANIMAL_ORDER: 'setAnimalOrder',
    MODALITY_RESET: 'modalityReset',
    TYPE_RESET: 'typeReset'
};





class DebugRect extends Konva.Rect {
    
    /**
     *
     * @param {{x: number, y: number, width: number, height: number}}rect
     */
    constructor(rect) {
        super({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            
            fill: 'black',
            opacity: 0.2
        });
    }
}






// export class LegendGroup extends Konva.Group {
//     constructor() {
//         throw Error("Not implemented.");
//         super();
//     }
// }



// FIX Visit all diagram elements and fix listeners calls with new method names.


export class DiagramGroup extends Konva.Group {
    
    /**
     * Simply calls [diagramResources.initializeAsync()]{@linkcode diagramResources#initializeAsync}.
     * @returns {Promise<undefined[]>}
     */
    static async initializeResources() {
        return diagramResources.initializeAsync();
    }
    
    
    
    constructor() {
        if (!isLibraryReady) throw Error("Library resources must be initialized before using diagrams.");
        
        super();
        
        const state = new OpTypeState();
        this._opTypeState = state;
        
        // Create group for the whole stack of functions and then create every single one of them and add them.
        const cogFunStackGroup = new Konva.Group();
        const cogFunCutoutsGroup = new Konva.Group({
            globalCompositeOperation: 'destination-out'
        });
        
        /** @type {CognitiveFunctionGroup[]} */
        const cogFunGroups = new Array(4);
        for (let i = 0; i < 4; i++) {
            const cfg = new CognitiveFunctionGroup(state.getCognitiveFunState(i));
            
            cogFunGroups[i] = cfg;
            cogFunStackGroup.add(cfg);
            cogFunCutoutsGroup.add(new CognitiveFunctionCircle(state.getCognitiveFunState(i)));
        }
    
        const animalStackGroup = new Konva.Group();
        // Do the same things for animals.
        // Iterating AnimalPositions (through property names) to create AnimalGroups.
        for (const ap of AnimalGrantPosition.All) {
            console.log(ap)
            const circle1 = cogFunGroups[ap.grantIndex1].circle;
            const circle2 = cogFunGroups[ap.grantIndex2].circle;
            // noinspection JSCheckFunctionSignatures
            const ag = new AnimalGroup(
                state.getObservableAnimal(ap),
                circle1,
                circle2
            );
            animalStackGroup.add(ag);
        }
        
        // This rectangle is used to have the full hovering/tapping surface available.
        const invisibleRectangle = new Konva.Rect({
            width: DIAGRAM_SIZE,
            height: DIAGRAM_SIZE,
            opacity: 0
        });
        const controls = new ControlsGroup(state);
        
        this._cognitiveFunctionsGroup = cogFunStackGroup;
        this._animalsGroup = animalStackGroup;
        this._controls = controls;
        
        
        // Add the groups in the right visual order.
        this.add(invisibleRectangle, animalStackGroup, cogFunCutoutsGroup, cogFunStackGroup, controls);
        
        // HERE Figure out how to avoid applying the tap if we've clicked a control circle.
        // Binding mouse/tap events.
        this.on('mouseenter', this.onMouseEnter);
        this.on('tap', this.onTapShow);
        this.on('mouseleave', this.onMouseLeave);
        
        
        // Binding Diagram Events.
        this.on(OpTypeChangeEvents.LETTER_SWITCH, (evt) => {
            this.onLetterSwitch(evt.details.grantOrder);
        });
        
        this.on(OpTypeChangeEvents.CHARGE_SWITCH, () => {
            this.onChargeSwitch();
        });
        
        this.on(OpTypeChangeEvents.MAIN_AXIS_SWITCH, () => {
            this.onMainAxisSwitch();
        });
        
        this.on(OpTypeChangeEvents.SET_ANIMAL_ORDER, (evt) => {
            this.onSetAnimalOrder(evt.details.animalPosition);
        });
    }
    
    
    
    onMouseEnter() {
        console.log("Mouse over.");
        this.onShowControls();
    }
    
    onMouseLeave() {
        console.log("Mouse out.");
        this.onHideControls();
    }
    
    
    onTapShow(evt) {
        console.log("Tap show.");
        this.onShowControls();
        this.off('tap');
        this.on('tap', this.onTapHide);
    }
    
    onTapHide(evt) {
        if (evt.target instanceof ControlCircle) return;
        console.log("Tap hide.");
        this.onHideControls();
        this.off('tap');
        this.on('tap', this.onTapShow);
    }
    
    
    
    onShowControls() {
        console.log("Show controls.");
        this._cognitiveFunctionsGroup.opacity(0.7);
        this._animalsGroup.opacity(0.7);
        this._controls.opacity(1);
    }
    
    
    onHideControls() {
        this._cognitiveFunctionsGroup.opacity(1);
        this._animalsGroup.opacity(1);
        this._controls.opacity(0);
    }
    
    
    
    /**
     *
     * @param grantOrder {number}
     */
    onLetterSwitch(grantOrder) {
        console.log("Letter switch.");
        this._opTypeState.switchLetter(grantOrder);
    }
    
    
    onChargeSwitch() {
        console.log("Charge switch.");
        this._opTypeState.switchCharge(0);
    }
    
    onMainAxisSwitch() {
        console.log("Main axis switch.");
        this._opTypeState.switchMainAxis()
    }
    
    onSetAnimalOrder(animalPosition) {
        console.log("Animal order set.");
        this._opTypeState.setAnimalOrder(animalPosition);
    }
    
    
    
    
}







class CognitiveFunctionGroup extends Konva.Group {
    #circle;
    
    
    /**
     * @param {ObservableCognitiveFunction} cogFunState
     */
    constructor(cogFunState) {
        super();
        
        const circle = new CognitiveFunctionCircle(cogFunState);
        this.#circle = circle;
        
        const demonBgImg = new DemonBackgroundImage(cogFunState, circle);
        const masculineBgImg = new MasculineBackgroundImage(cogFunState, circle);
        const text = new CognitiveFunctionText(cogFunState, circle);
        
        
        this.add(demonBgImg, masculineBgImg, /*outline,*/ circle, text);
    }
    
    
    get circle() {
        return this.#circle;
    }
}




class CognitiveFunctionCircle extends Konva.Circle {
    #grantScaleFactor;
    
    /**
     * @param {ObservableCognitiveFunction} observableCognitiveFunction
     */
    constructor(observableCognitiveFunction) {
        super({
            position: FunctionCirclePositions[observableCognitiveFunction.grantOrder],
            radius: CIRCLE_BASE_RADIUS,
            strokeWidth: CIRCLE_STROKE_WIDTH
        });
        
        this.#grantScaleFactor = FunctionCircleScaleFactors[observableCognitiveFunction.grantOrder];
        
        this.#updateDrawing(observableCognitiveFunction.state);
        
        observableCognitiveFunction.onUpdate(this.#updateDrawing);
    }
    
    
    
    /**
     *
     * @param cogFunState {CognitiveFunctionState}
     */
    #updateDrawing(cogFunState) {
        this.fill(CogFunFillColors[cogFunState.cognitiveFunction.coinLabel[0]]);
        this.stroke(CogFunStrokeColors[cogFunState.cognitiveFunction.coinLabel[0]]);
    
        const genericScaleFactor = cogFunState.grantOrder === 0 ? 1.05 : 1;
        
        // If not generic diagram use scaling, otherwise don't.
        this.scaleX(cogFunState.parentType.isUntouched ? genericScaleFactor : this.#grantScaleFactor);
        this.scaleY(cogFunState.parentType.isUntouched ? genericScaleFactor : this.#grantScaleFactor);
    }
}


// class CognitiveFunctionOutline extends CognitiveFunctionCircle {
//     /**
//      *
//      * @param {number} grantOrder
//      */
//     constructor(grantOrder) {
//         super(grantOrder);
//
//         this.radius(CIRCLE_BASE_RADIUS + 15);
//         this.fill('limegreen');
//     }
//
//     /**
//      *
//      * @param {Boolean} isSavior
//      */
//     updateSaviorState(isSavior) {
//         this.visible(isSavior);
//     }
// }



class CognitiveFunctionBackgroundImage extends Konva.Image {
    
    get _BASE_IMG_SCALE() { return 1; }
    
    
    
    // REM grantOrder might not be needed but we're keeping it anyway.
    /**
     *
     * @param {ObservableCognitiveFunction} cogFunState
     * @param {HTMLImageElement} img
     * @param {CognitiveFunctionCircle} circle
     */
    constructor(cogFunState, img, circle) {
        super();
        
        
        // Based on how the library is structured, img should always be loaded when reaching this point.
        this.image(img);
        // this.opacity(grantOrder !== 3 ? 0.3 : 1);
        this.position(circle.position());
        // Offset is applied before the scale, regardless of when it's called, so we need to use the original size.
        this.offsetX(this.width() / 2);
        this.offsetY(this.height() / 2);
        
        this._updateDrawing(cogFunState, circle);
        cogFunState.addEventListener('change', () => {
            this._updateDrawing(cogFunState, circle);
        });
    }
    
    
    
    /**
     *
     * @param {ObservableCognitiveFunction} cogFunState
     * @param {CognitiveFunctionCircle} circle
     * @protected
     */
    _updateDrawing(cogFunState, circle) {
        const scale = this._BASE_IMG_SCALE * circle.scaleX();
        this.scaleX(scale);
        this.scaleY(scale);
    }
}


class DemonBackgroundImage extends CognitiveFunctionBackgroundImage {
    get _BASE_IMG_SCALE() { return 0.4; }
    
    
    /**
     * @param {ObservableCognitiveFunction} cogFunState
     * @param {CognitiveFunctionCircle} circle
     */
    constructor(cogFunState, circle) {
        const img = cogFunState.grantOrder === 3 ?
            DiagramResources.BIG_DEMON_BG_IMG : DiagramResources.LITTLE_DEMON_BG_IMG;
        
        super(cogFunState, img, circle);
    
        this.#updateDrawing(cogFunState)
        cogFunState.addEventListener('change', () => {
            this.#updateDrawing(cogFunState);
        });
    }
    
    
    #updateDrawing(cogFunState) {
        this.visible(cogFunState.isDemon);
    }
}


class MasculineBackgroundImage extends CognitiveFunctionBackgroundImage {
    get _BASE_IMG_SCALE() {
        return 0.43;
    }
    
    /**
     * @param {ObservableCognitiveFunction} cogFunState
     * @param {CognitiveFunctionCircle} circle
     */
    constructor(cogFunState, circle) {
        super(cogFunState, DiagramResources.MASCULINE_FUNCTION_BG_IMG, circle);
        
        this.#updateDrawing(cogFunState)
        cogFunState.addEventListener(OpTypeChangeEvents.OP_TYPE_CHANGE, () => {
            this.#updateDrawing(cogFunState);
        });
    }
    
    
    #updateDrawing(cogFunState) {
        this.visible(cogFunState.isMasculine);
    }
}




class CognitiveFunctionText extends Konva.Text {
    
    /**
     * @param {ObservableCognitiveFunction} cogFunState
     * @param {CognitiveFunctionCircle} circle
     */
    constructor(cogFunState, circle) {
        super(
            {
                position: {
                    x: circle.getClientRect().x,
                    y: circle.getClientRect().y,
                },
                offset: {
                    x: -2 * circle.scaleY() + 1.3,
                    y: -4 * circle.scaleY()
                },
                height: circle.getClientRect().height,
                width: circle.getClientRect().width,
                
                align: 'center',
                verticalAlign: 'middle',
                
                fontFamily: 'Fira Code,Roboto Mono,Liberation Mono,Consolas,monospace',
                fontStyle: 'bold',
                fontSize: COGFUN_BASE_FONT_SIZE * circle.scaleY(),
                fill: 'white',
                stroke: 'black',
                strokeWidth: 2,
            }
        );
    
        
        this.#updateDrawing(cogFunState, circle)
        cogFunState.addEventListener("change", () => {
            this.#updateDrawing(cogFunState, circle)
        });
    }
    
    
    #updateDrawing(cogFunState, circle) {
        console.log(cogFunState.name);
        this.text(cogFunState.name);
        this.fontSize(COGFUN_BASE_FONT_SIZE * circle.scaleY());
    }
}



class AnimalGroup extends Konva.Group {
    /**
     *
     * @param {ObservableAnimal} animalState
     * @param {CognitiveFunctionCircle} circle1
     * @param {CognitiveFunctionCircle} circle2
     */
    constructor(animalState, circle1, circle2) {
        super();
        
        const bgTriangle = new AnimalBackgroundTriangle(animalState, circle1, circle2);
        const line = new AnimalLine(animalState, circle1, circle2);
        const letterText = new AnimalLetter(animalState);
        const orderText = new AnimalOrderNumber(animalState);
        
        
        this.add(bgTriangle, line, letterText, orderText);
    }
}




class AnimalBackgroundTriangle extends Konva.Line {
    
    /**
     *
     * @param {number} coord
     * @returns {number}
     */
    static #offsetCoordinate(coord) {
        switch (true) {
            case coord > DIAGRAM_CENTER:
                return coord - ANIMAL_BG_TRIANGLE_OFFSET;
            case coord < DIAGRAM_CENTER:
                return coord + ANIMAL_BG_TRIANGLE_OFFSET;
            default:
                return coord;
        }
    }
    
    /**
     *
     * @param {ObservableAnimal} animalState
     * @param {CognitiveFunctionCircle} circle1
     * @param {CognitiveFunctionCircle} circle2
     */
    constructor(animalState, circle1, circle2) {
        
        super({
            points: [
                AnimalBackgroundTriangle.#offsetCoordinate(circle1.x()),
                AnimalBackgroundTriangle.#offsetCoordinate(circle1.y()),
                
                AnimalBackgroundTriangle.#offsetCoordinate(circle2.x()),
                AnimalBackgroundTriangle.#offsetCoordinate(circle2.y()),
                
                DIAGRAM_CENTER,
                DIAGRAM_CENTER
            ],
            closed: true
        });
    
    
        this.#updateDrawing(animalState)
        animalState.addEventListener("change", () => {
            this.#updateDrawing(animalState)
        });
    }
    
    
    #updateDrawing(animalState) {
        this.visible(animalState.isSet);
    
        switch (animalState.stackOrder) {
            case 0:
                this.opacity(FIRST_ANIMAL_TRIANGLE_OPACITY);
                this.fill(SAVIOR_ANIMAL_TRIANGLE_COLOR);
                break;
            case 1:
                this.opacity(SECOND_ANIMAL_TRIANGLE_OPACITY);
                this.fill(SAVIOR_ANIMAL_TRIANGLE_COLOR);
                break;
            case 2:
                this.opacity(THIRD_ANIMAL_TRIANGLE_OPACITY);
                this.fill(DEMON_ANIMAL_TRIANGLE_COLOR);
                break;
            case 3:
                this.opacity(LAST_ANIMAL_TRIANGLE_OPACITY);
                this.fill(DEMON_ANIMAL_TRIANGLE_COLOR);
                break;
            default:
        }
    }
}

class AnimalLine extends Konva.Line {
    
    /**
     *
     * @param {ObservableAnimal} animalState
     * @param {CognitiveFunctionCircle} circle1
     * @param {CognitiveFunctionCircle} circle2
     */
    constructor(animalState, circle1, circle2) {
        
        super({
            points: [
                circle1.x(), circle1.y(),
                circle2.x(), circle2.y()
            ],
            stroke: 'black',
            strokeWidth: '5'
        });
        
        this.#updateDrawing(animalState)
        animalState.addEventListener('change', () => {
            this.#updateDrawing(animalState)
        });
    }
    
    
    #updateDrawing(animalState) {
        switch (animalState.stackOrder) {
            case 0:
                this.strokeWidth(FIRST_ANIMAL_STROKE_WIDTH);
                this.dashEnabled(false);
                this.opacity(1);
                break;
            case 1:
                this.strokeWidth(SECOND_ANIMAL_STROKE_WIDTH);
                this.dashEnabled(false);
                this.opacity(1);
                break;
            case 2:
                this.strokeWidth(THIRD_ANIMAL_STROKE_WIDTH);
                this.dash(THIRD_ANIMAL_DASH_PATTERN);
                this.dashEnabled(true);
                this.opacity(1);
                break;
            case 3:
                this.strokeWidth(LAST_ANIMAL_STROKE_WIDTH);
                this.dash(LAST_ANIMAL_DASH_PATTERN);
                this.dashEnabled(true);
                this.opacity(LAST_ANIMAL_LINE_OPACITY);
                break;
            default:
                this.strokeWidth(SECOND_ANIMAL_STROKE_WIDTH);
                this.dashEnabled(false);
                this.opacity(1);
        }
    }
}



class AnimalText extends Konva.Text {
    // noinspection JSMethodCanBeStatic
    /**
     * @returns {number}
     */
    get _INVISIBLE_TEXT_BOX_BASE_SIZE() { return 32; }
    
    /**
     *
     * @param {ObservableAnimal} animalState
     */
    constructor(animalState) {
        
        super(
            {
                x: DIAGRAM_CENTER,
                y: DIAGRAM_CENTER,
                
                fontSize: ANIMAL_LETTER_BASE_FONT_SIZE,
                fontFamily: 'Fira Code,Roboto Mono,Liberation Mono,Consolas,monospace',
                //fontStyle: 'bold',
                fill: 'black',
                stroke: 'black',
                strokeWidth: '1',
                strokeEnabled: false
            }
        );
        
        const baseSize = this._INVISIBLE_TEXT_BOX_BASE_SIZE;
        // The text is placed using an invisible text box and based on the position of the animal we align the text
        // to the correct corner. We then add or remove a bunch of pixels to the base box size to get a more symmetric
        // look.
        switch (animalState.animalPosition) {
            case AnimalGrantPosition.STRONGER_INFO:
                // baseWidth = baseSize - baseOff;
                // baseHeight = baseSize - baseOff;
                this.align('left');
                this.verticalAlign('top');
                break;
            case AnimalGrantPosition.STRONGER_ENERGY:
                // baseWidth = baseSize - baseOff;
                // baseHeight = baseSize - baseOff;
                this.align('right');
                this.verticalAlign('top');
                break;
            case AnimalGrantPosition.WEAKER_INFO:
                // baseWidth = baseSize - baseOff;
                // baseHeight = baseSize - baseOff;
                this.align('right');
                this.verticalAlign('bottom');
                break;
            case AnimalGrantPosition.WEAKER_ENERGY:
                // baseWidth = baseSize - baseOff;
                // baseHeight = baseSize - baseOff;
                this.align('left');
                this.verticalAlign('bottom');
                break;
            default:
                throw new Error("Invalid Animal Position.");
        }
        this.width(baseSize);
        this.height(baseSize + 12);
        
        this.offsetX(this.width() / 2);
        this.offsetY(this.height() / 2);
    }
    
    
    /**
     *
     * @param {string} text
     * @param {ObservableAnimal} animalState
     */
    _updateText(text, animalState) {
        this.visible(animalState.isSet);
        this.text(text);
        this.fontStyle(animalState.isDoubleActivated ? "bold" : "normal");
        this.strokeEnabled(animalState.isDoubleActivated);
        
        this.offsetX(this.width() / 2);
        this.offsetY(this.height() / 2);
    }
}



class AnimalLetter extends AnimalText {
    /**
     * @override
     * @returns {number}
     * @private
     */
    get _INVISIBLE_TEXT_BOX_BASE_SIZE() { return super._INVISIBLE_TEXT_BOX_BASE_SIZE + 50; }
    
    
    /**
     *
     * @param {ObservableAnimal} animalState
     */
    constructor(animalState) {
        super(animalState);
        
        this.#updateDrawing(animalState)
        animalState.addEventListener('change', () => {
            this.#updateDrawing(animalState)
        });
    }
    
    
    #updateDrawing(animalState) {
        const baseSize = this._INVISIBLE_TEXT_BOX_BASE_SIZE;
        let animalName = animalState.name
    
        if (animalState.stackOrder === 3) {
            animalName = `(${animalName})`;
            this.width(baseSize + 20);
        } else {
            this.width(baseSize);
        }
    
        super._updateText(animalName, animalState);
    }
}


class AnimalOrderNumber extends AnimalText {
    /**
     *
     * @param {ObservableAnimal} animalState
     */
    constructor(animalState) {
        super(animalState);
    
        this.#updateDrawing(animalState)
        animalState.addEventListener('change', () => {
            this.#updateDrawing(animalState)
        });
    }
    
    
    #updateDrawing(animalState) {
        super._updateText((animalState.stackOrder + 1).toString(), animalState);
    }
}



class ControlsGroup extends Konva.Group {
    /**
     *
     * @param opTypeState {OpTypeState}
     */
    constructor(opTypeState) {
        super({
            opacity: 0
        });
        
        // Adding controls for functions.
        const switchLetterControl1 = new SwitchLetterControl(opTypeState.getCogFunState(0));
        const switchLetterControl2 = new SwitchLetterControl(opTypeState.getCogFunState(1));
        const switchChargeControl = new SwitchChargeControl(opTypeState.getCogFunState(0));
        const switchAxisControl = new SwitchAxisControl(opTypeState.getCogFunState(0));
        
        this.add(switchLetterControl1, switchChargeControl, switchAxisControl, switchLetterControl2);
        
        // Adding controls for animals.
        for (const an of AnimalGrantPosition.All) this.add(new AnimalOrderControl(opTypeState.getObservableAnimal(an)));
    }
}



class ControlCircle extends Konva.Circle {
    // REM All controls extending this will bubble up the appropriate event from OpTypeStateEvents
    /**
     *
     * @param circleConfig {Object}
     */
    constructor(circleConfig) {
        super({
            radius: CONTROL_CIRCLE_BASE_RADIUS,
            fill: 'green',
            stroke: 'black'
        });
        
        this.setAttrs(circleConfig);
    }
}


class SwitchLetterControl extends ControlCircle {
    /**
     *
     * @param cogFunState {ObservableCognitiveFunction}
     */
    constructor(cogFunState) {
        const startingPosition = FunctionCirclePositions[cogFunState.grantOrder];
        
        super({
            x: startingPosition.x - CIRCLE_BASE_RADIUS,
            y: startingPosition.y
        });
        
        this.on('pointerclick', () => {
            this.fire(
                OpTypeChangeEvents.LETTER_SWITCH,
                {
                    details: {
                        grantOrder: cogFunState.grantOrder
                    }
                },
                true
            )
        });
    }
    
    // TODO Make it so that the circle shows the letter it can switch to, with some sort of switch symbol next to it.
}


class SwitchChargeControl extends ControlCircle {
    /**
     *
     * @param cogFunState {ObservableCognitiveFunction}
     */
    constructor(cogFunState) {
        const startingPosition = FunctionCirclePositions[cogFunState.grantOrder];
        
        super({
            x: startingPosition.x + CIRCLE_BASE_RADIUS,
            y: startingPosition.y
        });
        
        this.on('pointerclick', () => {
            this.fire(
                OpTypeChangeEvents.CHARGE_SWITCH,
                {
                    details: {
                    }
                },
                true
            )
        });
    }
    
    // TODO Same as the letter (read other TODO)
}


class SwitchAxisControl extends ControlCircle {
    
    /**
     *
     * @param cogFunState {ObservableCognitiveFunction}
     */
    constructor(cogFunState) {
        const c1Position = FunctionCirclePositions[0];
        
        super({
            x: c1Position.x,
            y: c1Position.y,
            offsetX: OPPOSITE_CIRCLE_DISTANCE/4 + 15,
            offsetY: -OPPOSITE_CIRCLE_DISTANCE/4 + 15
        });
        
        this.on('pointerclick', () => {
            this.fire(
                OpTypeChangeEvents.MAIN_AXIS_SWITCH,
                {
                    details: {
                    }
                },
                true
            )
        });
    }
    
    // TODO Make it so that the circle shows DOO or ODD
}


class AnimalOrderControl extends ControlCircle {
    /**
     *
     * @param animalState {ObservableAnimal}
     */
    constructor(animalState) {
        const startingPosition = DIAGRAM_CENTER;
        
        const offset = AnimalCenterOffsets.get(animalState.animalPosition);
        
        super({
            x: startingPosition,
            y: startingPosition,
            offset: offset
        });
        
        this.on('pointerclick', (evt) => {
            this.fire(
                OpTypeChangeEvents.SET_ANIMAL_ORDER,
                {
                    details: {
                        animalPosition: animalState.animalPosition
                    }
                },
                true
            )
        });
    }
    
    
    // TODO The circle shows what number the animal will be set to if clicked.
    //      After clicking the first one, a 'reset' button for animals will appear somewhere, and animals that already
    //      have an order set will not show their button.
    
}