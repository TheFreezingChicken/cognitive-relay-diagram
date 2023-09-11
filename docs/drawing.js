const cognitiveFunctionInnerRadius = 50;
const axisDistancePixels = 400;


function totalRadius(circle) {
    return circle.radius() + circle.strokeWidth();
}

function cogFunTextPlacement(coordinate, circle) {
    return coordinate - totalRadius(circle);
}

const feelingFill = '#c82323';
const feelingStroke = '#881a1a';
const thinkingFill = '#6c6c6c';
const thinkingStroke = '#292929';
const sensingFill = '#f3ca24';
const sensingStroke = '#c0912c';
const intuitionFill = '#944cd2';
const intuitionStroke = '#522c73';

const tfcStyleValue = 'tfc';
const opStyleValue = 'op';


function fillColor(cognitiveFunction) {
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


function strokeColor(cognitiveFunction) {
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


function invertFun(cognitiveFunction) {
    let funChar = cognitiveFunction[0];
    let introChar = cognitiveFunction[1];
    
    switch (funChar) {
        case 'F':
            funChar = 'T';
            break;
        case 'T':
            funChar = 'F';
            break;
        case 'S':
            funChar = 'N';
            break;
        case 'N':
            funChar = 'S';
            break;
    }
    
    if (introChar === 'i') introChar = 'e' ; else introChar = 'i';
    
    return funChar + introChar;
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
}

class CognitiveFunctionCircle extends Konva.Circle {
    constructor(scaleFactor, config) {
        super(config);
        
        this.radius(cognitiveFunctionInnerRadius);
        this.strokeWidth(this.radius() / 7);
        
        this.scaleX(scaleFactor);
        this.scaleY(scaleFactor);
    }
}

class AnimalLine extends Konva.Line {
    constructor(circle1, circle2) {
        super({
            points: [circle1.x, circle1.y, circle2.x, circle2.y],
            fill: 'black',
            width: '1',
        });
        
    }
    
    
    animalOrder(order) {
        switch (order) {
            case 1:
                this.width(3);
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


class Animal {
    constructor(deciderFun, observerFun) {
        this.deciderFunction = deciderFun;
        this.observerFunction = observerFun;
    }
}



const diagramContainerElement = document.getElementById('cognitive-diagram-container');
const diagramContainerId = diagramContainerElement.id
const diagramContainerWidth = diagramContainerElement.clientWidth;

const stage = new Konva.Stage({
    container: diagramContainerId,
    width: diagramContainerWidth,
    height: 900
});

// Removed all the dp shit because we can use the "scale" function.
//const dpFactor = 1 / 900;

// Function to scale pixels according to the size of the container.
//
// function dp(pixels) {
//     console.log("pixels:", pixels);
//     console.log("dpFactor:", dpFactor);
//     console.log("stage width:", stage.width());
//     return Math.round(pixels * dpFactor * stage.width());
// }

// TODO Add listener for page resize.

const layer = new Konva.Layer();
const circleGroup = new Konva.Group();
const textGroup = new Konva.Group();


// Function order is relative to the Grant stack.
const firstFunXPos = stage.width() / 2;
const firstFunYPos = cognitiveFunctionInnerRadius + 20;

const lastFunXPos = firstFunXPos;
const lastFunYPos = firstFunYPos + axisDistancePixels;

const axisDistance = lastFunYPos - firstFunYPos;

const secondFunXPos = firstFunXPos - (axisDistance / 2);
const secondFunYPos = axisDistance / 2 + firstFunYPos;

const thirdFunXPos = secondFunXPos + axisDistance;
const thirdFunYPos = secondFunYPos;


const firstFunCircle = new CognitiveFunctionCircle(
    1,
    {
        x: firstFunXPos,
        y: firstFunYPos,
    }
);

const secondFunCircle = new CognitiveFunctionCircle(
    0.85,
    {
        x: secondFunXPos,
        y: secondFunYPos,
    }
);

const thirdFunCircle = new CognitiveFunctionCircle(
    0.8,
    {
        x: thirdFunXPos,
        y: thirdFunYPos,
    }
);

const lastFunCircle = new CognitiveFunctionCircle(
    0.7,
    {
        x: lastFunXPos,
        y: lastFunYPos,
    }
);



const firstToSecondFunLine = new AnimalLine(firstFunCircle, secondFunCircle);
const firstToThirdFunLine = new AnimalLine(firstFunCircle, thirdFunCircle);
const secondToLastFunLine = new AnimalLine(secondFunCircle, lastFunCircle);
const thirdToLastFunLine = new AnimalLine(thirdFunCircle, lastFunCircle);


const firstFunText = new CognitiveFunctionText(firstFunCircle);
const secondFunText = new CognitiveFunctionText(secondFunCircle);
const thirdFunText = new CognitiveFunctionText(thirdFunCircle);
const lastFunText = new CognitiveFunctionText(lastFunCircle);


circleGroup.add(firstFunCircle, secondFunCircle, thirdFunCircle, lastFunCircle);
textGroup.add(firstFunText, secondFunText, thirdFunText, lastFunText);
layer.add(circleGroup, textGroup);
stage.add(layer);


function redrawCircles() {
    const functionsStyle = document.getElementById('functions-style').value;
    const observerDecider = document.getElementById('observer-decider').value;
    const animals = document.getElementById('animals').value;
    const quadra = document.getElementById('quadra').value;
    
    const quadraDi = quadra === "alpha" || quadra === "beta" ? "Ti" : "Fi"
    const quadraDe = quadraDi === "Ti" ? "Fe" : "Te"
    const quadraOi = quadra === "alpha" || quadra === "delta" ? "Si" : "Ni"
    const quadraOe = quadraDi === "Si" ? "Ne" : "Se"
    
    let sleep = new Animal(quadraDi, quadraOi);
    let consume = new Animal(quadraDi, quadraOe);
    let blast = new Animal(quadraDe, quadraOi);
    let play = new Animal(quadraDe, quadraOe);
    
    
    let isSingleDecider = observerDecider === "doo";
    
    let firstAnimal;
    let firstSaviorFun;
    let secondSaviorFun;
    
    switch (animals[0]) {
        case 'S':
            firstAnimal = sleep;
            break;
        case 'C':
            firstAnimal = consume;
            break;
        case 'B':
            firstAnimal = blast;
            break;
        case 'P':
            firstAnimal = play;
            break;
    }
    
    if (isSingleDecider) {
        firstSaviorFun = firstAnimal.deciderFunction;
        secondSaviorFun = firstAnimal.observerFunction;
    } else {
        firstSaviorFun = firstAnimal.observerFunction;
        secondSaviorFun = firstAnimal.deciderFunction;
    }
    
    
    let thirdSaviorFun = invertFun(secondSaviorFun);
    let lastSaviorFun = invertFun(firstSaviorFun);
    // If introversion/extroversion of first and second savior functions are matching, then the correct second Grant
    // function is the opposite of the second savior function, otherwise it's the savior function itself.
    let secondGrantFun = firstSaviorFun[1] === secondSaviorFun[1] ? invertFun(secondSaviorFun) : secondSaviorFun;
    let thirdGrantFun = invertFun(secondGrantFun);
    
    firstFunCircle.fill(fillColor(firstSaviorFun));
    firstFunCircle.stroke(strokeColor(firstSaviorFun));
    secondFunCircle.fill(fillColor(secondGrantFun));
    secondFunCircle.stroke(strokeColor(secondGrantFun));
    thirdFunCircle.fill(fillColor(thirdGrantFun));
    thirdFunCircle.stroke(strokeColor(thirdGrantFun));
    lastFunCircle.fill(fillColor(lastSaviorFun));
    lastFunCircle.stroke(strokeColor(lastSaviorFun));
    
    firstFunText.text(firstSaviorFun);
    secondFunText.text(secondGrantFun);
    thirdFunText.text(thirdGrantFun);
    lastFunText.text(lastSaviorFun);
    
    stage.draw();
}

redrawCircles();