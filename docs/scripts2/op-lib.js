const PRIVATE_OPERATION_SYMBOL = Symbol();

/** @type {number} */
export function oppositeGrantOrder(grantOrder) {
    if (typeof grantOrder !== 'number') throw new TypeError("Not a number");
    if (!Number.isInteger(grantOrder)) throw new Error("Not an integer.");
    
    switch (grantOrder) {
        case 0: return 3;
        case 1: return 2;
        case 2: return 1;
        case 3: return 0;
        default: throw new Error("Out of range.");
    }
}


/**
 * @param grantOrder {number}
 */
function checkGrantOrder(grantOrder) {
    if (typeof grantOrder !== 'number') throw new TypeError("Invalid Grant order index. Not a number.");
    if (!Number.isInteger(grantOrder)) throw new Error("Invalid Grant order index. Not an integer.");
    
    if (grantOrder < 0 || grantOrder >= 4) throw new Error("Invalid Grant order index. Out of bounds (0-3).");
}


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



// SLEEP Implement all "plus" methods.
// SLEEP Implement all "opposite" methods.
// SLEEP Implement case-fixing in all string parameters.



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
        
        this._coinLabel = axisLetter;
    }
    
    
    get coinLabel() {
        return this._coinLabel;
    }
    
    
    
    
    /**
     * @return {Axis}
     */
    opposite() {
        if (this === Axis.OBSERVING) return Axis.DECIDING
        else return Axis.OBSERVING;
    }
    
    /**
     * 
     * @param charge {Charge|string}
     * @return {HumanNeed|Axis}
     */
    plus(charge){
        if (charge == null) return this;
        
        if (typeof Charge === 'string') charge = Charge.fromCharacter(charge);
        if (!(charge instanceof Charge)) throw new Error("Not a valid charge.");
        
        return HumanNeed.fromString(this.coinLabel + charge.coinLabel);
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
        
        this._coinLabel = scopeLetters;
    }
    
    get coinLabel() {
        return this._coinLabel;
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
                return this._coinLabel[0];
            case Axis.DECIDING:
            case 'D':
                return this._coinLabel[1];
            default:
                throw new Error("Invalid axis argument.");
        }
    }
    
    
    toString() {
        return this.coinLabel;
    }
}




// SLEEP Finish enumifying ones below if the above ones behave correctly.


/**
 * @readonly
 */
export class Charge extends PrivateConstructorObject {
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
        
