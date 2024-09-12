/*
 * Copyright © 2024, The Freezing Chicken
 * Licensed under CC BY-SA 4.0
 *
 * https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1
 */

import {Animal, AnimalGrantContext, Axis, Charge, CognitiveFunction, GrantIndex, Letter, Modality, OpType} from "./op-lib.js";


const devTest = false;
let isLibraryReady = false;

// Object properties constants.
const DENY_HIDE_CONTROL_PROPERTY = 'denyHideControl';
const DENY_SHOW_CONTROL_PROPERTY = 'denyShowControl'


// Size constants.

const CIRCLE_BASE_RADIUS = 55;
const CIRCLE_STROKE_FACTOR = 0.1;
const CIRCLE_STROKE_WIDTH = CIRCLE_BASE_RADIUS * CIRCLE_STROKE_FACTOR;

/**
 * @readonly
 */
const CogFunCircleScaleFactors = Object.freeze([
    1,
    0.81,
    0.65,
    0.48
]);

const FIRST_ANIMAL_STROKE_WIDTH = 5;
const SECOND_ANIMAL_STROKE_WIDTH = 3;
const THIRD_ANIMAL_STROKE_WIDTH = 2;
const LAST_ANIMAL_STROKE_WIDTH = 1;

const COGFUN_BASE_FONT_SIZE = 60;
const ANIMAL_LABEL_FONT_SIZE = 20;
const BUTTON_FONT_SIZE = 55;



// Distance constants.

const OPPOSITE_CIRCLE_DISTANCE = 320;
export const DIAGRAM_SIZE = OPPOSITE_CIRCLE_DISTANCE + CIRCLE_BASE_RADIUS * 4;
const DIAGRAM_CENTER = DIAGRAM_SIZE / 2;

const ANIMAL_X2_OFFSET_FROM_LINE = 25;
const ANIMAL_BG_TRIANGLE_OFFSET = 17;

const BUTTON_VERTICAL_GAP = 50;
const CHOICE_PAGE_TOP_MARGIN = 70;
const GLOBAL_BUTTON_HEIGHT = 70;


// Position constants.

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
]);


const CogFunCircleOffsets = Object.freeze([
    Object.freeze({
        x: 0,
        y: -OPPOSITE_CIRCLE_DISTANCE / 2
    }),
    Object.freeze({
        x: -OPPOSITE_CIRCLE_DISTANCE / 2,
        y: 0
    }),
    Object.freeze({
        x: OPPOSITE_CIRCLE_DISTANCE / 2,
        y: 0
    }),
    Object.freeze({
        x: 0,
        y: OPPOSITE_CIRCLE_DISTANCE / 2
    })
]);



const AnimalCenterOffsets = new Map([
    [AnimalGrantContext.STRONGER_INFO, { x: 50, y: 50 }],
    [AnimalGrantContext.STRONGER_ENERGY, { x: -50, y: 50 }],
    [AnimalGrantContext.WEAKER_ENERGY, { x: 50, y: -50 }],
    [AnimalGrantContext.WEAKER_INFO, { x: -50, y: -50 }],
]);


// Style and Color constants.

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

const THIRD_ANIMAL_DASH_PATTERN = [10, 2];
const LAST_ANIMAL_DASH_PATTERN = [6, 17];

const FIRST_SAVIOR_ANIMAL_TRIANGLE_COLOR = '#e5f2e5';
const SECOND_SAVIOR_ANIMAL_TRIANGLE_COLOR = '#ebf5eb';
const THIRD_ANIMAL_TRIANGLE_COLOR = '#fff6e5';
const LAST_ANIMAL_TRIANGLE_COLOR = '#ffe5e5';
// const FIRST_SAVIOR_ANIMAL_TRIANGLE_COLOR = 'green';
// const SECOND_SAVIOR_ANIMAL_TRIANGLE_COLOR = 'green';
// const THIRD_ANIMAL_TRIANGLE_COLOR = 'orange';
// const LAST_ANIMAL_TRIANGLE_COLOR = 'red';

// REM Keep this even if not used, as it's easier to try other colors through transparency.
const FIRST_ANIMAL_TRIANGLE_OPACITY = 0.1;
const SECOND_ANIMAL_TRIANGLE_OPACITY = 0.08;
const THIRD_ANIMAL_TRIANGLE_OPACITY = 0.1;
const LAST_ANIMAL_TRIANGLE_OPACITY = 0.1;

