import {AnimalGrantContext, GrantIndex, Letter, OpType} from "./op-lib.js";


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


const CogFunCirclePositions = Object.freeze([
    Object.freeze({
        x: DIAGRAM_CENTER,
        y: DIAGRAM_CENTER - OPPOSITE_CIRCLE_DISTANCE / 2
    }),
    Object.freeze({
        x: DIAGRAM_CENTER - OPPOSITE_CIRCLE_DISTANCE / 2,
        y: DIAGRAM_CENTER
    }),
    Object.freeze({
        x: DIAGRAM_CENTER + OPPOSITE_CIRCLE_DISTANCE / 2,
        y: DIAGRAM_CENTER
    }),
    Object.freeze({
        x: DIAGRAM_CENTER,
        y: DIAGRAM_CENTER + OPPOSITE_CIRCLE_DISTANCE / 2
    })
])



/**
 * @readonly
 */
const CogFunCircleScaleFactors = Object.freeze([
    1,
    0.81,
    0.65,
    0.48
]);


const AnimalCenterOffsets = new Map([
    [AnimalGrantContext.STRONGER_INFO, { x: 50, y: 50 }],
    [AnimalGrantContext.STRONGER_ENERGY, { x: -50, y: 50 }],
    [AnimalGrantContext.WEAKER_ENERGY, { x: 50, y: -50 }],
    [AnimalGrantContext.WEAKER_INFO, { x: -50, y: -50 }],
]);


const COGFUN_BASE_FONT_SIZE = 60;

const ANIMAL_LETTER_BASE_FONT_SIZE = 20;

const ANIMAL_LETTER_OFFSET_FROM_LINE = -15;

// Offset of the semi-transparent colored triangles from the lines.
const ANIMAL_BG_TRIANGLE_OFFSET = 17;

const FIRST_ANIMAL_STROKE_WIDTH = 5;
const THIRD_ANIMAL_STROKE_WIDTH = 2;
const LAST_ANIMAL_STROKE_WIDTH = 1;

const SECOND_ANIMAL_STROKE_WIDTH = 3;
const THIRD_ANIMAL_DASH_PATTERN = [10, 2];
const LAST_ANIMAL_DASH_PATTERN = [6, 17];

const SAVIOR_ANIMAL_TRIANGLE_COLOR = "green";
const DEMON_ANIMAL_TRIANGLE_COLOR = "red";

const FIRST_ANIMAL_TRIANGLE_OPACITY = 0.1;
const SECOND_ANIMAL_TRIANGLE_OPACITY = 0.05;
const THIRD_ANIMAL_TRIANGLE_OPACITY = 0.03;
const LAST_ANIMAL_TRIANGLE_OPACITY = 0.05;

const LAST_ANIMAL_LINE_OPACITY = 0.4;


const CONTROL_BUTTON_WIDTH = 300;


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


const IMG_DIR_PATH = './assets/img';

// REM Leave "new Image" in case we need to use different types of resources.
const DiagramResources = {
    BIG_DEMON_BG_IMG: new Image(),
    LITTLE_DEMON_BG_IMG: new Image(),
    MASCULINE_FUNCTION_BG_IMG: new Image(),
    FUNCTION_POINTER_GRID_IMG: new Image(),
    FUNCTION_POINTER_ARROW_IMG: new Image()
};


class ResourceLoader {
    /**
     * Asynchronously initializes all resources needed to render diagrams.
     * @returns {Promise<void>}
     */
    async initializeAsync() {
        console.log("Initializing resources...");
        /**
         * Return a promise which resolves when a single image is loaded or failed.
         * @param img {HTMLImageElement}
         * @param path {string}
         * @returns {Promise<void>}
         */
        const loadImg = (img, path) => {
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    img.onload = null;
                    img.onerror = null;
                    resolve();
                };
                img.onerror = () => {
                    img.onload = null;
                    img.onerror = null;
                    reject();
                };
                img.src = path;
            });
        };
        // User previous lambda to load all images concurrently.
        // When all are finished set library as ready. Returns the end Promise.
        return Promise.all([
            loadImg(DiagramResources.LITTLE_DEMON_BG_IMG, `${IMG_DIR_PATH}/Demon3.png`),
            loadImg(DiagramResources.BIG_DEMON_BG_IMG, `${IMG_DIR_PATH}/Demon4.png`),
            loadImg(DiagramResources.MASCULINE_FUNCTION_BG_IMG, `${IMG_DIR_PATH}/Muscles.png`),
            loadImg(DiagramResources.FUNCTION_POINTER_GRID_IMG, `${IMG_DIR_PATH}/pointer-grid.png`),
            loadImg(DiagramResources.FUNCTION_POINTER_ARROW_IMG, `${IMG_DIR_PATH}/blue-arrow.png`)
        ]).then(() => {
            // REM Add any other resource initialization here.
            console.log("Resources fully initialized.");
            isLibraryReady = true;
        });
    }
}


