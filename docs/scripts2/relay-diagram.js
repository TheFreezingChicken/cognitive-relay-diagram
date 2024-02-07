import {CognitiveFunction} from "./op-lib.js";

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
    O: 'white',
    D: 'white'
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




/**
 * @readonly
 * @class
 */
class AnimalPosition {
    // SLEEP Remove "buildInstance" and copy what we did for Quadra.
    
    static #Args = class Args {
        constructor(grantIndex1, grantIndex2) {
            this.grantIndex1 = grantIndex1;
            this.grantIndex2 = grantIndex2;
        }
    }
    
    static #_UPPER_INFO = this.#buildInstance(0, 1);
    
    static #_UPPER_ENERGY = this.#buildInstance(0, 2);
    
    static #_LOWER_INFO = this.#buildInstance(2, 3);
    
    static #_LOWER_ENERGY = this.#buildInstance(1, 3);
    
    
    /** @type {Readonly<AnimalPosition>} */
    static get UPPER_INFO() {
        return this.#_UPPER_INFO;
    }
    
    /** @type {Readonly<AnimalPosition>} */
    static get UPPER_ENERGY() {
        return this.#_UPPER_ENERGY;
    }
    
    /** @type {Readonly<AnimalPosition>} */
    static get LOWER_INFO() {
        return this.#_LOWER_INFO;
    }
    
    /** @type {Readonly<AnimalPosition>} */
    static get LOWER_ENERGY() {
        return this.#_LOWER_ENERGY;
    }
    
    
    static #all = Object.freeze([
        AnimalPosition.UPPER_INFO,
        AnimalPosition.UPPER_ENERGY,
        AnimalPosition.LOWER_INFO,
        AnimalPosition.LOWER_ENERGY
    ]);
    
    /**
     * @returns {Readonly<AnimalPosition>[]}
     */
    static get all() {
        return this.#all;
    }
    
    
    
    // SLEEP When we have an IDE that doesn't suck ass convert this to a static initializer.
    /**
     * @param grantIndex1 {number}
     * @param grantIndex2 {number}
     * @return {AnimalPosition}
     */
    static #buildInstance(grantIndex1, grantIndex2) {
        return new AnimalPosition(new this.#Args(grantIndex1, grantIndex2));
    }
    
    
    /**
     *
     * @param grantIndex1 {number}
     * @param grantIndex2 {number}
     * @return {AnimalPosition}
     */
    static getInstance(grantIndex1, grantIndex2) {
        /**
         * @param i {number}
         * @param name {string}
         */
        function checkIndex(i, name) {
            if (typeof i !== 'number') throw new TypeError(
                `${name} is not a number.`
            );
            
            if (!Number.isInteger(i)) throw new Error(
                `${name} is not an integer.`
            );
            
            if (i < 0 || i >= 4) throw new Error(`${name} is not between 0 and 3 (included).`);
        }
        
        checkIndex(grantIndex1, "Grant index 1");
        checkIndex(grantIndex2, "Grant index 2");
        
        if (grantIndex1 === grantIndex2) throw new Error("Grant indexes can't be the same.");
        
        // Return the appropriate immutable instance based on the provided indexes.
        switch (grantIndex1 + grantIndex2) {
            // 0 + 1.
            case 1:
                return this.#_UPPER_INFO;
            // 0 + 2.
            case 2:
                return this.#_UPPER_ENERGY;
            // 1 + 3.
            case 4:
                return this.#_LOWER_ENERGY;
            // 2 + 3.
            case 5:
                return this.#_LOWER_INFO;
            default:
                throw new Error("Invalid index couple (same axis not allowed).");
        }
    }
    
    
    /**
     *
     * @param args {AnimalPosition.Args}
     */
    constructor(args) {
        if (!(args instanceof AnimalPosition.#Args)) throw new Error(
            "Private constructor. Use static methods or properties to obtain instances."
        );
        
        this.grantIndex1 = args.grantIndex1;
        this.grantIndex2 = args.grantIndex2;
        
        Object.freeze(this);
    }
}



/**
 * @readonly
 * @enum {string}
 */
const DiagramEvents = Object.freeze({
    // Contains "grantOrder"
    LETTER_SWITCH: 'letterSwitch',
    CHARGE_SWITCH: 'chargeSwitch',
    MIDDLE_AXIS_SWITCH: 'middleAxisSwitch',
    MAKE_MASCULINE: 'makeMasculine',
    MODALITY_RESET: 'modalityReset',
    TYPE_RESET: 'typeReset'
});

class OpTypeState extends EventTarget {
    #cogFunStates;
    /** @type {Map} */
    #animalStates;
    
