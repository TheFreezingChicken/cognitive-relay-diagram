import {Axis, CognitiveFunction, HumanNeed} from "../scripts/op-lib";

const PRIVATE_OPERATION = Symbol();

/**
 * @readonly
 * @enum {string}
 */
export const Axis = {
    OBSERVING: 'O',
    DECIDING: 'D',
    
    /**
     * @param letter {string}
     * @return {Axis}
     */
    fromLetter: function (letter) {
        switch (letter) {
            case 'O':
            case 'S':
            case 'N':
                return this.OBSERVING;
            case 'D':
            case 'F':
            case 'T':
                return this.DECIDING;
            default:
                throw new Error("Invalid letter.");
        }
    },
    
    /**
     * @param letter {string}
     * @return {Axis}
     */
    oppositeOf: function (letter) {
        const axis = this?.fromLetter(letter) ?? throw Error("Missing function.");
        
        if (axis === this.OBSERVING) return this.DECIDING
        else return this.OBSERVING;
    }
}
/** @type {Axis[]} */
Axis.All = [Axis.OBSERVING, Axis.DECIDING];
Object.freeze(Axis);


/**
 * @readonly
 * @enum {string}
 */
export const RealityScope = {
    CONCRETE: 'SF',
    ABSTRACT: 'NT',
    
    fromLetter: function (letter) {
        switch (letter) {
            case 'S':
            case 'F':
                return this.CONCRETE;
            case 'N':
            case 'T':
                return this.ABSTRACT;
            default:
                throw new Error("Invalid letter.");
        }
    }
}
/** @type {RealityScope[]} */
RealityScope.All = [RealityScope.CONCRETE, RealityScope.ABSTRACT];
Object.freeze(RealityScope);


/**
 * @readonly
 * @enum {string}
 */
export const Charge = {
    INTROVERTED: 'i',
    EXTROVERTED: 'e',
    
    fromCharacter: function (character) {
        switch (character) {
            case 'i':
                return this.INTROVERTED;
            case 'e':
                return this.EXTROVERTED;
            default:
                throw new Error("Invalid character.");
        }
    }
}
/** @type {Charge[]} */
Charge.All = [Charge.INTROVERTED, Charge.EXTROVERTED];
Object.freeze(Charge);




/**
 * @readonly
 * @enum {HumanNeedConfig}
 */
export const HumanNeed = {
    DI_SELF: new HumanNeedConfig(Axis.DECIDING, Charge.INTROVERTED),
    DE_TRIBE: new HumanNeedConfig(Axis.DECIDING, Charge.EXTROVERTED),
    OI_ORGANIZE: new HumanNeedConfig(Axis.OBSERVING, Charge.INTROVERTED),
    OE_GATHER: new HumanNeedConfig(Axis.OBSERVING, Charge.EXTROVERTED)


    // /**
    //  * @param humanNeedShortName {string}
    //  */
    // constructor(humanNeedShortName) {
    //     if (new.target === HumanNeed && !HumanNeed.#canConstruct) throw new Error(
    //         "Private constructor. Use static properties and methods."
    //     );
    //
    //     this.rawName = humanNeedShortName;
    //
    //     switch (humanNeedShortName) {
    //         case 'Di':
    //             this.name = 'Self';
    //             break;
    //         case 'De':
    //             this.name = 'Tribe';
    //             break;
    //         case 'Oi':
    //             this.name = 'Organize';
    //             break;
    //         case 'Oe':
    //             this.name = 'Gather';
    //             break;
    //         default:
    //             throw new Error("Impossible. Invalid human need short name.");
    //     }
    //
    //     if (new.target === HumanNeed) {
    //         Object.freeze(this);
    //     }
    // }
}
/** @type {HumanNeed[]} */
HumanNeed.All = [HumanNeed.DI_SELF, HumanNeed.DE_TRIBE, HumanNeed.OI_ORGANIZE, HumanNeed.OE_GATHER];
Object.freeze(HumanNeed);


/** @class */
class HumanNeedConfig extends Object{
    
    /**
     *
     * @param axis {Axis}
     * @param charge {Charge}
     */
    constructor(axis, charge) {
        super();
        
        this._axis = axis;
        this._charge = charge;
        this._name = axis + charge;
    }
    
    
    get axis() {
        return this._axis;
    }
    
    get charge() {
        return this._charge;
    }
    
    get name() {
        return this._name;
    }
    
    
    get longName() {
        switch (this.name) {
            case 'Di':
                return 'Self';
            case 'De':
                return 'Tribe';
            case 'Oi':
                return 'Organize';
            case 'Oe':
                return 'Gather';
            default:
                throw new Error("Impossible. Invalid human need short name.");
        }
    }
    
    
    toString() {
        return this.name;
    }
}





/**
 * @readonly
 * @enum {LetterConfig}
 */
export const Letter = {
    S: new LetterConfig(Axis.OBSERVING, RealityScope.CONCRETE),
    N: new LetterConfig(Axis.OBSERVING, RealityScope.ABSTRACT),
    F: new LetterConfig(Axis.DECIDING, RealityScope.CONCRETE),
    T: new LetterConfig(Axis.DECIDING, RealityScope.ABSTRACT)
}
/** @type {Letter[]} */
Letter.All = []
for (const l in Letter) {
    Letter.All.push(Letter[l]);
}
Object.freeze(Letter);

/**
 * @class
 */
class LetterConfig extends Object {
    
