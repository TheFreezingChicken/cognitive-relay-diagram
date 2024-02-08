const PRIVATE_OPERATION_SYMBOL = Symbol();


class PrivateConstructorObject extends Object {
    /**
     * @protected
     */
    static _canConstruct = false;
    
    constructor() {
        super();
        const subClass = this.constructor;
        if (!subClass._canConstruct) throw new Error(
            "Private constructor. Use class methods or constants to get instances."
        );
    }
}


class Enum extends PrivateConstructorObject {
    static _All = undefined;
    static get All() {
        return Object.freeze(this._All);
    }
    
    constructor() {
        super();
        
        const enumSubClass = this.constructor;
        if (enumSubClass._All == null) enumSubClass._All = [];
        enumSubClass._All.push(this);
    }
}


/**
 * @readonly
 */
export class Axis extends Enum {
    static _canConstruct = true;
    
    static #OBSERVING = new Axis('O');
    static #DECIDING = new Axis('D');
    
    static {
        this._canConstruct = false;
    }
    
    static get OBSERVING() {
        return this.#OBSERVING;
    }
    
    static get DECIDING() {
        return this.#DECIDING;
    }
    
    
    /**
     * @param character {string}
     * @return {Axis}
     */
    static fromCharacter(character) {
        switch (character) {
            case 'O':
            case 'S':
            case 'N':
                return this.OBSERVING;
            case 'D':
            case 'F':
            case 'T':
                return this.DECIDING;
            default:
                throw new Error("Invalid character.");
        }
    }
    
    
    
    /**
     * @private
     * @param axisLetter {string}
     */
    constructor(axisLetter) {
        super();
        
        this._label = axisLetter;
    }
    
    
    get label() {
        return this._label;
    }
    
    
    
    
    
    /**
     * @return {Axis}
     */
    opposite() {
        if (this === Axis.OBSERVING) return Axis.DECIDING
        else return Axis.OBSERVING;
    }
}






/**
 * @readonly
 */
class RealityScope extends Enum {
    static _canConstruct = true;
    
    static #CONCRETE = new RealityScope('SF');
    static #ABSTRACT = new RealityScope('NT');
    
    static {
        this._canConstruct = false;
    }
    
    
    static get CONCRETE() {
        return this.#CONCRETE;
    }
    
    static get ABSTRACT() {
        return this.#ABSTRACT;
    }
    
    /**
     * @param character {string}
     * @return {RealityScope}
     */
    static fromCharacter(character) {
        switch (character) {
            case 'S':
            case 'F':
                return this.CONCRETE;
            case 'N':
            case 'T':
                return this.ABSTRACT;
            default:
                throw new Error("Invalid Scope letter.");
        }
    }
    
    
    /**
     * @private
     * @param scopeLetters {string}
     */
    constructor(scopeLetters) {
        super();
        
        this._label = scopeLetters;
    }
    
    get label() {
        return this._label;
    }
    
    
    
    /**
     *
     * @param axis {string, Axis}
     * @return string
     */
    getLetterStringFromAxis(axis) {
        switch (axis) {
            case Axis.OBSERVING:
            case 'O':
                return this._label[0];
            case Axis.DECIDING:
            case 'D':
                return this._label[1];
            default:
                throw new Error("Invalid axis argument.");
        }
    }
    
    
    toString() {
        return this.label;
    }
}




// SLEEP Finish enumifying ones below if the above ones behave correctly.


/**
 * @readonly
 */
class Charge extends PrivateConstructorObject {
    static _canConstruct = true;
    
    static #INTROVERTED = new Charge('i');
    static #EXTROVERTED = new Charge('e');
    
    static {
        this._canConstruct = false;
    }
    
    static get INTROVERTED() {
        return this.#INTROVERTED;
    }
    
    static get EXTROVERTED() {
        return this.#EXTROVERTED;
    }
    
    /**
     * @param character {string}
     * @return {Charge}
     */
    static fromCharacter(character) {
        switch (character) {
            case 'i':
                return this.INTROVERTED;
            case 'e':
                return this.EXTROVERTED;
            default:
                throw new Error("Invalid Charge character.");
        }
    }
    
    static #All = [this.INTROVERTED, this.EXTROVERTED];
    
    static get All() {
        return this.#All;
    }
    
