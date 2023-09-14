// Convention: every index follows the Grant stack positioning.
import {OpType} from "./op-lib.js";

export const CIRCLE_BASE_RADIUS = 60;
export const CIRCLE_STROKE_FACTOR = 0.15;
export const OPPOSITE_CIRCLE_DISTANCE = 350;


const FIRST_GRANT_FUNCTION_SCALE_FACTOR = 1;
const SECOND_GRANT_FUNCTION_SCALE_FACTOR = 0.82;
const THIRD_GRANT_FUNCTION_SCALE_FACTOR = 0.68;
const LAST_GRANT_FUNCTION_SCALE_FACTOR = 0.53;


const FIRST_ANIMAL_STROKE_WIDTH = 17;
const SECOND_ANIMAL_STROKE_WIDTH = 5;
const THIRD_ANIMAL_STROKE_WIDTH = 5;
const THIRD_ANIMAL_DASH_PATTERN = [10, 5];
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




class CognitiveFunctionText extends Konva.Text {
    constructor(circle) {
        super(
            {
                x: circle.x() - totalRadius(circle) + (1.3 * circle.scaleY()),
                y: circle.y() - totalRadius(circle) + (4.5 * circle.scaleY()),
                height: totalRadius(circle) * 2,
                width: totalRadius(circle) * 2,
                fontSize: 58 * circle.scaleY(),
                fontFamily: 'Fira Code,Roboto Mono,Liberation Mono,Consolas,monospace',
                fontStyle: 'bold',
                fill: 'white',
                stroke: 'black',
                strokeWidth: 2,
                align: 'center',
                verticalAlign: 'middle'
            }
        );
    }
    
    
    _cognitiveFunction;
    get cognitiveFunction() {
        return this._cognitiveFunction;
    }
    set cognitiveFunction(cognitiveFunction) {
        this.text(cognitiveFunction)
        this._cognitiveFunction = cognitiveFunction;
    }
}

