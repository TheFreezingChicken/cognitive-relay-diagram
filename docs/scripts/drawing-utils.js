export const cognitiveFunctionInnerRadius = 50;
export const axisDistancePixels = 400;


export function totalRadius(circle) {
    return circle.radius() + circle.strokeWidth();
}

export function cogFunTextPlacement(coordinate, circle) {
    return coordinate - totalRadius(circle);
}

export const feelingFill = '#c82323';
export const feelingStroke = '#881a1a';
export const thinkingFill = '#6c6c6c';
export const thinkingStroke = '#292929';
export const sensingFill = '#f3ca24';
export const sensingStroke = '#c0912c';
export const intuitionFill = '#944cd2';
export const intuitionStroke = '#522c73';

export const tfcStyleValue = 'tfc';
export const opStyleValue = 'op';


export function fillColor(cognitiveFunction) {
    let funChar = cognitiveFunction[0];
    
    let color;
    switch (funChar) {
        case 'F':
            color = feelingFill;
            break;
        case 'T':
            color = thinkingFill;
            break;
        case 'S':
            color = sensingFill;
            break;
        case 'N':
            color = intuitionFill;
            break;
    }
    
    return color;
}


export function strokeColor(cognitiveFunction) {
    let funChar = cognitiveFunction[0];
    
    let color;
    switch (funChar) {
        case 'F':
            color = feelingStroke;
            break;
        case 'T':
            color = thinkingStroke;
            break;
        case 'S':
            color = sensingStroke;
            break;
        case 'N':
            color = intuitionStroke;
            break;
    }
    
    return color;
}



export class CognitiveFunctionText extends Konva.Text {
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
}

export class CognitiveFunctionCircle extends Konva.Circle {
    constructor(scaleFactor, config) {
        super(config);
        
        this.radius(cognitiveFunctionInnerRadius);
        this.strokeWidth(this.radius() / 7);
        
        this.scaleX(scaleFactor);
        this.scaleY(scaleFactor);
    }
}

export class AnimalLine extends Konva.Line {
    constructor(circle1, circle2) {
        super({
            points: [circle1.x(), circle1.y(), circle2.x(), circle2.y()],
            stroke: 'black',
            strokeWidth: '1'
        });
        
    }
    
    
    animalOrder(order) {
        switch (order) {
            case 1:
                this.strokeWidth(3);
                break;
            case 2:
                break;
            case 3:
                this.dash = [5, 3];
                break;
            case 4:
                this.dash = [2, 5];
                break;
        }
    }
}