    /**
     * @private
     * @param chargeLetter {string}
     */
    constructor(chargeLetter) {
        super();
        
        this._label = chargeLetter;
    }
    
    
    get label() {
        return this._label;
    }
    
    
    
    opposite() {
        switch (this) {
            case Charge.INTROVERTED:
                return Charge.EXTROVERTED;
            case Charge.EXTROVERTED:
                return Charge.INTROVERTED;
            default:
                throw new Error("Impossible. Foreign Charge instance.");
        }
    }
    
    
    toString() {
        return this.label;
    }
}


/**
 * @readonly
 */
class HumanNeed extends PrivateConstructorObject {
    static _canConstruct = true;
    
    static #DI_SELF = new HumanNeed(Axis.DECIDING, Charge.INTROVERTED);
    static #DE_TRIBE = new HumanNeed(Axis.DECIDING, Charge.EXTROVERTED);
    static #OI_ORGANIZE = new HumanNeed(Axis.OBSERVING, Charge.INTROVERTED);
    static #OE_GATHER = new HumanNeed(Axis.OBSERVING, Charge.EXTROVERTED);
    
    static {
        this._canConstruct = false;
    }
    
    static get DI_SELF() {
        return this.#DI_SELF;
    }
    
    static get DE_TRIBE() {
        return this.#DE_TRIBE;
    }
    
    static get OI_ORGANIZE() {
        return this.#OI_ORGANIZE;
    }
    
    static get OE_GATHER() {
        return this.#OE_GATHER;
    }
    
    
    static #All = [this.DI_SELF,this.DE_TRIBE,this.OI_ORGANIZE,this.OE_GATHER];
    static get All() {
        return this.#All;
    }
    
    
    static fromString(humanNeedLabel) {
        switch (humanNeedLabel) {
            case 'Di':
            case 'Self':
                return this.DI_SELF;
            case 'De':
            case 'Tribe':
                return this.DE_TRIBE;
            case 'Oi':
            case 'Organize':
                return this.OI_ORGANIZE;
            case 'Oe':
            case 'Gather':
                return this.OE_GATHER;
            default:
                throw new Error("Invalid human need string.");
        }
    }
    
    
    /**
     * @param axis {Axis}
     * @param charge {Charge}
     */
    constructor(axis, charge) {
        super();
        
        this._axis = axis;
        this._charge = charge;
        this._label = axis.label + charge.label;
    }
    
    get label() {
        return this._label;
    }
    get charge() {
        return this._charge;
    }
    get axis() {
        return this._axis;
    }
    
    get longName() {
        switch (this) {
            case HumanNeed.DI_SELF:
                return 'Self';
            case HumanNeed.DE_TRIBE:
                return 'Tribe';
            case HumanNeed.OI_ORGANIZE:
                return 'Organize';
            case HumanNeed.OE_GATHER:
                return 'Gather';
            default:
                throw new Error("Impossible. Foreign Human Need instance.");
        }
    }
    
    toString() {
        return this.label;
    }
}



/**
 * @readonly
 */
class Letter extends PrivateConstructorObject {
    static _canConstruct = true;
    
    static #S = new Letter(Axis.OBSERVING, RealityScope.CONCRETE);
    static #N = new Letter(Axis.OBSERVING, RealityScope.ABSTRACT);
    static #F = new Letter(Axis.DECIDING, RealityScope.CONCRETE);
    static #T = new Letter(Axis.DECIDING, RealityScope.ABSTRACT);
    
    static {
        this._canConstruct = false;
    }
    
    
    static get Sensing() {
        return this.#S;
    }
    
    static get Intuiting() {
        return this.#N;
    }
    
    static get Feeling() {
        return this.#F;
    }
    
    static get Thinking() {
        return this.#T;
    }
    
    
    static #All = [this.Sensing,this.Intuiting,this.Feeling,this.Thinking];
    static get All() {
        return this.#All;
    }
    
    
    static fromCharacter(character) {
        switch (character) {
            case 'S':
                return this.Sensing;
            case 'N':
                return this.Intuiting;
            case 'F':
                return this.Feeling;
            case 'T':
                return this.Thinking;
            default:
                throw new Error("String is not a valid letter.");
        }
    }
    
    
    /**
     *
     * @param axis {Axis}
     * @param realityScope {RealityScope}
     */
    constructor(axis, realityScope) {
        super();
        
        this._axis = axis;
        this._realityScope = realityScope;
        this._label = realityScope.getLetterStringFromAxis(axis);
    }
    
    
    get axis() {
        return this._axis;
    }
    
