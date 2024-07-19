


export const GrantIndex = {
    
    /**
     * Checks if the provided {@link grantIndex} is valid.
     *
     * @param {...number} grantIndex
     *
     * @throws {TypeError} If {@link grantIndex} is not a number.
     * @throws {Error} If {@link grantIndex} is not an integer or is out of bounds (0-3).
     */
    validate(...grantIndex) {
        grantIndex.forEach((grIdx) => {
            if (!Number.isInteger(grIdx))
                throw new Error("Invalid Grant order index. Not an integer.");
            
            if (grIdx < 0 || grIdx > 3)
                throw new Error("Invalid Grant order index. Out of bounds (0-3).");
        })
    },
    
    
    /**
     * Returns the opposite grant index.
     *
     * @param {number} grantIndex
     *
     * @throws {TypeError} If {@link grantIndex} is not a number.
     * @throws {Error} If {@link grantIndex} is not an integer or is out of range.
     */
    opposite(grantIndex) {
        this.validate(grantIndex);
        
        switch (grantIndex)         {
            case 0: return 3;
            case 1: return 2;
            case 2: return 1;
            case 3: return 0;
            default: throw new Error("Out of range.");
        }
    },
    
    
    Couple: class {
        constructor(index1, index2) {
            GrantIndex.validate(index1, index2)
            
            if (index1 === index2) throw new Error("Indexes in Couple can't be equal.");
            
            this.strongerIndex = Math.max(index1, index2);
            this.weakerIndex = Math.min(index1, index2);
        }
    }
}






/**
 * @enum string
 */
export const Axis = {
    OBSERVING: 'O',
    DECIDING: 'D',
    
    fromString(axisString) {
        switch (axisString) {
            case 'O':
            case 'S':
            case 'N':
            case 'Si':
            case 'Se':
            case 'Ni':
            case 'Ne':
                return Axis.OBSERVING;
            case 'D':
            case 'F':
            case 'T':
            case 'Fi':
            case 'Ti':
            case 'Fe':
            case 'Te':
                return Axis.DECIDING;
            default:
                throw new Error("Invalid Axis string.");
        }
    },
    
    /**
     *
     * @param axis {Axis|string}
     * @return {string}
     */
    opposite(axis) {
        axis = Axis.fromString(axis);
        
        return axis === Axis.OBSERVING ? Axis.DECIDING : Axis.OBSERVING;
    }
}