        this._coinLabel = chargeLetter;
    }
    
    
    get coinLabel() {
        return this._coinLabel;
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
        return this.coinLabel;
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
        this._coinLabel = axis.coinLabel + charge.coinLabel;
    }
    
    get coinLabel() {
        return this._coinLabel;
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
        return this.coinLabel;
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
        this._coinLabel = realityScope.getLetterStringFromAxis(axis);
    }
    
    
    get axis() {
        return this._axis;
    }
    
    get realityScope() {
        return this._realityScope;
    }
    
    get coinLabel() {
        return this._coinLabel;
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
        return this.coinLabel;
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
        
        return HumanNeed.fromString(this.axis.coinLabel + charge.coinLabel);
    }
    
    
    get coinLabel() {
        /** @type {Charge|undefined} */
        const charge = this.charge;
        return this._internalName[0] + (charge?.coinLabel ?? '');
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
        const letterStr = this.letter?.opposite()?.coinLabel ?? this.axis.coinLabel;
        const chargeStr = this.charge?.opposite()?.coinLabel ?? '';

        return new CognitiveFunction(letterStr + chargeStr);
    }
    
    /**
     * Returns a copy of this function with its letter inverted.
     * Axis is always maintained, so 'O' and 'D' partial functions will stay the same.
     * @returns {CognitiveFunction}
     */
    withOppositeLetter() {
        const letterStr = this.letter?.opposite()?.coinLabel ?? this.axis.coinLabel;
        const chargeStr = this._internalName[1];
        
        return new CognitiveFunction(letterStr + chargeStr);
    }
    
    /**
     * Returns a copy of this function with its charge inverted.
     * @return {CognitiveFunction}
     */
    withOppositeCharge() {
        const letterStr = this._internalName[0];
        const chargeStr = this.charge?.opposite()?.coinLabel ?? '';
        
        return new CognitiveFunction(letterStr + chargeStr);
    }
    
    
    
    
    /**
     *
     * @param charge {string|Charge}
     * @return {CognitiveFunction}
     */
    withCharge(charge) {
        if (charge == null || charge === this.charge) return this;
        
        if (typeof charge === 'string') charge = Charge.fromCharacter(charge);
        if (!(charge instanceof Charge)) throw new Error("Not a valid charge.");
        
        return new CognitiveFunction(this._internalName[0] + charge.coinLabel);
    }
    
    
    /**
     *
     * @param charge {string|Charge}
     * @return {CognitiveFunction}
     */
    plusCharge(charge) {
        if (charge == null || charge === this.charge) return this;
        if (this.charge != null) throw new Error("This instance has an opposing charge.");
        
        return this.withCharge(charge);
    }
    
    
    /**
     *
     * @param humanNeed {string|HumanNeed}
     * @param [ignoreAxis] {boolean}
     * @return {CognitiveFunction}
     */
    withHumanNeed(humanNeed, ignoreAxis) {
        if (humanNeed == null || humanNeed === this.humanNeed) return this;
        
        if (typeof humanNeed === 'string') humanNeed = HumanNeed.fromString(humanNeed);
        if (!(humanNeed instanceof HumanNeed)) throw new Error("Not a valid human need.");
        if (!ignoreAxis && this.axis !== humanNeed.axis) throw new Error("Incompatible axis.");
        
        return this.axis !== humanNeed.axis ?
            new CognitiveFunction(humanNeed.coinLabel) :
            new CognitiveFunction(this._internalName[0] + humanNeed.charge.coinLabel);
    }
    
    /**
     *
     * @param humanNeed {string|HumanNeed}
     * @return {CognitiveFunction}
     */
    plusHumanNeed(humanNeed) {
        if (humanNeed == null || humanNeed === this.humanNeed) return this;
        if (this.humanNeed != null) throw new Error("This instance has a different human need.");
        
        return this.withHumanNeed(humanNeed);
    }
    
    
    /**
     *
     * @param letter {string|Letter}
     * @param [ignoreAxis] {boolean}
     * @return {CognitiveFunction}
     */
    withLetter(letter, ignoreAxis) {
        if (letter == null || letter.coinLabel === this.coinLabel) return this;
        
        if (typeof letter === 'string') letter = Letter.fromCharacter(letter);
        if (!(letter instanceof Letter)) throw new Error("Not a valid letter.");
        if (!ignoreAxis && this.axis !== letter.axis) throw new Error("Incompatible axis.");
        
        return new CognitiveFunction(letter.coinLabel + this._internalName[1]);
    }
    
    
    /**
     *
     * @param letter {string|Letter}
     * @return {CognitiveFunction}
     */
    plusLetter(letter) {
        if (letter == null || letter === this.letter) return this;
        if (this.letter != null) throw new Error("This instance has a different letter.");
        
        return this.withLetter(letter);
    }
    
    
    
    
    /**
     * Returns a new cognitive function, where every coin in this instance is overridden by coins in <code>other</code>, but doesn't remove missing
     * coins. If <code>ignoreAxis</code> is falsy, conflicting axis will throw an error, otherwise <code>other</code> will
     * completely override every coin.
     * @example
     * // Assuming instance is 'Fi'.
     * this.injectedWith('Te') // returns 'Te'.
     * this.injectedWith('De') // returns 'Fe'.
     * this.injectedWith('Oi') // throws an error.
     * this.injectedWith('O', true) // returns 'O'.
     * this.injectedWith('Oi', true) // returns 'Oi'.
     * this.injectedWith('Ni', true) // returns 'Ni'.
     *
     * @param other {string|Charge|HumanNeed|Letter|CognitiveFunction}
     * @param [ignoreAxis] {boolean}
     * @return {CognitiveFunction}
     */
    injectedWith(other, ignoreAxis) {
        if (other == null || other.coinLabel === this.coinLabel) return this;
        
        switch (true) {
            case (other instanceof Charge): return this.withCharge(other);
            case (other instanceof HumanNeed): return this.withHumanNeed(other, ignoreAxis);
            case (other instanceof Letter): return this.withLetter(other, ignoreAxis);
        }
        
        
        if (typeof other === 'string') other = new CognitiveFunction(other);
        if (!(other instanceof CognitiveFunction)) throw new Error("Invalid argument type.");
        
        console.log(other.humanNeed);
        console.log(other.letter);
        return this.withHumanNeed(other.humanNeed, ignoreAxis).withLetter(other.letter, ignoreAxis);
    }
    
    
    /**
     * Simply does <code>other.injectedWith(this)</code>.
     * @param other {string|Charge|HumanNeed|Letter|CognitiveFunction}
     * @param [ignoreAxis] {boolean}
     * @return {CognitiveFunction}
     */
    injectInto(other, ignoreAxis) {
        return other.injectedWith(this);
    }
    
    
    
    /**
     *
     * @param other {string|Charge|HumanNeed|Letter|CognitiveFunction}
     * @return {CognitiveFunction}
     */
    plus(other) {
        if (other == null || other.coinLabel === this.coinLabel) return this;
        
        
        switch (true) {
            case (other instanceof Charge): return this.plusCharge(other);
            case (other instanceof HumanNeed): return this.plusHumanNeed(other);
            case (other instanceof Letter): return this.plusLetter(other);
        }
        
        
        if (typeof other === 'string') other = new CognitiveFunction(other);
        if (!(other instanceof CognitiveFunction)) throw new Error("Invalid argument type.");
        
        // REM Both human need and charge addition is necessary to trigger errors on conflicts.
        return this.plusCharge(other.charge).plusHumanNeed(other.humanNeed).plusLetter(other.letter);
    }
    
    /**
     * Returns the matching grant order function as if this instance was the first one in the stack.
     * Functions in the middle axis will be returned as human needs (because of the possible double match).
     * Remember grantOrder is always 0-indexed.
     * 
     * @example
     * // Assume this instance is Fi
     * grantMatch(1) // Returns Oe
     * grantMatch(2) // Returns Oi
     * grantMatch(3) // Returns Te
     * 
     * @param grantOrder {number}
     * @return {CognitiveFunction}
     */
    grantMatch(grantOrder) {
        switch (grantOrder) {
            case 0: return this;
            // Opposite axis + opposite charge.
            case 1: return new CognitiveFunction(this.axis.opposite().plus(this.charge?.opposite()).coinLabel);
            // Opposite axis + same charge.
            case 2: return new CognitiveFunction(this.axis.opposite().plus(this.charge).coinLabel);
            case 3: return this.opposite();
            default: throw new Error("Invalid grant order argument.");
        }
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
        
        return this.coinLabel === otherFunction.coinLabel;
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
        return this.coinLabel;
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
        
        switch (humanNeed1.coinLabel[1] + humanNeed2.coinLabel[2]) {
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
        
        let coinLabel;
        if (observingHumanNeed === HumanNeed.OI_ORGANIZE) {
            coinLabel = decidingHumanNeed === HumanNeed.DI_SELF ? 'S' : 'B';
        } else {
            coinLabel = decidingHumanNeed === HumanNeed.DI_SELF ? 'C' : 'P';
        }
        
        this._observingHumanNeed = observingHumanNeed;
        this._decidingHumanNeed = decidingHumanNeed;
        this._coinLabel = coinLabel;
    }
    
    
    
    get coinLabel() {
        return this._coinLabel;
    }
    
    get decidingHumanNeed() {
        return this._decidingHumanNeed;
    }
    
    get observingHumanNeed() {
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
        
        return this.coinLabel === otherAnimal.coinLabel;
    };
    
    
    /**
     *
     * @param humanNeed {CognitiveFunction|HumanNeed|string}
     * @return {boolean}
     */
    includes(humanNeed) {
        if (typeof humanNeed === 'string') humanNeed = HumanNeed.fromString(humanNeed);
        if (humanNeed instanceof CognitiveFunction) humanNeed = humanNeed.humanNeed;
        
        if (!humanNeed instanceof HumanNeed) throw new Error("Not a valid human need.");
        
        return this.decidingHumanNeed === humanNeed || this.observingHumanNeed === humanNeed;
    }
    
    
    
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
        return this.coinLabel;
    }
}




