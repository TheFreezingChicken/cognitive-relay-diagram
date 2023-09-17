import {OpType} from "./op-lib.js";

// Convention: every index follows the Grant stack positioning.
const CIRCLE_BASE_RADIUS = 60;
const CIRCLE_STROKE_FACTOR = 0.2;
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


const FIRST_ANIMAL_STROKE_WIDTH = 15;
const SECOND_ANIMAL_STROKE_WIDTH = 4;
const THIRD_ANIMAL_STROKE_WIDTH = 2;
const THIRD_ANIMAL_DASH_PATTERN = [10, 2];
const LAST_ANIMAL_STROKE_WIDTH = 1;
const LAST_ANIMAL_DASH_PATTERN = [6, 17];

const FIRST_SAVIOR_ANIMAL_LINE_STROKE_COLOR = "#55c076";
const SAVIOR_ANIMAL_TRIANGLE_COLOR = "green";
const DEMON_ANIMAL_TRIANGLE_COLOR = "red";

const FIRST_ANIMAL_TRIANGLE_OPACITY = 0.1;
const SECOND_ANIMAL_TRIANGLE_OPACITY = 0.05;
const THIRD_ANIMAL_TRIANGLE_OPACITY = 0.03;
const LAST_ANIMAL_TRIANGLE_OPACITY = 0.05;

const LAST_ANIMAL_LINE_OPACITY = 0.4;

const TFCStyleColors = {
    FEELING_FILL: '#c82323',
    FEELING_STROKE: '#881a1a',
    THINKING_FILL: '#6c6c6c',
    THINKING_STROKE: '#292929',
    SENSING_FILL: '#f3ca24',
    SENSING_STROKE: '#c0912c',
    INTUITION_FILL: '#944cd2',
    INTUITION_STROKE: '#522c73',
}



class CognitiveFunctionCircle extends Konva.Circle {
    /**
     *
     * @private
     * @type {number}
     */
    _grantOrder;
    
    
    /**
     * @param grantOrder
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
        
        
        this._grantOrder = grantOrder;
    }
    
    
    getFillColor(cogFun) {
        let funChar = cogFun[0];
        
        let color;
        switch (funChar) {
            case 'F':
                color = TFCStyleColors.FEELING_FILL;
                break;
            case 'T':
                color = TFCStyleColors.THINKING_FILL;
                break;
            case 'S':
                color = TFCStyleColors.SENSING_FILL;
                break;
            case 'N':
                color = TFCStyleColors.INTUITION_FILL;
                break;
        }
        
        return color;
    }
    
    
    getStrokeColor(cogFun) {
        let funChar = cogFun[0];
        
        let color;
        switch (funChar) {
            case 'F':
                color = TFCStyleColors.FEELING_STROKE;
                break;
            case 'T':
                color = TFCStyleColors.THINKING_STROKE;
                break;
            case 'S':
                color = TFCStyleColors.SENSING_STROKE;
                break;
            case 'N':
                color = TFCStyleColors.INTUITION_STROKE;
                break;
        }
        
        return color;
    }
    
    
    
    updateCogFun(cogFun) {
        this.fill(this.getFillColor(cogFun));
        this.stroke(this.getStrokeColor(cogFun));
    }
}



class CognitiveFunctionText extends Konva.Text {
    _circle;
    
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
        
        this._circle = circle;
    }
    
    
    
    updateCogFun(cogFun) {
        this.text(cogFun);
    }
}



class CognitiveFunctionGroup extends Konva.Group {
    /**
     * @private
     * @type {CognitiveFunctionCircle}
     */
    _circle;
    get circle() { return this._circle; }
    
    /**
     * @private
     * @type {CognitiveFunctionText}
     */
    _text;
    get text () { return this._text; }
    
    /**
     *
     * @private
     * @type {number}
     */
    _grantOrder;
    get grantOrder () { return this._grantOrder; }
    
    /**
     *
     * @private
     * @type {string}
     */
    _cogFun;
    get cogFun() { return this._cogFun; }
    