    get realityScope() {
        return this._realityScope;
    }
    
    get label() {
        return this._label;
    }
    
    get longName() {
        switch (this) {
            case Letter.Sensing:
                return 'Sensing';
            case Letter.Intuiting:
                return 'Intuiting';
            case Letter.Feeling:
                return 'Feeling';
            case Letter.Thinking:
                return 'Thinking';
            default:
                throw new Error("Impossible. Foreign Letter instance.");
        }
    }
    
    toString() {
        return this.label;
    }
    
    
    
    opposite() {
        switch (this) {
            case Letter.Sensing:
                return Letter.Intuiting;
            case Letter.Intuiting:
                return Letter.Sensing;
            case Letter.Feeling:
                return Letter.Thinking;
            case Letter.Thinking:
                return Letter.Feeling;
            default:
                throw new Error("Impossible. Foreign Letter instance.");
        }
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
        
        // Normalize case.
        cognitiveFunction = cognitiveFunction[0].toUpperCase() + cognitiveFunction[1].toLowerCase();
    
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
    
    
    // REM:
    //   - we use _internalName for raw characters
    //   - we always have the first letter (O or D at the very least)
    //   - missing charge == '?'
    
    /**
     *
     * @return {undefined|Letter}
     */
    get letter() {
        const char1 = this._internalName[0];
        
        if (/[OD]/.test(char1)) return undefined;
        
        return Letter.fromCharacter(char1);
    }
    
    
    /**
     *
     * @return {undefined|Charge}
     */
    get charge() {
        const char2 = this._internalName[1];
        
        // noinspection EqualityComparisonWithCoercionJS
        if (char2 == '?') return undefined;
        
        return Charge.fromCharacter(char2);
    }
    
    
    get axis() {
        return Axis.fromCharacter(this._internalName[0]);
    }
    
    get realityScope() {
        const letter = this.letter;
        if (letter == null) return undefined;
        
        return letter.realityScope;
    }
    
    get humanNeed () {
        const charge = this.charge;
        if (charge == null) return undefined;
        
        return HumanNeed.fromString(this.axis.label + charge.label);
    }
    
    
    get label() {
        /** @type {Charge|undefined} */
        const charge = this.charge;
        return this._internalName[0] + (charge?.label ?? '');
    }
    
    
    
    // SLEEP
    // get longName() { throw new Error("Not implemented."); }
    
    
    
    
    
    
    /**
     *
     * @returns {undefined|boolean}
     */
    get isIntroverted() {
        return this.charge && this.charge === Charge.INTROVERTED;
    }
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isExtroverted() {
        return this.charge && this.charge === Charge.EXTROVERTED;
    }
    
    
    
    /**
     * @returns {boolean}
     */
    get isObserving() {
        return this.axis === Axis.OBSERVING;
    }
    
    /**
     * @returns {boolean}
     */
    get isDeciding() {
        return this.axis === Axis.DECIDING;
    }
    
    
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isOi() { return this.humanNeed === HumanNeed.OI_ORGANIZE; }
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isOe() { return this.humanNeed === HumanNeed.OE_GATHER; }
    
    
    
    /**
     *
     * @returns {boolean}
     */
    get isSensing() {
        return this.letter === Letter.Sensing;
    }
    
    /**
     *
     * @returns {boolean}
     */
    get isIntuition() {
        return this.letter === Letter.Intuiting;
    }
    
    
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isDi() { return this.humanNeed === HumanNeed.DI_SELF; }
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isDe() { return this.humanNeed === HumanNeed.DE_TRIBE; }
    
    
    
    /** @returns {boolean} */
    get isFeeling() {
        return this.letter === Letter.Feeling;
    }
    
    /** @returns {boolean} */
    get isThinking() {
        return this.letter === Letter.Thinking;
    }
    
    
    
    
    
    
    
    
    /**
     * Return a copy of this function with both letter and charge inverted.
     * The axis is always maintained, which means that the 'O' and 'D' of a partial function are never changed.
     * @returns {CognitiveFunction}
     */
    opposite() {
        const letterStr = this.letter?.opposite()?.label ?? this.axis.label;
        const chargeStr = this.charge?.opposite()?.label ?? '';

        return new CognitiveFunction(letterStr + chargeStr);
    }
    
    /**
     * Returns a copy of this function with its letter inverted.
     * Axis is always maintained, so 'O' and 'D' partial functions will stay the same.
     * @returns {CognitiveFunction}
     */
    withOppositeLetter() {
        const letterStr = this.letter?.opposite()?.label ?? this.axis.label;
        const chargeStr = this._internalName[1];
        
        return new CognitiveFunction(letterStr + chargeStr);
    }
    
    /**
     * Returns a copy of this function with its charge inverted.
     * @return {CognitiveFunction}
     */
    withOppositeCharge() {
        const letterStr = this._internalName[0];
        const chargeStr = this.charge?.opposite()?.label ?? '';
        
        return new CognitiveFunction(letterStr + chargeStr);
    }
    
    
    /**
     * Returns true when this instance is a partial cognitive function. A partial cognitive function is a function
     * with an undefined letter ("O/D" instead of "F/T/S/N") or an undefined charge ("?" instead of "i/e")
     * @returns {boolean}
     */
    get isPartial() {
        return /[OD?]/.test(this._internalName);
    }
    
    /**
     * @param {string|CognitiveFunction} otherFunction
     * @returns {boolean|undefined}
     */
    equalsTo(otherFunction) {
        try {
            if (typeof otherFunction === 'string') otherFunction = new CognitiveFunction(otherFunction);
        } catch (e) {
            throw new Error("String argument isn't a valid cognitive function.");
        }
        
        if (!(otherFunction instanceof CognitiveFunction)) throw TypeError("Invalid argument type.");
        
        return this.label === otherFunction.label;
    }
    
    
    /**
     * Same as [equalsTo] but doesn't accept strings.
     *
     * @param otherFunction {CognitiveFunction}
     * @return {boolean|undefined}
     */
    strictlyEqualsTo(otherFunction) {
        if (!(otherFunction instanceof CognitiveFunction)) throw TypeError("Not an instance of CognitiveFunction.");
        
        return this.equalsTo(otherFunction);
    }
    
    
    /**
     * @param otherFunction {CognitiveFunction|string}
     * @returns {boolean} True if both functions can appear in a single type. False otherwise.
     */
    isCompatibleWith(otherFunction) {
        try {
            if (typeof otherFunction === 'string') otherFunction = new CognitiveFunction(otherFunction);
        } catch (e) {
            throw new Error("String argument isn't a valid cognitive function.");
        }
        if (!(otherFunction instanceof CognitiveFunction)) throw new TypeError('Invalid argument type.');
        
        if (this.axis !== otherFunction.axis) return true;
        
        return !(
            this.charge != null && this.charge === otherFunction.charge ||
            this.letter != null && this.letter === otherFunction.letter
        );
    }
    
    
    
    /**
     * @param otherFunction {CognitiveFunction|string}
     * @returns {boolean} True if both functions can be Savior functions in a single type. False otherwise.
     */
    canBeSaviorWith(otherFunction) {
        try {
            if (typeof otherFunction === 'string') otherFunction = new CognitiveFunction(otherFunction);
        } catch (e) {
            throw new Error("String argument isn't a valid cognitive function.");
        }
        if (!(otherFunction instanceof CognitiveFunction)) throw new TypeError('Invalid argument type.');
        
        if (this.axis === otherFunction.axis) return false;
        
        return !(
            this.charge != null && this.charge === otherFunction.charge ||
            this.letter != null && this.letter === otherFunction.letter
        );
    }
    
    
    /**
     * @override
     * @returns {string}
     */
    toString() {
        return this.label;
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
 */
export class Animal extends Enum {
    static _canConstruct = true;
    
    static #SLEEP = new Animal(HumanNeed.OI_ORGANIZE, HumanNeed.DI_SELF);
    static #CONSUME = new Animal(HumanNeed.OE_GATHER, HumanNeed.DI_SELF);
    static #BLAST = new Animal(HumanNeed.OI_ORGANIZE, HumanNeed.DE_TRIBE);
    static #PLAY = new Animal(HumanNeed.OE_GATHER, HumanNeed.DE_TRIBE);
    
    static {
        this._canConstruct = false;
    }
    
    
    static get SLEEP() {
        return this.#SLEEP;
    }
    
    static get CONSUME() {
        return this.#CONSUME;
    }
    
    static get BLAST() {
        return this.#BLAST;
    }
    
    static get PLAY() {
        return this.#PLAY;
    }
    
    
    /**
     * @param humanNeed1 {string|HumanNeed|CognitiveFunction}
     * @param humanNeed2 {string|HumanNeed|CognitiveFunction}
     * @return {Animal}
     */
    static fromHumanNeeds(humanNeed1, humanNeed2) {
        // Reducing other types to human needs first.
        
        try {
            if (typeof humanNeed1 === 'string') humanNeed1 = new CognitiveFunction(humanNeed1);
            if (typeof humanNeed2 === 'string') humanNeed2 = new CognitiveFunction(humanNeed2);
        } catch (e) {
            throw new Error("The provided string argument isn't a valid CognitiveFunction.");
        }
        
        if (humanNeed1 instanceof CognitiveFunction) humanNeed1 = humanNeed1.humanNeed;
        if (humanNeed2 instanceof CognitiveFunction) humanNeed2 = humanNeed2.humanNeed;
        
        if (!(humanNeed1 instanceof HumanNeed && humanNeed2 instanceof HumanNeed)) throw new TypeError(
            "Invalid type for one or more arguments."
        );
        
        if (humanNeed1.axis === humanNeed2.axis) throw new Error(
            "Can't have two human needs on the same axis for an Animal."
        );
        
        switch (humanNeed1.label[1] + humanNeed2.label[2]) {
            case 'ee':
                return this.PLAY;
            case 'ii':
                return this.SLEEP;
            case 'ei':
                return humanNeed1.axis === Axis.OBSERVING ? this.CONSUME : this.BLAST;
            case 'ie':
                return humanNeed1.axis === Axis.OBSERVING ? this.BLAST : this.CONSUME;
            default:
                throw new Error("Impossible. Foreign HumanNeed instance.");
        }
    }
    
    
    /**
     * 
     * @param animalString {string}
     * @return {Animal}
     */
    static fromAnimalString(animalString) {
        switch (animalString) {
            case 'S':
            case 'SLEEP':
                return this.SLEEP;
            case 'C':
            case 'CONSUME':
                return this.CONSUME;
            case 'B':
            case 'BLAST':
                return this.BLAST;
            case 'P':
            case 'PLAY':
                return this.PLAY;
            default:
                throw new Error("Invalid Animal string.");
        }
    }
    
    
    /**
     * @param observingHumanNeed {HumanNeed}
     * @param decidingHumanNeed {HumanNeed}
     */
    constructor(observingHumanNeed, decidingHumanNeed) {
        super();
        
        let label;
        if (observingHumanNeed === HumanNeed.OI_ORGANIZE) {
            label = decidingHumanNeed === HumanNeed.DI_SELF ? 'S' : 'B';
        } else {
            label = decidingHumanNeed === HumanNeed.DI_SELF ? 'C' : 'P';
        }
        
        this._observingHumanNeed = observingHumanNeed;
        this._decidingHumanNeed = decidingHumanNeed;
        this._label = label;
    }
    
    
    
    get label() {
        return this._label;
    }
    
    get decidingFunction() {
        return this._decidingHumanNeed;
    }
    
    get observingFunction() {
        return this._observingHumanNeed;
    }
    
    
    
    // noinspection JSDuplicatedDeclaration
    /**
     * @param otherAnimal {string|Animal}
     */
    equalsTo(otherAnimal){};
    
    // noinspection JSDuplicatedDeclaration
    /**
     *
     * @param humanNeed1 {string|HumanNeed|CognitiveFunction}
     * @param humanNeed2 {string|HumanNeed|CognitiveFunction}
     */
    equalsTo(humanNeed1, humanNeed2) {
        let otherAnimal = humanNeed1;
        if (!(otherAnimal instanceof Animal)) otherAnimal = Animal.fromHumanNeeds(humanNeed1, humanNeed2);
        
        return this.label === otherAnimal.label;
    };
    
    
    
    opposite() {
        switch (this) {
            case Animal.SLEEP:
                return Animal.PLAY;
            case Animal.CONSUME:
                return Animal.BLAST;
            case Animal.BLAST:
                return Animal.CONSUME;
            case Animal.PLAY:
                return Animal.SLEEP;
            default:
                throw new Error("Impossible. Foreign animal instance.");
        }
    };
    
    
    toString() {
        return this.label;
    }
}




/**
 * @readonly
 * @class
 */
export class AnimalPosition extends Enum {
    
    static _canConstruct = true;
    
    static #STRONGER_INFO = new AnimalPosition(0, 1);
    static #STRONGER_ENERGY = new AnimalPosition(0, 2);
    static #WEAKER_INFO = new AnimalPosition(2, 3);
    static #WEAKER_ENERGY = new AnimalPosition(1, 3);
    
    static {
        this._canConstruct = false;
    }
    
    
    static get STRONGER_INFO() {
        return this.#STRONGER_INFO;
    }
    
    static get STRONGER_ENERGY() {
        return this.#STRONGER_ENERGY;
    }
    
    static get WEAKER_INFO() {
        return this.#WEAKER_INFO;
    }
    
    static get WEAKER_ENERGY() {
        return this.#WEAKER_ENERGY;
    }
    
    
    /**
     *
     * @param grantIndex1 {number}
     * @param grantIndex2 {number}
     * @return {AnimalPosition}
     */
    static fromGrantOrder(grantIndex1, grantIndex2) {
        /**
         * @param i {number}
         * @param name {string}
         */
        function checkIndex(i, name) {
            if (typeof i !== 'number') throw new TypeError(
                `${name} is not a number.`
            );
            
            if (!Number.isInteger(i)) throw new Error(
                `${name} is not an integer.`
            );
            
            if (i < 0 || i >= 4) throw new Error(`${name} is not between 0 and 3 (included).`);
        }
        
        checkIndex(grantIndex1, "Grant index 1");
        checkIndex(grantIndex2, "Grant index 2");
        
        if (grantIndex1 === grantIndex2) throw new Error("Grant indexes can't be the same.");
        
        // Return the appropriate immutable instance based on the provided indexes.
        switch (grantIndex1 + grantIndex2) {
            // 0 + 1.
            case 1:
                return this.STRONGER_INFO;
            // 0 + 2.
            case 2:
                return this.STRONGER_ENERGY;
            // 1 + 3.
            case 4:
                return this.WEAKER_ENERGY;
            // 2 + 3.
            case 5:
                return this.WEAKER_INFO;
            default:
                throw new Error("Invalid index couple (same axis not allowed).");
        }
    }
    
    
    /**
     * 
     * @param grantIndex1 {number}
     * @param grantIndex2 {number}
     */
    constructor(grantIndex1, grantIndex2) {
        super()
        
        this._grantIndex1 = grantIndex1;
        this._grantIndex2 = grantIndex2;
    }
    
    
    get grantIndex1() {
        return this._grantIndex1;
    }
    
    get grantIndex2() {
        return this._grantIndex2;
    }
}



// /**
//  * @class
//  */
// export class OpType {
//
//     static build512Type(animalStack, saviors, modality) {
//         throw new Error("Not implemented.")
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
//                 throw new Error("Invalid argument for isSingleObserver.");
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
//                 throw new Error("Invalid argument for isSaviorDi.");
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
//                 throw new Error("Invalid argument for isSaviorOi.");
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
//                 throw new Error("Invalid argument for isSaviorSensing.");
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
//                 throw new Error("Invalid argument for isSaviorFeeling.");
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
//                 throw new Error("Invalid argument for isSaviorConsume.");
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
//                 throw new Error("Invalid argument for isSaviorSleep.");
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
//                 throw new Error("Invalid argument for isInfoDom.");
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
//                 throw new Error("Invalid argument for isIntroverted.");
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
//                 throw new Error("Invalid argument for hasMasculineSensory.");
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
//                 throw new Error("Invalid argument for hasMasculineDe.");
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
//                 throw new Error("Invalid argument for isFlex.");
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
//                 throw new Error("Invalid argument for isResponsibility.");
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
//         throw new Error("Not implemented.");
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
//                     throw new Error("Impossible case.")
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
