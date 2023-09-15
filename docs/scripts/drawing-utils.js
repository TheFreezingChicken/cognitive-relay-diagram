// Convention: every index follows the Grant stack positioning.
import {OpType} from "./op-lib.js";

export const CIRCLE_BASE_RADIUS = 60;
export const CIRCLE_STROKE_FACTOR = 0.15;
export const OPPOSITE_CIRCLE_DISTANCE = 350;

const BASE_COGFUN_FONT_SIZE = 58;

const FIRST_GRANT_FUNCTION_SCALE_FACTOR = 1;
const SECOND_GRANT_FUNCTION_SCALE_FACTOR = 0.82;
const THIRD_GRANT_FUNCTION_SCALE_FACTOR = 0.68;
const LAST_GRANT_FUNCTION_SCALE_FACTOR = 0.53;


const FIRST_ANIMAL_STROKE_WIDTH = 17;
const SECOND_ANIMAL_STROKE_WIDTH = 5;
const THIRD_ANIMAL_STROKE_WIDTH = 3;
const THIRD_ANIMAL_DASH_PATTERN = [10, 2];
const LAST_ANIMAL_STROKE_WIDTH = 1;
const LAST_ANIMAL_DASH_PATTERN = [6, 16];


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


function totalRadius(circle) {
    return circle.radius() + circle.strokeWidth();
}




class CognitiveFunctionCircle extends Konva.Circle {
    _stubCogFun;
    _grantOrder;
    
    constructor(x, y, grantOrder, stubCogFun) {
        super({x: x, y: y, scaleX: 1, scaleY: 1});
        
        this.radius(CIRCLE_BASE_RADIUS);
        this.strokeWidth(this.radius() * CIRCLE_STROKE_FACTOR);
        
        this._stubCogFun = stubCogFun;
        this._grantOrder = grantOrder;
        
        
        this.cogFun = stubCogFun;
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
    
    
    
    reset() {
        this.cogFun = this._stubCogFun;
    }
    
    
    _cogFun;
    get cogFun() {
        return this._cogFun;
    }
    set cogFun(cogFun) {
        this.fill(this.getFillColor(cogFun));
        this.stroke(this.getStrokeColor(cogFun));
        
        let scaleFactor;
        if (cogFun === this._stubCogFun) {
            scaleFactor = 0.9;
        } else switch (this._grantOrder) {
            case 0:
                scaleFactor = FIRST_GRANT_FUNCTION_SCALE_FACTOR;
                break;
            case 1:
                scaleFactor = SECOND_GRANT_FUNCTION_SCALE_FACTOR;
                break;
            case 2:
                scaleFactor = THIRD_GRANT_FUNCTION_SCALE_FACTOR;
                break;
            case 3:
                scaleFactor = LAST_GRANT_FUNCTION_SCALE_FACTOR;
                break;
        }
        this.scaleX(scaleFactor);
        this.scaleY(scaleFactor);
        
        this._cogFun = cogFun;
    
    
        console.log(
            `Circle ${this._grantOrder + 1}:\n`,
            "Width: ", this.getClientRect().width,
            "Height: ", this.getClientRect().height,
        )
    }
}



class CognitiveFunctionText extends Konva.Text {
    _circle;
    
    constructor(circle, stubFunction) {
        super(
            {
                x: circle.getClientRect().x,
                y: circle.getClientRect().y,
                height: circle.getClientRect().height,
                width: circle.getClientRect().width,
                
                align: 'center',
                verticalAlign: 'middle',
                
                fontFamily: 'Fira Code,Roboto Mono,Liberation Mono,Consolas,monospace',
                fontStyle: 'bold',
                fill: 'white',
                stroke: 'black',
                strokeWidth: 2,
            }
        );
        
        this._circle = circle;
        this.cogFun = stubFunction;
    }
    
    
    _cogFun;
    get cogFun() {
        return this._cogFun;
    }
    set cogFun(partialCogFun) {
        this.text(partialCogFun.replaceAll("?",""));
        
        // Horizontal offset and font size based on neutral diagram or specific type diagram.
        if (this.text().length === 1) {
            this.offsetX(1);
            this.fontSize(BASE_COGFUN_FONT_SIZE);
        }
        else {
            this.offsetX(-2 * this._circle.scaleY());
            this.fontSize(BASE_COGFUN_FONT_SIZE * this._circle.scaleY());
        }
        
        this.offsetY(-4 * this._circle.scaleY());
        this._cogFun = partialCogFun;
    }
}



class CognitiveFunctionGroup extends Konva.Group {
    circle;
    text;
    _grantOrder;
    
    constructor(circleXPos, circleYPos, grantOrder) {
        super();
        
        let stubFunction;
        switch (grantOrder) {
            case 0:
                stubFunction = "N?";
                break;
            case 1:
                stubFunction = "T?";
                break;
            case 2:
                stubFunction = "F?";
                break;
            case 3:
                stubFunction = "S?";
                break;
        }
        
        const circle = new CognitiveFunctionCircle(
            circleXPos, circleYPos, grantOrder, stubFunction
        );
        
        const text = new CognitiveFunctionText(circle, stubFunction);
        this._grantOrder = grantOrder;
        
        this.add(circle);
        this.add(text);
        
        this.circle = circle;
        this.text = text;
    }
    
    
    _cogFun;
    get cogFun() {
        return this._cogFun;
    }
    set cogFun(cogFun) {
        this.circle.cogFun = cogFun;
        this.text.cogFun = cogFun;
        this._cogFun = cogFun;
    }
    