const diagramResources = new ResourceLoader();

class OpTypeManager {
    get opType() {
        return this._opType;
    }
    
    /**
     *
     * @param [startingOpType] {OpType}
     */
    constructor(startingOpType) {
        this._opType = startingOpType;
    }
    
    addListener(listener) {
        console.log("implement OpTypeManager.addListener");
    }
}


export class CRDStage extends Konva.Stage {
    /**
     * Simply calls [diagramResources.initializeAsync()]{@linkcode diagramResources#initializeAsync}.
     * @returns {Promise<void>}
     */
    static async initializeResources() {
        return diagramResources.initializeAsync();
    }
    
    
    /**
     *
     * @param diagramContainer {HTMLElement}
     * @param startingOpType {OpType}
     */
    constructor(diagramContainer, startingOpType) {
        console.log(`Constructing Stage with type ${startingOpType.toString()}`);
        
        if (!isLibraryReady)
            throw new Error("Library resources must be initialized before using diagrams.");
        
        super({
            container: diagramContainer.id,
            width: DIAGRAM_SIZE,
            height: DIAGRAM_SIZE
        });
        
        this.CenterPoint = {
            x: this.width() / 2,
            y: this.height() / 2
        };
        
        const opTypeManager = new OpTypeManager(startingOpType);
        
        this._diagramLayer = new DiagramLayer(opTypeManager);
        this.add(this._diagramLayer);
        
        this._controlLayer = new ControlLayer(opTypeManager);
        this.add(this._controlLayer);
    }
}


class DiagramLayer extends Konva.Layer {
    /**
     *
     * @param opTypeManager {OpTypeManager}
     */
    constructor(opTypeManager) {
        super();
        console.log(`Constructing diagram layer with type ${opTypeManager.opType.toString()}`)
        
        this.add(new DiagramGroup(opTypeManager.opType));
        
        // Add listener to reset (remove and re-add) diagram when OP type changes.
        opTypeManager.addListener((newOpType) => {
            this.removeChildren();
            this.add(new DiagramGroup(newOpType));
        });
    }
}


class DiagramGroup extends Konva.Group {
    constructor(opType) {
        super();
        // Create group for the whole stack of functions and then create every single one of them and add them.
        this._cogFunStackGroup = new CogFunStackGroup({opType: opType});
        this._animalStackGroup = new AnimalStackGroup({opType: opType});
        this.add(this._animalStackGroup, this._cogFunStackGroup);
    }
}




/**
 * @typedef CogFunStackConfigs
 * @property {OpType} [opType]
 */
function CogFunStackConfigs() {}


class CogFunStackGroup extends Konva.Group {
    static _getDefaultLetter(grantIndex) {
        GrantIndex.validate(grantIndex);
        
        switch (grantIndex) {
            case 0:
                return Letter.INTUITING;
            case 1:
                return Letter.THINKING;
            case 2:
                return Letter.FEELING;
            case 3:
                return Letter.SENSING;
        }
    }
    
    /**
     *
     * @param configs {CogFunStackConfigs}
     */
    constructor(configs) {
        super();
        
        this._cogFunGroups = new Array(4);
        
        for (let i = 0; i < 4; i++) {
            /**
             *
             * @type {CognitiveFunctionConfigs}
             */
            const cogFunConfigs = {
                cogFunData: configs.opType?.getCogFunData(i)
            };
            
            if (configs.opType == null) {
                cogFunConfigs.cogFunDataOverride = {
                    cogFunText: CogFunStackGroup._getDefaultLetter(i),
                    grantIndex: i
                }
            }
            
            
            const cfg = new CognitiveFunctionGroup(cogFunConfigs);
            this._cogFunGroups[i] = cfg;
            this.add(cfg);
        }
    }
}


/**
 * @typedef {Object} CogFunConfigsOverride
 *
 * @property {string} cogFunText
 * @property {number} grantIndex
 */


