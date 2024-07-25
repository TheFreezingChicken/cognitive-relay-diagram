


export class GrantIndex {
    
    /**
     * Checks if the provided {@link grantIndex} is valid.
     *
     * @param {...number} grantIndex
     *
     * @throws {TypeError} If {@link grantIndex} is not a number.
     * @throws {Error} If {@link grantIndex} is not an integer or is out of bounds (0-3).
     */
    static validate(...grantIndex) {
        grantIndex.forEach((grIdx) => {
            if (!Number.isInteger(grIdx))
                throw new Error("Invalid Grant order index. Not an integer.");
            
            if (grIdx < 0 || grIdx > 3)
                throw new Error("Invalid Grant order index. Out of bounds (0-3).");
        })
    }
    
    
    /**
     * Returns the opposite grant index.
     *
     * @param {number} grantIndex
     *
     * @throws {TypeError} If {@link grantIndex} is not a number.
     * @throws {Error} If {@link grantIndex} is not an integer or is out of range.
     */
    static opposite(grantIndex) {
        this.validate(grantIndex);
        
        switch (grantIndex)         {
            case 0: return 3;
            case 1: return 2;
            case 2: return 1;
            case 3: return 0;
            default: throw new Error("Out of range.");
        }
    }
    
    /**
     *
     * @param animalGrantContext {AnimalGrantContext}
     * @return {GrantIndex.Couple}
     */
    static animalCouple(animalGrantContext) {
        switch (animalGrantContext) {
            case AnimalGrantContext.STRONGER_INFO: return new this.Couple(0, 1);
            case AnimalGrantContext.STRONGER_ENERGY: return new this.Couple(0, 2);
            case AnimalGrantContext.WEAKER_ENERGY: return new this.Couple(1, 3);
            case AnimalGrantContext.WEAKER_INFO: return new this.Couple(2, 3);
            default: throw new Error("Invalid Animal grant context.");
        }
    }
    
    
    static Couple = class {
        get weakerIndex() {
            return this._weakerIndex;
        }
        
        get strongerIndex() {
            return this._strongerIndex;
        }
        
        
        
        constructor(index1, index2) {
            GrantIndex.validate(index1, index2)
            
            if (index1 === index2) throw new Error("Indexes in Couple can't be equal.");
            
            this._strongerIndex = Math.max(index1, index2);
            this._weakerIndex = Math.min(index1, index2);
        }
    }
}






/**
 * @readonly
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
Object.freeze(Axis);


/**
 * @readonly
 * @enum string
 */