class CognitiveFunctionCircle extends Konva.Circle {
    constructor(x, y, scaleFactor) {
        super({x: x, y: y});
        
        this.radius(CIRCLE_BASE_RADIUS);
        this.strokeWidth(this.radius() * CIRCLE_STROKE_FACTOR);
        
        this.scaleX(scaleFactor);
        this.scaleY(scaleFactor);
    }
    
    
    getFillColor(cognitiveFunction) {
        let funChar = cognitiveFunction[0];
        
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
    
    
    getStrokeColor(cognitiveFunction) {
        let funChar = cognitiveFunction[0];
        
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
    
    
    
    
    _cognitiveFunction;
    get cognitiveFunction() {
        return this._cognitiveFunction;
    }
    set cognitiveFunction(cognitiveFunction) {
        this.fill(this.getFillColor(cognitiveFunction));
        this.stroke(this.getStrokeColor(cognitiveFunction));
        this._cognitiveFunction = cognitiveFunction;
    }
}



class AnimalLine extends Konva.Line {
    cognitiveFunctionGroup1;
    cognitiveFunctionGroup2;
    
    constructor(group1, group2) {
        super({
            points: [
                group1.circle.x(), group1.circle.y(),
                group2.circle.x(), group2.circle.y()
            ],
            stroke: 'black',
            strokeWidth: '1'
        });
        
        this.cognitiveFunctionGroup1 = group1;
        this.cognitiveFunctionGroup2 = group2;
    }
    
    
    updateAnimalOrder(animalStack) {
        let animal;
        
        const g1 = this.cognitiveFunctionGroup1;
        const g2 = this.cognitiveFunctionGroup2;
        const isFirstGroupDecider = g1.cognitiveFunction[0].match(["F|T"]);
        
        
        // Using introversion/extroversion letters to identify animal.
        switch (g1.cognitiveFunction[1] + g2.cognitiveFunction[1]) {
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
    
        const order = animalStack.indexOf(animal);
        
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


class CognitiveFunctionGroup extends Konva.Group {
    circle;
    text;
    grantOrder;
    
    constructor(circleXPos, circleYPos, scaleFactor, grantOrder) {
        super();
    
        const circle = new CognitiveFunctionCircle(
            circleXPos, circleYPos, scaleFactor
        );
        
        const text = new CognitiveFunctionText(circle);
        this.grantOrder = grantOrder;
        
        this.add(circle);
        this.add(text);
        
        this.circle = circle;
        this.text = text;
    }
    
    
    _cognitiveFunction;
    get cognitiveFunction() {
        return this._cognitiveFunction;
    }
    set cognitiveFunction(cognitiveFunction) {
        this.circle.cognitiveFunction = cognitiveFunction;
        this.text.cognitiveFunction = cognitiveFunction;
        this._cognitiveFunction = cognitiveFunction;
    }
}


export class DiagramStage extends Konva.Stage {
    cognitiveFunctionGroups;
    animalLines;
    
    
    constructor(htmlElement) {
        super({
            container: htmlElement.id,
            width: htmlElement.clientWidth,
            height: 900
        });
        
        const cfGroups = new Array(4);
        cfGroups[0] = new CognitiveFunctionGroup(
            this.width() / 2,
            CIRCLE_BASE_RADIUS + 20,
            FIRST_GRANT_FUNCTION_SCALE_FACTOR,
            0
        );
        cfGroups[3] = new CognitiveFunctionGroup(
            cfGroups[0].circle.x(),
            cfGroups[0].circle.y() + OPPOSITE_CIRCLE_DISTANCE,
            LAST_GRANT_FUNCTION_SCALE_FACTOR,
            3
        );
        
        cfGroups[1] = new CognitiveFunctionGroup(
            cfGroups[0].circle.x() - OPPOSITE_CIRCLE_DISTANCE / 2,
            cfGroups[0].circle.y() + OPPOSITE_CIRCLE_DISTANCE / 2,
            SECOND_GRANT_FUNCTION_SCALE_FACTOR,
            1
        );
        cfGroups[2] = new CognitiveFunctionGroup(
            cfGroups[1].circle.x() + OPPOSITE_CIRCLE_DISTANCE,
            cfGroups[1].circle.y(),
            THIRD_GRANT_FUNCTION_SCALE_FACTOR,
            2
        );
        
        // Lines are stored following Grant stack;
        const animalLines = new Array(4);
        animalLines[0] = new AnimalLine(cfGroups[0], cfGroups[1]);
        animalLines[1] = new AnimalLine(cfGroups[0], cfGroups[2]);
        animalLines[2] = new AnimalLine(cfGroups[1], cfGroups[3]);
        animalLines[3] = new AnimalLine(cfGroups[2], cfGroups[3]);
        
        const linesGroup = new Konva.Group();
        for (const line of animalLines) {
            linesGroup.add(line);
        };
        
        const functionsGroup = new Konva.Group();
        for (const g of cfGroups) {
            functionsGroup.add(g);
        };
        
        const layer = new Konva.Layer();
        layer.add(linesGroup);
        layer.add(functionsGroup);
        
        this.add(layer);
        
        this.cognitiveFunctionGroups = cfGroups;
        this.animalLines = animalLines;
    }
    
    
    redraw(
        functionsStyle,
        observerDecider,
        animals,
        quadra
    ) {
        const isSingleObserver = observerDecider === 'odd';
        
        const opType = new OpType(quadra, isSingleObserver, animals, "MM", "#1");
    
        this.cognitiveFunctionGroups[0].cognitiveFunction = opType.grantStack[0];
        this.cognitiveFunctionGroups[1].cognitiveFunction = opType.grantStack[1];
        this.cognitiveFunctionGroups[2].cognitiveFunction = opType.grantStack[2];
        this.cognitiveFunctionGroups[3].cognitiveFunction = opType.grantStack[3];
    
        for (const line of this.animalLines) {
            line.updateAnimalOrder(opType.animalStack);
        }
        
        this.draw();
    }
}