/**
 * Returns the opposite grant order.
 * @throws {TypeError} If {@link grantOrder} is not a number.
 * @throws {Error} If {@link grantOrder} is not an integer or is out of range.
 */
export function oppositeGrantOrder(grantOrder) {
    if (!Number.isInteger(grantOrder))
        throw new Error("Not an integer.");
    switch (grantOrder) {
        case 0: return 3;
        case 1: return 2;
        case 2: return 1;
        case 3: return 0;
        default: throw new Error("Out of range.");
    }
}



/**
 * Checks if the provided {@link grantIndex} is valid.
 * @throws {TypeError} If {@link grantIndex} is not a number.
 * @throws {Error} If {@link grantIndex} is not an integer or is out of bounds (0-3).
 */
export function validateStackIndex(grantIndex) {
    if (!Number.isInteger(grantIndex))
        throw new Error("Invalid Grant order index. Not an integer.");
    if (grantIndex < 0 || grantIndex >= 4)
        throw new Error("Invalid Grant order index. Out of bounds (0-3).");
}


function isInstanceOfEnum(enumObj, value) {
    return Object.values(enumObj).includes(value);
}



function toCogFunArray(rawCognitiveFunctions) {
    const result = new Array(rawCognitiveFunctions.length);
    for (let i = 0; i < rawCognitiveFunctions.length; i++) {
        let cf = rawCognitiveFunctions[i];
        if (!(cf instanceof CognitiveFunction)) {
            cf = new CognitiveFunction(cf);
        }
        result[i] = cf;
    }
    return result;
}


export const Axis = {
    OBSERVING: 'O',
    DECIDING: 'D',
    
    fromCharacter: function (character) {
        switch (character) {
            case 'O':
            case 'S':
            case 'N':
                return Axis.OBSERVING;
            case 'D':
            case 'F':
            case 'T':
                return Axis.DECIDING;
            default:
                throw new Error("Invalid character.");
        }
    },
    
    opposite: function (axis) {
        return axis === Axis.OBSERVING ? Axis.DECIDING : Axis.OBSERVING;
    }
}


export const Charge = {
    INTROVERTED: 'i',
    EXTROVERTED: 'e',
    
    fromCharacter: function (character) {
        switch (character) {
            case 'i':
                return Charge.INTROVERTED;
            case 'e':
                return Charge.EXTROVERTED;
            default:
                throw new Error("Invalid Charge character.");
        }
    },
    
    opposite: function (charge) {
        switch (charge) {
            case Charge.INTROVERTED:
                return Charge.EXTROVERTED;
            case Charge.EXTROVERTED:
                return Charge.INTROVERTED;
            default:
                throw new Error("Invalid charge.");
        }
    }
}


export const HumanNeed = {
    OI_ORGANIZE: "Oi",
    OE_GATHER: "Oe",
    DI_SELF: "Di",
    DE_TRIBE: "De",
    
    fromString: function (humanNeedLabel) {
        switch (humanNeedLabel) {
            case 'Di':
            case 'Self':
                return HumanNeed.DI_SELF;
            case 'De':
            case 'Tribe':
                return HumanNeed.DE_TRIBE;
            case 'Oi':
            case 'Organize':
                return HumanNeed.OI_ORGANIZE;
            case 'Oe':
            case 'Gather':
                return HumanNeed.OE_GATHER;
            default:
                throw new Error("Invalid human need string.");
        }
    },
    
    getCharge: function (humanNeed) {
        switch (humanNeed) {
            case HumanNeed.OI_ORGANIZE:
            case HumanNeed.DI_SELF:
                return Charge.INTROVERTED;
            case HumanNeed.OE_GATHER:
            case HumanNeed.DE_TRIBE:
                return Charge.EXTROVERTED;
        }
    },
    
    getAxis: function (humanNeed) {
        switch (humanNeed) {
            case HumanNeed.OI_ORGANIZE:
            case HumanNeed.OE_GATHER:
                return Axis.OBSERVING;
            case HumanNeed.DI_SELF:
            case HumanNeed.DE_TRIBE:
                return Axis.DECIDING;
        }
    }
    
}

export const Letter = {
    SENSING: 'S',
    INTUITING: 'N',
    FEELING: 'F',
    THINKING: 'T',
    
    fromCharacter: function (character) {
        switch (character) {
            case 'S':
                return Letter.SENSING;
            case 'N':
                return Letter.INTUITING;
            case 'F':
                return Letter.FEELING;
            case 'T':
                return Letter.THINKING;
            default:
                throw new Error("String is not a valid letter.");
        }
    },
    
    opposite: function (letter) {
        switch (letter) {
            case Letter.SENSING:
                return Letter.INTUITING;
            case Letter.INTUITING:
                return Letter.SENSING;
            case Letter.FEELING:
                return Letter.THINKING;
            case Letter.THINKING:
                return Letter.FEELING;
            default:
                throw new Error("Invalid letter.");
        }
    }
}