export const Charge = {
    INTROVERTED: 'i',
    EXTROVERTED: 'e',
    
    /**
     * @type {Charge[]}
     */
    All: Object.freeze([this.INTROVERTED, this.EXTROVERTED]),
    
    
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
Object.freeze(Charge);




/**
 * @readonly
 * @enum string
 */
export const HumanNeed = {
    OI_ORGANIZE: 'Oi',
    OE_GATHER: 'Oe',
    DI_SELF: 'Di',
    DE_TRIBE: 'De',
    
    /**
     * @type {HumanNeed[]}
     */
    All: Object.freeze([this.OI_ORGANIZE, this.OE_GATHER, this.DI_SELF, this.DE_TRIBE]),
    
    
    fromString(humanNeedString) {
        switch (humanNeedString) {
            case 'Di':
            case 'Ti':
            case 'Fi':
                return HumanNeed.DI_SELF;
            case 'De':
            case 'Te':
            case 'Fe':
                return HumanNeed.DE_TRIBE;
            case 'Oi':
            case 'Si':
            case 'Ni':
                return HumanNeed.OI_ORGANIZE;
            case 'Oe':
            case 'Se':
            case 'Ne':
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
Object.freeze(HumanNeed);




/**
 * @readonly
 * @enum {string}
 *
 */
export const Letter = {
    SENSING: 'S',
    INTUITING: 'N',
    FEELING: 'F',
    THINKING: 'T',
    
    /**
     * @type {Readonly<Letter[]>}
     */
    All: Object.freeze([this.SENSING, this.INTUITING, this.FEELING, this.THINKING]),
    
    
    /**
     *
     * @param letterString {string}
     * @return {Letter}
     */
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
Object.freeze(Letter);




/**
 * @readonly
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
     * @type {CognitiveFunction[]}
     */
    All: Object.freeze([
        this.SI,
        this.SE,
        this.NI,
        this.NE,
        this.FI,
        this.FE,
        this.TI,
        this.TE
    ]),
    // REM If adding more collections, name them AllObserving etc...
    
    
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
    fromPartialCogFunStrings(...cogFunStrings) {
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
            
            // If all temp variables are null, it means every coin threw an error which means the string doesn't represent any
            // coin.
            if (tempAxis === tempLetter === tempCharge == null)
                throw new Error("Found invalid Cognitive Function string.");
            
            if (tempAxis != null && axis !== tempAxis) throw new Error("Conflicting axis were provided.");
            if (tempLetter != null && letter !== tempLetter) throw new Error("Conflicting letters were provided.");
            if (tempCharge != null && charge !== tempCharge) throw new Error("Conflicting charges were provided.");
            
            
            axis = tempAxis ?? axis;
            letter = tempLetter ?? letter;
            charge = tempCharge ?? charge;
        });
        
        if (letter == null && charge == null)
            throw new Error("A complete Cognitive Function couldn't be obtained by the provided strings.");
        
        
        return letter + charge;
    },
    
    
    opposite(cogFun) {
        this.throwIfInvalid(cogFun);
        const letter = Letter.fromString(cogFun);
        const charge = Charge.fromString(cogFun);
        
        return Letter.opposite(letter) + Charge.opposite(charge);
    },
    
    
    /**
     *
     * @param cogFun {...CognitiveFunction|string}
     * @return {boolean}
     */
    isValid(...cogFun) {
        for(const cf in cogFun) {
            if (!this.All.includes(cf)) return false;
        }
        
        return true;
    },
    
    /**
     *
     * @param cogFun {...CognitiveFunction}
     */
    throwIfInvalid(...cogFun) {
        if (!this.isValid(...cogFun)) throw new Error("Invalid Cognitive Function.");
    },
    
}
Object.freeze(CognitiveFunction);

// HERE Revisit everything considering that === for strings is a content equality check.




/**
 * @readonly
 * @enum string
 */
export const Modality = {
    FF_TESTER: 'FF',
    FM_VISUAL: 'FM',
    MF_AUDIO: 'MF',
    MM_KINESTHETIC: 'MM',
    
    /**
     * @readonly
     * @type {Modality[]}
     */
    All: Object.freeze([this.FF_TESTER, this.FM_VISUAL, this.MF_AUDIO, this.MM_KINESTHETIC]),
    
    
    isValid(...modalityString) {
        for (const ms in modalityString) {
            if (!this.All.includes(ms)) return false;
        }
        
        return true;
    },
    
    throwIfInvalid(...modalityString) {
        if (!this.isValid(...modalityString)) throw new Error("Invalid Cognitive Function.");
    }
}
Object.freeze(Modality);



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
    
    
    /**
     *
     * @param firstFunction {CognitiveFunction}
     * @param secondFunction {CognitiveFunction}
     * @return MbtiType
     */
    fromCogFuns(firstFunction, secondFunction) {
        CognitiveFunction.throwIfInvalid(firstFunction, secondFunction);
        
        const axis1 = Axis.fromString(firstFunction);
        const axis2 = Axis.fromString(secondFunction);
        
        if (axis1 === axis2) throw new Error("Provided Cognitive Functions can't be on the same axis.");
        
        
        const firstLetter = firstFunction[1].toUpperCase();
        
        // Convert second Savior function to second Grant function if needed.
        if (secondFunction[1] === firstFunction[1]) secondFunction = CognitiveFunction.opposite(secondFunction);
        
        const middleLetters = axis1 === Axis.OBSERVING ?
            firstFunction[0] + secondFunction[0] :
            secondFunction[0] + firstFunction[0];
        
        let lastLetter = 'x';
        switch (firstFunction) {
            case 'Fi':
            case 'Ti':
            case 'Se':
            case 'Ne':
                lastLetter = 'P';
                break;
            case 'Fe':
            case 'Te':
            case 'Si':
            case 'Ni':
                lastLetter = 'J';
                break;
        }
        
        // noinspection JSValidateTypes | Guaranteed to match one of the types.
        return firstLetter + middleLetters + lastLetter;
    }
}
Object.freeze(MbtiType);




/**
 * @readonly
 * @enum string
 */
export const AnimalGrantContext = {
    STRONGER_INFO: 'Info1',
    STRONGER_ENERGY: 'Energy1',
    WEAKER_ENERGY: 'Energy2',
    WEAKER_INFO: 'Info2',
    
    /**
     * @type {AnimalGrantContext[]}
     */
    All: Object.freeze([
        this.STRONGER_INFO,
        this.STRONGER_ENERGY,
        this.WEAKER_ENERGY,
        this.WEAKER_INFO
    ]),
    
    /**
     *
     * @param animal {Animal|string}
     * @param firstFunction {CognitiveFunction}
     * @return {AnimalGrantContext}
     */
    inType(animal, firstFunction) {
        CognitiveFunction.throwIfInvalid(firstFunction);
        animal = Animal.fromString(animal);
        
        if (Animal.isEnergy(animal)) {
            return Animal.isCompatible(animal, firstFunction) ? this.STRONGER_ENERGY : this.WEAKER_ENERGY;
        } else {
            return Animal.isCompatible(animal, firstFunction) ? this.STRONGER_INFO : this.WEAKER_INFO;
        }
    }
}
Object.freeze(AnimalGrantContext);



/**
 * @readonly
 * @enum string
 */
export const Animal = {
    SLEEP: 'S',
    CONSUME: 'C',
    BLAST: 'B',
    PLAY: 'P',
    
    /**
     *
     * @type {Animal[]}
     */
    All: Object.freeze([this.SLEEP, this.CONSUME, this.BLAST, this.PLAY]),
    
    /**
     *
     * @param animalString {string}
     * @return Animal
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
     * @return {Animal}
     */
    fromHumanNeeds(humanNeed1, humanNeed2) {
        humanNeed1 = HumanNeed.fromString(humanNeed1);
        humanNeed2 = HumanNeed.fromString(humanNeed2);
        
        const axis1 = Axis.fromString(humanNeed1);
        const axis2 = Axis.fromString(humanNeed2);
        
        if (axis1 === axis2) throw new Error("Human Needs axis can't be the same in an Animal.");
        
        
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
                throw new Error("This should've never happened wtf...");
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
            default:
                throw new Error("This should've never happened wtf...");
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
            default:
                throw new Error("This should've never happened wtf...");
        }
    },
    
    /**
     *
     * @param humanNeed {CognitiveFunction}
     * @return {{infoAnimal: Animal, energyAnimal: Animal}}
     */
    coupleFromHumanNeed(humanNeed) {
        // noinspection JSValidateTypes | Needed for better switch.
        humanNeed = HumanNeed.fromString(humanNeed);
        
        switch (humanNeed) {
            case HumanNeed.DI_SELF:
                return {
                    infoAnimal: this.CONSUME,
                    energyAnimal: this.SLEEP
                }
            case HumanNeed.DE_TRIBE:
                return {
                    infoAnimal: this.BLAST,
                    energyAnimal: this.PLAY
                }
            case HumanNeed.OI_ORGANIZE:
                return {
                    infoAnimal: this.BLAST,
                    energyAnimal: this.SLEEP
                }
            case HumanNeed.OE_GATHER:
                return {
                    infoAnimal: this.CONSUME,
                    energyAnimal: this.PLAY
                }
            default:
                throw new Error("This should've never happened wtf...");
        }
    },
    
    /**
     *
     * @param animal {Animal}
     * @return {{decidingHumanNeed: HumanNeed, observingHumanNeed: HumanNeed}}
     */
    toHumanNeeds(animal) {
        animal = this.fromString(animal);
        
        switch (animal) {
            case this.SLEEP:
                return {
                    decidingHumanNeed: HumanNeed.DI_SELF,
                    observingHumanNeed: HumanNeed.OI_ORGANIZE
                }
            case this.CONSUME:
                return {
                    decidingHumanNeed: HumanNeed.DI_SELF,
                    observingHumanNeed: HumanNeed.OE_GATHER
                }
            case this.BLAST:
                return {
                    decidingHumanNeed: HumanNeed.DE_TRIBE,
                    observingHumanNeed: HumanNeed.OI_ORGANIZE
                }
            case this.PLAY:
                return {
                    decidingHumanNeed: HumanNeed.DE_TRIBE,
                    observingHumanNeed: HumanNeed.OE_GATHER
                }
            default:
                throw new Error("This should've never happened wtf...");
        }
    },
    
    
    /**
     *
     * @param animal {Animal}
     * @return {boolean}
     */
    isEnergy(animal) {
        animal = this.fromString(animal);
        
        return animal === this.SLEEP || animal === this.PLAY;
    }
}
Object.freeze(Animal);