export const Charge = {
    INTROVERTED: 'i',
    EXTROVERTED: 'e',
    
    
    fromString(chargeString) {
        switch (chargeString) {
            case 'i':
            case '?i':
            case 'Di':
            case 'Oi':
            case 'Fi':
            case 'Ti':
            case 'Si':
            case 'Ni':
                return Charge.INTROVERTED;
            case 'e':
            case '?e':
            case 'De':
            case 'Oe':
            case 'Fe':
            case 'Te':
            case 'Se':
            case 'Ne':
                return Charge.EXTROVERTED;
            default:
                throw new Error("Invalid Charge string.");
        }
    },
    
    /**
     *
     * @param charge {Charge|string}
     * @returns {string}
     */
    opposite(charge) {
        charge = Charge.fromString(charge);
        
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




/**
 * @enum string
 */
export const HumanNeed = {
    OI_ORGANIZE: 'Oi',
    OE_GATHER: 'Oe',
    DI_SELF: 'Di',
    DE_TRIBE: 'De',
    
    /**
     * @return {HumanNeed[]}
     */
    getAll() {
        return [this.OI_ORGANIZE, this.OE_GATHER, this.DI_SELF, this.DE_TRIBE];
    },
    
    fromString(humanNeedString) {
        switch (humanNeedString) {
            case 'Di':
            case 'Ti':
            case 'Fi':
            case 'Self':
                return HumanNeed.DI_SELF;
            case 'De':
            case 'Te':
            case 'Fe':
            case 'Tribe':
                return HumanNeed.DE_TRIBE;
            case 'Oi':
            case 'Si':
            case 'Ni':
            case 'Organize':
                return HumanNeed.OI_ORGANIZE;
            case 'Oe':
            case 'Se':
            case 'Ne':
            case 'Gather':
                return HumanNeed.OE_GATHER;
            default:
                throw new Error("Invalid Human Need string.");
        }
    },
    
    /**
     *
     * @param humanNeed {HumanNeed|string}
     * @returns {HumanNeed}
     */
    opposite(humanNeed) {
        humanNeed = HumanNeed.fromString(humanNeed);
        
        switch (humanNeed) {
            case this.OI_ORGANIZE:
                return this.OE_GATHER;
            case this.OE_GATHER:
                return this.OI_ORGANIZE;
            case this.DI_SELF:
                return this.DE_TRIBE;
            case this.DE_TRIBE:
                return this.DI_SELF;
        }
    }
}




/**
 * @enum {string}
 *
 */
export const Letter = {
    SENSING: 'S',
    INTUITING: 'N',
    FEELING: 'F',
    THINKING: 'T',
    
    fromString(letterString) {
        switch (letterString) {
            case 'S':
            case 'Si':
            case 'Se':
                return Letter.SENSING;
            case 'N':
            case 'Ni':
            case 'Ne':
                return Letter.INTUITING;
            case 'F':
            case 'Fi':
            case 'Fe':
                return Letter.FEELING;
            case 'T':
            case 'Ti':
            case 'Te':
                return Letter.THINKING;
            default:
                throw new Error("Invalid Letter string.");
        }
    },
    
    
    /**
     *
     * @param letter {Letter|string}
     * @returns {Letter}
     */
    opposite(letter) {
        letter = Letter.fromString(letter);
        
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
                throw new Error("Invalid Letter.");
        }
    }
}




/**
 * @enum {string}
 */
export const CognitiveFunction = {
    SI: 'Si',
    SE: 'Se',
    NI: 'Ni',
    NE: 'Ne',
    FI: 'Fi',
    FE: 'Fe',
    TI: 'Ti',
    TE: 'Te',
    
    /**
     *
     * @return {CognitiveFunction[]}
     */
    getAll() {
        return [
            this.SI,
            this.SE,
            this.NI,
            this.NE,
            this.FI,
            this.FE,
            this.TI,
            this.TE
        ]
    },
    
    /**
     *
     * @param cogFunString {string}
     * @return CognitiveFunction
     */
    fromString(cogFunString) {
        switch (cogFunString) {
            case 'Si': return this.SI;
            case 'Se': return this.SE;
            case 'Ni': return this.NI;
            case 'Ne': return this.NE;
            case 'Fi': return this.FI;
            case 'Fe': return this.FE;
            case 'Ti': return this.TI;
            case 'Te': return this.TE;
            default:
                throw new Error("Invalid Cognitive Function string.");
        }
    },
    
    /**
     * Tries to combine the provided strings into a single @{link CognitiveFunction}. <br>
     * Redundant coins are ignored and conflicting ones throw an error.
     *
     * @param cogFunStrings {...string}
     *
     * @throws {Error} If any element in {@link cogFunStrings} is found to be an invalid string or it conflicts with strings
     *                 parsed previously.
     *
     * @return CognitiveFunction
     */
    fromPartialFunctionStrings(...cogFunStrings) {
        let axis;
        let letter;
        let charge;
        
        cogFunStrings.forEach((cf) => {
            let tempAxis;
            let tempLetter;
            let tempCharge;
            
            try {
                tempAxis = Axis.fromString(cf);
            } catch {}
            
            try {
                tempLetter = Letter.fromString(cf);
            } catch {}
            
            try {
                tempCharge = Charge.fromString(cf);
            } catch {}
            
            // If all temp variables are null, it means every coin threw an error which means it can't be any coin.
            if (tempAxis === tempLetter === tempCharge == null)
                throw new Error("Found invalid Cognitive Function string.");
            
            if (tempAxis != null && axis !== tempAxis) throw new Error("Conflicting coins were provided.");
            if (tempLetter != null && letter !== tempLetter) throw new Error("Conflicting coins were provided.");
            if (tempCharge != null && charge !== tempCharge) throw new Error("Conflicting coins were provided.");
            
            
            axis = tempAxis ?? axis;
            letter = tempLetter ?? letter;
            charge = tempCharge ?? charge;
        });
        
        
        return this.fromString(letter + charge);
    }
}

// HERE Revisit everything considering that === for strings is a content equality check.




/**
 * @typedef
 * @enum string
 */
export const Modality = {
    FF_TESTER: 'FF',
    FM_VISUAL: 'FM',
    MF_AUDIO: 'MF',
    MM_KINESTHETIC: 'MM'
}




/**
 * @enum string
 */
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




/**
 * @enum string
 */
export const AnimalGrantContext = {
    STRONGER_INFO: 'Info1',
    STRONGER_ENERGY: 'Energy1',
    WEAKER_ENERGY: 'Energy2',
    WEAKER_INFO: 'Info2',
    
    /**
     * @return {AnimalGrantContext[]}
     */
    getAll() {
        return [
            AnimalGrantContext.STRONGER_INFO,
            AnimalGrantContext.STRONGER_ENERGY,
            AnimalGrantContext.WEAKER_ENERGY,
            AnimalGrantContext.WEAKER_INFO
        ];
    }
}



export class MbtiTypeData {
    
    /**
     *
     * @param mbtiType {MbtiType}
     */
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
                this.grantPositionedAnimals.set(AnimalGrantContext.STRONGER_INFO, Animal.CONSUME);
                this.grantPositionedAnimals.set(AnimalGrantContext.STRONGER_ENERGY, Animal.SLEEP);
                break;
            case 'IJ':
                this.grantStack[0] = mbtiType[1] + 'i';
                this.grantStack[1] = mbtiType[2] + 'e';
                this.grantPositionedAnimals.set(AnimalGrantContext.STRONGER_INFO, Animal.BLAST);
                this.grantPositionedAnimals.set(AnimalGrantContext.STRONGER_ENERGY, Animal.SLEEP);
                break;
            case 'EP':
                this.grantStack[0] = mbtiType[1] + 'e';
                this.grantStack[1] = mbtiType[2] + 'i';
                this.grantPositionedAnimals.set(AnimalGrantContext.STRONGER_INFO, Animal.CONSUME);
                this.grantPositionedAnimals.set(AnimalGrantContext.STRONGER_ENERGY, Animal.PLAY);
                break;
            case 'EJ':
                this.grantStack[0] = mbtiType[2] + 'e';
                this.grantStack[1] = mbtiType[1] + 'i';
                this.grantPositionedAnimals.set(AnimalGrantContext.STRONGER_INFO, Animal.BLAST);
                this.grantPositionedAnimals.set(AnimalGrantContext.STRONGER_ENERGY, Animal.PLAY);
                break;
            default:
                throw new Error("Unexpected characters.");
        }
        
        this.grantStack[2] = this.grantStack[1].opposite();
        this.grantStack[3] = this.grantStack[0].opposite();
        
        const strongInfoAnimal = this.grantPositionedAnimals.get(AnimalGrantContext.STRONGER_INFO);
        const strongEnergyAnimal = this.grantPositionedAnimals.get(AnimalGrantContext.STRONGER_ENERGY);
        
        this.grantPositionedAnimals.set(AnimalGrantContext.WEAKER_INFO, Animal.opposite(strongInfoAnimal));
        this.grantPositionedAnimals.set(AnimalGrantContext.WEAKER_ENERGY, Animal.opposite(strongEnergyAnimal));
    }
    
    getCognitiveFunction(grantIndex) {
        GrantIndex.validate(grantIndex);
        
        return this.grantStack[grantIndex];
    }
}