export const CognitiveFunction = {
    SI: 'Si',
    SE: 'Se',
    NI: 'Ni',
    NE: 'Ne',
    FI: 'Fi',
    FE: 'Fe',
    TI: 'Ti',
    TE: 'Te',
}


export const Modality = {
    FF_TESTER: 'FF',
    FM_VISUAL: 'FM',
    MF_AUDIO: 'MF',
    MM_KINESTHETIC: 'MM'
}


export const GrantBasedAnimal = {
    STRONGER_INFO: '01',
    STRONGER_ENERGY: '02',
    WEAKER_ENERGY: '13',
    WEAKER_INFO: '23',
    
    All: () => [
        AnimalGrantPosition.STRONGER_INFO,
        AnimalGrantPosition.STRONGER_ENERGY,
        AnimalGrantPosition.WEAKER_ENERGY,
        AnimalGrantPosition.WEAKER_INFO
    ],
    
    toGrantIndexCouple: function (animalGrantPosition) {
        switch (animalGrantPosition) {
            case AnimalGrantPosition.STRONGER_INFO:
                return {
                    strongerIndex: 0,
                    weakerIndex: 1
                };
            case AnimalGrantPosition.STRONGER_ENERGY:
                return {
                    strongerIndex: 0,
                    weakerIndex: 2
                };
            case AnimalGrantPosition.WEAKER_INFO:
                return {
                    strongerIndex: 2,
                    weakerIndex: 3
                };
            case AnimalGrantPosition.WEAKER_ENERGY:
                return {
                    strongerIndex: 1,
                    weakerIndex: 3
                };
        }
    }
}

export const MbtiType = {
    ISFJ: 'ISFJ',
    ISFP: 'ISFP',
    ISTJ: 'ISTJ',
    ISTP: 'ISTP',
    INFJ: 'INFJ',
    INFP: 'INFP',
    INTJ: 'INTJ',
    INTP: 'INTP',
    ESFJ: 'ESFJ',
    ESFP: 'ESFP',
    ESTJ: 'ESTJ',
    ESTP: 'ESTP',
    ENFJ: 'ENFJ',
    ENFP: 'ENFP',
    ENTJ: 'ENTJ',
    ENTP: 'ENTP',
}


export class MbtiTypeData {
    
    constructor(mbtiType) {
        // DEBT Add string checks.
        
        this.grantStack = new Array(4);
        this.grantPositionedAnimals = new Map();
        
        const temperament = mbtiType[0] + mbtiType[3];
        
        // Get first two functions in the stack from temperament.
        switch (temperament) {
            case 'IP':
                this.grantStack[0] = mbtiType[2] + 'i';
                this.grantStack[1] = mbtiType[1] + 'e';
                this.grantPositionedAnimals.set(GrantBasedAnimal.STRONGER_INFO, Animal.CONSUME);
                this.grantPositionedAnimals.set(GrantBasedAnimal.STRONGER_ENERGY, Animal.SLEEP);
                break;
            case 'IJ':
                this.grantStack[0] = mbtiType[1] + 'i';
                this.grantStack[1] = mbtiType[2] + 'e';
                this.grantPositionedAnimals.set(GrantBasedAnimal.STRONGER_INFO, Animal.BLAST);
                this.grantPositionedAnimals.set(GrantBasedAnimal.STRONGER_ENERGY, Animal.SLEEP);
                break;
            case 'EP':
                this.grantStack[0] = mbtiType[1] + 'e';
                this.grantStack[1] = mbtiType[2] + 'i';
                this.grantPositionedAnimals.set(GrantBasedAnimal.STRONGER_INFO, Animal.CONSUME);
                this.grantPositionedAnimals.set(GrantBasedAnimal.STRONGER_ENERGY, Animal.PLAY);
                break;
            case 'EJ':
                this.grantStack[0] = mbtiType[2] + 'e';
                this.grantStack[1] = mbtiType[1] + 'i';
                this.grantPositionedAnimals.set(GrantBasedAnimal.STRONGER_INFO, Animal.BLAST);
                this.grantPositionedAnimals.set(GrantBasedAnimal.STRONGER_ENERGY, Animal.PLAY);
                break;
            default:
                throw new Error("Unexpected characters.");
        }
        
        this.grantStack[2] = this.grantStack[1].opposite();
        this.grantStack[3] = this.grantStack[0].opposite();
        
        const strongInfoAnimal = this.grantPositionedAnimals.get(GrantBasedAnimal.STRONGER_INFO);
        const strongEnergyAnimal = this.grantPositionedAnimals.get(GrantBasedAnimal.STRONGER_ENERGY);
        
        this.grantPositionedAnimals.set(GrantBasedAnimal.WEAKER_INFO, Animal.opposite(strongInfoAnimal));
        this.grantPositionedAnimals.set(GrantBasedAnimal.WEAKER_ENERGY, Animal.opposite(strongEnergyAnimal));
    }
    