/**
 * @typedef {Object} OpTypeCogFunData
 * @property {OpType} parentType
 * @property {CognitiveFunction} cogFun
 * @property {number} grantIndex
 * @property {OpTypeAnimalData} parentInfoAnimal
 * @property {OpTypeAnimalData} parentEnergyAnimal
 * @property {boolean} isSavior
 * @property {boolean} isMasculine
 * @property {boolean} isDoubleActivated
 */

/**
 * @typedef {Object} OpTypeAnimalData
 * @property {OpType} parentType
 * @property {Animal} animal
 * @property {number} stackIndex
 * @property {AnimalGrantContext} grantContext
 * @property {GrantIndex.Couple} grantIndexCouple
 * @property {OpTypeCogFunData} observingCogFun
 * @property {OpTypeCogFunData} decidingCogFun
 * @property {boolean} isSavior
 * @property {boolean} isDoubleActivated
 */

/**
 * @typedef {Object} OpTypeModalityData
 * @property {OpType} parentType
 * @property {Modality} modality
 * @property {OpTypeCogFunData} observingFunction
 * @property {OpTypeCogFunData} decidingFunction
 * @property {OpTypeAnimalData} doubleMasculineAnimal
 * @property {OpTypeAnimalData} doubleFeminineAnimal
 */




