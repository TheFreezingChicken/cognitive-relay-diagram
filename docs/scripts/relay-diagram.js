import {getAnimalLetter, OpType} from "./op-lib.js";

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


/**
 * @class
 */
class GrantIndexCouple {
    #idx1;
    #idx2;
    
    get grantIdx1() { return this.#idx1; }
    
    get grantIdx2() { return this.#idx2; }
    
    
    constructor(idx1, idx2) {
        this.#idx1 = idx1;
        this.#idx2 = idx2;
    }
}

/**
 * @readonly
 * @enum {GrantIndexCouple}
 */
const AnimalPosition = {
    UPPER_LEFT: new GrantIndexCouple(0, 1),
    UPPER_RIGHT: new GrantIndexCouple(0, 2),
    LOWER_LEFT: new GrantIndexCouple(3, 1),
    LOWER_RIGHT: new GrantIndexCouple(3, 2)
}


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


// HERE Checkout how Promises work before going on with this.
class ResourceLoader extends EventTarget {
    
    constructor() {
        super();
    }
    
    /**
     *
     * @param images {HTMLImageElement[]}
     * @param i {number}
     */
    #recursiveLoading(images, i) {
        images[i].addEventListener('load', () => {
        
        });
    }
    
    loadAllImages() {
        const resArray = Object.values(DiagramResources);
        this.#recursiveLoading(resArray, 0)
        
    }
}


/**
 * @enum {string}
 */
const DiagramStateEvents = {
    OP_TYPE_CHANGE: 'opTypeChange',
    DIAGRAM_SETTING_CHANGE: 'diagramSettingChange'
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

export const mainDiagramGroup = new MainRelayDiagram();

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



class CognitiveFunctionCircle extends Konva.Circle {
    /**
     *
     * @private
     * @type {number}
     */
    #grantIndex;
    
    
    /**
     * @param {MainRelayDiagram} rootDiagramGroup
     * @param {number} grantIndex
     */
    constructor(rootDiagramGroup, grantIndex) {
        let position;
        let scaleFactor;
    
        switch (grantIndex) {
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
            strokeWidth: CIRCLE_STROKE_WIDTH,
            scale: {
                x: scaleFactor,
                y: scaleFactor
            }
        });
        
        
        this.#grantIndex = grantIndex;
        
        const state = rootDiagramGroup.state;
        state.addEventListener(DiagramStateEvents.OP_TYPE_CHANGE, () => {
            let fillColor;
            let strokeColor;
            // Checking first character of the corresponding grant function.
            switch (state.opType?.grantStack[grantIndex][0]) {
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
     * @param {HTMLImageElement} img
     * @param {CognitiveFunctionCircle} circle
     * @param {number} grantOrder
     */
    constructor(img, circle, grantOrder) {
        super();
        
        this.#circleScale = circle.scaleX();
        
        img.addEventListener('load', () => {
            this.#onImgLoad(img, circle, grantOrder);
        });
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
    
    /**
     *
     * @param {HTMLImageElement} img
     * @param {CognitiveFunctionCircle} circle
     * @param {number} grantOrder
     */
    #onImgLoad(img, circle, grantOrder) {
        this.image(img);
        // this.opacity(grantOrder !== 3 ? 0.3 : 1);
        this.position(circle.position());
        // Offset is applied before the scale, regardless of when it's called, so we need to use the original size.
        this.offsetX(this.width() / 2);
        this.offsetY(this.height() / 2);
    
        this._applyCustomAttributes(circle, grantOrder);
    }
}


class DemonBackgroundImage extends CognitiveFunctionBackgroundImage {
    get _IMG_SCALE() { return 0.4; }
    
    
    /**
     *
     * @param {MainRelayDiagram} rootDiagramGroup
     * @param {CognitiveFunctionCircle} circle
     * @param {number} grantIndex
     */
    constructor(rootDiagramGroup, circle, grantIndex) {
        const img = grantIndex === 3 ? BIG_DEMON_BG_IMG : LITTLE_DEMON_BG_IMG;
        
        super(img, circle, grantIndex);
        
        const state = rootDiagramGroup.state;
        state.addEventListener(DiagramStateEvents.OP_TYPE_CHANGE, () => {
            const isSavior = state.opType?.isSaviorFunction(grantIndex);
            this.visible(!isSavior);
        });
    }
}


class MasculineBackgroundImage extends CognitiveFunctionBackgroundImage {
    get _IMG_SCALE() {
        return 0.43;
    }
    
    /**
     *
     * @param {MainRelayDiagram} rootDiagramGroup
     * @param {CognitiveFunctionCircle} circle
     * @param {number} grantIndex
     */
    constructor(rootDiagramGroup, circle, grantIndex) {
        super(MASCULINE_FUNCTION_BG_IMG, circle, grantIndex);
    
        const state = rootDiagramGroup.state;
        state.addEventListener(DiagramStateEvents.OP_TYPE_CHANGE, () => {
            const cogFun = state.opType.grantStack[grantIndex];
            const isMasculine = state.opType.masculineFunctions.includes(cogFun);
            this.visible(isMasculine);
        });
    }
}


class CognitiveFunctionText extends Konva.Text {
    #circle;
    
    /**
     *
     * @param {MainRelayDiagram} rootDiagramGroup
     * @param {CognitiveFunctionCircle} circle
     * @param {number} grantIndex
     */
    constructor(rootDiagramGroup, circle, grantIndex) {
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
        
        this.#circle = circle;
    
        const state = rootDiagramGroup.state;
        state.addEventListener(DiagramStateEvents.OP_TYPE_CHANGE, () => {
            const cogFun = state.opType.grantStack[grantIndex];
            this.text(cogFun);
        });
    }
}



class CognitiveFunctionGroup extends Konva.Group {
    /**
     * @type {CognitiveFunctionCircle}
     */
    #circle;
    /**
     *
     * @returns {CognitiveFunctionCircle}
     */
    get circle() { return this.#circle; }
    
    /**
     * @type {CognitiveFunctionOutline}
     */
    #outline;
    /**
     *
     * @returns {CognitiveFunctionOutline}
     */
    get outline() { return this.#outline; }
    
    /**
     * @type {DemonBackgroundImage}
     */
    #demonBgImg;
    /**
     *
     * @returns {DemonBackgroundImage}
     */
    get demonBgImg() { return this.#demonBgImg; }
    
    /**
     * @type {MasculineBackgroundImage}
     */
    #masculineBgImg;
    
    /**
     * @type {CognitiveFunctionText}
     */
    #text;
    /**
     *
     * @returns {CognitiveFunctionText}
     */
    get text () { return this.#text; }
    
    /**
     * @type {number}
     */
    #grantIndex;
    /**
     *
     * @returns {number}
     */
    get grantIndex () { return this.#grantIndex; }
    
    
    /**
     * @type {string}
     */
    #cogFun;
    /**
     *
     * @returns {string}
     */
    get cogFun() { return this.#cogFun; }
    
    /**
     * @param {MainRelayDiagram} rootDiagramGroup
     * @param {number} grantIndex
     */
    constructor(rootDiagramGroup, grantIndex) {
        super();
    
        this.#grantIndex = grantIndex;
        
        
        const circle = new CognitiveFunctionCircle(rootDiagramGroup, grantIndex);
        this.#circle = circle;
        
        // const outline = new CognitiveFunctionOutline(grantIndex);
        // this.#outline = outline;
        
        const demonBgImg = new DemonBackgroundImage(rootDiagramGroup, circle, grantIndex);
        this.#demonBgImg = demonBgImg;
        
        const masculineBgImg = new MasculineBackgroundImage(rootDiagramGroup, circle, grantIndex);
        this.#masculineBgImg = masculineBgImg;
        
        const text = new CognitiveFunctionText(rootDiagramGroup, circle, grantIndex);
        this.#text = text;
        
        
        this.add(demonBgImg, masculineBgImg, /*outline,*/ circle, text);
    }
}

// TODO Make all private fields use "#".


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
     * @param {MainRelayDiagram} rootDiagramGroup
     * @param {AnimalPosition} animalPosition
     */
    constructor(rootDiagramGroup, animalPosition) {
        const c1 = rootDiagramGroup.getCogFunGroup(animalPosition.grantIdx1).circle;
        const c2 = rootDiagramGroup.getCogFunGroup(animalPosition.grantIdx2).circle;
        
        super({
            points: [
                AnimalBackgroundTriangle.#offsetCoordinate(c1.x()), AnimalBackgroundTriangle.#offsetCoordinate(c1.y()),
                AnimalBackgroundTriangle.#offsetCoordinate(c2.x()), AnimalBackgroundTriangle.#offsetCoordinate(c2.y()),
                DIAGRAM_CENTER, DIAGRAM_CENTER
            ],
            closed: true
        });
    
    
        const state = rootDiagramGroup.state;
        state.addEventListener(DiagramStateEvents.OP_TYPE_CHANGE, () => {
            const cf1 = state.opType.grantStack[animalPosition.grantIdx1];
            const cf2 = state.opType.grantStack[animalPosition.grantIdx2];
            
            const animal = getAnimalLetter(cf1, cf2);
    
    
            switch (stackIndex) {
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
                    throw new Error("Invalid animal order.");
            }
        });
    }
    
    
}

class AnimalLine extends Konva.Line {
    /**
     * @type {CognitiveFunctionCircle}
     */
    #circle1;
    /**
     * @type {CognitiveFunctionCircle}
     */
    #circle2;
    
    /**
     * FIX
     * @param {CognitiveFunctionCircle} circle1
     * @param {CognitiveFunctionCircle} circle2
     */
    constructor(rootDiagram, animalPosition) {
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
    }
    
    
    updateAnimalOrder(order) {
        switch (order) {
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
                throw new Error("Invalid animal order.");
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
     * FIX
     * @param rootDiagram
     * @param animalPosition
     */
    constructor(rootDiagram, animalPosition) {
        const c1 = cogFun1Group.circle;
        const c2 = cogFun2Group.circle;
        
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
        switch (animalPosition) {
            case AnimalPosition.UPPER_LEFT:
                // baseWidth = baseSize - baseOff;
                // baseHeight = baseSize - baseOff;
                this.align('left');
                this.verticalAlign('top');
                break;
            case AnimalPosition.UPPER_RIGHT:
                // baseWidth = baseSize - baseOff;
                // baseHeight = baseSize - baseOff;
                this.align('right');
                this.verticalAlign('top');
                break;
            case AnimalPosition.LOWER_LEFT:
                // baseWidth = baseSize - baseOff;
                // baseHeight = baseSize - baseOff;
                this.align('left');
                this.verticalAlign('bottom');
                break;
            case AnimalPosition.LOWER_RIGHT:
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
    updateText(text, stackOrder, isDoubleActivated) {
        this.text(text);
        this.fontStyle(isDoubleActivated ? "bold" : "normal");
        this.strokeEnabled(isDoubleActivated);
    
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
    
    
    constructor(rootDiagram, animalPosition) {
        super(rootDiagram, animalPosition);
    }
    
    /**
     * @override
     * @param {string} animal
     * @param {number} stackOrder
     * @param {Boolean} isDoubleActivated
     */
    updateText(animal, stackOrder, isDoubleActivated) {
        const baseSize = this._INVISIBLE_TEXT_BOX_BASE_SIZE;
    
        if (stackOrder === 3) {
            animal = `(${animal})`;
            this.width(baseSize + 20);
        } else {
            this.width(baseSize);
        }
        
        super.updateText(animal, stackOrder, isDoubleActivated);
    }
}


class AnimalOrderNumber extends AnimalText {
    constructor(rootDiagram, animalPosition) {
        super(rootDiagram, animalPosition);
    }
}



class AnimalGroup extends Konva.Group {
    /**
     * @type {CognitiveFunctionGroup}
     */
    #cogFun1Group;
    
    /**
     * @type {CognitiveFunctionGroup}
     */
    #cogFun2Group;
    
    /**
     * @type {AnimalPosition}
     */
    #animalPosition;
    
    
    /**
     * @type {AnimalBackgroundTriangle}
     */
    #backgroundTriangle;
    
    /**
     * @type {AnimalLine}
     */
    #line;
    
    /**
     * @type {AnimalLetter}
     */
    #letterText;
    
    
    /**
     * @type {AnimalOrderNumber}
     */
    #stackOrderText;
    
    
    /**
     *
     * @param {MainRelayDiagram} rootDiagramGroup
     * @param {AnimalPosition} animalPosition
     */
    constructor(rootDiagramGroup, animalPosition) {
        super();
        
        this.#animalPosition = animalPosition;
    
        const bgTriangle = new AnimalBackgroundTriangle(rootDiagramGroup, animalPosition);
        this.#backgroundTriangle = bgTriangle;
        
        const line = new AnimalLine(rootDiagramGroup, animalPosition);
        this.#line = line;
    
        const letterText = new AnimalLetter(rootDiagramGroup, animalPosition);
        this.#letterText = letterText;
        
        const orderText = new AnimalOrderNumber(rootDiagramGroup, animalPosition);
        this.#stackOrderText = orderText;
        
        
        this.add(bgTriangle, line, letterText, orderText);
    }
}



export class MainRelayDiagram extends Konva.Group {
    static initializeResources() {
        BIG_DEMON_BG_IMG.src = `${IMG_DIR_PATH}/Demon4.png`;
        LITTLE_DEMON_BG_IMG.src = `${IMG_DIR_PATH}/Demon3.png`;
        MASCULINE_FUNCTION_BG_IMG.src = `${IMG_DIR_PATH}/Muscles.png`;
    }
    
    /**
     * @private
     * @type {CognitiveFunctionGroup[]}
     */
    #cogFunGroups;
    
    /**
     * @param {number} grantIdx
     * @returns {CognitiveFunctionGroup}
     */
    getCogFunGroup (grantIdx) { return this.#cogFunGroups[grantIdx]; }
    
    
    /**
     *
     * @private
     * @type {AnimalGroup[]}
     */
    #animalGroups;
    
    /**
     * @type {DiagramGroupState}
     */
    #state;
    /**
     * @returns {DiagramGroupState}
     */
    get state() { return this.#state; }
    
    
    
    constructor() {
        super();
        if (!isLibraryReady) throw Error("Library must be initialized before using diagrams.");
        
        this.#state = new DiagramGroupState();
        
        // Create group for the whole stack of functions and then create every single one of them and add them.
        const cogFunStackGroup = new Konva.Group();
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
        for (const ap in AnimalPosition) {
            const ag = new AnimalGroup(this, AnimalPosition[ap]);
            animalGroups.push(ag);
            animalStackGroup.add(ag);
        }
        this.#animalGroups = animalGroups;
        
        // Add the two stack-groups. Animals are visually below, so they're added first.
        this.add(animalStackGroup, cogFunStackGroup);
    }
}


export class LegendGroup extends Konva.Group {}