/**
 * Configurations for elements of {@link CognitiveFunctionGroup}
 *
 * @typedef {Object} CognitiveFunctionConfigs
 *
 * @property {OpTypeCogFunData} [cogFunData]
 * @property {CogFunConfigsOverride} [cogFunDataOverride]
 */


/**
 * @class
 */
class CognitiveFunctionGroup extends Konva.Group {
    
    /**
     *
     * @param configs {CognitiveFunctionConfigs}
     */
    constructor(configs) {
        super();
        
        this.circle = new CognitiveFunctionCircle(configs);
        
        const demonBgImg = new DemonBackgroundImage(configs);
        const masculineBgImg = new MasculineBackgroundImage(configs);
        const text = new CognitiveFunctionText(configs);
        
        this.add(demonBgImg, masculineBgImg, this.circle, text);
    }
}




class CognitiveFunctionCircle extends Konva.Circle {
    /**
     *
     * @param configs {CognitiveFunctionConfigs}
     */
    constructor(configs) {
        
        super({
            radius: CIRCLE_BASE_RADIUS,
            strokeWidth: CIRCLE_STROKE_WIDTH,
            x: CogFunCirclePositions[configs.cogFunData?.grantIndex ?? configs.cogFunDataOverride.grantIndex].x,
            y: CogFunCirclePositions[configs.cogFunData?.grantIndex ?? configs.cogFunDataOverride.grantIndex].y,
            fill: CogFunFillColors[configs.cogFunData?.cogFun[0] ?? configs.cogFunDataOverride.cogFunText],
            stroke: CogFunStrokeColors[configs.cogFunData?.cogFun[0] ?? configs.cogFunDataOverride.cogFunText],
        });
        
        // DEBT Assuming non-partial diagram, so it's generic only at first rendering.
        const isGenericDiagram = configs.cogFunData == null;
        
        // Making first function slightly bigger for generic because of optical illusion.
        const genericScaleFactor = configs.cogFunDataOverride?.grantIndex === 0 ? 1.05 : 1;
        const grantScaleFactor = CogFunCircleScaleFactors[configs.cogFunData?.grantIndex ?? 0];
        
        // If not generic diagram use scaling, otherwise don't.
        this.scaleX(isGenericDiagram ? genericScaleFactor : grantScaleFactor);
        this.scaleY(isGenericDiagram ? genericScaleFactor : grantScaleFactor);
    }
}


// HERE Keep fixing configs access.

class CognitiveFunctionBackgroundImage extends Konva.Image {
    /**
     *
     * @param img {HTMLImageElement}
     * @param configs {CognitiveFunctionConfigs}
     */
    constructor(img, configs) {
        // Based on how we structured the library, img should always be loaded when reaching this point.
        super({
            image: img
        });
        
        const pos = CogFunCirclePositions[configs.cogFunData?.grantIndex ?? configs.cogFunDataOverride.grantIndex];
        
        this.position(pos);
        this.offsetX(this.width() / 2);
        this.offsetY(this.height() / 2);
    }
}



class DemonBackgroundImage extends CognitiveFunctionBackgroundImage {
    /**
     *
     * @param configs {CognitiveFunctionConfigs}
     */
    constructor(configs) {
        const img = configs.cogFunData?.grantIndex === 3 ?
            DiagramResources.BIG_DEMON_BG_IMG :
            DiagramResources.LITTLE_DEMON_BG_IMG;
        
        super(img, configs);
        
        this.visible(!(configs.cogFunData?.isSavior ?? true));
        
        const CIRCLE_SCALE = CogFunCircleScaleFactors[configs.cogFunData?.grantIndex ?? 0];
        const IMG_SCALE_FACTOR = 0.4;
        this.scaleX(CIRCLE_SCALE * IMG_SCALE_FACTOR);
        this.scaleY(CIRCLE_SCALE * IMG_SCALE_FACTOR)
    }
}

class MasculineBackgroundImage extends CognitiveFunctionBackgroundImage {
    
    /**
     *
     * @param configs {CognitiveFunctionConfigs}
     */
    constructor(configs) {
        super(DiagramResources.MASCULINE_FUNCTION_BG_IMG, configs);
        
        this.visible(configs.cogFunData?.isMasculine ?? false);
        
        const CIRCLE_SCALE = CogFunCircleScaleFactors[configs.cogFunData?.grantIndex ?? 0];
        const IMG_SCALE_FACTOR = 0.43;
        this.scaleX(CIRCLE_SCALE * IMG_SCALE_FACTOR);
        this.scaleY(CIRCLE_SCALE * IMG_SCALE_FACTOR)
    }
}