const LAST_ANIMAL_LINE_OPACITY = 0.4;


// Resource Management

const IMG_DIR_PATH = './assets/img';

// REM Leave "new Image" in case we need to use different types of resources.
const DiagramResources = {
    BIG_ANGEL_BG_IMG: new Image(),
    LITTLE_ANGEL_BG_IMG: new Image(),
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
            loadImg(DiagramResources.BIG_ANGEL_BG_IMG, `${IMG_DIR_PATH}/angel-wings-1.png`),
            loadImg(DiagramResources.LITTLE_ANGEL_BG_IMG, `${IMG_DIR_PATH}/small-angel.png`),
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



// Start of Diagram code


class OpTypeManager {
    _opType;
    /**
     *
     * @private
     * @type {OpTypeChangeListener[]}
     */
    _listeners;
    
    /**
     *
     * @return {OpType|null|undefined}
     */
    get opType() {
        return this._opType;
    }
    
    /**
     *
     * @param [startingOpType] {OpType}
     */
    constructor(startingOpType) {
        this._listeners = [];
        this._opType = startingOpType;
    }
    
    /**
     * @callback OpTypeChangeListener
     * @param {OpType} opType
     */
    
    
    /**
     *
     * @param listener {OpTypeChangeListener}
     */
    addListener(listener) {
        this._listeners.push(listener);
    }
    
    //DEBT For now we don't need a "removeListener" method. Implement if needed to avoid leaks.
    
    
    reset() {
        this._opType = null;
        this._fireChange();
    }
    
    _fireChange() {
        for (const listener of this._listeners) {
            listener(this._opType);
        }
    }
    
    
    /**
     * 
     * @param opType {OpType}
     */
    update(opType) {
        if (!(opType instanceof OpType)) throw new Error("Not an OpType.");
        
        this._opType = opType;
        this._fireChange()
    }
}


export class CRDStage extends Konva.Stage {
    _controlLayer;
    _diagramLayer;
    _hideControlsGlobalCallback;
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
     * @param [startingOpType] {OpType}
     */
    constructor(diagramContainer, startingOpType) {
        console.log(`Constructing Stage with type ${startingOpType?.toString()}`);
        
        if (!isLibraryReady)
            throw new Error("Library resources must be initialized before using diagrams.");
        
        super({
            container: diagramContainer.id,
            width: DIAGRAM_SIZE,
            height: DIAGRAM_SIZE
        });
        
        const opTypeManager = new OpTypeManager(startingOpType);
        
        this._diagramLayer = new DiagramLayer(opTypeManager);
        this.add(this._diagramLayer);
        
        this._controlLayer = new ControlLayer(this, opTypeManager);
        this.add(this._controlLayer);
        
        this._hideControls();
        this._hideControlsGlobalCallback = (evt) => {
            console.log('Document click.');
            if (evt?.target instanceof HTMLCanvasElement) return;
            
            this._hideControls(evt);
        };
        
        opTypeManager.addListener(() => {
            this._hideControls();
        });
    }
    
    
    _showControls(evt) {
        if (evt?.target[DENY_SHOW_CONTROL_PROPERTY] ?? false) return;
        if (evt?.target instanceof CRDStage) return;
        
        this._controlLayer.visible(true);
        // noinspection JSCheckFunctionSignatures || Lies.
        this.off('click tap');
        setTimeout(() => {
            console.log('Listening to whole document for clicks.')
            
            document.addEventListener('click', this._hideControlsGlobalCallback);
            this.on('click tap', this._hideControls)
        }, 400);
    }
    
    _hideControls(evt) {
        console.log("Target:");
        console.log(evt?.target);
        if (evt?.target[DENY_HIDE_CONTROL_PROPERTY] ?? false) return;
        
        // noinspection JSCheckFunctionSignatures || Lies.
        document.removeEventListener('click', this._hideControlsGlobalCallback);
        this.off('click tap');
        setTimeout(() => {
            this.on('click tap', this._showControls);
        }, 400);
        this._controlLayer.visible(false);
    }
    
    
}


class DiagramLayer extends Konva.Layer {
    /**
     *
     * @param opTypeManager {OpTypeManager}
     */
    constructor(opTypeManager) {
        super();
        
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
        console.log(`Constructing new diagram with type ${opType?.toString()}`)
        // Create group for the whole stack of functions and then create every single one of them and add them.
        this._cogFunStackGroup = new CogFunStackGroup({opType: opType});
        this._animalStackGroup = new AnimalStackGroup({opType: opType});
        
        const whiteBg = new Konva.Rect({
            width: DIAGRAM_SIZE + 10,
            height: DIAGRAM_SIZE + 10,
            x: -5,
            y: -5,
            fill: 'white'
        });
        
        whiteBg[DENY_SHOW_CONTROL_PROPERTY] = true;
        
        this.add(whiteBg, this._animalStackGroup, this._cogFunStackGroup);
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
        
        const saviorBgImg = new SaviorBackgroundImage(configs);
        const demonBgImg = new DemonBackgroundImage(configs);
        const masculineBgImg = new MasculineBackgroundImage(configs);
        const cogFunText = new CognitiveFunctionText(configs);
        // const doubleActivationText = new DoubleActivationText(configs);
        
        this.add(saviorBgImg, demonBgImg, masculineBgImg, this.circle, cogFunText/*, doubleActivationText*/);
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
        const genericScaleFactor = configs.cogFunDataOverride?.grantIndex === 0 ? 1.075 : 1;
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


class SaviorBackgroundImage extends CognitiveFunctionBackgroundImage {
    /**
     *
     * @param configs {CognitiveFunctionConfigs}
     */
    constructor(configs) {
        const grantIndex = configs.cogFunData?.grantIndex;
        const img = grantIndex === 0 ?
            DiagramResources.BIG_ANGEL_BG_IMG :
            DiagramResources.LITTLE_ANGEL_BG_IMG;
        
        super(img, configs);
        
        this.visible(configs.cogFunData?.isSavior ?? false);
        
        const CIRCLE_SCALE = CogFunCircleScaleFactors[configs.cogFunData?.grantIndex ?? 0];
        const IMG_SCALE_FACTOR = grantIndex === 0 ? 0.4 : 0.42;
        this.scaleX(CIRCLE_SCALE * IMG_SCALE_FACTOR);
        this.scaleY(CIRCLE_SCALE * IMG_SCALE_FACTOR);
        this.offsetY(grantIndex === 0 ? 190 : 183);
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
        const IMG_SCALE_FACTOR = 0.35;
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
        const IMG_SCALE_FACTOR = 0.37;
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




// class DoubleActivationText extends Konva.Text {
//     /**
//      *
//      * @param configs {CognitiveFunctionConfigs}
//      */
//     constructor(configs) {
//
//         const pos = CogFunCirclePositions[configs.cogFunData?.grantIndex ?? configs.cogFunDataOverride.grantIndex];
//         const scale = CogFunCircleScaleFactors[configs.cogFunData?.grantIndex ?? 0];
//
//         super({
//             position: pos,
//             height: CIRCLE_BASE_RADIUS + CIRCLE_STROKE_WIDTH,
//             width: (CIRCLE_BASE_RADIUS + CIRCLE_STROKE_WIDTH) * 2,
//             align: 'center',
//             verticalAlign: 'middle',
//             fontFamily: 'Fira Code, monospace',
//             fontStyle: 'bold',
//             fontSize: COGFUN_BASE_FONT_SIZE * 0.7 * scale,
//             fill: 'white',
//             stroke: 'black',
//             strokeWidth: 2,
//             text: 'x2'
//         });
//
//         const baseOffsetX = this.width() / 2;
//         const baseOffsetY = this.height() / 2;
//         // Adding a tiny delta to make the text look more centered.
//         const visualCenterDeltaX = -0.95 * scale;
//         const visualCenterDeltaY = -5 * scale;
//
//         this.offsetX(baseOffsetX + visualCenterDeltaX);
//         this.offsetY(baseOffsetY + visualCenterDeltaY - (CIRCLE_BASE_RADIUS + CIRCLE_STROKE_WIDTH - 15) * scale);
//
//         this.visible(true);
//     }
//
// }





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
        const doubleActivationText = new AnimalDoubleActivationText(configs);
        
        this.add(bgTriangle, line, letterText, orderText, doubleActivationText);
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
        const biggerIndex = configs.animalData?.grantIndexCouple?.strongerIndex ??
            configs.animalDataOverride.grantIndexCouple.strongerIndex;
        const smallerIndex = configs.animalData?.grantIndexCouple?.weakerIndex ??
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
                // this.opacity(FIRST_ANIMAL_TRIANGLE_OPACITY);
                this.fill(FIRST_SAVIOR_ANIMAL_TRIANGLE_COLOR);
                break;
            case 1:
                // this.opacity(SECOND_ANIMAL_TRIANGLE_OPACITY);
                this.fill(SECOND_SAVIOR_ANIMAL_TRIANGLE_COLOR);
                break;
            case 2:
                // this.opacity(THIRD_ANIMAL_TRIANGLE_OPACITY);
                this.fill(THIRD_ANIMAL_TRIANGLE_COLOR);
                break;
            case 3:
                // this.opacity(LAST_ANIMAL_TRIANGLE_OPACITY);
                this.fill(LAST_ANIMAL_TRIANGLE_COLOR);
                break;
            default:
                this.visible(false);
        }
        
        this[DENY_SHOW_CONTROL_PROPERTY] = true;
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


class AnimalDoubleActivationText extends Konva.Text {
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
        
        const rightMostX = Math.max(smallerCirclePos.x, biggerCirclePos.x);
        const leftMostX = Math.min(smallerCirclePos.x, biggerCirclePos.x);
        
        super({
            x: rightMostX - (rightMostX - leftMostX) / 2,
            y: smallerCirclePos.y - (smallerCirclePos.y - biggerCirclePos.y) / 2,
            fontFamily: 'Fira Code, monospace',
            fontSize: ANIMAL_LABEL_FONT_SIZE * 1.2,
            fontStyle: 'bold',
            text: 'x2',
            fill: 'black',
            // stroke: 'black',
            // strokeWidth: 1,
            strokeEnabled: true
        });
        
        this.visible(configs.animalData?.isDoubleActivated ?? false);
        if (configs.animalData == null) return;
        
        const indexes = [
            configs.animalData.grantIndexCouple.weakerIndex,
            configs.animalData.grantIndexCouple.strongerIndex
        ];
        
        const xOffsetFromLine = indexes.includes(1) ? ANIMAL_X2_OFFSET_FROM_LINE : -ANIMAL_X2_OFFSET_FROM_LINE;
        const yOffsetFromLine = indexes.includes(0) ? ANIMAL_X2_OFFSET_FROM_LINE * 0.5 : -ANIMAL_X2_OFFSET_FROM_LINE;
        this.offsetX(this.getClientRect().width / 2 + xOffsetFromLine);
        this.offsetY(this.getClientRect().height / 2 + yOffsetFromLine);
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
            fontSize: ANIMAL_LABEL_FONT_SIZE,
            fontFamily: 'Fira Code,monospace',
            //fontStyle: 'bold',
            fill: 'black',
        });
        
        this[DENY_SHOW_CONTROL_PROPERTY] = true;
        
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
        
        this.fontStyle(configs.animalData?.isDoubleActivated ? "bold" : "normal");
        
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
    constructor(stage, opTypeManager) {
        super();
        
        this.add(new BackgroundColorRect(), new ControlPageManagerGroup(opTypeManager));
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
    /** @type {OpTypeManager} */
    _opTypeManager;
    
    _modalityPage;
    _temperamentPage;
    
    _modality;
    _firstFunction;
    _secondGrantFunction;
    _saviorAnimals;
    _demonAnimals;
    
    _selectionButtonsGroup;
    _navigationButtonsGroup;
    
    /**
     * @type {ChoicePageGroup[]}
     * @private
     */
    _previousPages;
    /**
     * @type {ChoicePageGroup}
     * @private
     */
    _currentPage;
    
    /**
     * @type {ControlButtonGroup}
     * @private
     */
    _skipModalityButton;
    _backButton;
    _clearButton;
    
    
    /**
     *
     * @param opTypeManager {OpTypeManager}
     */
    constructor(opTypeManager) {
        super();
        
        this._opTypeManager = opTypeManager;
        this._previousPages = [];
        
        const selectionButtonsGroup = new Konva.Group();
        const navigationButtonsGroup = new Konva.Group();
        this._selectionButtonsGroup = selectionButtonsGroup;
        this._navigationButtonsGroup = navigationButtonsGroup;

        const NAVIGATION_BUTTON_WIDTH = 230;
        const NAVIGATION_BUTTON_HEIGHT = GLOBAL_BUTTON_HEIGHT;
        
        let button;
        // DEBT Might need to make this more generic if we're implementing partial types.
        button = new ControlButtonGroup({
            size: {width: NAVIGATION_BUTTON_WIDTH - 90, height: NAVIGATION_BUTTON_HEIGHT},
            text: "Skip",
            onClick: () => {
                this._hideSkipButton();
                this._showBackButton();
                this._swapPage(this._temperamentPage);
                this._modality = null;
            }
        });
        button.offsetX(-DIAGRAM_SIZE / 2 + button.getClientRect().width / 2);
        button.offsetY(-DIAGRAM_SIZE / 2 - 50);
        this._skipModalityButton = button;
        
        
        button = new ControlButtonGroup({
            size: {width: NAVIGATION_BUTTON_WIDTH, height: NAVIGATION_BUTTON_HEIGHT},
            text: "⇦ Back",
            onClick: () => {
                selectionButtonsGroup.removeChildren();
                this._currentPage = this._previousPages.pop();
                if (this._previousPages.length === 0) this._hideBackButton();
                if (this._currentPage instanceof ModalityChoicePageGroup) this._showSkipButton();
                selectionButtonsGroup.add(this._currentPage);
            }
        });
        button.offsetX(5);
        button.offsetY(-DIAGRAM_SIZE + button.getClientRect().height - 8);
        button.visible(false);
        this._backButton = button;
        
        
        button = new ControlButtonGroup({
            size: {width: NAVIGATION_BUTTON_WIDTH - 30, height: NAVIGATION_BUTTON_HEIGHT},
            text: "Reset",
            onClick: () => {
                this._clear(true)
            }
        });
        button.offsetX(-DIAGRAM_SIZE + button.getClientRect().width - 5);
        button.offsetY(-DIAGRAM_SIZE + button.getClientRect().height - 8);
        this._clearButton = button;
        
        
        // Modality and Temperament pages are always the same, we don't need builders.
        
        this._modalityPage = new ModalityChoicePageGroup((modality) => {
            this._modality = modality;
            this._hideSkipButton();
            this._showBackButton()
            this._swapPage(this._temperamentPage);
        });
        this._currentPage = this._modalityPage;
        
        this._temperamentPage = new TemperamentChoicePageGroup((temperament) => {
            this._swapPage(this._buildFirstFunctionPage(temperament));
        });
        
        
        selectionButtonsGroup.add(this._modalityPage);
        navigationButtonsGroup.add(this._backButton, this._skipModalityButton, this._clearButton);
        
        this.add(selectionButtonsGroup, navigationButtonsGroup);
    }
    
    
    
    /**
     *
     * @param page {ChoicePageGroup}
     * @private
     */
    _swapPage(page) {
        this._selectionButtonsGroup.removeChildren();
        this._selectionButtonsGroup.add(page);
        if (this._currentPage != null) this._previousPages.push(this._currentPage);
        this._currentPage = page;
    }
    
    
    
    _buildFirstFunctionPage(temperament) {
        return new FirstFunctionChoicePageGroup(temperament, (firstFunction) => {
            this._firstFunction = firstFunction;
            this._swapPage(this._buildMiddleAxisPage(firstFunction))
        });
    }
    
    _buildMiddleAxisPage(firstFunction) {
        return new MiddleAxisChoicePageGroup(firstFunction, (secondFunction) => {
            this._secondGrantFunction = secondFunction;
            this._swapPage(this._buildSaviorAnimalsPage(firstFunction));
        });
    }
    
    _buildSaviorAnimalsPage(firstFunction) {
        return new SaviorAnimalsChoicePageGroup(firstFunction, (saviorAnimals) => {
            this._saviorAnimals = saviorAnimals;
            this._swapPage(this._buildLastAnimalPage(saviorAnimals));
        });
    }
    
    /**
     *
     * @param saviorAnimals {string}
     * @return {LastAnimalChoicePageGroup}
     * @private
     */
    _buildLastAnimalPage(saviorAnimals) {
        return new LastAnimalChoicePageGroup(saviorAnimals, (demonAnimals) => {
            this._demonAnimals = demonAnimals;
            this._confirmType();
        })
    }
    
    _hideSkipButton() {
        this._skipModalityButton.visible(false);
    }
    
    _showSkipButton() {
        this._skipModalityButton.visible(true);
    }
    
    
    _confirmType() {
        this._opTypeManager.update(new OpType(
            this._firstFunction,
            this._secondGrantFunction,
            this._saviorAnimals + this._demonAnimals,
            this._modality
        ));
        this._clear();
    }
    
    /**
     *
     * @param [clearTypeToo] {boolean}
     * @private
     */
    _clear(clearTypeToo) {
        this._modality = '';
        this._firstFunction = '';
        this._secondGrantFunction = '';
        this._saviorAnimals = '';
        this._demonAnimals = '';
        this._previousPages = [];
        this._currentPage = null;
        if (clearTypeToo) this._opTypeManager.reset();
        this._showSkipButton();
        this._hideBackButton();
        this._swapPage(this._modalityPage);
    }
    
    _hideBackButton() {
        this._backButton.visible(false);
    }
    
    _showBackButton() {
        this._backButton.visible(true);
    }
}



class ChoicePageGroup extends Konva.Group {
    /**
     *
     * @param leftButtons {ControlButtonGroup[]}
     * @param rightButtons {ControlButtonGroup[]}
     */
    constructor(leftButtons, rightButtons) {
        super();
        console.log(`Left buttons amount: ${leftButtons.length}`);
        console.log(`Right buttons amount: ${rightButtons.length}`);
        // The size of buttons should be the same in the same page, so we can use any one to calculate positions.
        
        let yOffset = 0;
        for (const button of leftButtons) {
            console.log(`Placing button ${button._text}`);
            button.offsetX(0);
            button.offsetY(yOffset);
            this.add(button);
            
            yOffset -= button.getClientRect().height + BUTTON_VERTICAL_GAP;
        }
        
        yOffset = 0;
        for (const button of rightButtons) {
            console.log(`Placing button ${button._text}`);
            button.offsetX(-button.getClientRect().width - 100);
            button.offsetY(yOffset);
            this.add(button);
            
            yOffset -= button.getClientRect().height + BUTTON_VERTICAL_GAP;
        }
        
        this.offsetX(-((DIAGRAM_SIZE - this.getClientRect().width) / 2));
        this.offsetY(-CHOICE_PAGE_TOP_MARGIN);
    }
}




class ModalityChoicePageGroup extends ChoicePageGroup {
    /**
     *
     * @param onSelectionConfirmed {function(Modality): void}
     */
    constructor(onSelectionConfirmed) {
        const BUTTON_WIDTH = 120;
        const BUTTON_HEIGHT = GLOBAL_BUTTON_HEIGHT;
        
        const ffButton = new ControlButtonGroup({
            size: {width: BUTTON_WIDTH, height: BUTTON_HEIGHT},
            text: Modality.FF_TESTER,
            onClick: () => { onSelectionConfirmed(Modality.FF_TESTER) }
        });
        
        const fmButton = new ControlButtonGroup({
            size: {width: BUTTON_WIDTH, height: BUTTON_HEIGHT},
            text: Modality.FM_VISUAL,
            onClick: () => { onSelectionConfirmed(Modality.FM_VISUAL) }
        });
        
        const mfButton = new ControlButtonGroup({
            size: {width: BUTTON_WIDTH, height: BUTTON_HEIGHT},
            text: Modality.MF_AUDIO,
            onClick: () => { onSelectionConfirmed(Modality.MF_AUDIO) }
        });
        
        const mmButton = new ControlButtonGroup({
            size: {width: BUTTON_WIDTH, height: BUTTON_HEIGHT},
            text: Modality.MM_KINESTHETIC,
            onClick: () => { onSelectionConfirmed(Modality.MM_KINESTHETIC) }
        });
        
        
        super(
            [ffButton, mfButton],
            [fmButton, mmButton]
        )
    }
    
}



class TemperamentChoicePageGroup extends ChoicePageGroup {
    /**
     *
     * @param onSelectionConfirmed {function(string): void}
     */
    constructor(onSelectionConfirmed) {
        const BUTTON_WIDTH = 200;
        const BUTTON_HEIGHT = GLOBAL_BUTTON_HEIGHT;
        
        const leftTemperaments = ['IxxP', 'ExxJ'];
        const rightTemperaments = ['IxxJ', 'ExxP'];
        
        const leftButtons = [];
        const rightButtons = [];
        
        for (let i = 0; i < 2; i++) {
            leftButtons.push(
                new ControlButtonGroup({
                    size: {width: BUTTON_WIDTH, height: BUTTON_HEIGHT},
                    text: leftTemperaments[i],
                    onClick: () => {
                        onSelectionConfirmed(leftTemperaments[i])
                    }
                })
            );
        }
        
        for (let i = 0; i < 2; i++) {
            rightButtons.push(
                new ControlButtonGroup({
                    size: {width: BUTTON_WIDTH, height: BUTTON_HEIGHT},
                    text: rightTemperaments[i],
                    onClick: () => {
                        onSelectionConfirmed(rightTemperaments[i])
                    }
                })
            );
        }
        
        super(leftButtons, rightButtons);
    }
    
}

class FirstFunctionChoicePageGroup extends ChoicePageGroup {
    /**
     *
     * @param temperament {string}
     * @param onSelectionConfirmed {function(CognitiveFunction): void}
     */
    constructor(temperament, onSelectionConfirmed) {
        const BUTTON_WIDTH = 120;
        const BUTTON_HEIGHT = GLOBAL_BUTTON_HEIGHT;
        
        let firstHumanNeed;
        switch (temperament) {
            case 'IxxP':
                firstHumanNeed = 'Di';
                break;
            case 'ExxJ':
                firstHumanNeed = 'De';
                break;
            case 'IxxJ':
                firstHumanNeed = 'Oi';
                break;
            case 'ExxP':
                firstHumanNeed = 'Oe';
                break;
        }
        
        let leftButtonText = '';
        let rightButtonText = '';
        switch (firstHumanNeed[0]) {
            case 'D':
                leftButtonText = Letter.FEELING;
                rightButtonText = Letter.THINKING;
                break;
            case 'O':
                leftButtonText = Letter.SENSING;
                rightButtonText = Letter.INTUITING;
                break;
        }
        
        leftButtonText += firstHumanNeed[1];
        rightButtonText += firstHumanNeed[1];
        
        super(
            [new ControlButtonGroup({
                size: {width: BUTTON_WIDTH, height: BUTTON_HEIGHT},
                text: leftButtonText,
                onClick: () => { onSelectionConfirmed(leftButtonText) }
            })],
            [new ControlButtonGroup({
                size: {width: BUTTON_WIDTH, height: BUTTON_HEIGHT},
                text: rightButtonText,
                onClick: () => { onSelectionConfirmed(rightButtonText) }
            })]
        )
    }
    
}

class MiddleAxisChoicePageGroup extends ChoicePageGroup {
    /**
     *
     * @param firstFunction {CognitiveFunction}
     * @param onSelectionConfirmed {function(CognitiveFunction): void}
     */
    constructor(firstFunction, onSelectionConfirmed) {
        const BUTTON_WIDTH = 200;
        const BUTTON_HEIGHT = GLOBAL_BUTTON_HEIGHT;
        
        const axis = Axis.opposite(firstFunction);
        const charge = Charge.opposite(firstFunction);
        
        let firstLetter = '';
        let secondLetter = '';
        if (axis === Axis.OBSERVING) {
            firstLetter = Letter.SENSING;
            secondLetter = Letter.INTUITING;
        } else {
            firstLetter = Letter.FEELING;
            secondLetter = Letter.THINKING;
        }
        
        const leftSecondFunction = firstLetter + charge;
        const rightSecondFunction = secondLetter + charge;
        
        const leftButtonText = leftSecondFunction + '/' + CognitiveFunction.opposite(leftSecondFunction);
        const rightButtonText = rightSecondFunction + '/' + CognitiveFunction.opposite(rightSecondFunction);
        
        super(
            [
                new ControlButtonGroup({
                    size: {width: BUTTON_WIDTH, height: BUTTON_HEIGHT},
                    text: leftButtonText,
                    onClick: () => { // noinspection JSCheckFunctionSignatures | Guaranteed.
                        onSelectionConfirmed(leftSecondFunction);
                    }
                })
            ],
            [
                new ControlButtonGroup({
                    size: {width: BUTTON_WIDTH, height: BUTTON_HEIGHT},
                    text: rightButtonText,
                    onClick: () => { // noinspection JSCheckFunctionSignatures | Guaranteed.
                        onSelectionConfirmed(rightSecondFunction);
                    }
                })
            ]
        )
    }
    
}

class SaviorAnimalsChoicePageGroup extends ChoicePageGroup {
    /**
     * @param firstFunction {CognitiveFunction}
     * @param onSelectionConfirmed {function(string): void}
     */
    constructor(firstFunction, onSelectionConfirmed) {
        const BUTTON_WIDTH = 120;
        const BUTTON_HEIGHT = GLOBAL_BUTTON_HEIGHT;
        
        
        let saviorAnimalCouples = [];
        for (const firstAnimal of Animal.All) {
            if (!Animal.isCompatible(firstAnimal, firstFunction)) continue;
            
            for (const secondAnimal of Animal.All) {
                if (secondAnimal === firstAnimal || secondAnimal === Animal.opposite(firstAnimal)) continue;
                
                saviorAnimalCouples.push(firstAnimal + secondAnimal);
            }
        }
        
        let leftButtons = [];
        let rightButtons = [];
        for (let i = 0; i < saviorAnimalCouples.length; i++) {
            // noinspection JSMismatchedCollectionQueryUpdate | Used as selector.
            /** @type {ControlButtonGroup[]} */
            const targetArray = i < saviorAnimalCouples.length / 2 ? leftButtons : rightButtons;
            
            targetArray.push(new ControlButtonGroup({
                size: {width: BUTTON_WIDTH, height: BUTTON_HEIGHT},
                text: saviorAnimalCouples[i],
                onClick: () => { // noinspection JSCheckFunctionSignatures | Guaranteed.
                    onSelectionConfirmed(saviorAnimalCouples[i]);
                }
            }));
        }
        
        super(leftButtons, rightButtons);
    }
    
    
}

class LastAnimalChoicePageGroup extends ChoicePageGroup {
    /**
     *
     * @param saviorAnimals {string}
     * @param onSelectionConfirmed {function(Animal): void}
     */
    constructor(saviorAnimals, onSelectionConfirmed) {
        const BUTTON_WIDTH = 130;
        const BUTTON_HEIGHT = GLOBAL_BUTTON_HEIGHT + 20;
        
        const animalOption1 = Animal.opposite(saviorAnimals[0]);
        const animalOption2 = Animal.opposite(saviorAnimals[1]);
        
        const button1 = new ControlButtonGroup({
            size: {width: BUTTON_WIDTH, height: BUTTON_HEIGHT},
            text: '(' + animalOption1 + ')',
            onClick: () => { // noinspection JSCheckFunctionSignatures | Guaranteed.
                onSelectionConfirmed(animalOption2 + animalOption1);
            }
        });
        
        const button2 = new ControlButtonGroup({
            size: {width: BUTTON_WIDTH, height: BUTTON_HEIGHT},
            text: '(' + animalOption2 + ')',
            onClick: () => { // noinspection JSCheckFunctionSignatures | Guaranteed.
                onSelectionConfirmed(animalOption1 + animalOption2);
            }
        });
        
        super([button1], [button2]);
    }
}


/**
 * @typedef {Object} ControlButtonConfigs
 * @property {{x: number, y: number}} [position]
 * @property {{width: number, height: number}} size
 * @property {string} text
 * @property {function(): void} onClick
 */

/**
 * @class
 */
class ControlButtonGroup extends Konva.Group {
    /**
     *
     * @param configs {ControlButtonConfigs}
     */
    constructor(configs) {
        super();
        
        this._text = configs.text;
        
        const bgRect = new Konva.Rect({
            x: configs.position?.x ?? 0,
            y: configs.position?.y ?? 0,
            width: configs.size.width,
            height: configs.size.height,
            fill: '#cdd2d3',
            stroke: 'black',
            strokeWidth: 1
        });
        bgRect[DENY_HIDE_CONTROL_PROPERTY] = true;
        
        const text = new Konva.Text({
            x: configs.position?.x ?? 0,
            y: configs.position?.y ?? 2.7,
            width: bgRect.width(),
            height: bgRect.height(),
            align: 'center',
            verticalAlign: 'middle',
            fontFamily: 'Arial, sans serif',
            fontStyle: 'bold',
            fontSize: BUTTON_FONT_SIZE,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            text: configs.text,
        });
        text[DENY_HIDE_CONTROL_PROPERTY] = true;
        
        this.add(bgRect, text);
        this.on('pointerclick', configs.onClick);
        this[DENY_HIDE_CONTROL_PROPERTY] = true;
    }
}