/**
 * @class
 */
export class OpType {
    /**
     *
     * @private
     * @type OpTypeCogFunData[]
     */
    _grantStack;
    /**
     * @type {OpTypeAnimalData[]}
     * @private
     */
    _animalStack;
    /**
     * @type {Modality}
     * @private
     */
    _modality;
    
    /**
     *
     * @param firstFunction {CognitiveFunction}
     * @param secondFunction {CognitiveFunction}
     * @param animalStack {string|string[]}
     * @param modality {?Modality}
     */
    constructor(firstFunction, secondFunction, animalStack, modality) {
        CognitiveFunction.throwIfInvalid(firstFunction, secondFunction);
        
        const axis1 = Axis.fromString(firstFunction);
        const axis2 = Axis.fromString(secondFunction);
        
        if (axis1 === axis2) throw new Error("First and Second Functions can't be on the same axis.");
        
        // Convert second Savior function to second Grant function if needed.
        if (firstFunction[1] === secondFunction[1]) secondFunction = CognitiveFunction.opposite(secondFunction);
        
        
        const strongAnimalCouple = Animal.coupleFromHumanNeed(firstFunction);
        
        /** @type {OpTypeCogFunData[]} */
        const grantStack = new Array(4);
        // For now we only assign what we can.
        grantStack[0] = {
            parentType: this,
            cogFun: firstFunction,
            grantIndex: 0,
            isSavior: true
        };
        grantStack[1] = {
            parentType: this,
            cogFun: secondFunction,
            grantIndex: 1,
            isSavior: strongAnimalCouple.energyAnimal === animalStack[0]
        };
        grantStack[2] = {
            parentType: this,
            cogFun: CognitiveFunction.opposite(secondFunction),
            grantIndex: 2,
            isSavior: !grantStack[1].isSavior
        };
        grantStack[3] = {
            parentType: this,
            cogFun: CognitiveFunction.opposite(firstFunction),
            grantIndex: 3,
            isSavior: false
        };
        
        const weakAnimalCouple = Animal.coupleFromHumanNeed(grantStack[3].cogFun);
        
        
        if (Array.isArray(animalStack)) animalStack = animalStack.join('');
        if (typeof animalStack !== 'string') throw new TypeError("Invalid Animal Stack type.");
        
        // Normalizing animal stack.
        animalStack = animalStack.toUpperCase();
        animalStack = animalStack.replaceAll(/'[^SCBP]'/, '');
        
        if (animalStack.length < 3 || animalStack.length > 4) throw new Error("Invalid Animal Stack length.");
        if (Animal.opposite(animalStack[0]) === animalStack[1]) throw new Error("Opposite animals can't be both saviors.");
        
        for (const an of Animal.All) {
            let matchTimes = 0;
            // This doesn't actually replace anything, it just checks for duplicate animals.
            animalStack = animalStack.replace(an,() => {
                if (matchTimes++ > 0) throw new Error("Can't have same Animal twice in the stack.");
                
                return an;
            });
            
            // Since we allow for 3-letters stacks, then the missing animal is the one to add at the end.
            if (!animalStack.includes(an)) animalStack = animalStack + an;
        }
        
        animalStack = animalStack.split('');
        
        
        if (modality != null) {
            Modality.throwIfInvalid(modality);
            
            // HERE FIX This is actually dumb and wrong. Fix it.
            
            grantStack[0].isMasculine = firstFunction[0] === Letter.SENSING && modality[0] === 'M' ||
                HumanNeed.fromString(firstFunction) === HumanNeed.DE_TRIBE && modality[1] === 'M'
            
            grantStack[1].isMasculine = secondFunction[0] === Letter.SENSING && modality[0] === 'M' ||
                HumanNeed.fromString(secondFunction) === HumanNeed.DE_TRIBE && modality[1] === 'M'
            
            grantStack[2].isMasculine = !grantStack[1].isMasculine;
            grantStack[3].isMasculine = !grantStack[0].isMasculine;
        }
        
        
        
        // Convert string animals to array of OpTypeAnimalData.
        
        for (let i = 0; i < 4; i++) {
            const animal = animalStack[i];
            // noinspection JSCheckFunctionSignatures | Guaranteed to fit Animal values.
            const humanNeeds = Animal.toHumanNeeds(animal);
            const isEnergy = humanNeeds.decidingHumanNeed[1] === humanNeeds.observingHumanNeed[1];
            const grantContext = AnimalGrantContext.inType(animal, firstFunction);
            
            /**
             *
             * @type {OpTypeAnimalData}
             */
            const animalData = {
                parentType: this,
                animal: animal,
                stackIndex: i,
                grantContext: grantContext,
                grantIndexCouple: GrantIndex.animalCouple(grantContext),
                isSavior: i < 2,
                isDoubleActivated: i < 2 && Animal.opposite(animal) === animalStack[3],
                decidingCogFun: grantStack.find((cfData) => {
                    return HumanNeed.fromString(cfData.cogFun) === humanNeeds.decidingHumanNeed
                }),
                observingCogFun: grantStack.find((cfData) => {
                    return HumanNeed.fromString(cfData.cogFun) === humanNeeds.observingHumanNeed
                })
            }
            
            if (isEnergy) {
                animalData.decidingCogFun.parentEnergyAnimal = animalData;
                animalData.observingCogFun.parentEnergyAnimal = animalData;
            } else {
                animalData.decidingCogFun.parentInfoAnimal = animalData;
                animalData.observingCogFun.parentInfoAnimal = animalData;
            }
            
            animalData.decidingCogFun.isDoubleActivated = animalData.isDoubleActivated;
            animalData.observingCogFun.isDoubleActivated = animalData.isDoubleActivated;
        }
        
        
        this._grantStack = Object.freeze(grantStack);
        // noinspection JSValidateTypes | Strings are coerced to Animals
        this._animalStack = Object.freeze(animalStack);
        this._modality = modality;
    }
    
    
    /**
     *
     * @param reference {number|Animal|AnimalGrantContext}
     * @return AnimalData
     */
    getAnimalData(reference) {
        switch (true) {
            case Animal.isValid(reference):
                reference = this._animalStack.indexOf(reference);
            case AnimalGrantContext.isValid(reference):
                reference = this._animalConfigurationMap.get(reference);
        }
        
        
    }
    