    /**
     *
     * @param axis {Axis}
     * @param realityScope {RealityScope}
     */
    constructor(axis, realityScope) {
        super();
        
        this._axis = axis;
        this._realityScope = realityScope;
        this._name = realityScope[axis === Axis.OBSERVING ? 0 : 1];
    }
    
    
    get axis() {
        return this._axis;
    }
    
    get realityScope() {
        return this._realityScope;
    }
    
    /** @returns {string} */
    get name() {
        return this._name;
    }
    
    get longName() {
        switch (this.name) {
            case 'S':
                return 'Sensing';
            case 'N':
                return 'Intuiting';
            case 'F':
                return 'Feeling';
            case 'T':
                return 'Thinking';
            default:
                throw new Error("Impossible. Invalid human letter");
        }
    }
    
    
    toString() {
        return this.name;
    }
}


// /**
//  * @readonly
//  * @enum {CognitiveFunctionConfig}
//  */
// export const CognitiveFunction = {
// }
// /** @type {CognitiveFunction[]} */
// CognitiveFunction.All = [];
// for (const ltr of Letter.All) {
//     for (const need of HumanNeed.All) {
//         if (need.axis === ltr.axis) {
//             const cf = new CognitiveFunctionConfig(ltr, need);
//             CognitiveFunction[ltr.name + need.charge] = cf;
//             // noinspection JSCheckFunctionSignatures
//             CognitiveFunction.All.push(cf);
//         }
//     }
// }


/**
 * @class
 */
export class CognitiveFunction {
    /**
     * @param {string|CognitiveFunction} cognitiveFunction A {@link CognitiveFunction} to copy or a letter+charge
     *     string.
     */
    constructor(cognitiveFunction) {
        if (cognitiveFunction instanceof CognitiveFunction) cognitiveFunction = cognitiveFunction._internalName;
        if (typeof cognitiveFunction !== 'string') throw new TypeError("Invalid type.");
    
    
        // Check length for validity.
        if (cognitiveFunction.length < 1 || cognitiveFunction.length > 2) throw new Error("Invalid length.");
    
    
        // If it's a one-letter function add a question mark for the introversion/extroversion
        if (cognitiveFunction.length === 1) cognitiveFunction = cognitiveFunction + '?';
    
        // Check first letter for validity.
        if (/[^FTSNDO]/.test(cognitiveFunction[0])) throw new Error("Invalid first letter.");
    
        // Check second letter for validity.
        if (/[^ie?]/.test(cognitiveFunction[1])) throw new Error("Invalid second letter.");
        
        /**
         * Used exclusively internally. Uses '?' for missing charge/need for ease of use.
         * @type {string}
         * @protected
         */
        this._internalName = cognitiveFunction;
    }
    
    
    
    /**
     * @returns {string}
     */
    get name() { return this.letter + this.charge ?? ''; }
    
    
    
    // SLEEP
    // get longName() { throw new Error("Not implemented."); }
    
    // HERE
    
    /**
     *
     * @returns {undefined|string} 'F', 'T', 'S', 'N' or undefined
     */
    get letter() {
        return /[OD]/.test(this.rawLetter) ? undefined : this.rawLetter;
    }
    
    
    /**
     * @returns {undefined|string} 'i', 'e' or undefined
     */
    get charge() {
        return this.rawCharge === '?' ? undefined : this.rawCharge;
    }
    
    
    
    /**
     *
     * @returns {undefined|boolean}
     */
    get isIntroverted() {
        return this.charge && this.charge === 'i';
    }
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isExtroverted() {
        return this.charge && this.charge === 'e';
    }
    
    
    
    /**
     * @returns {boolean}
     */
    get isObserving() {
        return /[SNO]/.test(this.rawLetter);
    }
    
    /**
     * @returns {boolean}
     */
    get isDeciding() {
        return /[FTD]/.test(this.rawLetter);
    }
    
    
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isOi() { return this.isIntroverted && this.isObserving; }
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isOe() { return this.isExtroverted && this.isObserving; }
    
    
    
    /**
     *
     * @returns {boolean}
     */
    get isSensing() {
        return this.letter === 'S';
    }
    
    /**
     *
     * @returns {boolean}
     */
    get isIntuition() {
        return this.letter === 'N';
    }
    
    
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isDi() { return this.isIntroverted && this.isDeciding; }
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isDe() { return this.isExtroverted && this.isDeciding; }
    
    
    
    /** @returns {boolean} */
    get isFeeling() {
        return this.letter === 'F'
    }
    
    /** @returns {boolean} */
    get isThinking() {
        return this.letter === 'T'
    }
    
    
    // SLEEP Add humanNeedOnly() function to return a copy function reduced to "Oi, Oe, Di, De" or undefined.
    
    
    
    
    
    /**
     * Return a copy of this function with both letter and charge inverted.
     * The axis is always maintained, which means that the 'O' and 'D' of a partial function are never changed.
     * @returns {CognitiveFunction}
     */
    opposite() {
        let letter = this.rawLetter;
        let charge = this.rawCharge;
        
        switch (letter) {
            case 'F':
                letter = 'T';
                break;
            case 'T':
                letter = 'F';
                break;
            case 'S':
                letter = 'N';
                break;
            case 'N':
                letter = 'S';
                break;
            default:
                // Do nothing.
                break;
        }
        
        switch (charge) {
            case 'i':
                charge = 'e';
                break;
            case 'e':
                charge = 'i';
                break;
            default:
                // Do nothing.
                break;
        }

        return new CognitiveFunction(letter + charge);
    }
    