/**
 * Indicates the position of an animal based on the grant order of its functions.
 * @readonly
 * @class
 */
export class AnimalGrantPosition extends Enum {
    
    static _canConstruct = true;
    
    static #STRONGER_INFO = new AnimalGrantPosition(0, 1);
    static #STRONGER_ENERGY = new AnimalGrantPosition(0, 2);
    static #WEAKER_INFO = new AnimalGrantPosition(2, 3);
    static #WEAKER_ENERGY = new AnimalGrantPosition(1, 3);
    
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
     * @return {AnimalGrantPosition}
     */
    static fromGrantOrder(grantIndex1, grantIndex2) {
        checkGrantOrder(grantIndex1);
        checkGrantOrder(grantIndex2);
        
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



/**
 * @readonly
 * @enum {string}
 */
export const OpTypeChangeEvents = {
    // Contains "grantOrder"
    LETTER_SWITCH: 'letterSwitch',
    CHARGE_SWITCH: 'chargeSwitch',
    MAIN_AXIS_SWITCH: 'mainAxisSwitch',
    MAKE_MASCULINE: 'makeMasculine',
    SET_ANIMAL_ORDER: 'setAnimalOrder',
    MODALITY_RESET: 'modalityReset',
    TYPE_RESET: 'typeReset',
    INTERNAL_CHANGE: 'internalChange'
};
Object.freeze(OpTypeChangeEvents);


// HERE Possible actions:
//      - 16type change
//        · Changes everything
//      - Letter change (for any function)
//        · Changes opposite function
//

//      - Charge change (for first and last function)
//      - Animal change (


/**
 *
 */
class ObservableOpType extends EventTarget {
    /** @type {Symbol} */
    #dominoSymbol;
    
    /**
     *
     * @return {Symbol}
     * @package
     */
    get _dominoSymbol() {
        return this.#dominoSymbol;
    }
    
    
    /** @type {ObservableGrantFunction[]} */
    #observableCognitiveFunctions;
    /** @type {Map<AnimalGrantPosition, ObservableGrantAnimal>} */
    #observableAnimals;
    
    // HERE Continua a fixare
    
    
    /**
     * This will be filled with null values if the stack order hasn't been set by the user yet.
     * @type {AnimalState[]}
     */
    #animalStackStates;
    
    
    
    constructor() {
        super();
        
        /** @type {ObservableGrantFunction[]} */
        const cogFunStates = new Array(4);
        /** @type {Map<AnimalGrantPosition, ObservableGrantAnimal>} */
        const animalStates = new Map();
        this.#observableCognitiveFunctions = cogFunStates;
        this.#observableAnimals = animalStates;
        this.#animalStackStates = new Array(4);
        
        // Populating states.
        for (let i = 0; i < 4; i++) {
            cogFunStates[i] = new ObservableGrantFunction(i);
        }
        
        for (const ap of AnimalGrantPosition.All) {
            animalStates.set(ap, new ObservableGrantAnimal(ap))
        }
        
        
        // Now that the states are all created, attach this instance to all (it will add the listeners).
        
        for (const cfs of cogFunStates) {
            cfs.attachOpTypeState(this);
        }
        
        for (const as of animalStates.values()) {
            as.attachOpTypeState(this);
        }
    }
    
    
    _dominoStarted() {
        this.#dominoSymbol = Symbol();
    }
    

// HERE Animals are updated according to each function update. Animal order is decided through clicking
//      the triangles in the middle (clicking on a triangle that was already clicked makes the count start
//      from the beginning).
//      When animals are already set and a function gets changed, if the animal order is still valid it
//      gets preserved. To achieve this more efficiently, I need an additional state stored separately
//      for the animal itself rather than its position, and the position state is going to both listen and
//      send user updates to that.
//      for changes.
    
    /**
     * @param grantOrder {number}
     * @returns {ObservableGrantFunction}
     */
    getCogFunState(grantOrder) {
        return this.#observableCognitiveFunctions[grantOrder];
    }
    
    /**
     * @param animalReference {AnimalGrantPosition|number}
     * @returns {ObservableGrantAnimal}
     */
    getAnimalState(animalReference) {
        switch (true) {
            case (animalReference instanceof AnimalGrantPosition):
                return this.#observableAnimals.get(animalReference);
            case (typeof animalReference === 'number'):
                return this.#animalStackStates[animalReference];
            default:
                throw new Error("Invalid argument.");
        }
    }
    
    
    
    
    fixMiddleAxis() {
        const firstFun = this.getCogFunState(0);
        const secondFun = this.getCogFunState(1);
        
        if (firstFun.cognitiveFunction.canBeSaviorWith(secondFun.cognitiveFunction)) return;
        
        secondFun.startDominoUpdate(firstFun.cognitiveFunction.grantMatch(1));
        this.getCogFunState(2).startDominoUpdate(secondFun.cognitiveFunction.opposite());
    }
    
    fixAnimals() {
        for (/** @type {AnimalGrantPosition} */ const ap of AnimalGrantPosition.All) {
            const fun1 = this.getCogFunState(ap.grantIndex1).cognitiveFunction;
            const fun2 = this.getCogFunState(ap.grantIndex2).cognitiveFunction;
            
            // No charge means we aren't in a situation where animals can be determined.
            if (fun1.charge == null) return;
            
            this.getAnimalState(ap).updateAnimal(Animal.fromHumanNeeds(fun1, fun2));
        }
    }
    
    fixDemons() {
        const lastFunState = this.getCogFunState(3);
        if (lastFunState.cognitiveFunction.charge != null) lastFunState.startDominoUpdate(null, true);
        
        const secondFunState = this.getCogFunState(1);
        const thirdFunState = this.getCogFunState(2);
        
        const firstAnimal = this.getAnimalState(0).animal;
        
        if (firstAnimal == null) return;
        
        if (firstAnimal.includes(secondFunState.cognitiveFunction)) {
            secondFunState.startDominoUpdate(null, true);
        } else {
        
        }
    }
    
    
    
    switchLetter(grantOrder) {
        const cfs = this.getCogFunState(grantOrder);
        const newFunction = cfs.cognitiveFunction.withOppositeLetter();
        this._isUntouched = false;
        cfs.startDominoUpdate(newFunction);
    }
    
    switchCharge(grantOrder) {
        
        
        // Changing charges of middle axis functions would require ambiguous propagations, so we forbid it.
        if (grantOrder === 1 || grantOrder === 2) throw new Error("Can't change charges of middle axis functions.");
        
        
        const cfState = this.getCogFunState(grantOrder);
        const cogFun = cfState.cognitiveFunction
        
        // Inverting charge or assigning introverted charge if there is no charge.
        cfState.startDominoUpdate(
            cogFun.charge == null ? cogFun.plusCharge(Charge.INTROVERTED) : cogFun.withOppositeCharge()
        )
    }
    
    
    switchMainAxis() {
        const firstFunState = this.getCogFunState(0);
        const secondFunState = this.getCogFunState(1);
        const tempFun = firstFunState.cognitiveFunction;
        
        firstFunState.startDominoUpdate(secondFunState.cognitiveFunction);
        secondFunState.startDominoUpdate(tempFun);
    }
    
    resetAnimals() {
        for (const [aPos, animal] of this.#observableAnimals) {
            animal.updateStackOrder(0, false);
        }
    }
    
    
    setAnimalOrder(animalPosition) {
        // const animalBeingSet = this.getAnimalState(animalPosition);
        // let resetAll = false;
        // for (let i = 0; i < 4; i++) {
        //     if (resetAll) {
        //         this.#animalStackStates[i] = null;
        //         continue;
        //     }
        //     // TODO Remember that at the 3rd animal we must also automatically set the 4th and the double activated.
        //     // HERE Continue (and consider if the above condition is fine)
        // }
    }
}


/** @readonly */
const DefaultOpTypeFunctions = [
    new CognitiveFunction('N'),
    new CognitiveFunction('T'),
    new CognitiveFunction('F'),
    new CognitiveFunction('S')
]
Object.freeze(DefaultOpTypeFunctions);



class ObservableCoin extends EventTarget {
    /** @type {Symbol} */
    #dominoSymbol = null;
    /** @type {ObservableOpType|null} */
    _parentOpType = null;
    /**
     * @abstract
     * @type {Object}
     */
    _state = null;
    
    
    
    /**
     *
     * @abstract
     * @protected
     * @param observableOpType {ObservableOpType}
     */
    _onAttachParent(observableOpType) {
        throw new Error("Abstract method. Not overridden in subclass.");
    }
    
    
    
    
    /**
     * @package
     * @param obsOpType {ObservableOpType}
     */
    _attachParentOpType(obsOpType) {
        this._parentOpType = obsOpType;
        
        obsOpType._afterDominoEdit(() => {
            this._notifyUi();
        });
        
        this._onAttachParent(obsOpType);
    }
    
    
    /**
     * Should only be called after a domino ended.
     * @protected
     */
    _notifyUi() {
        this.dispatchEvent(new Event('change'));
    }
    
    /**
     * @protected
     */
    _notifyCoins() {
        this.dispatchEvent(new Event(OpTypeChangeEvents.INTERNAL_CHANGE));
    }
    
    /**
     * Should be called by OP type on user action.
     * @param config
     * @package
     */
    _startDominoEdit(config) {
        this._parentOpType._dominoStarted();
        this._dominoEdit(config);
    };
    
    /**
     *
     * @return {boolean}
     * @package
     */
    get _hasBeenDominoEdited() {
        return this._parentOpType._dominoSymbol === this.#dominoSymbol;
    }
    
    /**
     * Should be called only by listeners when attaching parent OP type, and only if not previously domino edited in the same domino.
     * @param config
     * @protected
     */
    _dominoEdit(config) {
        if (this._hasBeenDominoEdited) throw new Error("Already edited in the same domino edit.");
        this.#dominoSymbol = this._parentOpType._dominoSymbol;
        this._onEdit(config);
    };
    
    
    /**
     * @protected
     */
    _onEdit(state) {
        for (const prop in state) this._state[prop] = state[prop];
        this._notifyCoins();
    };
}


/**
 * @typedef {Object} CognitiveFunctionState
 * @property {CognitiveFunction} cognitiveFunction
 * @property {number} grantOrder
 * @property {boolean|null} [isDemon]
 * @property {boolean|null} [isMasculine]
 */

/**
 *
 */
class ObservableGrantFunction extends ObservableCoin {
    #grantOrder;
    /** @type {CognitiveFunction} */
    #cogFun;
    /** @type {ObservableGrantFunction} */
    #oppositeCogFunState;
    /** @type {boolean|null} */
    #isDemon = null;
    /** @type {boolean|null} */
    #isMasculine = null;
    
    /** @type {ObservableOpType|null} */
    _parentOpTypeState = null;
    
    /**
     * @param grantOrder {number}
     */
    constructor(grantOrder) {
        super();
        this.#grantOrder = grantOrder;
        
        this.#cogFun = DefaultOpTypeFunctions[grantOrder];
        
        
        if (devTest) this.#devInit()
    }
    
    
    #devInit() {
        switch (this.#grantOrder) {
            case 0:
                this.#cogFun = new CognitiveFunction('Fi');
                break
            case 1:
                this.#cogFun = new CognitiveFunction('Ne');
                break
            case 2:
                this.#cogFun = new CognitiveFunction('Si');
                break
            case 3:
                this.#cogFun = new CognitiveFunction('Te');
                break
        }
    }
    
    
    
    /**
     * @returns {number}
     */
    get grantOrder() {
        return this.#grantOrder;
    }
    
    
    
    get cognitiveFunction() {
        return this.#cogFun;
    }
    
    /**
     * @returns {string}
     */
    get name() {
        return this.#cogFun.coinLabel;
    }
    
    get isDemon() {
        return this.#isDemon;
    }
    
    /**
     * @returns {boolean}
     */
    get isMasculine() {
        return this.#isMasculine;
    }
    
    
    
    get isDiagramUntouched() {
        return this._parentOpTypeState._isUntouched
    }
    
    
    _attachParentOpType(obsOpType) {
        super._attachParentOpType(obsOpType);
        
        // For all functions. Listen to update of the opposite one to change it accordingly.
        const oppositeFunState = opTypeState.getCogFunState(oppositeGrantOrder(this.grantOrder));
        oppositeFunState.addEventListener(
            OpTypeChangeEvents.INTERNAL_CHANGE,
            () => {
                const newCogFun = oppositeFunState.cognitiveFunction.opposite();
                // If last function, set Demon to true, otherwise set null to do nothing.
                const isDemon = this.grantOrder === 3 || null;
                this.#instanceUpdate(newCogFun, isDemon);
            }
        );
        
        
        
        
        // For second and third function.
        if (this.grantOrder === 1 || this.grantOrder === 2) {
            const firstFunState
            
            // Listen to updates of stronger info animal to change Demon state accordingly.
            const strongerInfoAnimalState = opTypeState.getAnimalState(AnimalGrantPosition.STRONGER_INFO);
            strongerInfoAnimalState.addEventListener(OpTypeChangeEvents.INTERNAL_CHANGE, () => {
                const isDemon = strongerInfoAnimalState.isSet && this.grantOrder === 1 && strongerInfoAnimalState.stackOrder === 0;
                this.#instanceUpdate(null, isDemon);
            });
        }
    }
}




/**
 * @typedef {Object} AnimalState
 * @property {Animal} [animal]
 * @property {number} [stackOrder]
 * @property {boolean|null} [isDemon]
 * @property {boolean|null} [isDoubleActivated]
 */


/**
 * Animal that's observable in within a parent type. What remains fixed is its positioning based on the Grant order of the functions within the parent
 * type. <br>
 * For example, if you're observing the {@link AnimalGrantPosition.STRONGER_INFO} Animal, it should update to:
 * - Consume for IxxPs and ExxPs
 * - Blast for IxxJs and ExxJs
 *
 * So every time the parent type changes, the Animal changes to maintain the Animal consistent to its Grant functions position.
 */
class ObservableGrantAnimal extends EventTarget {
    