    setOpType(opType) {
        this.cogFun = opType.grantStack[this._grantOrder];
    
        // console.log(
        //     `Group ${this._grantOrder + 1}:\n`,
        //     "Width: ", this.getClientRect().width,
        //     "Height: ", this.getClientRect().height,
        // )
    }
}



class AnimalLine extends Konva.Line {
    cogFun1Group;
    cogFun2Group;
    
    constructor(group1, group2) {
        super({
            points: [
                group1.circle.x(), group1.circle.y(),
                group2.circle.x(), group2.circle.y()
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
                this.opacity(0.3);
                break;
        }
    }
}


class AnimalText extends Konva.Text {
    constructor(cogFun1Circle, cogFun2Circle) {
        super(
            // HERE The smaller X is always the leftmost one. Good to find the x,y point.
            // {
            //     x: circle.x() - totalRadius(circle) + (1.3 * circle.scaleY()),
            //     y: circle.y() - totalRadius(circle) + (4.5 * circle.scaleY()),
            //     height: totalRadius(cogFun1Group.circle),
            //     width: this.width(Math.sqrt(OPPOSITE_CIRCLE_DISTANCE / 2 * 2)),
            //     fontSize: 58 * circle.scaleY(),
            //     fontFamily: 'Fira Code,Roboto Mono,Liberation Mono,Consolas,monospace',
            //     fontStyle: 'bold',
            //     fill: 'white',
            //     stroke: 'black',
            //     strokeWidth: 2,
            //     align: 'center',
            //     verticalAlign: 'middle'
            // }
        );
        
        
    }
    
    
    
    updateText(animal, order) {
        this.text(animal);
    }
}


class AnimalGroup extends Konva.Group {
    line;
    text;
    cogFun1Group;
    cogFun2Group;
    
    constructor(cogFun1Group, cogFun2Group) {
        super();
    
        const line = new AnimalLine(cogFun1Group, cogFun2Group);
        const text = new AnimalText(cogFun1Group, cogFun2Group);
        
        this.add(line, text);
        
        this.cogFun1Group = cogFun1Group;
        this.cogFun2Group = cogFun2Group;
        this.line = line;
        this.text = text;
    }
    
    
    setOpType(opType) {
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
        
        const order = opType.animalStack.indexOf(animal);
        this.line.updateAnimalOrder(order);
        this.text.updateText(animal, order);
    }
}






export class DiagramStage extends Konva.Stage {
    cogFunGroups;
    animalGroups;
    
    
    constructor(htmlElement) {
        super({
            container: htmlElement.id,
            width: htmlElement.clientWidth,
            height: 900
        });
        
        const cogFunGroups = new Array(4);
        cogFunGroups[0] = new CognitiveFunctionGroup(
            this.width() / 2,
            CIRCLE_BASE_RADIUS + 20,
            0
        );
        cogFunGroups[3] = new CognitiveFunctionGroup(
            cogFunGroups[0].circle.x(),
            cogFunGroups[0].circle.y() + OPPOSITE_CIRCLE_DISTANCE,
            3
        );
        
        cogFunGroups[1] = new CognitiveFunctionGroup(
            cogFunGroups[0].circle.x() - OPPOSITE_CIRCLE_DISTANCE / 2,
            cogFunGroups[0].circle.y() + OPPOSITE_CIRCLE_DISTANCE / 2,
            1
        );
        cogFunGroups[2] = new CognitiveFunctionGroup(
            cogFunGroups[1].circle.x() + OPPOSITE_CIRCLE_DISTANCE,
            cogFunGroups[1].circle.y(),
            2
        );
        
        // Lines are stored following Grant stack;
        const animalGroups = new Array(4);
        // The order of groups in the constructors is important for animal text rotation.
        animalGroups[0] = new AnimalGroup(cogFunGroups[0], cogFunGroups[1]);
        animalGroups[1] = new AnimalGroup(cogFunGroups[2], cogFunGroups[0]);
        animalGroups[2] = new AnimalGroup(cogFunGroups[1], cogFunGroups[3]);
        animalGroups[3] = new AnimalGroup(cogFunGroups[3], cogFunGroups[2]);
        
        const linesGroup = new Konva.Group();
        for (const line of animalGroups) {
            linesGroup.add(line);
        };
        
        const functionsGroup = new Konva.Group();
        for (const g of cogFunGroups) {
            functionsGroup.add(g);
        };
        
        const layer = new Konva.Layer();
        layer.add(linesGroup);
        layer.add(functionsGroup);
        
        this.add(layer);
        
        this.cogFunGroups = cogFunGroups;
        this.animalGroups = animalGroups;
    }
    
    
    redraw(
        functionsStyle,
        observerDecider,
        animals,
        quadra
    ) {
        const isSingleObserver = observerDecider === 'odd';
        
        const opType = new OpType(quadra, isSingleObserver, animals, "MM", "#1");
    
        for (const g of this.cogFunGroups) {
            g.setOpType(opType)
        }
    
        for (const g of this.animalGroups) {
            g.setOpType(opType);
        }
        
        this.draw();
    }
}