    /**
     *
     * @param {DiagramGroup} rootDiagramGroup
     * @param {number} grantOrder
     */
    constructor(rootDiagramGroup, grantOrder) {
        super();
    
        this._grantOrder = grantOrder;
        // TODO Add background circle for savior-demon
        
        const circle = new CognitiveFunctionCircle(grantOrder);
        this._circle = circle;
        
        const text = new CognitiveFunctionText(circle);
        this._text = text;
        
        
        this.add(circle, text);
    }
    
    
    
    /**
     *
     * @param {OpType} opType
     */
    updateCogFun(opType) {
        const cogFun = opType.grantStack[this._grantOrder];
        this._cogFun = cogFun;
        
        this._circle.updateCogFun(cogFun);
        this._text.updateCogFun(cogFun);
    }
}


// HERE Figure out how to freaking offset both triangles (or make a single one).
class AnimalBackgroundTriangle extends Konva.Line {
    constructor(
        /*CognitiveFunctionGroup*/
        cogFun1Group,
        /*CognitiveFunctionGroup*/
        cogFun2Group,
        /*{x,y}*/
        diagramCenter
    ) {
        const c1 = cogFun1Group._circle;
        const c2 = cogFun2Group._circle;
        
        super({
            points: [
                c1.position(),
                c2.x(), c2.y(),
                diagramCenter.x, diagramCenter.y
            ],
            closed: true
        });
    }
    
    
    
    
    updateOrder(/*number*/order) {
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
        }
    }
}

class AnimalLine extends Konva.Line {
    cogFun1Group;
    cogFun2Group;
    
    constructor(group1, group2) {
        super({
            points: [
                group1._circle.x(), group1._circle.y(),
                group2._circle.x(), group2._circle.y()
            ],
            stroke: 'black',
            strokeWidth: '5'
        });
        
        this.cogFun1Group = group1;
        this.cogFun2Group = group2;
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
        }
    }
}


class AnimalText extends Konva.Text {
    static get _INVISIBLE_TEXT_BOX_SIZE() { return 50; }
    static get _INVISIBLE_TEXT_BOX_BASE_OFFSET() { return AnimalText._INVISIBLE_TEXT_BOX_SIZE / 2; }
    
    _diagramCenter;
    
    constructor(cogFun1Group, cogFun2Group, diagramCenter) {
        const c1 = cogFun1Group._circle;
        const c2 = cogFun2Group._circle;
        
        super(
            {
                x: (c1.x() + c2.x()) / 2,
                y: (c1.y() + c2.y()) / 2,
                width: AnimalText._INVISIBLE_TEXT_BOX_SIZE,
                height: AnimalText._INVISIBLE_TEXT_BOX_SIZE,
                offsetX: AnimalText._INVISIBLE_TEXT_BOX_BASE_OFFSET,
                offsetY: AnimalText._INVISIBLE_TEXT_BOX_BASE_OFFSET,
                
                fontSize: ANIMAL_LETTER_BASE_FONT_SIZE,
                fontFamily: 'Fira Code,Roboto Mono,Liberation Mono,Consolas,monospace',
                //fontStyle: 'bold',
                fill: 'black',
                stroke: 'black',
                strokeWidth: '1',
                strokeEnabled: false,
                
                align: 'center',
                verticalAlign: 'middle'
            }
        );
        
        this._diagramCenter = diagramCenter;
    }
    
    
    
    updateText(animal, order, isDoubleActivated) {
        this.text(order === 3 ? `(${animal})` : animal);
        this.fontStyle(isDoubleActivated ? "bold" : "normal");
        this.strokeEnabled(isDoubleActivated);
        const baseOffset = AnimalText._INVISIBLE_TEXT_BOX_BASE_OFFSET;
        const cX = this._diagramCenter.x;
        const cY = this._diagramCenter.y;
        const tX = this.x();
        const tY = this.y();
        
        let addedXOffset;
        let addedYOffset;
        switch (true) {
            // Top left
            case cX > tX && cY > tY:
                addedXOffset = -17;
                addedYOffset = -25;
                break;
            // Top right
            case cX < tX && cY > tY:
                addedXOffset = 17;
                addedYOffset = -25;
                break;
            // Bottom left
            case cX > tX && cY < tY:
                addedXOffset = -17;
                addedYOffset = 17;
                break;
            // Bottom right
            case cX < tX && cY < tY:
                addedXOffset = 17;
                addedYOffset = 17;
                break;
        }
        
        this.offsetX(baseOffset + addedXOffset);
        this.offsetY(baseOffset + addedYOffset);
    }
}


