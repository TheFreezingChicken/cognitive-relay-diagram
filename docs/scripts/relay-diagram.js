import {OpType} from "./op-lib.js";

// Convention: every index follows the Grant stack positioning.
const CIRCLE_BASE_RADIUS = 60;
const CIRCLE_STROKE_FACTOR = 0.15;
const CIRCLE_STROKE_WIDTH = CIRCLE_BASE_RADIUS * CIRCLE_STROKE_FACTOR;
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
 * @enum {number}
 */
const AnimalPosition = {
    UPPER_LEFT: 0,
    UPPER_RIGHT: 1,
    LOWER_LEFT: 2,
    LOWER_RIGHT: 3
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

const BIG_DEMON_BG_IMG = new Image();
BIG_DEMON_BG_IMG.src = `${IMG_DIR_PATH}/Demon4.png`;

const LITTLE_DEMON_BG_IMG = new Image();
LITTLE_DEMON_BG_IMG.src = `${IMG_DIR_PATH}/Demon3.png`;

const MASCULINE_FUNCTION_BG_IMG = new Image();
MASCULINE_FUNCTION_BG_IMG.src = `${IMG_DIR_PATH}/Muscles.png`

/**
 *
 * @param {function(): void} listener
 */
export function addAllImgLoadEventListener(listener) {
    BIG_DEMON_BG_IMG.addEventListener('load', listener);
    MASCULINE_FUNCTION_BG_IMG.addEventListener('load', listener);
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



class CognitiveFunctionCircle extends Konva.Circle {
    /**
     *
     * @private
     * @type {number}
     */
    #grantOrder;
    
    
    /**
     * @param {number} grantOrder
     */
    constructor(grantOrder) {
        let position;
        let scaleFactor;
    
        switch (grantOrder) {
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
        
        
        this.#grantOrder = grantOrder;
    }
    
    
    /**
     *
     * @param {string} cogFun
     */
    updateCogFun(cogFun) {
    
        let fillColor;
        let strokeColor;
        switch (cogFun[0]) {
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
        }
        
        this.fill(fillColor);
        this.stroke(strokeColor);
    }
}


class CognitiveFunctionOutline extends CognitiveFunctionCircle {
    /**
     *
     * @param {number} grantOrder
     */
    constructor(grantOrder) {
        super(grantOrder);
        
        this.radius(CIRCLE_BASE_RADIUS + 15);
        this.fill('limegreen');
    }
    
    /**
     *
     * @param {Boolean} isSavior
     */
    updateSaviorState(isSavior) {
        this.visible(isSavior);
    }
}


class CognitiveFunctionBackgroundImage extends Konva.Image {
    
    /**
     * @protected
     * @type {number}
     */
    get _IMG_SCALE() { return 1; }
    
    /**
     * @protected
     * @type {number}
     */
    #circleScale;
    
    /**
     * @protected
     * @returns {number}
     */
    get _BASE_SCALE() { return this._IMG_SCALE * this.#circleScale; }
    
    
    
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
        this.#circleScale = circle.scaleX();
    
        this.image(img);
        // this.opacity(grantOrder !== 3 ? 0.3 : 1);
        // This crop removes the black border around the image.
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
     * @param {CognitiveFunctionCircle} circle
     * @param {number} grantOrder
     */
    constructor(circle, grantOrder) {
        const img = grantOrder === 3 ? BIG_DEMON_BG_IMG : LITTLE_DEMON_BG_IMG;
        
        super(img, circle, grantOrder);
    }
    
    
    updateDemonState(isDemon) {
        this.visible(isDemon);
    }
}


class MasculineBackgroundImage extends CognitiveFunctionBackgroundImage {
    get _IMG_SCALE() {
        return 0.43;
    }
    // HERE Make the muscles smaller (in PS).
    
    constructor(circle, grantOrder) {
        super(MASCULINE_FUNCTION_BG_IMG, circle, grantOrder);
    }
    
    
    updateMasculineState(isMasculine) {
        this.visible(isMasculine);
    }
}


class CognitiveFunctionText extends Konva.Text {
    #circle;
    
    /**
     *
     * @param {CognitiveFunctionCircle} circle
     */
    constructor(circle) {
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
    }
    
    
    
    updateCogFun(cogFun) {
        this.text(cogFun);
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
    #grantOrder;
    /**
     *
     * @returns {number}
     */
    get grantOrder () { return this.#grantOrder; }
    
    
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
     * @param {DiagramGroup} rootDiagramGroup
     * @param {number} grantOrder
     */
    constructor(rootDiagramGroup, grantOrder) {
        super();
    
        this.#grantOrder = grantOrder;
        
        
        const circle = new CognitiveFunctionCircle(grantOrder);
        this.#circle = circle;
        
        const outline = new CognitiveFunctionOutline(grantOrder);
        this.#outline = outline;
        
        const demonBgImg = new DemonBackgroundImage(circle, grantOrder);
        this.#demonBgImg = demonBgImg;
        
        const masculineBgImg = new MasculineBackgroundImage(circle,grantOrder);
        this.#masculineBgImg = masculineBgImg;
        
        const text = new CognitiveFunctionText(circle);
        this.#text = text;
        
        // addDemonImgLoadEventListener(() => {
        //     const debugRect = new DebugRect(demonBgImg.getClientRect());
        //     console.log(demonBgImg.getClientRect());
        //
        //     this.add(debugRect);
        // });
        
        
        this.add(demonBgImg, masculineBgImg, /*outline,*/ circle, text);
    }
    
    
    
    /**
     *
     * @param {OpType} opType
     */
    updateCogFun(opType) {
        const cogFun = opType.grantStack[this.#grantOrder];
        this.#cogFun = cogFun;
        
        const isSavior = opType.saviorFunctions.includes(cogFun);
        this.#demonBgImg.updateDemonState(!isSavior);
        this.#masculineBgImg.updateMasculineState(opType.masculineFunctions.includes(cogFun));
        this.#outline.updateSaviorState(isSavior);
        this.#circle.updateCogFun(cogFun);
        this.#text.updateCogFun(cogFun);
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
     *
     * @param {CognitiveFunctionGroup} cogFun1Group
     * @param {CognitiveFunctionGroup} cogFun2Group
     */
    constructor(cogFun1Group, cogFun2Group,) {
        const c1 = cogFun1Group.circle;
        const c2 = cogFun2Group.circle;
        
        
        
        super({
            points: [
                AnimalBackgroundTriangle.#offsetCoordinate(c1.x()), AnimalBackgroundTriangle.#offsetCoordinate(c1.y()),
                AnimalBackgroundTriangle.#offsetCoordinate(c2.x()), AnimalBackgroundTriangle.#offsetCoordinate(c2.y()),
                DIAGRAM_CENTER, DIAGRAM_CENTER
            ],
            closed: true
        });
    }
    
    
    /**
     *
     * @param {number} order
     */
    updateAnimalOrder(order) {
        switch (order) {
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
     *
     * @param {CognitiveFunctionCircle} circle1
     * @param {CognitiveFunctionCircle} circle2
     */
    constructor(circle1, circle2) {
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
    
    
    constructor(cogFun1Group, cogFun2Group, animalPosition) {
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


class AnimalOrderNumber extends AnimalText {}



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
    
    
    
    constructor(cogFun1Group, cogFun2Group) {
        super();
        
        this.#cogFun1Group = cogFun1Group;
        this.#cogFun2Group = cogFun2Group;
        
        let animalPosition;
        switch (`${cogFun1Group.grantOrder}${cogFun2Group.grantOrder}`) {
            case '01':
            case '10':
                animalPosition = AnimalPosition.UPPER_LEFT;
                break;
            case '02':
            case '20':
                animalPosition = AnimalPosition.UPPER_RIGHT;
                break
            case '13':
            case '31':
                animalPosition = AnimalPosition.LOWER_LEFT;
                break;
            case '23':
            case '32':
                animalPosition = AnimalPosition.LOWER_RIGHT;
                break
            default:
                throw new Error("Invalid group combinations or grant order.");
        }
        this.#animalPosition = animalPosition;
        
        const bgTriangle = new AnimalBackgroundTriangle(cogFun1Group, cogFun2Group);
        this.#backgroundTriangle = bgTriangle;
        
        const line = new AnimalLine(cogFun1Group.circle, cogFun2Group.circle);
        this.#line = line;
    
        const letterText = new AnimalLetter(cogFun1Group, cogFun2Group, animalPosition);
        this.#letterText = letterText;
        
        const orderText = new AnimalOrderNumber(cogFun1Group, cogFun2Group, animalPosition);
        this.#stackOrderText = orderText;
        
        
        this.add(bgTriangle, line, letterText, orderText);
    }
    
    
    updateAnimal(opType) {
        let animal;
        
        const cogFun1 = this.#cogFun1Group.cogFun;
        const cogFun2 = this.#cogFun2Group.cogFun;
        const isFirstGroupDecider = cogFun1[0].match("F|T");
        
        
        // Using introversion/extroversion letters to identify animal.
        switch (cogFun1[1] + cogFun2[1]) {
            case "ii":
                animal = "S";
                break;
            case "ee":
                animal = "P";
                break;
            // For the next two cases we need to check the first letter as well.
            case "ie":
                if (isFirstGroupDecider) animal = "C";
                else animal = "B";
                break;
            case "ei":
                if (isFirstGroupDecider) animal = "B";
                else animal = "C";
                break;
        }
        
        const isDoubleActivated = opType.doubleActivatedAnimal === animal;
        const stackOrder = opType.animalStack.indexOf(animal);
        this.#backgroundTriangle.updateAnimalOrder(stackOrder);
        this.#line.updateAnimalOrder(stackOrder);
        this.#letterText.updateText(animal, stackOrder, isDoubleActivated);
        this.#stackOrderText.updateText(stackOrder + 1, stackOrder, isDoubleActivated);
    }
}



class AnimalGroupsMatrix {
    /**
     * Clockwise Indexed Matrix for the animal groups.
     *
     * @private
     * @type {AnimalGroup[][]}
     */
    #aCwIdxMatrix;
    
    /**
     * Set containing all the animal groups instances.
     *
     * @private
     * @type {Set}
     */
    #aSet;
    
    
    /**
     *
     * @param {DiagramGroup} rootDiagramGroup
     */
    constructor(rootDiagramGroup) {
        const cwIdxMatrix = new Array(4);
        const aSet = new Set();
        
        for (let i = 0; i < 4; i++) {
            cwIdxMatrix[i] = new Array(4);
    
            for (let j = 0; j < 4; j++) {
                const clockwiseDistance = Math.abs(i - j);
                
                
                switch (true) {
                    // If the two functions are the same or opposite, skip.
                    case clockwiseDistance === 0 || clockwiseDistance === 2:
                        continue;
                    // Retrieve reference for function combinations that we already did.
                    case j < i:
                        cwIdxMatrix[i][j] = cwIdxMatrix[j][i];
                        break;
                    // Normal creation and assignment.
                    default:
                        const newGroup = new AnimalGroup(
                            rootDiagramGroup.getCogFunGroupClockwise(i),
                            rootDiagramGroup.getCogFunGroupClockwise(j)
                        );
                        
                        // Assign to correct matrix slot and also add to the Set.
                        aSet.add(cwIdxMatrix[i][j] = newGroup);
                }
            }
        }
        
        this.#aCwIdxMatrix = cwIdxMatrix;
        if (aSet.size > 4) throw new Error("Too many animal groups.");
        this.#aSet = aSet;
    }
    
    
    getGroup(index1, index2) {
        const result = this.#aCwIdxMatrix[index1][index2];
    }
    
    /**
     * @type {ReadonlySet}
     */
    get all () {
        // noinspection JSValidateTypes
        return this.#aSet
    }
}



export class DiagramGroup extends Konva.Group {
    /**
     * @private
     * @type {CognitiveFunctionGroup[]}
     */
    #cogFunGroups;
    /**
     *
     * @private
     * @type {AnimalGroupsMatrix}
     */
    #animalGroups;
    
    
    
    constructor() {
        super();
        
        const cogFunGroups = new Array(4);
        for (let grantOrder = 0; grantOrder < 4; grantOrder++) {
            cogFunGroups[grantOrder] = new CognitiveFunctionGroup(this, grantOrder);
        }
        this.#cogFunGroups = cogFunGroups;
        
        const animalGroups = new AnimalGroupsMatrix(this);
        this.#animalGroups = animalGroups;
        
        
        // Adding all animal groups.
        for (const ag of animalGroups.all) {
            this.add(ag);
        }
        
        // Adding all cognitive functions groups.
        for (const cfg of cogFunGroups) {
            this.add(cfg);
        }
    }
    
    
    
    getCogFunGroup(index) { return this.#cogFunGroups[index]; }
    
    
    getCogFunGroupClockwise(index) {
        switch (index) {
            case 0:
                return this.#cogFunGroups[0];
            case 3:
                return this.#cogFunGroups[1];
            case 1:
                return this.#cogFunGroups[2];
            case 2:
                return this.#cogFunGroups[3];
            default:
                throw new Error("Invalid index.");
        }
    }
    
    
    /**
     *
     * @param {OpType} opType
     */
    updateType(opType) {
        for (const cfg of this.#cogFunGroups) {
            cfg.updateCogFun(opType)
        }
        
        for (const ag of this.#animalGroups.all) {
            ag.updateAnimal(opType)
        }
    }
}


export class LegendGroup extends Konva.Group {}