    getCognitiveFunction(grantIndex) {
        validateStackIndex(grantIndex);
        
        return this.grantStack[grantIndex];
    }
}


export const Animal = {
    SLEEP: 'S',
    CONSUME: 'C',
    BLAST: 'B',
    PLAY: 'P',
    
    All: () => [Animal.SLEEP, Animal.CONSUME, Animal.BLAST, Animal.PLAY],
    
    fromHumanNeeds: function (humanNeed1, humanNeed2) {
        // DEBT string checks.
        
        switch (humanNeed1[1] + humanNeed2[1]) {
            case 'ee':
                return Animal.PLAY;
            case 'ii':
                return Animal.SLEEP;
            case 'ei':
                return humanNeed1[0] === Axis.OBSERVING ? Animal.CONSUME : Animal.BLAST;
            case 'ie':
                return humanNeed1[0] === Axis.OBSERVING ? Animal.BLAST : Animal.CONSUME;
            default:
                throw new Error("Impossible. Foreign HumanNeed instance.");
        }
    },
    
    isCompatible: function (animalLetter, humanNeed) {
        switch (animalLetter) {
            case Animal.SLEEP:
                return humanNeed === HumanNeed.OI_ORGANIZE || humanNeed === HumanNeed.DI_SELF;
            case Animal.CONSUME:
                return humanNeed === HumanNeed.OE_GATHER || humanNeed === HumanNeed.DI_SELF;
            case Animal.BLAST:
                return humanNeed === HumanNeed.OI_ORGANIZE || humanNeed === HumanNeed.DE_TRIBE;
            case Animal.PLAY:
                return humanNeed === HumanNeed.OE_GATHER || humanNeed === HumanNeed.DE_TRIBE;
        }
    },
    
    opposite: function (animal) {
        switch (animal) {
            case Animal.SLEEP:
                return Animal.PLAY;
            case Animal.CONSUME:
                return Animal.BLAST;
            case Animal.BLAST:
                return Animal.CONSUME;
            case Animal.PLAY:
                return Animal.SLEEP;
        }
    }
}


// HERE Continue changing stuff, and change AnimalStack to AnimalData

export class AnimalData {
    
    constructor(stack) {
        this.stack = new Array(4);
        let tempStack = stack;
        // Removing extra characters.
        tempStack?.replaceAll(/'[^SCBP]'/, '');
        // Splitting all letters into an array and converting to Set ensures that there are no duplicates.
        tempStack = new Set(tempStack.split(''));
        if (tempStack.size < 3 || tempStack.size > 4)
            throw new Error("Invalid animal stack string length.");
        // Adding the missing animal at the end when we have 3.
        if (tempStack.size === 3)
            for (const letter of Animal.All) {
                if (tempStack.add(letter).size === 4)
                    break;
            }
        tempStack.forEach((v) => { this.stack.push(v); });
    }
    
    isCompatible(grantStack) {
        return Animal.isCompatible(this.stack[0], grantStack.getCognitiveFunction(0).humanNeed);
    }
    
    getAnimal(stackIndex) {
        validateStackIndex(stackIndex);
        return this.stack[stackIndex];
    }
    
    isSavior(animal) {
        return this.stack.indexOf(animal) <= 1;
    }
}



