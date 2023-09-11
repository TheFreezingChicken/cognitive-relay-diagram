const cognitiveFunctionInnerRadius = 80;
const cognitiveFunctionStroke = cognitiveFunctionInnerRadius / 5;
const cognitiveFunctionTotalRadius = cognitiveFunctionInnerRadius + cognitiveFunctionStroke;


function cogFunTextPlacement(coordinate) {
    return coordinate - cognitiveFunctionTotalRadius;
}

const feelingFill = '#c82323';
const feelingStroke = '#881a1a';
const thinkingFill = '#6c6c6c';
const thinkingStroke = '#292929';
const sensingFill = '#f3ca24';
const sensingStroke = '#c0912c';
const intuitionFill = '#944cd2';
const intuitionStroke = '#522c73';


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


function invertFunction(cognitiveFunction) {
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
    constructor(config) {
        super(config);
        
        this.height(cognitiveFunctionTotalRadius * 2);
        this.width(cognitiveFunctionTotalRadius * 2);
        this.fontSize(100);
        this.fontFamily('Arial');
        this.fontStyle('bold');
        this.fill('white');
        this.stroke('black');
        this.strokeWidth(2);
        this.align('center');
        this.verticalAlign('middle')
    }
}

class CognitiveFunctionCircle extends Konva.Circle {
    constructor(config) {
        super(config);
        
        this.radius(cognitiveFunctionInnerRadius);
        this.strokeWidth(cognitiveFunctionStroke);
    }
}


class Animal {
    constructor(deciderFun, osbserverFun) {
        this.deciderFunction = deciderFun;
        this.observerFunction = osbserverFun;
    }
}



const diagramContainerElement = document.getElementById('cognitive-diagram-container');
const diagramContainerId = diagramContainerElement.id
const diagramContainerWidth = diagramContainerElement.clientWidth;

const stage = new Konva.Stage({
    container: diagramContainerId,
    width: diagramContainerWidth,
    height: 400
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


// Defining constants placed as a square. It's easier to think about and then we can just rotate them.
// Function order is relative to the Grant stack.
// Lead function is at the top left corner.
const baseDistance = 50
const leadFunctionXPosition = stage.width() / 2 - cognitiveFunctionTotalRadius - baseDistance;
const leadFunctionYPosition = cognitiveFunctionTotalRadius;

// Second function is below the first function.
const secondFunctionXPosition = leadFunctionXPosition;
const secondFunctionYPosition = leadFunctionYPosition + cognitiveFunctionInnerRadius * 2 + baseDistance * 2;

const thirdFunctionXPosition = stage.width() / 2 + cognitiveFunctionInnerRadius + baseDistance;
const thirdFunctionYPosition = leadFunctionYPosition;

const lastFunctionXPosition = thirdFunctionXPosition;
const lastFunctionYPosition = secondFunctionYPosition;


var firstFunctionCircle = new CognitiveFunctionCircle({
    x: leadFunctionXPosition,
    y: leadFunctionYPosition,
});

var secondFunctionCircle = new CognitiveFunctionCircle({
    x: secondFunctionXPosition,
    y: secondFunctionYPosition,
});

var thirdFunctionCircle = new CognitiveFunctionCircle({
    x: thirdFunctionXPosition,
    y: thirdFunctionYPosition,
});

var lastFunctionCircle = new CognitiveFunctionCircle({
    x: lastFunctionXPosition,
    y: lastFunctionYPosition,
});



var leadFunctionText = new CognitiveFunctionText({
    x: cogFunTextPlacement(firstFunctionCircle.x()),
    y: cogFunTextPlacement(firstFunctionCircle.y()) + 5,
});




layer.add(firstFunctionCircle, secondFunctionCircle, thirdFunctionCircle, lastFunctionCircle);
layer.add(leadFunctionText);
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
    
    
    let isSaviorDeciderIntroverted = animals.startsWith("S") || animals.startsWith("C");
    let isSaviorObserverIntroverted = animals.startsWith("S") || animals.startsWith("B");
    let isSingleDecider = observerDecider === "doo";
    
    let firstAnimal;
    let firstFunction;
    let secondFunction;
    
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
        firstFunction = firstAnimal.deciderFunction;
        secondFunction = firstAnimal.observerFunction;
    } else {
        firstFunction = firstAnimal.observerFunction;
        secondFunction = firstAnimal.deciderFunction;
    }
    
    
    let thirdFunction = invertFunction(secondFunction);
    let lastFunction = invertFunction(firstFunction);
    
    firstFunctionCircle.fill(fillColor(firstFunction));
    firstFunctionCircle.stroke(strokeColor(firstFunction));
    secondFunctionCircle.fill(fillColor(secondFunction));
    secondFunctionCircle.stroke(strokeColor(secondFunction));
    thirdFunctionCircle.fill(fillColor(thirdFunction));
    thirdFunctionCircle.stroke(strokeColor(thirdFunction));
    lastFunctionCircle.fill(fillColor(lastFunction));
    lastFunctionCircle.stroke(strokeColor(lastFunction));
    
    stage.draw();
}

redrawCircles();