/**
 *
 * @enum string
 */
export const Animal = {
    SLEEP: 'S',
    CONSUME: 'C',
    BLAST: 'B',
    PLAY: 'P',
    
    /**
     *
     * @return {Animal[]}
     */
    getAll() {
        return [Animal.SLEEP, Animal.CONSUME, Animal.BLAST, Animal.PLAY];
    },
    
    /**
     *
     * @param animalString {string}
     */
    fromString(animalString) {
        animalString = animalString.toUpperCase();
        
        switch (animalString) {
            case 'S':
            case 'SLEEP':
                return Animal.SLEEP;
            case 'C':
            case 'CONSUME':
                return Animal.CONSUME;
            case 'B':
            case 'BLAST':
                return Animal.BLAST;
            case 'P':
            case 'PLAY':
                return Animal.PLAY;
            default:
                throw new Error("Invalid Animal string.");
        }
    },
    
    
    /**
     *
     * @param humanNeed1 {CognitiveFunction|HumanNeed|string}
     * @param humanNeed2 {CognitiveFunction|HumanNeed|string}
     * @return {Animal|string}
     */
    fromHumanNeeds(humanNeed1, humanNeed2) {
        // Feeding both args to "fromString" to gatekeep invalid strings.
        humanNeed1 = HumanNeed.fromString(humanNeed1);
        humanNeed2 = HumanNeed.fromString(humanNeed2);
        
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
    
    /**
     *
     * @param animal {Animal|string}
     * @param humanNeed {HumanNeed|string}
     * @return {boolean}
     */
    isCompatible(animal, humanNeed) {
        animal = Animal.fromString(animal);
        humanNeed = HumanNeed.fromString(humanNeed);
        
        switch (animal) {
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
    
    /**
     *
     * @param animal {Animal|string}
     * @return {Animal}
     */
    opposite(animal) {
        animal = Animal.fromString(animal);
        
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
            for (const letter of Animal.getAll) {
                if (tempStack.add(letter).size === 4)
                    break;
            }
        tempStack.forEach((v) => { this.stack.push(v); });
    }
    
    isCompatible(grantStack) {
        return Animal.isCompatible(this.stack[0], grantStack.getCognitiveFunction(0).humanNeed);
    }
    
    getAnimal(stackIndex) {
        GrantIndex.validate(stackIndex);
        return this.stack[stackIndex];
    }
    
    isSavior(animal) {
        return this.stack.indexOf(animal) <= 1;
    }
}



// export class OpType {
//     constructor(grantStack, animalStack, modality) {
//         this.isGeneric = false;
//         this.grantSortedCogFunInfos = new Array(4);
//         this.animalMap = new Map();
//         // For GENERIC, show only the 4 letters as they're expected in the generic version of the Cognitive Relay Diagram.
//         if (grantStack === OpType.GENERIC_TYPE_SYMBOL) {
//             this.isGeneric = true;
//             this.grantSortedCogFunInfos[0] = {
//                 grantIndex: 0,
//                 cognitiveFunction: new CognitiveFunction("N")
//             };
//             this.grantSortedCogFunInfos[1] = {
//                 grantIndex: 1,
//                 cognitiveFunction: new CognitiveFunction("T")
//             };
//             this.grantSortedCogFunInfos[2] = {
//                 grantIndex: 2,
//                 cognitiveFunction: new CognitiveFunction("F")
//             };
//             this.grantSortedCogFunInfos[3] = {
//                 grantIndex: 3,
//                 cognitiveFunction: new CognitiveFunction("S")
//             };
//             return;
//         }
//         // For compiler.
//         grantStack = grantStack;
//         for (let i = 0; i < 4; i++) {
//             this.grantSortedCogFunInfos[i] = {
//                 grantIndex: i,
//                 cognitiveFunction: grantStack.getCognitiveFunction(i)
//             };
//         }
//         // DEBT For now we expect to have all other arguments if type is not GENERIC, but that will change once we get more flexible.
//         if (animalStack == null)
//             throw new Error("Animal stack must be given if type isn't GENERIC.");
//         if (modality == null)
//             throw new Error("Modality must be given if type isn't GENERIC.");
//         if (typeof animalStack === 'string')
//             animalStack = new AnimalData(animalStack);
//         if (!animalStack.isCompatible(grantStack))
//             throw new Error("First animal is incompatible with temperament.");
//         for (const anGrPos of AnimalGrantPosition.All) {
//             const indexes = AnimalGrantPosition.toGrantIndexCouple(anGrPos);
//             const strongerFunction = grantStack.getCognitiveFunction(indexes.strongerIndex);
//             const weakerFunction = grantStack.getCognitiveFunction(indexes.weakerIndex);
//             const actualAnimal = Animal.fromHumanNeeds(strongerFunction.humanNeed, weakerFunction.humanNeed);
//             const animalInfo = {
//                 animalPosition: anGrPos,
//                 animal: actualAnimal,
//                 isSavior: animalStack.isSavior(actualAnimal),
//                 isDoubleActivated: Animal.opposite(actualAnimal) == animalStack.getAnimal(3)
//             };
//             this.animalMap.set(anGrPos, animalInfo);
//         }
//         const firstAnimal = animalStack.getAnimal(0);
//         const lastAnimal = animalStack.getAnimal(3);
//         for (let i = 0; i < this.grantSortedCogFunInfos.length; i++) {
//             const cogFunInfo = this.grantSortedCogFunInfos[i];
//             const humanNeed = cogFunInfo.cognitiveFunction.humanNeed;
//             const letter = cogFunInfo.cognitiveFunction.letter;
//             this.grantSortedCogFunInfos[i] = {
//                 cognitiveFunction: cogFunInfo.cognitiveFunction,
//                 grantIndex: cogFunInfo.grantIndex,
//                 isSavior: Animal.isCompatible(firstAnimal, humanNeed),
//                 isMasculine: modality[0] == 'M' && letter == Letter.SENSING ||
//                     modality[1] == 'M' && humanNeed == HumanNeed.DE_TRIBE,
//                 isDoubleActivated: !Animal.isCompatible(lastAnimal, humanNeed)
//             };
//         }
//     }
//     getCognitiveFunctionInfo(grantIndex) {
//         return this.grantSortedCogFunInfos[grantIndex];
//     }
//     getAnimalInfo(animalGrantPosition) {
//         // DEBT When making diagram more flexible we need to allow for mixed defined-undefined animals.
//         return this.isGeneric ? undefined : this.animalMap.get(animalGrantPosition);
//     }
// }
// OpType.GENERIC_TYPE_SYMBOL = Symbol();
// OpType.GENERIC = new OpType(OpType.GENERIC_TYPE_SYMBOL);



// export class DynamicCognitiveFunction {
//     constructor(cognitiveFunction) {
//         if (cognitiveFunction instanceof CognitiveFunction) {
//             cognitiveFunction = cognitiveFunction._internalName;
//         }
//         if (cognitiveFunction.length < 1 || cognitiveFunction.length > 2) {
//             throw new Error("Invalid length.");
//         }
//         if (cognitiveFunction.length === 1) {
//             cognitiveFunction = cognitiveFunction + '?';
//         }
//         cognitiveFunction = cognitiveFunction[0].toUpperCase() + cognitiveFunction[1].toLowerCase();
//         if (/[^FTSNDO]/.test(cognitiveFunction[0])) {
//             throw new Error("Invalid first letter.");
//         }
//         if (/[^ie?]/.test(cognitiveFunction[1])) {
//             throw new Error("Invalid second letter.");
//         }
//         this._internalName = cognitiveFunction;
//     }
//     get axis() {
//         return Axis.fromCharacter(this._internalName[0]);
//     }
//     get letter() {
//         const char1 = this._internalName[0];
//         if (/[OD]/.test(char1))
//             return undefined;
//         return Letter.fromCharacter(char1);
//     }
//     get charge() {
//         const char2 = this._internalName[1];
//         if (char2 == '?')
//             return undefined;
//         return Charge.fromCharacter(char2);
//     }
//     get humanNeed() {
//         const charge = this.charge;
//         if (charge == null)
//             return undefined;
//         return HumanNeed.fromString(this.axis + charge);
//     }
//     get shortName() {
//         const charge = this.charge;
//         // First character is always guaranteed, second one depends on presence of charge.
//         return this._internalName[0] + (charge ?? '');
//     }
//
//     opposite() {
//         // Opposite letter or axis if letter is not set (axis is always guaranteed not null).
//         const letterStr = this.letter == null ? this.axis : Letter.opposite(this.letter);
//         // Empty string if charge is not set, or opposite charge.
//         const chargeStr = this.charge == null ? '' : Charge.opposite(this.charge);
//         // Concatenating characters to create opposite cognitive function.
//         return new CognitiveFunction(letterStr + chargeStr);
//     }
//
//     toString() {
//         return this.shortName;
//     }
// }