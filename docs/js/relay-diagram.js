import {AnimalGrantPosition, OpType} from "./op-lib.js";

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
    0.82,
    0.68,
    0.53
]);


const AnimalCenterOffsets = new Map([
    [AnimalGrantPosition.STRONGER_INFO, { x: 50, y: 50 }],
    [AnimalGrantPosition.STRONGER_ENERGY, { x: -50, y: 50 }],
    [AnimalGrantPosition.WEAKER_ENERGY, { x: 50, y: -50 }],
    [AnimalGrantPosition.WEAKER_INFO, { x: -50, y: -50 }],
]);


const COGFUN_BASE_FONT_SIZE = 58;

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
    constructor(startingOpType) {
        this.opType = OpType.GENERIC;
    }
    addListener(listener) {
        console.log("implement OpTypeManager.addListener");
    }
}


export class CRDStage extends Konva.Stage {
    //private readonly controlLayer: ControlLayer;
    /**
     * Simply calls [diagramResources.initializeAsync()]{@linkcode diagramResources#initializeAsync}.
     * @returns {Promise<void>}
     */
    static async initializeResources() {
        return diagramResources.initializeAsync();
    }
    
    
    constructor(diagramContainer, startingOpType) {
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
        
        this.diagramLayer = new DiagramLayer(opTypeManager);
        
        //this.controlLayer = new ControlLayer(opTypeManager);
        this.add(this.diagramLayer);
        //this.add(this.controlLayer);
    }
}


class DiagramLayer extends Konva.Layer {
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
        // Create group for the whole stack of functions and then create every single one of them and add them.
        this.cogFunStackGroup = new CognitiveFunctionStackGroup(opType);
        this.animalStackGroup = new AnimalStackGroup(opType, this.cogFunStackGroup);
    }
}





class CognitiveFunctionStackGroup extends Konva.Group {
    
    /**
     *
     * @param configs CognitiveFunctionStackGroupConfigs
     */
    constructor(configs) {
        super();
        this.cogFunGroups = new Array(4);
        for (let i = 0; i < 4; i++) {
            const cfg = new CognitiveFunctionGroup(opType, i);
            this.cogFunGroups[i] = cfg;
            this.add(cfg);
        }
    }
    
    getCognitiveFunctionGroup(grantIndex) {
        return this.cogFunGroups[grantIndex];
    }
}


class CognitiveFunctionGroup extends Konva.Group {
    constructor(opType, grantIndex) {
        super();
        
        this.circle = new CognitiveFunctionCircle(opType, grantIndex);
        
        const demonBgImg = new DemonBackgroundImage(opType, this.circle);
        const masculineBgImg = new MasculineBackgroundImage(opType, this.circle);
        const text = new CognitiveFunctionText(opType, this.circle);
        
        this.add(demonBgImg, masculineBgImg, this.circle, text);
    }
}


/**
 * Configurations for {@link CognitiveFunctionCircle}
 * @typedef {Object} CognitiveFunctionCircleConfigs
 * @property {number} grantIndex
 * @property {string} cogFunLetter
 */


class CognitiveFunctionCircle extends Konva.Circle {
    /**
     *
     * @param configs {CognitiveFunctionCircleConfigs}
     */
    constructor(configs) {
        
        super({
            radius: CIRCLE_BASE_RADIUS,
            strokeWidth: CIRCLE_STROKE_WIDTH,
            x: CogFunCirclePositions[configs.grantIndex].x,
            y: CogFunCirclePositions[configs.grantIndex].y,
            fill: CogFunFillColors[configs.cogFunLetter],
            stroke: CogFunStrokeColors[configs.cogFunLetter],
        });
        
        // HERE Keep changing
        const isGenericDiagram = opType === OpType.GENERIC;
        
        // Making first function slightly bigger for generic because of optical illusion.
        const genericScaleFactor = grantIndex === 0 ? 1.05 : 1;
        
        // If not generic diagram use scaling, otherwise don't.
        this.scaleX(isGenericDiagram ? genericScaleFactor : this.grantScaleFactor);
        this.scaleY(isGenericDiagram ? genericScaleFactor : this.grantScaleFactor);
    }
}