class AnimalGroup extends Konva.Group {
    /*AnimalBackgroundTriangle*/
    backgroundTriangle;
    line;
    text;
    cogFun1Group;
    cogFun2Group;
    
    constructor(cogFun1Group, cogFun2Group) {
        super();
    
        // HERE Fix with new arguments. And make properties private with public getter.
        
        const bgTriangle = new AnimalBackgroundTriangle(cogFun1Group, cogFun2Group, diagramCenter);
        const line = new AnimalLine(cogFun1Group, cogFun2Group);
        const text = new AnimalText(cogFun1Group, cogFun2Group, diagramCenter);
        
        this.add(bgTriangle, line, text);
        
        this.cogFun1Group = cogFun1Group;
        this.cogFun2Group = cogFun2Group;
    
        this.backgroundTriangle = bgTriangle;
        this.line = line;
        this.text = text;
    }
    
    
    updateAnimal(opType) {
        let animal;
        
        const cogFun1 = this.cogFun1Group.cogFun;
        const cogFun2 = this.cogFun2Group.cogFun;
        const isFirstGroupDecider = cogFun1[0].match(["F|T"]);
        
        
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
        const order = opType.animalStack.indexOf(animal);
        this.backgroundTriangle.updateOrder(order);
        this.line.updateAnimalOrder(order);
        this.text.updateText(animal, order, isDoubleActivated);
    }
}



class AnimalGroupsMatrix {
    /**
     * Clockwise Indexed Matrix for the animal groups.
     *
     * @private
     * @type {AnimalGroup[][]}
     */
    _aCwIdxMatrix;
    
    /**
     * Set containing all the animal groups instances.
     *
     * @private
     * @type {Set}
     */
    _aSet;
    
    
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
        
        this._aCwIdxMatrix = cwIdxMatrix;
        if (aSet.size > 4) throw new Error("Too many animal groups.");
        this._aSet = aSet;
    }
    
    
    getGroup(index1, index2) {
        const result = this._aCwIdxMatrix[index1][index2];
    }
    
    /**
     * @type {ReadonlySet}
     */
    get all () {
        // noinspection JSValidateTypes
        return this._aSet
    }
}



export class DiagramGroup extends Konva.Group {
    /**
     * @private
     * @type {CognitiveFunctionGroup[]}
     */
    _cogFunGroups;
    /**
     *
     * @private
     * @type {AnimalGroupsMatrix}
     */
    _animalGroups;
    
    
    
    constructor() {
        super();
        
        const cogFunGroups = new Array(4);
        for (let grantOrder = 0; grantOrder < 4; grantOrder++) {
            cogFunGroups[grantOrder] = new CognitiveFunctionGroup(this, grantOrder);
        }
        this._cogFunGroups = cogFunGroups;
        
        const animalGroups = new AnimalGroupsMatrix(this);
        this._animalGroups = animalGroups;
        
        
        // Adding all animal groups.
        for (const ag of animalGroups.all) {
            this.add(ag);
        }
        
        // Adding all cognitive functions groups.
        for (const cfg of cogFunGroups) {
            this.add(cfg);
        }
        
        this.add(Array.from(animalGroups.all));
        this.add(cogFunGroups);
    }
    
    
    
    getCogFunGroup(index) { return this._cogFunGroups[index]; }
    
    
    getCogFunGroupClockwise(index) {
        switch (index) {
            case 0:
                return this._cogFunGroups[0];
            case 3:
                return this._cogFunGroups[1];
            case 1:
                return this._cogFunGroups[2];
            case 2:
                return this._cogFunGroups[3];
            default:
                throw new Error("Invalid index.");
        }
    }
    
    
    /**
     *
     * @param {OpType} opType
     */
    updateType(opType) {
        for (const cfg of this._cogFunGroups) {
            cfg.updateCogFun(opType)
        }
        
        for (const ag of this._animalGroups.all) {
            ag.updateAnimal(opType)
        }
    }
}


export class LegendGroup extends Konva.Group {}