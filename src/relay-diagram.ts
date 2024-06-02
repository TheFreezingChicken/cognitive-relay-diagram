import Konva from "konva";
import {AnimalGrantPosition, OpType} from "./op-lib"

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


function getCogFunCirclePosition(stage: CRDStage, grantIndex: number): { x: number, y: number } {
    switch (grantIndex) {
        case 0:
            return Object.freeze({
                x: stage.CenterPoint.x,
                y: stage.CenterPoint.y - OPPOSITE_CIRCLE_DISTANCE / 2
            })
        case 1:
            return Object.freeze({
                x: stage.CenterPoint.x - OPPOSITE_CIRCLE_DISTANCE / 2,
                y: stage.CenterPoint.y
            })
        case 2:
            return Object.freeze({
                x: stage.CenterPoint.x + OPPOSITE_CIRCLE_DISTANCE / 2,
                y: stage.CenterPoint.y
            })
        case 3:
            return Object.freeze({
                x: stage.CenterPoint.x,
                y: stage.CenterPoint.y + OPPOSITE_CIRCLE_DISTANCE / 2
            })
        default:
            throw new Error("Invalid grant order");
    }
}

/**
 * @readonly
 */
const FunctionCircleScaleFactors = Object.freeze([
    1,
    0.82,
    0.68,
    0.53
])


const AnimalCenterOffsets: Map<AnimalGrantPosition, { x: number; y: number; }> = new Map([
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
     * @returns {Promise<void>}
     */
    async initializeAsync(): Promise<void> {
        console.log("Initializing resources...");

        /**
         * Return a promise which resolves when a single image is loaded or failed.
         * @param img {HTMLImageElement}
         * @param path {string}
         * @returns {Promise<void>}
         */
        const loadImg = (img: HTMLImageElement, path: string): Promise<void> => {
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





class OpTypeManager{
    opType: OpType;

    constructor(startingOpType?: OpType) {
        throw new Error("Not implemented yet.");
    }

    addListener(listener: (newOpType: OpType) => void) {
        throw new Error("Not implemented yet.");
    }
}








export class CRDStage extends Konva.Stage {
    public readonly CenterPoint: { x: number, y: number };

    private readonly diagramLayer: DiagramLayer;
    private readonly controlLayer: ControlLayer;


    /**
     * Simply calls [diagramResources.initializeAsync()]{@linkcode diagramResources#initializeAsync}.
     * @returns {Promise<void>}
     */
    static async initializeResources(): Promise<void> {
        return diagramResources.initializeAsync();
    }


    constructor(diagramContainer: HTMLElement, startingOpType?: OpType) {
        if (!isLibraryReady) throw new Error("Library resources must be initialized before using diagrams.");

        super({
            container: diagramContainer.id,
            width: DIAGRAM_SIZE,
            height: DIAGRAM_SIZE
        });

        this.CenterPoint = {
            x: this.width() / 2,
            y: this.height() / 2
        };



        const opTypeManager: OpTypeManager = new OpTypeManager(startingOpType);

        this.diagramLayer = new DiagramLayer(opTypeManager);
        this.controlLayer = new ControlLayer(opTypeManager);

        this.add(this.diagramLayer);
        this.add(this.controlLayer);
    }
}




class DiagramLayer extends Konva.Layer {

    constructor(opTypeManager: OpTypeManager) {
        super();

        this.add(new DiagramGroup(opTypeManager.opType))

        // Add listener to reset (remove and re-add) diagram when OP type changes.
        opTypeManager.addListener(
            (newOpType: OpType) => {
                this.removeChildren();
                this.add(new DiagramGroup(newOpType));
            }
        )
    }

}



class DiagramGroup extends Konva.Group {
    private readonly cogFunStackGroup: CognitiveFunctionStackGroup;
    private readonly animalStackGroup: AnimalStackGroup;


    constructor(opType: OpType) {
        super();

        // Create group for the whole stack of functions and then create every single one of them and add them.
        this.cogFunStackGroup = new CognitiveFunctionStackGroup(opType);
        this.animalStackGroup = new AnimalStackGroup(this.cogFunStackGroup);
    }

}



class CognitiveFunctionStackGroup extends Konva.Group {
    private readonly cogFunGroups: CognitiveFunctionGroup[];

    constructor(opType: OpType) {
        super();

        this.cogFunGroups = new Array(4);
        for (let i = 0; i < 4; i++) {
            const cfg = new CognitiveFunctionGroup(opType, i);
            this.cogFunGroups[i] = cfg;
            this.add(cfg);
        }
    }


    public getCognitiveFunctionGroup(grantIndex: number): CognitiveFunctionGroup {
        return this.cogFunGroups[grantIndex];
    }
}



class CognitiveFunctionGroup extends Konva.Group {
    public readonly circle: CognitiveFunctionCircle;


    constructor(opType: OpType, grantIndex: number) {
        super();


        this.circle = new CognitiveFunctionCircle(opType, grantIndex);

        const demonBgImg = new DemonBackgroundImage(opType, this.circle);
        const masculineBgImg = new MasculineBackgroundImage(opType, this.circle);
        const text = new CognitiveFunctionText(opType, this.circle);


        this.add(demonBgImg, masculineBgImg, this.circle, text);
    }

}



class CognitiveFunctionCircle extends Konva.Circle {
    private readonly grantScaleFactor: number;


    constructor(opType: OpType, grantIndex: number) {
        super({
            radius: CIRCLE_BASE_RADIUS,
            strokeWidth: CIRCLE_STROKE_WIDTH
        });

        this.position(getCogFunCirclePosition(this.getStage() as CRDStage, grantIndex));


        this.grantScaleFactor = FunctionCircleScaleFactors[grantIndex];

        const cogFun = opType.getCognitiveFunction(grantIndex);
        const isGenericDiagram = opType === OpType.GENERIC;

        // @ts-ignore // Should work
        this.fill(CogFunFillColors[cogFun.shortName[0]]);
        // @ts-ignore // Should work
        this.stroke(CogFunStrokeColors[cogFun.shortName[0]]);

        const genericScaleFactor = grantIndex === 0 ? 1.05 : 1;

        // If not generic diagram use scaling, otherwise don't.
        this.scaleX( isGenericDiagram ? genericScaleFactor : this.grantScaleFactor);
        this.scaleY(isGenericDiagram ? genericScaleFactor : this.grantScaleFactor);
    }
}


// HERE


class AnimalStackGroup extends Konva.Group {

    constructor(cogFunStackGroup: CognitiveFunctionStackGroup) {
        super();

        throw new Error("Not implemented yet.");
    }


}



class ControlLayer extends Konva.Layer {

    constructor(opTypeManager: OpTypeManager) {
        super();

        this.add(new ControlGroup(opTypeManager))
    }

}



class ControlGroup extends Konva.Group {

    constructor(opTypeManager: OpTypeManager) {
        super();

        for (const ap of AnimalGrantPosition.All) {
            console.log(ap);
            const circle1 = cogFunGroups[ap.grantIndex1].circle;
            const circle2 = cogFunGroups[ap.grantIndex2].circle;
            const ag = new AnimalGroup(
                state.getObservableAnimal(ap),
                circle1,
                circle2
            );
            animalStackGroup.add(ag);
        }
    }

}