class CognitiveFunctionBackgroundImage extends Konva.Image {
    get _BASE_IMG_SCALE() { return 1; }
    constructor(img, circle) {
        // Based on how we structured the library, img should always be loaded when reaching this point.
        super({
            image: img,
        });
        // this.opacity(grantOrder !== 3 ? 0.3 : 1);
        this.position(circle.position());
        // Offset is applied before the scale, regardless of when it's called, so we need to use the original size.
        this.offsetX(this.width() / 2);
        this.offsetY(this.height() / 2);
        const scale = this._BASE_IMG_SCALE * circle.scaleX();
        this.scaleX(scale);
        this.scaleY(scale);
    }
}



class DemonBackgroundImage extends CognitiveFunctionBackgroundImage {
    get _BASE_IMG_SCALE() { return 0.4; }
    constructor(opType, circle) {
        const img = circle.grantIndex === 3 ? DiagramResources.BIG_DEMON_BG_IMG : DiagramResources.LITTLE_DEMON_BG_IMG;
        super(img, circle);
        const cogFunInfo = opType.getCognitiveFunctionInfo(circle.grantIndex);
        this.visible(!cogFunInfo.isSavior);
    }
}

class MasculineBackgroundImage extends CognitiveFunctionBackgroundImage {
    get _BASE_IMG_SCALE() {
        return 0.43;
    }
    constructor(opType, circle) {
        super(DiagramResources.MASCULINE_FUNCTION_BG_IMG, circle);
        const cogFunInfo = opType.getCognitiveFunctionInfo(circle.grantIndex);
        this.visible(cogFunInfo.isMasculine ?? false);
    }
}



class CognitiveFunctionText extends Konva.Text {
    constructor(opType, circle) {
        super({
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
        });
        const cogFunInfo = opType.getCognitiveFunctionInfo(circle.grantIndex);
        console.log(cogFunInfo.cognitiveFunction.shortName);
        this.text(cogFunInfo.cognitiveFunction.shortName);
        this.fontSize(COGFUN_BASE_FONT_SIZE * circle.scaleY());
    }
}



class AnimalStackGroup extends Konva.Group {
    constructor(opType, cogFunStackGroup) {
        super();
        for (const ap of Object.values(AnimalGrantPosition)) {
            console.log(ap);
            const idxCouple = AnimalGrantPosition.toGrantIndexCouple(ap);
            const biggerCircle = cogFunStackGroup.getCognitiveFunctionGroup(idxCouple.strongerIndex).circle;
            const smallerCircle = cogFunStackGroup.getCognitiveFunctionGroup(idxCouple.weakerIndex).circle;
            const ag = new AnimalGroup(opType, ap, biggerCircle, smallerCircle);
            this.add(ag);
        }
    }
}


class AnimalGroup extends Konva.Group {
    constructor(opType, animalGrantPosition, biggerCircle, smallerCircle) {
        super();
        const bgTriangle = new AnimalBackgroundTriangle(opType, animalGrantPosition, biggerCircle, smallerCircle);
        const line = new AnimalLine(opType, animalGrantPosition, biggerCircle, smallerCircle);
        const letterText = new AnimalLetter(opType, animalGrantPosition);
        const orderText = new AnimalOrderNumber(opType, animalGrantPosition);
        this.add(bgTriangle);
        this.add(line);
        this.add(letterText);
        this.add(orderText);
    }
}


// DEBT When passing shapes we should be throwing errors if the passed shape stage doesn't match current shape stage.
class AnimalBackgroundTriangle extends Konva.Line {
    static offsetCoordinate(coord, centerValue) {
        switch (true) {
            case coord > centerValue:
                return coord - ANIMAL_BG_TRIANGLE_OFFSET;
            case coord < centerValue:
                return coord + ANIMAL_BG_TRIANGLE_OFFSET;
            default:
                return coord;
        }
    }
    