    constructor() {
        super();
        
        const cogFunStates = new Array(4);
        const animalStates = new Map();
        this.#cogFunStates = cogFunStates;
        this.#animalStates = animalStates;
    
        
        for (let i = 0; i < 4; i++) {
            cogFunStates[i] = new CognitiveFunctionState(this, i);
        }
    
        for (const ap of AnimalPosition.all) {
            animalStates.set(ap, new AnimalState(this, ap))
        }
    }
    
    
    // HERE Animals are updated according to each function update. Animal order is decided through clicking
    //      the triangles in the middle (clicking on a triangle that was already clicked makes the count start
    //      from the beginning).
    //      When animals are already set and a function gets changed, if the animal order is still valid it
    //      gets preserved. To achieve this more efficiently, I need an additional state stored separately
    //      for the animal itself rather than its position, and the position state is going to both listen and
    //      send user updates to that.
    //      for changes.
    
    /**
     * @param grantOrder {number}
     * @returns {CognitiveFunctionState}
     */
    getCogFunState(grantOrder) {
        return this.#cogFunStates[grantOrder];
    }
    
    /**
     * @param animalPosition {AnimalPosition}
     * @returns {AnimalState}
     */
    getAnimalState(animalPosition) {
        return this.#animalStates.get(animalPosition);
    }
}

class CognitiveFunctionState extends EventTarget {
    #grantOrder;
    /** @type {CognitiveFunction} */
    #cogFun;
    #isDemon;
    #isMasculine;
    
    /**
     * @param opTypeState {OpTypeState}
     * @param grantOrder {number}
     */
    constructor(opTypeState, grantOrder) {
        super();
        this.#grantOrder = grantOrder;
        
        switch (grantOrder) {
            case 0:
                this.#cogFun = new CognitiveFunction('N');
                break;
            case 1:
                this.#cogFun = new CognitiveFunction('T');
                break;
            case 2:
                this.#cogFun = new CognitiveFunction('F');
                break;
            case 3:
                this.#cogFun = new CognitiveFunction('S');
                break;
        }
        
        this.#isDemon = false;
        this.#isMasculine = false;
        
        if (devTest) this.#devInit()
    }
    
    
    #devInit() {
        switch (this.#grantOrder) {
            case 0:
                this.#cogFun = new CognitiveFunction('Fi');
                break
            case 1:
                this.#cogFun = new CognitiveFunction('Ne');
                break
            case 2:
                this.#cogFun = new CognitiveFunction('Si');
                break
            case 3:
                this.#cogFun = new CognitiveFunction('Te');
                break
        }
    }
    
    
    /**
     * @returns {number}
     */
    get grantOrder() {
        return this.#grantOrder;
    }
    
    /**
     * @returns {string}
     */
    get name() {
        return this.#cogFun.label;
    }
    
    /**
     * @returns {boolean}
     */
    get isDemon() {
        return this.#isDemon;
    }
    
    /**
     * @returns {boolean}
     */
    get isMasculine() {
        return this.#isMasculine;
    }
    
    
    update(cogFun, isDemon, isMasculine) {
        if (cogFun != null) this.#cogFun = cogFun;
        if (isDemon != null) this.#isDemon = isDemon;
        if (isMasculine != null) this.#isMasculine = isMasculine;
        this.notifyUi();
    }
    
    
    notifyUi() {
        this.dispatchEvent(new Event('change'));
    }
}


class AnimalState extends EventTarget {
    #diagramPosition;
    #isSet;
    #stackOrder;
    #name;
    #isDoubleActivated;
    
    /**
     * @param opTypeState {OpTypeState}
     * @param diagramPosition {AnimalPosition}
     */
    constructor(opTypeState, diagramPosition) {
        super();
        
        this.#diagramPosition = diagramPosition;
        
        this.#isSet = false;
        this.#stackOrder = -1;
        this.#name = "";
        this.#isDoubleActivated = false;
        
        //this.#devInit()
    }
    
    
    
    
    #devInit() {
        switch (this.#diagramPosition) {
            case AnimalPosition.UPPER_INFO:
                this.#name = 'C';
                this.#isSet = true;
                this.#stackOrder = 1;
                this.#isDoubleActivated = true;
                break;
            case AnimalPosition.UPPER_ENERGY:
                this.#name = 'P';
                this.#isSet = true;
                this.#stackOrder = 0;
                break;
            case AnimalPosition.LOWER_INFO:
                this.#name = 'B';
                this.#isSet = true;
                this.#stackOrder = 3;
                break;
            case AnimalPosition.LOWER_ENERGY:
                this.#name = 'S';
                this.#isSet = true;
                this.#stackOrder = 2;
                break;
            default:
                throw new Error("Invalid Animal Position");
        }
    }
    
    
    /**
     *
     * @returns {AnimalPosition}
     */
    get diagramPosition() {
        return this.#diagramPosition;
    }
    
    /**
     *
     * @returns {boolean}
     */
    get isSet() {
        return this.#isSet;
    }
    
    /**
     *
     * @returns {number}
     */
    get stackOrder() {
        return this.#stackOrder;
    }
    
    /**
     *
     * @returns {string}
     */
    get name() {
        return this.#name;
    }
    
    /**
     *
     * @returns {boolean}
     */
    get isDoubleActivated() {
        return this.#isDoubleActivated;
    }
}


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