    /**
     * Returns a copy of this function with its letter inverted.
     * Axis is always maintained, so 'O' and 'D' partial functions will stay the same.
     * @returns {CognitiveFunction}
     */
    withOppositeLetter() {
        let letter = this.rawLetter;
    
        switch (letter) {
            case 'F':
                letter = 'T';
                break;
            case 'T':
                letter = 'F';
                break;
            case 'S':
                letter = 'N';
                break;
            case 'N':
                letter = 'S';
                break;
            default:
                // Do nothing.
                break;
        }
    
        return new CognitiveFunction(letter + this.rawCharge);
    }
    
    /**
     * Returns a copy of this function with its charge inverted.
     * @return {CognitiveFunction}
     */
    withOppositeCharge() {
        let charge = this.rawCharge;
    
        switch (charge) {
            case 'i':
                charge = 'e';
                break;
            case 'e':
                charge = 'i';
                break;
            default:
                // Do nothing.
                break;
        }
    
        return new CognitiveFunction(this.rawLetter + charge);
    }
    
    
    /**
     * Returns true when this instance is a partial cognitive function. A partial cognitive function is a function
     * with an undefined letter ("O/D" instead of "F/T/S/N") or an undefined charge ("?" instead of "i/e")
     * @returns {boolean}
     */
    get isPartial() {
        return /[OD?]/.test(this.rawName);
    }
    
    /**
     * @param {any|string|CognitiveFunction} otherFunction
     * @returns {boolean|undefined}
     */
    equalsTo(otherFunction) {
        // Convert to CognitiveFunction if string, but also catch invalid strings and return undefined for them.
        try {
            if (typeof otherFunction === 'string') otherFunction = new CognitiveFunction(otherFunction);
        } catch (e) {
            return undefined
        }
        
        if (!(otherFunction instanceof CognitiveFunction)) return undefined;
        
        return this.rawName === otherFunction.rawName;
    }
    
    /**
     * @param otherFunction {CognitiveFunction|string|any}
     * @returns {boolean} True if D/O coin matches, false if it doesn't.
     */
    hasAxisAffinityWith(otherFunction) {
        // No need to check for string validity because we want an error if the argument is not a function.
        if (typeof otherFunction === 'string') otherFunction = new CognitiveFunction(otherFunction);
        if (!(otherFunction instanceof CognitiveFunction)) throw new Error('Invalid argument. Not a function.');
        
        // DEBT (low chance) Assumes even partial functions always have a D/O letter.
        return this.isDeciding && otherFunction.isDeciding || this.isObserving && otherFunction.isObserving;
    }
    
    
    /**
     * @override
     * @returns {string}
     */
    toString() {
        return this.name;
    }
}