    /**
     * @param diagramPosition {AnimalGrantPosition}
     */
    constructor(diagramPosition) {
        super();
        
        this.#animalPosition = diagramPosition;
        
        this.#stackOrder = null;
        this.#animal = null;
        this.#isDoubleActivated = false;
        
        //this.#devInit()
    }
    
    
    
    
    #devInit() {
        switch (this.#animalPosition) {
            case AnimalGrantPosition.STRONGER_INFO:
                this.#animal = Animal.fromAnimalString('C');
                this.#stackOrder = 1;
                this.#isDoubleActivated = true;
                break;
            case AnimalGrantPosition.STRONGER_ENERGY:
                this.#animal = Animal.fromAnimalString('P');
                this.#stackOrder = 0;
                break;
            case AnimalGrantPosition.WEAKER_INFO:
                this.#animal = Animal.fromAnimalString('B');
                this.#stackOrder = 3;
                break;
            case AnimalGrantPosition.WEAKER_ENERGY:
                this.#animal = Animal.fromAnimalString('S');
                this.#stackOrder = 2;
                break;
            default:
                throw new Error("Invalid Animal Position");
        }
    }
    
    
    /**
     *
     * @returns {AnimalGrantPosition}
     */
    get animalPosition() {
        return this.#animalPosition;
    }
    
    
    get animal() {
        return this.#animal;
    }
    
    /**
     *
     * @returns {boolean}
     */
    get isSet() {
        return this.#animal != null;
    }
    
    /**
     *
     * @returns {number|null}
     */
    get stackOrder() {
        return this.#stackOrder;
    }
    
    /**
     *
     * @returns {string}
     */
    get name() {
        return this.#animal?.coinLabel ?? '';
    }
    
    /**
     *
     * @returns {boolean}
     */
    get isDoubleActivated() {
        return this.#isDoubleActivated;
    }
    
    
    
    
    /**
     * @param opTypeState {ObservableOpType}
     */
    attachOpTypeState(opTypeState) {
    }
    
    
    
    
    /**
     *
     * @param animal {Animal}
     */
    updateAnimal(animal) {
        this.#animal = animal;
        this.notifyUi();
    }
    
    /**
     * @param stackOrder {number}
     * @param [isDoubleActivated] {boolean}
     */
    updateStackOrder(stackOrder, isDoubleActivated) {
        this.#stackOrder = stackOrder;
        if (isDoubleActivated != null) this.#isDoubleActivated = isDoubleActivated;
        this.notifyUi();
    }
    
    
    notifyUi() {
        this.dispatchEvent(new Event('change'));
    }
}