class CognitiveFunctionText extends Konva.Text {
    /**
     *
     * @param configs {CognitiveFunctionConfigs}
     */
    constructor(configs) {
        console.log("Constructing CognitiveFunctionText with:");
        console.log(configs);
        const text = configs.cogFunData?.cogFun ?? configs.cogFunDataOverride.cogFunText;
        console.log(text);
        console.log();
        
        const pos = CogFunCirclePositions[configs.cogFunData?.grantIndex ?? configs.cogFunDataOverride.grantIndex];
        const scale = CogFunCircleScaleFactors[configs.cogFunData?.grantIndex ?? 0];
        
        super({
            position: pos,
            height: (CIRCLE_BASE_RADIUS + CIRCLE_STROKE_WIDTH) * 2,
            width: (CIRCLE_BASE_RADIUS + CIRCLE_STROKE_WIDTH) * 2,
            align: 'center',
            verticalAlign: 'middle',
            fontFamily: 'Fira Code, monospace',
            fontStyle: 'bold',
            fontSize: COGFUN_BASE_FONT_SIZE * scale,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 2,
        });
        
        
        const baseOffsetX = this.width() / 2;
        const baseOffsetY = this.height() / 2;
        // Adding a tiny delta to make the text look more centered.
        const visualCenterDeltaX = -0.95 * scale;
        const visualCenterDeltaY = -5 * scale;
        
        this.text(text);
        this.offsetX(baseOffsetX + visualCenterDeltaX);
        this.offsetY(baseOffsetY + visualCenterDeltaY);
    }
}






/**
 * @typedef {Object} AnimalStackConfigs
 * @property {OpType} opType
 */


/**
 * @class
 */
class AnimalStackGroup extends Konva.Group {
    
    /**
     *
     * @param configs {AnimalStackConfigs}
     */
    constructor(configs) {
        super();
        
        for (const animalContext of AnimalGrantContext.All) {
            console.log('Constructing animal stack group...')
            console.log(animalContext);
            console.log();
            
            /**
             *
             * @type {AnimalConfigs}
             */
            const animalConfigs = {
                animalData: configs.opType?.getAnimalData(animalContext)
            };
            
            if (configs.opType == null) {
                animalConfigs.animalDataOverride = {
                    grantIndexCouple: GrantIndex.animalCouple(animalContext)
                }
            }
            
            this.add(new AnimalGroup(animalConfigs));
        }
    }
}


/**
 * @typedef {Object} AnimalConfigsOverride
 *
 * @property {GrantIndex.Couple} grantIndexCouple
 */

/**
 * @typedef {Object} AnimalConfigs
 *
 * @property {OpTypeAnimalData} animalData
 * @property {AnimalConfigsOverride} animalDataOverride
 */


/**
 * @class
 */
class AnimalGroup extends Konva.Group {
    
    /**
     *
     * @param configs {AnimalConfigs}
     */
    constructor(configs) {
        super();
        
        const bgTriangle = new AnimalBackgroundTriangle(configs);
        const line = new AnimalLine(configs);
        const letterText = new AnimalLetter(configs);
        const orderText = new AnimalOrderNumber(configs);
        
        this.add(bgTriangle, line, letterText, orderText);
    }
}




class AnimalBackgroundTriangle extends Konva.Line {
    static offsetCoordinate(circleCoord, centerValue) {
        switch (true) {
            case circleCoord > centerValue:
                return circleCoord - ANIMAL_BG_TRIANGLE_OFFSET;
            case circleCoord < centerValue:
                return circleCoord + ANIMAL_BG_TRIANGLE_OFFSET;
            default:
                return circleCoord;
        }
    }
    