    constructor(opType, animalGrantPosition, biggerCircle, smallerCircle) {
        const crdStage = biggerCircle.getStage();
        const centerPoint = crdStage.CenterPoint;
        
        super({
            points: [
                AnimalBackgroundTriangle.offsetCoordinate(biggerCircle.x(), centerPoint.x),
                AnimalBackgroundTriangle.offsetCoordinate(biggerCircle.y(), centerPoint.y),
                AnimalBackgroundTriangle.offsetCoordinate(smallerCircle.x(), centerPoint.x),
                AnimalBackgroundTriangle.offsetCoordinate(smallerCircle.y(), centerPoint.y),
                centerPoint.x,
                centerPoint.y
            ],
            closed: true
        });
        
        const stackIndex = opType.getAnimalInfo(animalGrantPosition)?.stackIndex;
        
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
        }
    }
}
class AnimalLine extends Konva.Line {
    constructor(opType, animalGrantPosition, biggerCircle, smallerCircle) {
        super({
            points: [
                biggerCircle.x(), biggerCircle.y(),
                smallerCircle.x(), smallerCircle.y()
            ],
            stroke: 'black',
            strokeWidth: 5
        });
        const stackIndex = opType.getAnimalInfo(animalGrantPosition)?.stackIndex;
        switch (stackIndex) {
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
    constructor(opType, animalGrantPosition, text) {
        super({
            fontSize: ANIMAL_LETTER_BASE_FONT_SIZE,
            fontFamily: 'Fira Code,Roboto Mono,Liberation Mono,Consolas,monospace',
            //fontStyle: 'bold',
            fill: 'black',
            stroke: 'black',
            strokeWidth: 1,
            strokeEnabled: false
        });
        const center = this.getStage().CenterPoint;
        this.position(center);
        const baseSize = this._INVISIBLE_TEXT_BOX_BASE_SIZE;
        const animalInfo = opType.getAnimalInfo(animalGrantPosition);
        // The text is placed using an invisible text box and based on the position of the animal we align the text
        // to the correct corner. We then add or remove a bunch of pixels to the base box size to get a more symmetric
        // look.
        switch (animalGrantPosition) {
            case AnimalGrantPosition.STRONGER_INFO:
                this.align('left');
                this.verticalAlign('top');
                break;
            case AnimalGrantPosition.STRONGER_ENERGY:
                this.align('right');
                this.verticalAlign('top');
                break;
            case AnimalGrantPosition.WEAKER_INFO:
                this.align('right');
                this.verticalAlign('bottom');
                break;
            case AnimalGrantPosition.WEAKER_ENERGY:
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
        this.visible(animalInfo?.stackIndex != undefined);
        this.text(text);
        this.fontStyle(animalInfo?.isDoubleActivated ? "bold" : "normal");
        this.strokeEnabled(animalInfo?.isDoubleActivated ?? false);
        this.offsetX(this.width() / 2);
        this.offsetY(this.height() / 2);
    }
}
class AnimalLetter extends AnimalText {
    get _INVISIBLE_TEXT_BOX_BASE_SIZE() { return super._INVISIBLE_TEXT_BOX_BASE_SIZE + 50; }
    constructor(opType, animalGrantPosition) {
        const animalInfo = opType.getAnimalInfo(animalGrantPosition);
        super(opType, animalGrantPosition, animalInfo?.animal ?? '');
        const baseSize = this._INVISIBLE_TEXT_BOX_BASE_SIZE;
        if (animalInfo?.stackIndex === 3) {
            this.text(`(${animalInfo?.animal ?? ''})`);
            this.width(baseSize + 20);
        }
        else {
            this.width(baseSize);
        }
    }
}
class AnimalOrderNumber extends AnimalText {
    constructor(opType, animalGrantPosition) {
        const animalInfo = opType.getAnimalInfo(animalGrantPosition);
        const stackIndex = animalInfo && animalInfo.stackIndex;
        const text = stackIndex == undefined ? '' : (stackIndex + 1).toString();
        super(opType, animalGrantPosition, text);
    }
}
class ControlLayer extends Konva.Layer {
    constructor(opTypeManager) {
        super();
        this.hideControls();
        this.on('mouseenter', this.onMouseEnter);
        this.on('tap', this.onTapShow);
        this.on('mouseleave', this.onMouseLeave);
        this.add(new MainAxisChoiceGroup(opTypeManager));
    }
    onMouseEnter() {
        this.showControls();
    }
    onTapShow() {
        console.log("Tap show.");
        this.showControls();
        this.off('tap');
        this.on('tap', this.onTapHide);
    }
    onTapHide() {
        this.hideControls();
        this.off('tap');
        this.on('tap', this.onTapShow);
    }
    onMouseLeave() {
        this.hideControls();
    }
    showControls() {
        this.opacity(1);
    }
    hideControls() {
        this.opacity(0);
    }
}
class ControlGroup extends Konva.Group {
    constructor(opTypeManager) {
        super();
        // HERE Base class, with the background semi-transparent "full-size" rectangle.
        throw new Error("Not implemented yet.");
    }
}
class MainAxisChoiceGroup extends ControlGroup {
    constructor(opTypeManager) {
        super(opTypeManager);
    }
}
class ControlButton extends Konva.Rect {
    constructor() {
        super();
    }
}