    // HERE Given the negligible amount of data, it's more reasonable to search for stuff on-the-fly with specific functions or
    //      properties (e.g.: getGrantCogFun(), getCogFunFromLetter(), etc...)
}




// export class AnimalStack {
//
//     constructor(stack) {
//         this.stack = new Array(4);
//
//         let tempStack = stack;
//         // Removing extra characters.
//         tempStack?.replaceAll(/'[^SCBP]'/, '');
//         // Splitting all letters into an array and converting to Set ensures that there are no duplicates.
//         tempStack = new Set(tempStack.split(''));
//         if (tempStack.size < 3 || tempStack.size > 4)
//             throw new Error("Invalid animal stack string length.");
//         // Adding the missing animal at the end when we have 3.
//         if (tempStack.size === 3)
//             for (const letter of Animal.getAll) {
//                 if (tempStack.add(letter).size === 4)
//                     break;
//             }
//         tempStack.forEach((v) => { this.stack.push(v); });
//     }
//
//     isCompatible(grantStack) {
//         return Animal.isCompatible(this.stack[0], grantStack.getCognitiveFunction(0).humanNeed);
//     }
//
//     getAnimal(stackIndex) {
//         GrantIndex.validate(stackIndex);
//         return this.stack[stackIndex];
//     }
//
//     isSavior(animal) {
//         return this.stack.indexOf(animal) <= 1;
//     }
// }



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