// /**
//  * @readonly
//  * @class
//  */
// export class Quadra {
//     static #isConstructorLocked = false;
//     static #_ALPHA = new Quadra("Si", "Fe", "Ne", "Ti");
//     static #_BETA = new Quadra("Se", "Fe", "Ni", "Ti");
//     static #_GAMMA = new Quadra("Se", "Fi", "Ni", "Te");
//     static #_DELTA = new Quadra("Si", "Fi", "Ne", "Te");
//     static #isConstructorLocked = true;
//
//     static #_All = [Quadra.#_ALPHA, Quadra.#_BETA, Quadra.#_GAMMA, Quadra.#_DELTA];
//
//     /**
//      * Si, Fe, Ti, Ne
//      * @type {Quadra}
//      */
//     static get ALPHA() {
//         return this.#_ALPHA;
//     }
//
//     /**
//      * Se, Fe, Ti, Ni
//      * @return {Quadra}
//      */
//     static get BETA() {
//         return this.#_BETA;
//     }
//
//     /**
//      * Se, Fi, Te, Ni
//      * @return {Quadra}
//      */
//     static get GAMMA() {
//         return this.#_GAMMA;
//     }
//
//     /**
//      * Si, Fi, Te, Ne
//      * @type {Quadra}
//      */
//     static get DELTA() {
//         return this.#_DELTA;
//     }
//
//
//
//
//     /**
//      * Array containing all the Quadras.
//      * @type {Quadra[]}
//      */
//     static get All() {
//         return this.#_All;
//     }
//
//
//     // REM We Don't need to use getters for instance properties because we Object.freeze() each instance.
//
//     /** @type {CognitiveFunction} */
//     sensingFunction;
//     /** @type {CognitiveFunction} */
//     feelingFunction;
//     /** @type {CognitiveFunction} */
//     intuitingFunction;
//     /** @type {CognitiveFunction} */
//     thinkingFunction;
//
//     /** @type {CognitiveFunction} */
//     oiFunction;
//     /** @type {CognitiveFunction} */
//     oeFunction;
//     /** @type {CognitiveFunction} */
//     diFunction;
//     /** @type {CognitiveFunction} */
//     deFunction;
//
//     /** @type {CognitiveFunction[]} */
//     allFourFunctions;
//
//
//
//     static getInstance(cognitiveFun1, cognitiveFun2) {
//         function checkFunction(cogFun, argName) {
//             if (typeof cogFun === 'string') cogFun = new CognitiveFunction(cogFun);
//
//             // REM It makes no sense to have partial quadras for now, so we're enforcing non-null + complete functions.
//
//             if (!(cogFun instanceof CognitiveFunction)) {
//                 throw new TypeError(`Invalid ${argName} type.`);
//             }
//
//             if (cogFun.isPartial) throw new Error(`${argName} is a partial function.`);
//
//             return cogFun
//         }
//
//         cognitiveFun1 = checkFunction(cognitiveFun1, "cognitiveFun1");
//         cognitiveFun2 = checkFunction(cognitiveFun2, "cognitiveFun2");
//
//         if (cognitiveFun1.hasAxisAffinityWith(cognitiveFun2)) {
//             throw new Error("Provided functions must be on different axis.");
//         }
//
//         for (const quadra of this.#_All) {
//             if (quadra.includes(cognitiveFun1) && quadra.includes(cognitiveFun2)) return quadra;
//         }
//     }
//
//
//     /**
//      * @param cognitiveFuns {...CognitiveFunction|string}
//      * @return {boolean}
//      */
//     includes(...cognitiveFuns) {
//         let count = 0;
//
//         for (const qCogFun of this.allFourFunctions) {
//             for (let argCogFun of cognitiveFuns) {
//                 // This will throw an error if the element is not a cognitive function.
//                 argCogFun = new CognitiveFunction(argCogFun);
//
//                 if (qCogFun.equalsTo(argCogFun)) count++;
//             }
//         }
//
//         return count === cognitiveFuns.length;
//     }
//
//     /**
//      * DON'T USE. Use {@link _ALPHA}, {@link _BETA}, {@link _GAMMA}, {@link _DELTA}, or {@link getInstance},
//      * @private
//      */
//     constructor(sensingFunction, feelingFunction, intuitionFunction, thinkingFunction) {
//         if (Quadra.#isConstructorLocked) throw new Error("Private constructor, use static properties or methods.");
//
//         sensingFunction = new CognitiveFunction(sensingFunction);
//         feelingFunction = new CognitiveFunction(feelingFunction);
//         intuitionFunction = new CognitiveFunction(intuitionFunction);
//         thinkingFunction = new CognitiveFunction(thinkingFunction);
//
//         this.sensingFunction = sensingFunction;
//         this.feelingFunction = feelingFunction;
//         this.intuitingFunction = intuitionFunction;
//         this.thinkingFunction = thinkingFunction;
//
//         /** @type {CognitiveFunction[]} */
//         const allFunctions = [this.sensingFunction, this.feelingFunction, this.intuitingFunction, this.thinkingFunction];
//         Object.freeze(allFunctions);
//         this.allFourFunctions = allFunctions;
//
//         for (const cogFun of allFunctions) {
//             switch (true) {
//                 case cogFun.isOi:
//                     this.oiFunction = cogFun;
//                     break;
//                 case cogFun.isOe:
//                     this.oeFunction = cogFun;
//                     break;
//                 case cogFun.isDi:
//                     this.diFunction = cogFun;
//                     break;
//                 case cogFun.isDe:
//                     this.deFunction = cogFun;
//                     break;
//             }
//         }
//
//         Object.freeze(this);
//         this.intuitingFunction = "";
//         throw new Error("We shouldn't even be able to reach this.");
//     }
//
//     /**
//      * @return {string}
//      */
//     get name() {
//         switch (this) {
//             case Quadra.ALPHA:
//                 return "Alpha";
//             case Quadra.BETA:
//                 return "Beta";
//             case Quadra.GAMMA:
//                 return "Gamma";
//             case Quadra.DELTA:
//                 return "Delta";
//             default:
//                 throw new Error("This shouldn't be possible.");
//         }
//     }
//
//
//     /**
//      *
//      * @returns {Quadra}
//      */
//     opposite() {
//         switch (this) {
//             case Quadra.ALPHA:
//                 return Quadra.GAMMA;
//             case Quadra.BETA:
//                 return Quadra.DELTA;
//             case Quadra.GAMMA:
//                 return Quadra.ALPHA;
//             case Quadra.DELTA:
//                 return Quadra.BETA;
//             default:
//                 throw new Error("This shouldn't be possible.");
//         }
//     }
//
//     // SLEEP Add oppositeObserverAxis and oppositeDeciderAxis.
// }




