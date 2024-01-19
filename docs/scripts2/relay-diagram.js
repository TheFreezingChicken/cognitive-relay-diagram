import {OpType} from "./op-lib.js";

let isLibraryReady = false;

// To change the base size of each circle (before scaling is applied).
const CIRCLE_BASE_RADIUS = 60;
// Multiplier applied to CIRCLE_BASE_RADIUS to get the width of each circle stroke.
const CIRCLE_STROKE_FACTOR = 0.15;
const CIRCLE_STROKE_WIDTH = CIRCLE_BASE_RADIUS * CIRCLE_STROKE_FACTOR;
// To change the distante between circles on the same "axis".
const OPPOSITE_CIRCLE_DISTANCE = 350;

export const DIAGRAM_SIZE = OPPOSITE_CIRCLE_DISTANCE + CIRCLE_BASE_RADIUS * 4;
const DIAGRAM_CENTER = DIAGRAM_SIZE / 2;


const COGFUN_BASE_FONT_SIZE = 58;
const ANIMAL_LETTER_BASE_FONT_SIZE = 20;
const ANIMAL_LETTER_OFFSET_FROM_LINE = -15;

const FIRST_GRANT_FUNCTION_SCALE_FACTOR = 1;
const SECOND_GRANT_FUNCTION_SCALE_FACTOR = 0.82;
const THIRD_GRANT_FUNCTION_SCALE_FACTOR = 0.68;
const LAST_GRANT_FUNCTION_SCALE_FACTOR = 0.53;

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




const TFCStyleColor = {
    FEELING_FILL: '#c82323',
    FEELING_STROKE: '#881a1a',
    THINKING_FILL: '#6c6c6c',
    THINKING_STROKE: '#292929',
    SENSING_FILL: '#f3ca24',
    SENSING_STROKE: '#c0912c',
    INTUITION_FILL: '#944cd2',
    INTUITION_STROKE: '#522c73',
}





const IMG_DIR_PATH = './img';

const DiagramResources = {
    BIG_DEMON_BG_IMG: new Image(),
    LITTLE_DEMON_BG_IMG: new Image(),
    MASCULINE_FUNCTION_BG_IMG: new Image()
}


class ResourceLoader {
    
    /**
     * Asynchronously initializes all resources needed to render diagrams.
     * @returns {Promise<undefined[]>}
     */
    async initializeAsync() {
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
            loadImg(DiagramResources.MASCULINE_FUNCTION_BG_IMG, `${IMG_DIR_PATH}/Muscles.png`)
        ]).then(() => { isLibraryReady = true });
    }
}

export const diagramResources = new ResourceLoader();


const AnimalPosition = Object.freeze({
    UPPER_INFO: 0,
    UPPER_ENERGY: 1,
    LOWER_INFO: 2,
    LOWER_ENERGY: 3
});


/**
 * @enum {string}
 */
const DiagramStateEvents = {
}

class DiagramGroupState extends EventTarget {
    /**
     * @type {OpType}
     */
    #opType;
    /**
     *
     * @returns {OpType}
     */
    get opType() { return this.#opType; }
    // TODO Remember to fire an event right after firing any change event, which will be used to drawWithInputs the diagram.
}

class CognitiveFunctionState extends EventTarget {
    /**
     * @returns {number}
     */
    get grantIndex() {
        throw new Error("Not implemented.");
    }
    
    /**
     * @returns {string}
     */
    get name() {
        throw new Error("Not implemented.");
    }
    
    /**
     * @returns {boolean}
     */
    get isDemon() {
        throw new Error("Not implemented.");
    }
    
    get isMasculine() {
        throw new Error("Not implemented.");
    }
}


class AnimalState extends EventTarget {
    get isSet() {
        throw new Error("Not implemented.");
    }
    
    get stackOrder() {
        throw new Error("Not implemented.");
    }
    
    get name() {
        throw new Error("Not implemented.");
    }
    
    get isDoubleActivated() {
        throw new Error("Not implemented.");
    }
    