    /**
     *
     * @param configs {AnimalConfigs}
     */
    constructor(configs) {
        const biggerIndex = configs.animalData?.grantIndexCouple.strongerIndex ??
            configs.animalDataOverride.grantIndexCouple.strongerIndex;
        const smallerIndex = configs.animalData?.grantIndexCouple.weakerIndex ??
            configs.animalDataOverride.grantIndexCouple.weakerIndex;
        const biggerCirclePos = CogFunCirclePositions[biggerIndex];
        const smallerCirclePos = CogFunCirclePositions[smallerIndex];
        
        super({
            points: [
                AnimalBackgroundTriangle.offsetCoordinate(biggerCirclePos.x, DIAGRAM_CENTER),
                AnimalBackgroundTriangle.offsetCoordinate(biggerCirclePos.y, DIAGRAM_CENTER),
                AnimalBackgroundTriangle.offsetCoordinate(smallerCirclePos.x, DIAGRAM_CENTER),
                AnimalBackgroundTriangle.offsetCoordinate(smallerCirclePos.y, DIAGRAM_CENTER),
                DIAGRAM_CENTER,
                DIAGRAM_CENTER
            ],
            closed: true
        });
        
        
        switch (configs.animalData?.stackIndex) {
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
                this.visible(false);
        }
    }
}




class AnimalLine extends Konva.Line {
    