export class LegendGroup extends Konva.Group {
    constructor() {
        throw Error("Not implemented.");
        super();
    }
}




export class RelayDiagramGroup extends Konva.Group {
    
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
        
        // Create group for the whole stack of functions and then create every single one of them and add them.
        const cogFunStackGroup = new Konva.Group();
        const cogFunCutoutsGroup = new Konva.Group({
            globalCompositeOperation: 'destination-out'
        });
        
        /** @type {CognitiveFunctionGroup[]} */
        const cogFunGroups = new Array(4);
        for (let i = 0; i < 4; i++) {
            const cfg = new CognitiveFunctionGroup(state.getCogFunState(i));
            
            cogFunGroups[i] = cfg;
            cogFunStackGroup.add(cfg);
            cogFunCutoutsGroup.add(new CognitiveFunctionCircle(state.getCogFunState(i)));
        }
    
        const animalStackGroup = new Konva.Group();
        // Do the same things for animals.
        // Iterating AnimalPositions (through property names) to create AnimalGroups.
        for (const ap of AnimalPosition.all) {
            console.log(ap)
            const circle1 = cogFunGroups[ap.grantIndex1].circle;
            const circle2 = cogFunGroups[ap.grantIndex2].circle;
            // noinspection JSCheckFunctionSignatures
            const ag = new AnimalGroup(
                state.getAnimalState(ap),
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
        
        // Binding mouse/tap events.
        this.on('mouseover tap', this.onMouseOver);
        this.on('mouseout', this.onMouseOut);
        
        
        // Binding Diagram Events.
        
        this.on(DiagramEvents.LETTER_SWITCH, (evt) => {
            this.onLetterSwitch(evt.details.grantOrder);
        });
        
        this.on(DiagramEvents.CHARGE_SWITCH, () => {
            this.onChargeSwitch();
        });
        
        this.on(DiagramEvents.MIDDLE_AXIS_SWITCH, () => {
            this.onMiddleAxisSwitch();
        });
        // REM Create custom event names in OpTypeStateEvents and make them bubble up when fired, so we can handle them here.
    }
    
    
    makeRetappable() {
        this.on('tap', this.onMouseOver);
    }
    
    onMouseOver() {
        this._cognitiveFunctionsGroup.opacity(0.7);
        this._animalsGroup.opacity(0.7);
        this._controls.opacity(1);
        // noinspection JSCheckFunctionSignatures (bad signature)
        this.off('tap');
    }
    
    
    onMouseOut() {
        this._cognitiveFunctionsGroup.opacity(1);
        this._animalsGroup.opacity(1);
        this._controls.opacity(0);
    }
    
    
    onTap() {
        this.onMouseOver();
    }
    
    
    /**
     *
     * @param grantOrder {number}
     */
    onLetterSwitch(grantOrder) {
        throw new Error("Not implemented yet.");
    }
    
    
    onChargeSwitch() {
    
    }
    
    onMiddleAxisSwitch() {
    
    }
}







class CognitiveFunctionGroup extends Konva.Group {
    #circle;
    
    
    /**
     * @param {CognitiveFunctionState} cogFunState
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


class CognitiveFunctionPointerCircle extends Konva.Circle {
    /**
     *
     * @param {CognitiveFunctionState} cogFunState
     * @param {CognitiveFunctionCircle} circle
     */
    constructor(cogFunState, circle) {
        super(circle.getAttrs());
        this.fill(null);
        this.stroke(null);
        this.opacity(0);
        
        switch (cogFunState.grantOrder) {
            case 0:
            case 3:
                // noinspection JSCheckFunctionSignatures
                this.fillPatternImage(DiagramResources.FUNCTION_POINTER_GRID_IMG);
                this.fillPatternOffsetX(-150);
                this.fillPatternOffsetY(-150);
                this.fillPatternScaleX(0.8);
                this.fillPatternScaleY(0.8);
                break;
            case 1:
                this.fillPatternImage(DiagramResources.FUNCTION_POINTER_ARROW_IMG);
                this.fillPatternOffsetX(-150);
                this.fillPatternOffsetY(-150);
                this.fillPatternScaleX(0.4);
                this.fillPatternScaleY(0.4);
                break;
            case 2:
                this.fillPatternImage(DiagramResources.FUNCTION_POINTER_ARROW_IMG);
                this.fillPatternOffsetX(-150);
                this.fillPatternOffsetY(-150);
                this.fillPatternScaleX(0.4);
                this.fillPatternScaleY(0.4);
                this.fillPatternRotation(180);
                break;
            
        }
    
        this.on('mouseover', () => {
            if (cogFunState.grantOrder === 0 || cogFunState.grantOrder === 3 || cogFunState.name.length > 1) this.opacity(0.85);
        });
        
        this.on('mouseout', () => {
            this.opacity(0);
        });
        
        this.on('click', () => {
            const pos = this.getRelativePointerPosition();
            console.log(pos);
            
            const isMainAxis = cogFunState.grantOrder === 0 || cogFunState.grantOrder === 3;
            
            if (isMainAxis) {
                switch (true) {
                    case pos.y < 0 && pos.x < 0:
                        cogFunState.previousLetter();
                        break;
                    case pos.y < 0 && pos.x > 0:
                        cogFunState.nextLetter();
                        break;
                    case pos.y > 0 && pos.x < 0:
                        cogFunState.makeExtroverted();
                        break;
                    case pos.y > 0 && pos.x > 0:
                        cogFunState.makeIntroverted();
                        break;
                }
            } else {
                if (cogFunState.name.length > 1) cogFunState.sameAxisOppositeLetter();
            }
        });
    }
}



class CognitiveFunctionCircle extends Konva.Circle {
    /**
     * @param {CognitiveFunctionState} cogFunState
     */
    constructor(cogFunState) {
        super({
            position: FunctionCirclePositions[cogFunState.grantOrder],
            radius: CIRCLE_BASE_RADIUS,
            strokeWidth: CIRCLE_STROKE_WIDTH
        });
        
        const scaleFactor = FunctionCircleScaleFactors[cogFunState.grantOrder];
        
        this.#updateDrawing(cogFunState, scaleFactor);
        
        cogFunState.addEventListener("change", () => {
            this.#updateDrawing(cogFunState, scaleFactor)
        });
        
    }
    