    get diagramPosition() {
        throw new Error("Not implemented.");
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




export class MainRelayDiagram extends Konva.Group {
    
    /**
     * Simply calls [diagramResources.initializeAsync()]{@linkcode diagramResources#initializeAsync}.
     * @returns {Promise<undefined[]>}
     */
    async static initializeResources() {
        return diagramResources.initializeAsync();
    }
    
    
    
    constructor() {
        if (!isLibraryReady) throw Error("Library resources must be initialized before using diagrams.");
        
        super();
        
        const state = new DiagramGroupState();
        // HERE FIX Pass sub-states into the constructors of the visual elements.
        
        // Create group for the whole stack of functions and then create every single one of them and add them.
        const cogFunStackGroup = new Konva.Group();
        /** @type {CognitiveFunctionGroup[]} */
        const cogFunGroups = new Array(4);
        for (let grantIndex = 0; grantIndex < 4; grantIndex++) {
            const cfg = new CognitiveFunctionGroup(this, grantIndex);
            cogFunGroups[grantIndex] = cfg;
            cogFunStackGroup.add(cfg);
        }
        this.#cogFunGroups = cogFunGroups;
        
        // Do the same things for animals.
        const animalStackGroup = new Konva.Group();
        const animalGroups = [];
        // Iterating AnimalPositions (through property names) to create AnimalGroups.
        for (const ap of Object.values(AbsoluteAnimalPositions)) {
            const circle1 = cogFunGroups[ap.grantIdx1].circle;
            const circle2 = cogFunGroups[ap.grantIdx2].circle;
            const ag = new AnimalGroup(this, circle1, circle2, AbsoluteAnimalPositions[ap]);
            animalGroups.push(ag);
            animalStackGroup.add(ag);
        }
        this.#animalGroups = animalGroups;
        
        // Add the two stack-groups. Animals are visually below, so they're added first.
        this.add(animalStackGroup, cogFunStackGroup);
    }
}







class CognitiveFunctionGroup extends Konva.Group {
    
    /**
     * @param {CognitiveFunctionState} cogFunState
     */
    constructor(cogFunState) {
        super();
        
        const circle = new CognitiveFunctionCircle(cogFunState);
        const demonBgImg = new DemonBackgroundImage(cogFunState, circle);
        const masculineBgImg = new MasculineBackgroundImage(cogFunState, circle);
        const text = new CognitiveFunctionText(cogFunState);
        
        this.add(demonBgImg, masculineBgImg, /*outline,*/ circle, text);
    }
}



class CognitiveFunctionCircle extends Konva.Circle {
    /**
     * @param {CognitiveFunctionState} cogFunState
     */
    constructor(cogFunState) {
        let position;
        let scaleFactor;
    
        switch (cogFunState.grantIndex) {
            case 0:
                position = {
                    x: DIAGRAM_CENTER,
                    y: DIAGRAM_CENTER - OPPOSITE_CIRCLE_DISTANCE / 2
                };
                scaleFactor = FIRST_GRANT_FUNCTION_SCALE_FACTOR;
                break;
            case 1:
                position = {
                    x: DIAGRAM_CENTER - OPPOSITE_CIRCLE_DISTANCE / 2,
                    y: DIAGRAM_CENTER
                };
                scaleFactor = SECOND_GRANT_FUNCTION_SCALE_FACTOR;
                break;
            case 2:
                position = {
                    x: DIAGRAM_CENTER + OPPOSITE_CIRCLE_DISTANCE / 2,
                    y: DIAGRAM_CENTER
                };
                scaleFactor = THIRD_GRANT_FUNCTION_SCALE_FACTOR;
                break;
            case 3:
                position = {
                    x: DIAGRAM_CENTER,
                    y: DIAGRAM_CENTER + OPPOSITE_CIRCLE_DISTANCE / 2
                };
                scaleFactor = LAST_GRANT_FUNCTION_SCALE_FACTOR;
                break;
            default:
                throw new Error("Invalid Grant order.");
        }
        
        
        super({
            position: position,
            radius: CIRCLE_BASE_RADIUS,
            strokeWidth: CIRCLE_STROKE_WIDTH
        });
        
        
        cogFunState.addEventListener("change", () => {
            let fillColor;
            let strokeColor;
            // Select colors based on first character of function.
            switch (cogFunState.name[0]) {
                case 'F':
                    fillColor = TFCStyleColor.FEELING_FILL;
                    strokeColor = TFCStyleColor.FEELING_STROKE;
                    break;
                case 'T':
                    fillColor = TFCStyleColor.THINKING_FILL;
                    strokeColor = TFCStyleColor.THINKING_STROKE;
                    break;
                case 'S':
                    fillColor = TFCStyleColor.SENSING_FILL;
                    strokeColor = TFCStyleColor.SENSING_STROKE;
                    break;
                case 'N':
                    fillColor = TFCStyleColor.INTUITION_FILL;
                    strokeColor = TFCStyleColor.INTUITION_STROKE;
                    break;
                default:
                    fillColor = 'white';
                    strokeColor = 'black';
            }
    
            this.fill(fillColor);
            this.stroke(strokeColor);
    
            // If not generic diagram use scaling, otherwise don't.
            this.scaleX(cogFunState.name.length === 2 ? scaleFactor : 1);
            this.scaleY(cogFunState.name.length === 2 ? scaleFactor : 1);
        });
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


class DemonBackgroundImage extends CognitiveFunctionBackgroundImage {
    get _IMG_SCALE() { return 0.4; }
    
    
    /**
     * @param {CognitiveFunctionState} cogFunState
     * @param {CognitiveFunctionCircle} circle
     */
    constructor(cogFunState, circle) {
        const img = cogFunState.grantIndex === 3 ?
            DiagramResources.BIG_DEMON_BG_IMG : DiagramResources.LITTLE_DEMON_BG_IMG;
        
        super(cogFunState, img, circle);
        
        cogFunState.addEventListener("change", () => {
            this.visible(cogFunState.isDemon);
        });
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
        
        cogFunState.addEventListener(DiagramStateEvents.OP_TYPE_CHANGE, () => {
            this.visible(cogFunState.isMasculine);
        });
    }
}

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
    
        this._applyCustomAttributes(circle, cogFunState.grantIndex);
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
                    x: -2 * circle.scaleY(),
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
    
        
        cogFunState.addEventListener("change", () => {
            this.text(cogFunState.name);
        });
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
    
    
        animalState.addEventListener("change", () => {
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
        });
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
        
        this.#circle1 = circle1;
        this.#circle2 = circle2;
        
        animalState.addEventListener('change', () => {
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
        });
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
        
        animalState.addEventListener('change', () => {
            const baseSize = this._INVISIBLE_TEXT_BOX_BASE_SIZE;
            let animal = animalState.name
            
            if (animalState.stackOrder === 3) {
                animal = `(${animal})`;
                this.width(baseSize + 20);
            } else {
                this.width(baseSize);
            }
    
            super._updateText(animal, animalState.stackOrder, animalState.isDoubleActivated);
        });
    }
}


class AnimalOrderNumber extends AnimalText {
    /**
     *
     * @param {AnimalState} animalState
     */
    constructor(animalState) {
        super(animalState);
    
        animalState.addEventListener('change', () => {
            super._updateText(animalState.stackOrder + 1, animalState.stackOrder, animalState.isDoubleActivated);
        });
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
                this.align('left');
                this.verticalAlign('bottom');
                break;
            case AnimalPosition.LOWER_ENERGY:
                // baseWidth = baseSize - baseOff;
                // baseHeight = baseSize - baseOff;
                this.align('right');
                this.verticalAlign('bottom');
                break;
        }
        this.width(baseSize);
        this.height(baseSize + 12);
        
        this.offsetX(this.width() / 2);
        this.offsetY(this.height() / 2);
    }
    
    
    /**
     *
     * @param {string} text
     * @param {number} stackOrder
     * @param {Boolean} isDoubleActivated
     */
    _updateText(text, stackOrder, isDoubleActivated) {
        this.text(text);
        this.fontStyle(isDoubleActivated ? "bold" : "normal");
        this.strokeEnabled(isDoubleActivated);
        
        this.offsetX(this.width() / 2);
        this.offsetY(this.height() / 2);
    }
}





export const mainDiagramGroup = new MainRelayDiagram();