export class OpType {
    constructor(grantStack, animalStack, modality) {
        this.isGeneric = false;
        this.grantSortedCogFunInfos = new Array(4);
        this.animalMap = new Map();
        // For GENERIC, show only the 4 letters as they're expected in the generic version of the Cognitive Relay Diagram.
        if (grantStack === OpType.GENERIC_TYPE_SYMBOL) {
            this.isGeneric = true;
            this.grantSortedCogFunInfos[0] = {
                grantIndex: 0,
                cognitiveFunction: new CognitiveFunction("N")
            };
            this.grantSortedCogFunInfos[1] = {
                grantIndex: 1,
                cognitiveFunction: new CognitiveFunction("T")
            };
            this.grantSortedCogFunInfos[2] = {
                grantIndex: 2,
                cognitiveFunction: new CognitiveFunction("F")
            };
            this.grantSortedCogFunInfos[3] = {
                grantIndex: 3,
                cognitiveFunction: new CognitiveFunction("S")
            };
            return;
        }
        // For compiler.
        grantStack = grantStack;
        for (let i = 0; i < 4; i++) {
            this.grantSortedCogFunInfos[i] = {
                grantIndex: i,
                cognitiveFunction: grantStack.getCognitiveFunction(i)
            };
        }
        // DEBT For now we expect to have all other arguments if type is not GENERIC, but that will change once we get more flexible.
        if (animalStack == null)
            throw new Error("Animal stack must be given if type isn't GENERIC.");
        if (modality == null)
            throw new Error("Modality must be given if type isn't GENERIC.");
        if (typeof animalStack === 'string')
            animalStack = new AnimalData(animalStack);
        if (!animalStack.isCompatible(grantStack))
            throw new Error("First animal is incompatible with temperament.");
        for (const anGrPos of AnimalGrantPosition.All) {
            const indexes = AnimalGrantPosition.toGrantIndexCouple(anGrPos);
            const strongerFunction = grantStack.getCognitiveFunction(indexes.strongerIndex);
            const weakerFunction = grantStack.getCognitiveFunction(indexes.weakerIndex);
            const actualAnimal = Animal.fromHumanNeeds(strongerFunction.humanNeed, weakerFunction.humanNeed);
            const animalInfo = {
                animalPosition: anGrPos,
                animal: actualAnimal,
                isSavior: animalStack.isSavior(actualAnimal),
                isDoubleActivated: Animal.opposite(actualAnimal) == animalStack.getAnimal(3)
            };
            this.animalMap.set(anGrPos, animalInfo);
        }
        const firstAnimal = animalStack.getAnimal(0);
        const lastAnimal = animalStack.getAnimal(3);
        for (let i = 0; i < this.grantSortedCogFunInfos.length; i++) {
            const cogFunInfo = this.grantSortedCogFunInfos[i];
            const humanNeed = cogFunInfo.cognitiveFunction.humanNeed;
            const letter = cogFunInfo.cognitiveFunction.letter;
            this.grantSortedCogFunInfos[i] = {
                cognitiveFunction: cogFunInfo.cognitiveFunction,
                grantIndex: cogFunInfo.grantIndex,
                isSavior: Animal.isCompatible(firstAnimal, humanNeed),
                isMasculine: modality[0] == 'M' && letter == Letter.SENSING ||
                    modality[1] == 'M' && humanNeed == HumanNeed.DE_TRIBE,
                isDoubleActivated: !Animal.isCompatible(lastAnimal, humanNeed)
            };
        }
    }
    getCognitiveFunctionInfo(grantIndex) {
        return this.grantSortedCogFunInfos[grantIndex];
    }
    getAnimalInfo(animalGrantPosition) {
        // DEBT When making diagram more flexible we need to allow for mixed defined-undefined animals.
        return this.isGeneric ? undefined : this.animalMap.get(animalGrantPosition);
    }
}
OpType.GENERIC_TYPE_SYMBOL = Symbol();
OpType.GENERIC = new OpType(OpType.GENERIC_TYPE_SYMBOL);



export class DynamicCognitiveFunction {
    constructor(cognitiveFunction) {
        if (cognitiveFunction instanceof CognitiveFunction) {
            cognitiveFunction = cognitiveFunction._internalName;
        }
        if (cognitiveFunction.length < 1 || cognitiveFunction.length > 2) {
            throw new Error("Invalid length.");
        }
        if (cognitiveFunction.length === 1) {
            cognitiveFunction = cognitiveFunction + '?';
        }
        cognitiveFunction = cognitiveFunction[0].toUpperCase() + cognitiveFunction[1].toLowerCase();
        if (/[^FTSNDO]/.test(cognitiveFunction[0])) {
            throw new Error("Invalid first letter.");
        }
        if (/[^ie?]/.test(cognitiveFunction[1])) {
            throw new Error("Invalid second letter.");
        }
        this._internalName = cognitiveFunction;
    }
    get axis() {
        return Axis.fromCharacter(this._internalName[0]);
    }
    get letter() {
        const char1 = this._internalName[0];
        if (/[OD]/.test(char1))
            return undefined;
        return Letter.fromCharacter(char1);
    }
    get charge() {
        const char2 = this._internalName[1];
        if (char2 == '?')
            return undefined;
        return Charge.fromCharacter(char2);
    }
    get humanNeed() {
        const charge = this.charge;
        if (charge == null)
            return undefined;
        return HumanNeed.fromString(this.axis + charge);
    }
    get shortName() {
        const charge = this.charge;
        // First character is always guaranteed, second one depends on presence of charge.
        return this._internalName[0] + (charge ?? '');
    }
    
    opposite() {
        // Opposite letter or axis if letter is not set (axis is always guaranteed not null).
        const letterStr = this.letter == null ? this.axis : Letter.opposite(this.letter);
        // Empty string if charge is not set, or opposite charge.
        const chargeStr = this.charge == null ? '' : Charge.opposite(this.charge);
        // Concatenating characters to create opposite cognitive function.
        return new CognitiveFunction(letterStr + chargeStr);
    }
    
    toString() {
        return this.shortName;
    }
}