// /**
//  * @readonly
//  * @class
//  */
// export class AbsoluteAnimalPositions {
//     // SLEEP Remove "buildInstance" and copy what we did for Quadra.
//
//     static #Args = class Args {
//         constructor(grantIndex1, grantIndex2) {
//             this.grantIndex1 = grantIndex1;
//             this.grantIndex2 = grantIndex2;
//         }
//     }
//
//     static #_UPPER_INFO = this.#buildInstance(0, 1);
//
//     static #_UPPER_ENERGY = this.#buildInstance(0, 2);
//
//     static #_LOWER_INFO = this.#buildInstance(2, 3);
//
//     static #_LOWER_ENERGY = this.#buildInstance(1, 3);
//
//
//     /** @type {Readonly<AbsoluteAnimalPositions>} */
//     static get UPPER_INFO() {
//         return this.#_UPPER_INFO;
//     }
//
//     /** @type {Readonly<AbsoluteAnimalPositions>} */
//     static get UPPER_ENERGY() {
//         return this.#_UPPER_ENERGY;
//     }
//
//     /** @type {Readonly<AbsoluteAnimalPositions>} */
//     static get LOWER_INFO() {
//         return this.#_LOWER_INFO;
//     }
//
//     /** @type {Readonly<AbsoluteAnimalPositions>} */
//     static get LOWER_ENERGY() {
//         return this.#_LOWER_ENERGY;
//     }
//
//     // SLEEP When we have an IDE that doesn't suck ass convert this to a static initializer.
//     /**
//      * @param grantIndex1 {number}
//      * @param grantIndex2 {number}
//      * @return {AbsoluteAnimalPositions}
//      */
//     static #buildInstance(grantIndex1, grantIndex2) {
//         return new AbsoluteAnimalPositions(new this.#Args(grantIndex1, grantIndex2));
//     }
//
//
//     /**
//      *
//      * @param grantIndex1 {number}
//      * @param grantIndex2 {number}
//      * @return {AbsoluteAnimalPositions}
//      */
//     static getInstance(grantIndex1, grantIndex2) {
//         /**
//          * @param i {number}
//          * @param name {string}
//          */
//         function checkIndex(i, name) {
//             if (typeof i !== 'number') throw new TypeError(
//                 `${name} is not a number.`
//             );
//
//             if (!Number.isInteger(i)) throw new Error(
//                 `${name} is not an integer.`
//             );
//
//             if (i < 0 || i >= 4) throw new Error(`${name} is not between 0 and 3 (included).`);
//         }
//
//         checkIndex(grantIndex1, "Grant index 1");
//         checkIndex(grantIndex2, "Grant index 2");
//
//         if (grantIndex1 === grantIndex2) throw new Error("Grant indexes can't be the same.");
//
//         // Return the appropriate immutable instance based on the provided indexes.
//         switch (grantIndex1 + grantIndex2) {
//             // 0 + 1.
//             case 1:
//                 return this.#_UPPER_INFO;
//             // 0 + 2.
//             case 2:
//                 return this.#_UPPER_ENERGY;
//             // 1 + 3.
//             case 4:
//                 return this.#_LOWER_ENERGY;
//             // 2 + 3.
//             case 5:
//                 return this.#_LOWER_INFO;
//             default:
//                 throw new Error("Invalid index couple (same axis not allowed).");
//         }
//     }
//
//
//     /**
//      *
//      * @param args {AbsoluteAnimalPositions.Args}
//      */
//     constructor(args) {
//         if (!(args instanceof AbsoluteAnimalPositions.#Args)) throw new Error(
//             "Private constructor. Use static methods or properties to obtain instances."
//         );
//
//         this.grantIndex1 = args.grantIndex1;
//         this.grantIndex2 = args.grantIndex2;
//
//         Object.freeze(this);
//     }
// }



/**
 * @readonly
 * @class
 */
export class Animal {
    static #_SLEEP = new Animal("Oi", "Di");
    static #_CONSUME = new Animal("Oe", "Di");
    static #_BLAST = new Animal("Oi", "De");
    static #_PLAY = new Animal("Oe", "De");
    
    /** @type {Animal} */
    static get SLEEP() {
        return this.#_SLEEP;
    }
    
    /** @type {Animal} */
    static get CONSUME() {
        return this.#_CONSUME;
    }
    
    /** @type {Animal} */
    static get BLAST() {
        return this.#_BLAST;
    }
    
    /** @type {Animal} */
    static get PLAY() {
        return this.#_PLAY;
    }
    
    // SLEEP Consider dividing constructor in fromName(), fromFunctions(), and copy(), make constructor private, and
    //       fix equality functions accordingly.
    /**
     * @param {CognitiveFunction|string} cogFun1 Two characters string or CognitiveFunction
     * @param {CognitiveFunction|string} cogFun2 Two characters string or CognitiveFunction
     */
    constructor(cogFun1, cogFun2) {
        if (typeof cogFun1 === 'string') cogFun1 = new CognitiveFunction(cogFun1);
        if (typeof cogFun2 === 'string') cogFun2 = new CognitiveFunction(cogFun2);
        if (!(cogFun1 instanceof CognitiveFunction && cogFun2 instanceof CognitiveFunction)) throw new TypeError(
            "One or more arguments is not a cognitive function."
        );
        
        if (!(cogFun1.charge && cogFun2.charge)) throw new Error(
            "Missing charge on one or both functions, which is required for Animals."
        );
        
        if (cogFun1.hasAxisAffinityWith(cogFun2)) throw new Error(
            "Invalid arguments. Functions must be on different axes D+O."
        );
        
        this._dFunction = cogFun1.isDeciding ? cogFun1 : cogFun2;
        this._oFunction = cogFun1.isObserving ? cogFun1 : cogFun2;
        
        let name = cogFun1.charge + cogFun2.charge;
        switch (name) {
            case 'ee':
                name = 'Play'
                break;
            case 'ii':
                name = 'Sleep'
                break;
            case 'ei':
            case 'ie':
                if (this._oFunction.isIntroverted) name = 'Blast'
                else name = 'Consume';
                break;
            default:
                throw new Error("Impossible. Invalid charge. Abort.");
        }
        this._name = name;
        
        Object.freeze(this);
    }
    
    /**
     *
     * @return {CognitiveFunction}
     */
    get decidingFunction() {
        return this._dFunction;
    }
    
    /**
     *
     * @returns {CognitiveFunction}
     */
    get observingFunction() {
        return this._oFunction;
    }
    
    /**
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }
    
    /**
     *
     * @return {string}
     */
    get letter() {
        return this.name[0];
    }
    
    /**
     *
     * @returns {boolean}
     */
    get isPartial() {
        return this.decidingFunction.isPartial || this.observingFunction.isPartial
    }
    
    
    opposite() {
        const oppositeObserver = this.observingFunction.opposite()
        const oppositeDecider = this.observingFunction.opposite()
        
        return new Animal(oppositeObserver, oppositeDecider);
    }
    
    /**
     * @param otherAnimal {Animal}
     * @return {boolean}
     */
    isSameAnimalOf(otherAnimal) {};
    
