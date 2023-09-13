import {
    AnimalLine,
    axisDistancePixels,
    CognitiveFunctionCircle,
    cognitiveFunctionInnerRadius,
    CognitiveFunctionText,
    fillColor,
    strokeColor
} from "./drawing-utils.js";
import {OpType} from "./op-lib.js";

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
const lineGroup = new Konva.Group();


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


const functionCircles = [
    new CognitiveFunctionCircle(
        1,
        {
            x: firstFunXPos,
            y: firstFunYPos,
        }
    ),
    
    new CognitiveFunctionCircle(
        0.85,
        {
            x: secondFunXPos,
            y: secondFunYPos,
        }
    ),
    
    new CognitiveFunctionCircle(
        0.8,
        {
            x: thirdFunXPos,
            y: thirdFunYPos,
        }
    ),
    
    new CognitiveFunctionCircle(
        0.7,
        {
            x: lastFunXPos,
            y: lastFunYPos,
        }
    )
]



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
lineGroup.add(firstToSecondFunLine, firstToThirdFunLine, secondToLastFunLine, thirdToLastFunLine);
layer.add(circleGroup, textGroup, lineGroup);

lineGroup.moveToBottom();

stage.add(layer);



function redrawCircles() {
    const functionsStyle = document.getElementById('functions-style').value;
    const observerDecider = document.getElementById('observer-decider').value;
    const animals = document.getElementById('animals').value;
    const quadra = document.getElementById('quadra').value;
    
    const isSingleObserver = observerDecider === 'odd';
    
    const opType = new OpType(quadra, isSingleObserver, animals, "MM", "#1");
    
    firstFunCircle.fill(fillColor(opType.grantStack[0]));
    firstFunCircle.stroke(strokeColor(opType.grantStack[0]));
    secondFunCircle.fill(fillColor(opType.grantStack[1]));
    secondFunCircle.stroke(strokeColor(opType.grantStack[1]));
    thirdFunCircle.fill(fillColor(opType.grantStack[2]));
    thirdFunCircle.stroke(strokeColor(opType.grantStack[2]));
    lastFunCircle.fill(fillColor(opType.grantStack[3]));
    lastFunCircle.stroke(strokeColor(opType.grantStack[3]));
    
    firstFunText.text(opType.grantStack[0]);
    secondFunText.text(opType.grantStack[1]);
    thirdFunText.text(opType.grantStack[2]);
    lastFunText.text(opType.grantStack[3]);
    
    // Because of the positiong conventions I chose, Sleep or Play are always on the right side as a first segment.
    if (opType.animalStack[0].match("[S|P]")) firstToThirdFunLine.setAnimalOrder(1);
    else firstToSecondFunLine.setAnimalOrder(1);
    
    
    
    stage.draw();
}

redrawCircles();