    #updateDrawing(cogFunState, scaleFactor) {
        this.fill(CogFunFillColors[cogFunState.name[0]]);
        this.stroke(CogFunStrokeColors[cogFunState.name[0]]);
    
        const genericScaleFactor = cogFunState.grantOrder === 0 ? 1.05 : 1;
        
        // If not generic diagram use scaling, otherwise don't.
        this.scaleX(cogFunState.name.length === 2 ? scaleFactor : genericScaleFactor);
        this.scaleY(cogFunState.name.length === 2 ? scaleFactor : genericScaleFactor);
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
    
    /**
     * @protected
     * @type {number}
     */
    get _IMG_SCALE() { return 1; }
    
    /**
     * Used as a multiplier on the _IMG_SCALE to stay proportional to the assigned circle.
     * @protected
     * @type {number}
     */
    #circleScale;
    
    /**
     * @protected
     * @returns {number}
     */
    get _BASE_SCALE() { return this._IMG_SCALE * this.#circleScale; }
    
    
    
    // REM grantOrder might not be needed but we're keeping it anyway.
    /**
     *
     * @param {CognitiveFunctionState} cogFunState
     * @param {HTMLImageElement} img
     * @param {CognitiveFunctionCircle} circle
     */
    constructor(cogFunState, img, circle) {
        super();
        
        this.#circleScale = circle.scaleX();
        
        // Based on how the library is structured, img should always be loaded when reaching this point.
        this.image(img);
        // this.opacity(grantOrder !== 3 ? 0.3 : 1);
        this.position(circle.position());
        // Offset is applied before the scale, regardless of when it's called, so we need to use the original size.
        this.offsetX(this.width() / 2);
        this.offsetY(this.height() / 2);
        
        this._applyCustomAttributes(circle, cogFunState.grantOrder);
    }
    
    
    
    /**
     *
     * @param {CognitiveFunctionCircle} circle
     * @param {number} grantOrder
     * @protected
     */
    _applyCustomAttributes(circle, grantOrder) {
        const baseScale = this._BASE_SCALE;
        this.scaleX(baseScale);
        this.scaleY(baseScale);
    }
}


class DemonBackgroundImage extends CognitiveFunctionBackgroundImage {
    get _IMG_SCALE() { return 0.4; }
    
    
    /**
     * @param {CognitiveFunctionState} cogFunState
     * @param {CognitiveFunctionCircle} circle
     */
    constructor(cogFunState, circle) {
        const img = cogFunState.grantOrder === 3 ?
            DiagramResources.BIG_DEMON_BG_IMG : DiagramResources.LITTLE_DEMON_BG_IMG;
        
        super(cogFunState, img, circle);
    
        this.#updateDrawing(cogFunState)
        cogFunState.addEventListener("change", () => {
            this.#updateDrawing(cogFunState)
        });
    }
    
    
    #updateDrawing(cogFunState) {
        this.visible(cogFunState.isDemon);
    }
}


class MasculineBackgroundImage extends CognitiveFunctionBackgroundImage {
    get _IMG_SCALE() {
        return 0.43;
    }
    