    /**
     *
     * @param cogFun1 {CognitiveFunction|string}
     * @param cogFun2 {CognitiveFunction|string}
     * @return {boolean}
     */
    isSameAnimalOf(cogFun1, cogFun2) {
        // If second arg is not null, assume it's two functions and make Animal, otherwise use first arg as Animal.
        const otherAnimal = cogFun2 != null ? new Animal(cogFun1, cogFun2) : cogFun1;
        if (!(otherAnimal instanceof Animal)) throw new TypeError("Not an instance of Animal.");
        
        return otherAnimal.name === this.name;
    }
    
    /**
     * @param animalName {string} First letter or full name of the animal.
     * @return {boolean}
     */
    matches(animalName) {
        switch (animalName) {
            case 'Sleep':
            case 'S':
            case 'Consume':
            case 'C':
            case 'Blast':
            case 'B':
            case 'Play':
            case 'P':
                break;
            default:
                throw new Error("Invalid Animal name.");
        }
        
        return this.letter === animalName[0];
    }
}





// /**
//  * @class
//  */
// export class OpType {
//
//     static build512Type(animalStack, saviors, modality) {
//         throw Error("Not implemented.")
//         return undefined;
//     }
//
//
//     constructor(
//         isSingleObserver,
//         isSaviorDi,
//         isSaviorOi,
//         isSaviorSensing,
//         isSaviorFeeling,
//         isSaviorConsume,
//         isSaviorSleep,
//         isInfoDom,
//         isIntroverted,
//         hasMasculineSensory,
//         hasMasculineDe,
//         isFlex,
//         isResponsibility
//     ) {
//         switch (isSingleObserver) {
//             case 'O':
//             case 'ODD':
//             case true:
//                 this._coinMainUnbalance = MainUnbalances.O;
//                 break;
//             case 'D':
//             case 'DOO':
//             case false:
//                 this._coinMainUnbalance = MainUnbalances.D;
//                 break;
//             case null:
//             case undefined:
//                 this._coinMainUnbalance = undefined;
//                 break;
//             default:
//                 throw Error("Invalid argument for isSingleObserver.");
//         }
//
//         switch (isSaviorDi) {
//             case 'Di':
//             case true:
//                 this._coinDeciderCharge = HumanNeeds.Di;
//                 break;
//             case 'De':
//             case false:
//                 this._coinDeciderCharge = HumanNeeds.De;
//                 break;
//             case null:
//             case undefined:
//                 this._coinDeciderCharge = undefined;
//                 break;
//             default:
//                 throw Error("Invalid argument for isSaviorDi.");
//         }
//
//
//         switch (isSaviorOi) {
//             case 'Oi':
//             case true:
//                 this._coinObserverCharge = HumanNeeds.Oi;
//                 break;
//             case 'Oe':
//             case false:
//                 this._coinObserverCharge = HumanNeeds.Oe;
//                 break;
//             case null:
//             case undefined:
//                 this._coinObserverCharge = undefined;
//                 break;
//             default:
//                 throw Error("Invalid argument for isSaviorOi.");
//         }
//
//
//         switch (isSaviorSensing) {
//             case 'S':
//             case true:
//                 this._coinObserverLetter = Letters.S;
//                 break;
//             case 'N':
//             case false:
//                 this._coinObserverLetter = Letters.N;
//                 break;
//             case null:
//             case undefined:
//                 this._coinObserverLetter = undefined;
//                 break;
//             default:
//                 throw Error("Invalid argument for isSaviorSensing.");
//         }
//
//
//
//         switch (isSaviorFeeling) {
//             case 'F':
//             case true:
//                 this._coinDeciderLetter = Letters.F;
//                 break;
//             case 'T':
//             case false:
//                 this._coinDeciderLetter = Letters.T;
//                 break;
//             case null:
//             case undefined:
//                 this._coinDeciderLetter = undefined;
//                 break;
//             default:
//                 throw Error("Invalid argument for isSaviorFeeling.");
//         }
//
//
//         switch (isSaviorConsume) {
//             case 'C':
//             case 'Consume':
//             case true:
//                 this._coinInfoAnimal = Animal.CONSUME;
//                 break;
//             case 'B':
//             case 'Blast':
//             case false:
//                 this._coinInfoAnimal = Animal.BLAST;
//                 break;
//             case null:
//             case undefined:
//                 this._coinInfoAnimal = undefined;
//                 break;
//             default:
//                 throw Error("Invalid argument for isSaviorConsume.");
//         }
//
//
//         switch (isSaviorSleep) {
//             case 'S':
//             case 'Sleep':
//             case true:
//                 this._coinEnergyAnimal = Animal.SLEEP;
//                 break;
//             case 'P':
//             case 'Play':
//             case false:
//                 this._coinEnergyAnimal = Animal.PLAY;
//                 break;
//             case null:
//             case undefined:
//                 this._coinEnergyAnimal = undefined;
//                 break;
//             default:
//                 throw Error("Invalid argument for isSaviorSleep.");
//         }
//
//
//         switch (isInfoDom) {
//             case 'I':
//             case 'Info':
//             case true:
//                 this._coinAnimalDominance = AnimalDominance.Info;
//                 break;
//             case 'E':
//             case 'Energy':
//             case false:
//                 this._coinAnimalDominance = AnimalDominance.Energy;
//                 break;
//             case null:
//             case undefined:
//                 this._coinAnimalDominance = undefined;
//                 break;
//             default:
//                 throw Error("Invalid argument for isInfoDom.");
//         }
//
//
//         switch (isIntroverted) {
//             case 'I':
//             case 'Introvert':
//             case 'Introverted':
//             case true:
//                 this._coinSocialEnergy = SocialEnergy.I;
//                 break;
//             case 'E':
//             case 'Extrovert':
//             case 'Extroverted':
//             case false:
//                 this._coinSocialEnergy = SocialEnergy.E;
//                 break;
//             case null:
//             case undefined:
//                 this._coinSocialEnergy = undefined;
//                 break;
//             default:
//                 throw Error("Invalid argument for isIntroverted.");
//         }
//
//
//         switch (hasMasculineSensory) {
//             case 'M':
//             case 'Masculine':
//             case 'S':
//             case true:
//                 this._coinSensorySexual = SexualCharge.M;
//                 break;
//             case 'F':
//             case 'Feminine':
//             case 'N':
//             case false:
//                 this._coinSensorySexual = SexualCharge.F;
//                 break;
//             case null:
//             case undefined:
//                 this._coinSensorySexual = undefined;
//                 break;
//             default:
//                 throw Error("Invalid argument for hasMasculineSensory.");
//         }
//
//
//         switch (hasMasculineDe) {
//             case 'M':
//             case 'Masculine':
//             case true:
//                 this._coinDeSexual = SexualCharge.M;
//                 break;
//             case 'F':
//             case 'Feminine':
//             case false:
//                 this._coinDeSexual = SexualCharge.F;
//                 break;
//             case null:
//             case undefined:
//                 this._coinDeSexual = undefined;
//                 break;
//             default:
//                 throw Error("Invalid argument for hasMasculineDe.");
//         }
//
//
//         switch (isFlex) {
//             case 'Flex':
//             case true:
//                 this._coinRespect = RespectType.Flex;
//                 break;
//             case 'Friends':
//             case false:
//                 this._coinRespect = RespectType.Friends;
//                 break;
//             case null:
//             case undefined:
//                 this._coinRespect = undefined;
//                 break;
//             default:
//                 throw Error("Invalid argument for isFlex.");
//         }
//
//
//         switch (isResponsibility) {
//             case 'Responsibility':
//             case true:
//                 this._coinAchievements = AchievementType.Responsibility
//                 break;
//             case 'Specialize':
//             case 'Specialization':
//             case false:
//                 this._coinAchievements = AchievementType.Specialize;
//                 break;
//             case null:
//             case undefined:
//                 this._coinAchievements = undefined;
//                 break;
//             default:
//                 throw Error("Invalid argument for isResponsibility.");
//         }
//
//
//         console.log(
//             "Constructing OP type...\n",
//             `ODD/DOO: ${isSingleObserver}\n`,
//             `Oi/Oe: ${isSaviorOi}\n`,
//             `Di/De: ${isSaviorDi}\n`,
//             `S/N: ${isSaviorSensing}\n`,
//             `F/T: ${isSaviorFeeling}\n`,
//             `Consume/Blast: ${isSaviorConsume}\n`,
//             `Sleep/Play: ${isSaviorSleep}\n`,
//             `Info/Energy: ${isInfoDom}\n`,
//             `Introvert/Extrovert: ${isIntroverted}\n`,
//             `M/F Sensory: ${hasMasculineSensory}\n`,
//             `M/F De: ${hasMasculineDe}\n`,
//             `Flex/Friends: ${isFlex}\n`,
//             `Responsibility/Specialize: ${isResponsibility}\n`,
//         )
//
//
//         const conflicts = this.getConflictingCoins();
//
//
//         const saviorFunctions = new Array(2);
//         let obFunc, decFunc;
//         if (!conflicts.SaviorCharges) {
//             const obLet = this._coinObserverLetter?.letter;
//             const obCharge = this._coinObserverLetter?.charge;
//             if (obLet || obCharge) obFunc = new CognitiveFunction((obLet ?? 'O') + (obCharge ?? ''));
//
//             const decLet = this._coinDeciderLetter?.letter;
//             const decCharge = this._coinDeciderLetter?.charge;
//             if (decLet || decCharge) decFunc = new CognitiveFunction((decLet ?? 'D') + (decCharge ?? ''));
//
//             switch (this._coinMainUnbalance) {
//                 case MainUnbalances.O:
//                     saviorFunctions[0] = obFunc;
//                     saviorFunctions[1] = decFunc;
//                     break;
//                 case MainUnbalances.D:
//                     saviorFunctions[0] = decFunc;
//                     saviorFunctions[1] = obFunc;
//                     break;
//             }
//         }
//
//
//
//
//         const grantStack = new Array(4);
//
//         // First and last function.
//         grantStack[0] = saviorFunctions[0];
//         grantStack[3] = grantStack[0]?.opposite();
//         // If introversion/extroversion characters of first and second savior functions are matching, then the correct
//         // second Grant function is the opposite of the second savior function, otherwise it's the savior function itself.
//         const matchingSaviorsExtroversion = saviorFunctions[0]?.charge === saviorFunctions[1]?.charge;
//         grantStack[1] = matchingSaviorsExtroversion ? saviorFunctions[1]?.opposite() : saviorFunctions[1];
//         grantStack[2] = grantStack[1]?.opposite();
//         this._grantStack = grantStack;
//
//
//         // Instantiate Quadra only if at least one of the two savior functions is not undefined.
//         if (decFunc || obFunc) this._quadra = new Quadra(
//             decFunc?.isIntroverted ? decFunc : decFunc?.opposite(),
//             obFunc?.isIntroverted ? obFunc : obFunc?.opposite()
//         )
//         const quad = this._quadra;
//
//
//         // let socialStack;
//         // switch (socialType) {
//         //     case "#1":
//         //         socialStack = "CSPB";
//         //         break;
//         //     case "#2":
//         //         socialStack = "PCBS";
//         //         break;
//         //     case "#3":
//         //         socialStack = "SBCP";
//         //         break;
//         //     case "#4":
//         //         socialStack = "BPSC";
//         //         break;
//         // }
//         // this._socialStack = socialStack;
//     }
//
//     /**
//      * Returns true if indexOrFunction points to a savior function.
//      * @param indexOrFunction {number, string, CognitiveFunction} Either a Grant index or a function.
//      * @return {boolean}
//      * @throws Will throw an error if the argument is not a function.
//      */
//     isSaviorFunction(indexOrFunction) {
//         throw Error("Not implemented.");
//     }
//
//     /**
//      * Returns true if indexOrFunction points to a masculine function.
//      * @param indexOrFunction {number, string, CognitiveFunction} Either a Grant index or a function.
//      * @returns {boolean|undefined}
//      * @throws Will throw an error if the argument is not a function.
//      */
//     isMasculineFunction(indexOrFunction) {
//         throw new Error("Not implemented.");
//     }
//
//
//     isDoubleActivatedFunction(indexOrFunction) {
//         throw new Error("Not implemented.");
//     }
//
//
//     get isPartial() {
//         return !(
//             this._coinMainUnbalance &&
//             this._coinDeciderCharge &&
//             this._coinObserverCharge &&
//             this._coinDeciderLetter &&
//             this._coinObserverLetter &&
//             this._coinInfoAnimal &&
//             this._coinEnergyAnimal &&
//             this._coinAnimalDominance &&
//             this._coinSocialEnergy &&
//             this._coinSensorySexual &&
//             this._coinDeSexual &&
//             this._coinRespect &&
//             this._coinAchievements
//         )
//     }
//
//     /**
//      *
//      * @returns {boolean|undefined}
//      */
//     get isSingleObserver() {
//         const coin = this._coinMainUnbalance;
//
//         return coin && coin === MainUnbalances.O
//     }
//
//     /**
//      *
//      * @returns {boolean|undefined}
//      */
//     get isSingleDecider() {
//         // We need to do the && to maintain 'undefined' on _coinMainUnbalance.
//         return this._coinMainUnbalance && !this.isSingleObserver;
//     }
//
//     /**
//      *
//      * @returns {CognitiveFunction[]}
//      */
//     get grantStack() {
//         return this._grantStack;
//     }
//
//
//
//
//     /**
//      *
//      * @returns {
//      *      {InfoAnimal: boolean, DominanceAndSocialEnergy: boolean, SaviorCharges: boolean, EnergyAnimal: boolean}
//      * }
//      */
//     getConflictingCoins() {
//         // If savior charges are defined an animal is created and we invert it.
//         let saviorAnimal;
//         try {
//             saviorAnimal = new Animal(this._coinDeciderCharge, this._coinObserverCharge);
//         } catch (e) {  }
//         let oppositeSaviorAnimal = saviorAnimal && saviorAnimal.opposite();
//
//
//         // Find the animal that can't be Savior because it must be Last.
//         let incompatibleAnimal;
//         if (this._coinAnimalDominance && this._coinSocialEnergy) {
//             switch(this._coinAnimalDominance[0] + this._coinSocialEnergy[0]) {
//                 case 'II':
//                     incompatibleAnimal = Animals.P;
//                     break;
//                 case 'IE':
//                     incompatibleAnimal = Animals.S;
//                     break;
//                 case 'EI':
//                     incompatibleAnimal = Animals.B;
//                     break;
//                 case 'EE':
//                     incompatibleAnimal = Animals.C;
//                     break;
//                 default:
//                     throw Error("Impossible case.")
//             }
//         }
//
//         return {
//             SaviorCharges: (
//                 oppositeSaviorAnimal?.isSameAnimalOf(this._coinInfoAnimal) ||
//                 oppositeSaviorAnimal?.isSameAnimalOf(this._coinEnergyAnimal) ||
//                 saviorAnimal?.isSameAnimalOf(incompatibleAnimal)
//             ) ?? false,
//
//             InfoAnimal: (
//                 this._coinInfoAnimal?.isSameAnimalOf(oppositeSaviorAnimal) ||
//                 this._coinInfoAnimal?.isSameAnimalOf(incompatibleAnimal)
//             ) ?? false,
//
//             EnergyAnimal: (
//                 this._coinEnergyAnimal?.isSameAnimalOf(oppositeSaviorAnimal) ||
//                 this._coinEnergyAnimal?.isSameAnimalOf(incompatibleAnimal)
//             ) ?? false,
//
//             DominanceAndSocialEnergy: (
//                 incompatibleAnimal?.isSameAnimalOf(saviorAnimal) ||
//                 incompatibleAnimal?.isSameAnimalOf(this._coinInfoAnimal) ||
//                 incompatibleAnimal?.isSameAnimalOf(this._coinEnergyAnimal)
//             ) ?? false
//         };
//     }
//
//
//
//     saviorFunctionsToString() {
//         const s1 = this._saviorFunctions[0];
//         const s2 = this._saviorFunctions[1];
//         return s1 + "/" + s2;
//     }
//
//     animalStackToString() {
//         const a1 = this.animalStack[0];
//         const a2 = this.animalStack[1];
//         const a3 = this.animalStack[2];
//         const a4 = this.animalStack[3];
//         return a1 + a2 + "/" + a3 + "(" + a4 + ")";
//     }
//
//
//
//     toString() {
//         const mod = this.modality;
//         const sav = this.saviorFunctionsToString();
//         const anim = this.animalStackToString();
//         return mod + "-" + sav + "-" + anim + "-" + this.socialType;
//     }
//
//
// }