    /**
     *
     * @param configs {AnimalConfigs}
     */
    constructor(configs) {
        const biggerIndex = configs.animalData?.grantIndexCouple.strongerIndex ??
            configs.animalDataOverride.grantIndexCouple.strongerIndex;
        const smallerIndex = configs.animalData?.grantIndexCouple.weakerIndex ??
            configs.animalDataOverride.grantIndexCouple.weakerIndex;
        const biggerCirclePos = CogFunCirclePositions[biggerIndex];
        const smallerCirclePos = CogFunCirclePositions[smallerIndex];
        
        super({
            points: [
                biggerCirclePos.x, biggerCirclePos.y,
                smallerCirclePos.x, smallerCirclePos.y
            ],
            stroke: 'black',
            strokeWidth: 5
        });
        
        
        switch (configs.animalData?.stackIndex) {
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
    get _INVISIBLE_TEXT_BOX_BASE_SIZE() { return 32; }
    
    // HERE FIX Text is shown in the top left corner of the stage.
    
    /**
     *
     * @param configs {AnimalConfigs}
     * @param text {string}
     */
    constructor(configs, text) {
        super({
            fontSize: ANIMAL_LETTER_BASE_FONT_SIZE,
            fontFamily: 'Fira Code,Roboto Mono,Liberation Mono,Consolas,monospace',
            //fontStyle: 'bold',
            fill: 'black',
            stroke: 'black',
            strokeWidth: 1,
            strokeEnabled: false
        });
        
        this.position({
            x: DIAGRAM_CENTER,
            y: DIAGRAM_CENTER
        });
        const baseSize = this._INVISIBLE_TEXT_BOX_BASE_SIZE;
        
        // The text is placed using an invisible text box and based on the position of the animal we align the text
        // to the correct corner. We then add or remove a bunch of pixels to the base box size to get a more symmetric
        // look.
        switch (configs.animalData?.grantContext) {
            case AnimalGrantContext.STRONGER_INFO:
                this.align('left');
                this.verticalAlign('top');
                break;
            case AnimalGrantContext.STRONGER_ENERGY:
                this.align('right');
                this.verticalAlign('top');
                break;
            case AnimalGrantContext.WEAKER_INFO:
                this.align('right');
                this.verticalAlign('bottom');
                break;
            case AnimalGrantContext.WEAKER_ENERGY:
                this.align('left');
                this.verticalAlign('bottom');
                break;
            case null:
            case undefined:
                this.visible(false);
                break;
            default:
                throw new Error("Invalid Animal context.");
        }
        
        this.width(baseSize);
        this.height(baseSize + 12);
        
        this.text(text);
        
        this.fontStyle(configs.isDoubleActivated ? "bold" : "normal");
        this.strokeEnabled(configs.isDoubleActivated ?? false);
        
        this.offsetX(this.width() / 2);
        this.offsetY(this.height() / 2);
    }
}



class AnimalLetter extends AnimalText {
    get _INVISIBLE_TEXT_BOX_BASE_SIZE() { return super._INVISIBLE_TEXT_BOX_BASE_SIZE + 50; }
    
    
    /**
     *
     * @param configs {AnimalConfigs}
     */
    constructor(configs) {
        super(configs, configs.animalData?.animal ?? '');
        
        // CHECK If text shenanigans, try to uncomment this and the one below.
        //const baseSize = this._INVISIBLE_TEXT_BOX_BASE_SIZE;
        
        if (configs.animalData?.stackIndex === 3) {
            this.text(`(${configs.animalData.animal ?? ''})`);
            
            // Enlarging the width to have the alignment naturally pushing the text to the corner.
            this.width(this._INVISIBLE_TEXT_BOX_BASE_SIZE + 21);
            // Need to readjust the offset to recenter the invisible box and obtain the effect mentioned above.
            this.offsetX(this.width() / 2);
        }
        // else {
        //     this.width(baseSize);
        // }
    }
}



class AnimalOrderNumber extends AnimalText {
    
    /**
     *
     * @param configs {AnimalConfigs}
     */
    constructor(configs) {
        // DEBT Need to change this shit if we start using partial types.
        const text = configs.animalData?.stackIndex == null ? '' : (configs.animalData.stackIndex + 1).toString();
        super(configs, text);
    }
}





class ControlLayer extends Konva.Layer {
    constructor(opTypeManager) {
        super();
        this.hideControls();
        this.on('mouseenter', this.onMouseEnter);
        this.on('tap', this.onTapShow);
        this.on('mouseleave', this.onMouseLeave);
        this.add(new BackgroundColorRect(), new ControlPageManagerGroup(opTypeManager));
    }
    
    onMouseEnter() {
        console.log("Mouse enter.")
        this.showControls();
    }
    
    onTapShow() {
        console.log("Tap.");
        console.log("Showing controls.");
        this.showControls();
        this.off('tap');
        this.on('tap', this.onTapHide);
    }
    
    onTapHide(event) {
        console.log("Tap.");
        if (event.target instanceof ControlButton) return;
        
        console.log("Hiding controls.");
        this.hideControls();
        this.off('tap');
        this.on('tap', this.onTapShow);
    }
    
    onMouseLeave() {
        console.log("Mouse leave.")
        this.hideControls();
    }
    
    showControls() {
        this.opacity(1);
    }
    
    hideControls() {
        this.opacity(0);
    }
}



class BackgroundColorRect extends Konva.Rect {
    constructor() {
        super({
            position: {
                x: 0,
                y: 0
            },
            width: DIAGRAM_SIZE,
            height: DIAGRAM_SIZE,
            fill: 'grey',
            opacity: 0.8
        });
    }
}


class ControlPageManagerGroup extends Konva.Group {
    /**
     *
     * @param opTypeManager {OpTypeManager}
     */
    constructor(opTypeManager) {
        super();
        
        this._opTypeManager = opTypeManager;
        this.add(new ModalityChoicePageGroup(this, opTypeManager));
    }
    
    goToTemperamentChoice() {
        this.removeChildren();
        this.add(new TemperamentChoicePageGroup(this, this._opTypeManager));
    }
    
    goToFirstFunctionChoice() {
        this.removeChildren();
        this.add(new FirstFunctionChoicePageGroup(this, this._opTypeManager));
    }
    
    goToMiddleAxisChoice() {
        this.removeChildren();
        this.add(new MiddleAxisChoicePageGroup(this, this._opTypeManager));
    }
    
    goToSaviorAnimalsChoice() {
        this.removeChildren();
        this.add(new SaviorAnimalsChoicePageGroup(this, this._opTypeManager));
    }
    
    goToLastAnimalChoice() {
        this.removeChildren();
        this.add(new LastAnimalChoicePageGroup(this, this._opTypeManager));
    }
}


class ChoicePageGroup extends Konva.Group {
    /**
     *
     * @param leftButtons {ControlButton[]}
     * @param rightButtons {ControlButton[]}
     * @param [hasSkip] {boolean}
     */
    constructor(leftButtons, rightButtons, hasSkip) {
        super();
        
        // HERE Consider splitting the two groups below so that the page manager handles them separately (that way they should
        //      also be easier to position because the generic buttons can have a position independent of specific buttons)
        
        const specificButtonsGroup = new Konva.Group();
        const genericButtonsGroup = new Konva.Group();
        
        let yOffset = 0;
        for (const button of leftButtons) {
            button.x(0);
            button.y(yOffset);
            this.add(button);
            
            yOffset += button.height() - 50;
        }
        
        yOffset = 0;
        for (const button of leftButtons) {
            button.x(CONTROL_BUTTON_WIDTH + 100);
            button.y(yOffset);
            this.add(button);
            
            yOffset += button.height() - 50;
        }
    }
}



class ControlButton extends Konva.Rect {
    constructor() {
        super();
    }
}