    /**
     * @param {CognitiveFunctionState} cogFunState
     * @param {CognitiveFunctionCircle} circle
     */
    constructor(cogFunState, circle) {
        super(cogFunState, DiagramResources.MASCULINE_FUNCTION_BG_IMG, circle);
        
        this.#updateDrawing(cogFunState)
        cogFunState.addEventListener(DiagramEvents.OP_TYPE_CHANGE, () => {
            this.#updateDrawing(cogFunState)
        });
    }
    
    
    #updateDrawing(cogFunState) {
        this.visible(cogFunState.isMasculine);
    }
}




class CognitiveFunctionText extends Konva.Text {
    
    /**
     * @param {CognitiveFunctionState} cogFunState
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
        // HERE Figure out why undefined by logging all around the places.
        this.text(cogFunState.name);
        this.fontSize(COGFUN_BASE_FONT_SIZE * circle.scaleY());
    }
}



class AnimalGroup extends Konva.Group {
    /**
     *
     * @param {AnimalState} animalState
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
     * @param {AnimalState} animalState
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
     * @param {AnimalState} animalState
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
     * @param {AnimalState} animalState
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
        switch (animalState.diagramPosition) {
            case AnimalPosition.UPPER_INFO:
                // baseWidth = baseSize - baseOff;
                // baseHeight = baseSize - baseOff;
                this.align('left');
                this.verticalAlign('top');
                break;
            case AnimalPosition.UPPER_ENERGY:
                // baseWidth = baseSize - baseOff;
                // baseHeight = baseSize - baseOff;
                this.align('right');
                this.verticalAlign('top');
                break;
            case AnimalPosition.LOWER_INFO:
                // baseWidth = baseSize - baseOff;
                // baseHeight = baseSize - baseOff;
                this.align('right');
                this.verticalAlign('bottom');
                break;
            case AnimalPosition.LOWER_ENERGY:
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
     * @param {AnimalState} animalState
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
     * @param {AnimalState} animalState
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
     * @param {AnimalState} animalState
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
        
        // HERE Make controls for Animals
        const switchLetterControl1 = new SwitchLetterControl(opTypeState.getCogFunState(0));
        const switchLetterControl2 = new SwitchLetterControl(opTypeState.getCogFunState(1));
        const switchChargeControl = new SwitchChargeControl(opTypeState.getCogFunState(0));
        const switchAxisControl = new SwitchAxisControl(opTypeState.getCogFunState(0));
        
        this.add(switchLetterControl1, switchChargeControl, switchAxisControl, switchLetterControl2);
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
     * @param cogFunState {CognitiveFunctionState}
     */
    constructor(cogFunState) {
        const startingPosition = FunctionCirclePositions[cogFunState.grantOrder];
        
        super({
            x: startingPosition.x - CIRCLE_BASE_RADIUS,
            y: startingPosition.y
        });
        
        this.on('pointerclick', () => {
            this.fire(
                DiagramEvents.LETTER_SWITCH,
                {
                    grantOrder: cogFunState.grantOrder
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
     * @param cogFunState {CognitiveFunctionState}
     */
    constructor(cogFunState) {
        const startingPosition = FunctionCirclePositions[cogFunState.grantOrder];
        
        super({
            x: startingPosition.x + CIRCLE_BASE_RADIUS,
            y: startingPosition.y
        });
        
        this.on('pointerclick', () => {
            this.fire(
                DiagramEvents.CHARGE_SWITCH,
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
     * @param cogFunState {CognitiveFunctionState}
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
                DiagramEvents.MIDDLE_AXIS_SWITCH,
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