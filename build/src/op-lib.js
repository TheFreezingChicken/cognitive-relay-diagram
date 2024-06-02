"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpType = exports.AnimalGrantPosition = exports.CognitiveFunction = exports.oppositeGrantOrder = void 0;
/**
 * Returns the opposite grant order.
 * @throws {TypeError} If {@link grantOrder} is not a number.
 * @throws {Error} If {@link grantOrder} is not an integer or is out of range.
 */
function oppositeGrantOrder(grantOrder) {
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
exports.oppositeGrantOrder = oppositeGrantOrder;
/**
 * Checks if the provided {@link grantOrder} is valid.
 * @throws {TypeError} If {@link grantOrder} is not a number.
 * @throws {Error} If {@link grantOrder} is not an integer or is out of bounds (0-3).
 */
function checkGrantOrder(grantOrder) {
    if (!Number.isInteger(grantOrder))
        throw new Error("Invalid Grant order index. Not an integer.");
    if (grantOrder < 0 || grantOrder >= 4)
        throw new Error("Invalid Grant order index. Out of bounds (0-3).");
}
function isInstanceOfEnum(enumObj, value) {
    return Object.values(enumObj).includes(value);
}
var Axis;
(function (Axis) {
    Axis["OBSERVING"] = "O";
    Axis["DECIDING"] = "D";
})(Axis || (Axis = {}));
(function (Axis) {
    function fromCharacter(character) {
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
    }
    Axis.fromCharacter = fromCharacter;
    function opposite(axis) {
        return axis === Axis.OBSERVING ? Axis.DECIDING : Axis.OBSERVING;
    }
    Axis.opposite = opposite;
    /* TODO Converted from javascript, requires more considerations.
    export function plus(axis: Axis, charge: any): any {
        if (charge == null) return axis;

        if (typeof charge === 'string') charge = Charge.fromCharacter(charge);
        if (!(isInstanceOfEnum(Charge, charge))) throw new Error("Not a valid charge.");

        return HumanNeed.fromString(axis + charge.coinLabel);
    }*/
})(Axis || (Axis = {}));
var RealityScope;
(function (RealityScope) {
    RealityScope["CONCRETE"] = "SF";
    RealityScope["ABSTRACT"] = "NT";
})(RealityScope || (RealityScope = {}));
(function (RealityScope) {
    //export const All: Set<RealityScope> = new Set(Object.values(RealityScope) as RealityScope[]);
    function fromCharacter(character) {
        switch (character) {
            case 'S':
            case 'F':
                return RealityScope.CONCRETE;
            case 'N':
            case 'T':
                return RealityScope.ABSTRACT;
            default:
                throw new Error("Invalid Scope letter.");
        }
    }
    RealityScope.fromCharacter = fromCharacter;
    function getLetterStringFromAxis(scope, axis) {
        switch (axis) {
            case Axis.OBSERVING:
            case 'O':
                return scope[0];
            case Axis.DECIDING:
            case 'D':
                return scope[1];
            default:
                throw new Error("Invalid axis argument.");
        }
    }
    RealityScope.getLetterStringFromAxis = getLetterStringFromAxis;
    function toString(scope) {
        return scope;
    }
    RealityScope.toString = toString;
})(RealityScope || (RealityScope = {}));
var Charge;
(function (Charge) {
    Charge["INTROVERTED"] = "i";
    Charge["EXTROVERTED"] = "e";
})(Charge || (Charge = {}));
(function (Charge) {
    //export const All: Charge[] = [Charge.INTROVERTED, Charge.EXTROVERTED];
    function fromCharacter(character) {
        switch (character) {
            case 'i':
                return Charge.INTROVERTED;
            case 'e':
                return Charge.EXTROVERTED;
            default:
                throw new Error("Invalid Charge character.");
        }
    }
    Charge.fromCharacter = fromCharacter;
    function opposite(charge) {
        switch (charge) {
            case Charge.INTROVERTED:
                return Charge.EXTROVERTED;
            case Charge.EXTROVERTED:
                return Charge.INTROVERTED;
            default:
                throw new Error("Impossible. Foreign Charge instance.");
        }
    }
    Charge.opposite = opposite;
    function toString(charge) {
        return charge;
    }
    Charge.toString = toString;
})(Charge || (Charge = {}));
var HumanNeed;
(function (HumanNeed) {
    HumanNeed["OI_ORGANIZE"] = "Oi";
    HumanNeed["OE_GATHER"] = "Oe";
    HumanNeed["DI_SELF"] = "Di";
    HumanNeed["DE_TRIBE"] = "De";
})(HumanNeed || (HumanNeed = {}));
(function (HumanNeed) {
    function fromString(humanNeedLabel) {
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
    }
    HumanNeed.fromString = fromString;
    function getCharge(humanNeed) {
        switch (humanNeed) {
            case HumanNeed.OI_ORGANIZE:
            case HumanNeed.DI_SELF:
                return Charge.INTROVERTED;
            case HumanNeed.OE_GATHER:
            case HumanNeed.DE_TRIBE:
                return Charge.EXTROVERTED;
        }
    }
    HumanNeed.getCharge = getCharge;
    function getAxis(humanNeed) {
        switch (humanNeed) {
            case HumanNeed.OI_ORGANIZE:
            case HumanNeed.OE_GATHER:
                return Axis.OBSERVING;
            case HumanNeed.DI_SELF:
            case HumanNeed.DE_TRIBE:
                return Axis.DECIDING;
        }
    }
    HumanNeed.getAxis = getAxis;
})(HumanNeed || (HumanNeed = {}));
var Letter;
(function (Letter) {
    Letter["SENSING"] = "S";
    Letter["INTUITING"] = "N";
    Letter["FEELING"] = "F";
    Letter["THINKING"] = "T";
})(Letter || (Letter = {}));
(function (Letter) {
    function fromCharacter(character) {
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
    }
    Letter.fromCharacter = fromCharacter;
})(Letter || (Letter = {}));
class CognitiveFunction {
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
    get axis() {
        return Axis.fromCharacter(this._internalName[0]);
    }
    get shortName() {
        const charge = this.charge;
        // First character is always guaranteed, second one depends on presence of charge.
        return this._internalName[0] + (charge !== null && charge !== void 0 ? charge : '');
    }
    /*
    get realityScope(): any | undefined {
        const letter = this.letter;
        if (letter == null) return undefined;
        return letter.realityScope;
    }

    get humanNeed(): HumanNeed | undefined {
        const charge = this.charge;
        if (charge == null) return undefined;
        return HumanNeed.fromString(this.axis.coinLabel + charge.coinLabel);
    }


    get isIntroverted(): boolean | undefined {
        return this.charge && this.charge === Charge.INTROVERTED;
    }

    get isExtroverted(): boolean | undefined {
        return this.charge && this.charge === Charge.EXTROVERTED;
    }

    get isObserving(): boolean {
        return this.axis === Axis.OBSERVING;
    }

    get isDeciding(): boolean {
        return this.axis === Axis.DECIDING;
    }

    get isOi(): boolean | undefined {
        return this.humanNeed === HumanNeed.OI_ORGANIZE;
    }

    get isOe(): boolean | undefined {
        return this.humanNeed === HumanNeed.OE_GATHER;
    }

    get isSensing(): boolean {
        return this.letter === Letter.Sensing;
    }

    get isIntuition(): boolean {
        return this.letter === Letter.Intuiting;
    }

    get isDi(): boolean | undefined {
        return this.humanNeed === HumanNeed.DI_SELF;
    }

    get isDe(): boolean | undefined {
        return this.humanNeed === HumanNeed.DE_TRIBE;
    }

    get isFeeling(): boolean {
        return this.letter === Letter.Feeling;
    }

    get isThinking(): boolean {
        return this.letter === Letter.Thinking;
    }

    opposite(): CognitiveFunction {
        const letterStr = this.letter?.opposite()?.coinLabel ?? this.axis.coinLabel;
        const chargeStr = this.charge?.opposite()?.coinLabel ?? '';
        return new CognitiveFunction(letterStr + chargeStr);
    }

    withOppositeLetter(): CognitiveFunction {
        const letterStr = this.letter?.opposite()?.coinLabel ?? this.axis.coinLabel;
        const chargeStr = this._internalName[1];
        return new CognitiveFunction(letterStr + chargeStr);
    }

    withOppositeCharge(): CognitiveFunction {
        const letterStr = this._internalName[0];
        const chargeStr = this.charge?.opposite()?.coinLabel ?? '';
        return new CognitiveFunction(letterStr + chargeStr);
    }

    withCharge(charge: string | Charge): CognitiveFunction {
        if (charge == null || charge === this.charge) return this;

        if (typeof charge === 'string') charge = Charge.fromCharacter(charge);
        if (!(charge instanceof Charge)) throw new Error("Not a valid charge.");

        return new CognitiveFunction(this._internalName[0] + charge.coinLabel);
    }

    plusCharge(charge: string | Charge): CognitiveFunction {
        if (charge == null || charge === this.charge) return this;
        if (this.charge != null) throw new Error("This instance has an opposing charge.");
        return this.withCharge(charge);
    }

    withHumanNeed(humanNeed: string | HumanNeed, ignoreAxis?: boolean): CognitiveFunction {
        if (humanNeed == null || humanNeed === this.humanNeed) return this;

        if (typeof humanNeed === 'string') humanNeed = HumanNeed.fromString(humanNeed);
        if (!(humanNeed instanceof HumanNeed)) throw new Error("Not a valid human need.");
        if (!ignoreAxis && this.axis !== humanNeed.axis) throw new Error("Incompatible axis.");

        return this.axis !== humanNeed.axis ?
            new CognitiveFunction(humanNeed.coinLabel) :
            new CognitiveFunction(this._internalName[0] + humanNeed.charge.coinLabel);
    }

    plusHumanNeed(humanNeed: string | HumanNeed): CognitiveFunction {
        if (humanNeed == null || humanNeed === this.humanNeed) return this;
        if (this.humanNeed != null) throw new Error("This instance has a different human need.");
        return this.withHumanNeed(humanNeed);
    }

    withLetter(letter: string | Letter, ignoreAxis?: boolean): CognitiveFunction {
        if (letter == null || letter.coinLabel === this.coinLabel) return this;

        if (typeof letter === 'string') letter = Letter.fromCharacter(letter);
        if (!(letter instanceof Letter)) throw new Error("Not a valid letter.");
        if (!ignoreAxis && this.axis !== letter.axis) throw new Error("Incompatible axis.");

        return new CognitiveFunction(letter.coinLabel + this._internalName[1]);
    }

    plusLetter(letter: string | Letter): CognitiveFunction {
        if (letter == null || letter === this.letter) return this;
        if (this.letter != null) throw new Error("This instance has a different letter.");
        return this.withLetter(letter);
    }

    injectedWith(other: string | Charge | HumanNeed | Letter | CognitiveFunction, ignoreAxis?: boolean): CognitiveFunction {
        if (other == null || other.coinLabel === this.coinLabel) return this;

        switch (true) {
            case (other instanceof Charge): return this.withCharge(other);
            case (other instanceof HumanNeed): return this.withHumanNeed(other, ignoreAxis);
            case (other instanceof Letter): return this.withLetter(other, ignoreAxis);
        }

        if (typeof other === 'string') other = new CognitiveFunction(other);
        if (!(other instanceof CognitiveFunction)) throw new Error("Invalid argument type.");

        return this.withHumanNeed(other.humanNeed, ignoreAxis).withLetter(other.letter, ignoreAxis);
    }

    injectInto(other: string | Charge | HumanNeed | Letter | CognitiveFunction, ignoreAxis?: boolean): CognitiveFunction {
        return other.injectedWith(this);
    }

    plus(other: string | Charge | HumanNeed | Letter | CognitiveFunction): CognitiveFunction {
        if (other == null || other.coinLabel === this.coinLabel) return this;

        switch (true) {
            case (other instanceof Charge): return this.plusCharge(other);
            case (other instanceof HumanNeed): return this.plusHumanNeed(other);
            case (other instanceof Letter): return this.plusLetter(other);
        }

        if (typeof other === 'string') other = new CognitiveFunction(other);
        if (!(other instanceof CognitiveFunction)) throw new Error("Invalid argument type.");

        return this.plusCharge(other.charge).plusHumanNeed(other.humanNeed).plusLetter(other.letter);
    }

    grantMatch(grantOrder: number): CognitiveFunction {
        switch (grantOrder) {
            case 0: return this;
            case 1: return new CognitiveFunction(this.axis.opposite().plus(this.charge?.opposite()).coinLabel);
            case 2: return new CognitiveFunction(this.axis.opposite().plus(this.charge).coinLabel);
            case 3: return this.opposite();
            default: throw new Error("Invalid grant order argument.");
        }
    }

    get isPartial(): boolean {
        return /[OD?]/.test(this._internalName);
    }

    equalsTo(otherFunction: string | CognitiveFunction): boolean {
        try {
            if (typeof otherFunction === 'string') otherFunction = new CognitiveFunction(otherFunction);
        } catch (e) {
            throw new Error("String argument isn't a valid cognitive function.");
        }

        if (!(otherFunction instanceof CognitiveFunction)) throw TypeError("Invalid argument type.");

        return this.coinLabel === otherFunction.coinLabel;
    }

    strictlyEqualsTo(otherFunction: CognitiveFunction): boolean {
        if (!(otherFunction instanceof CognitiveFunction)) throw TypeError("Not an instance of CognitiveFunction.");
        return this.equalsTo(otherFunction);
    }

    isCompatibleWith(otherFunction: string | CognitiveFunction): boolean {
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

    canBeSaviorWith(otherFunction: string | CognitiveFunction): boolean {
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
    */
    toString() {
        return this.shortName;
    }
}
exports.CognitiveFunction = CognitiveFunction;
var AnimalGrantPosition;
(function (AnimalGrantPosition) {
    AnimalGrantPosition[AnimalGrantPosition["STRONGER_INFO"] = 0] = "STRONGER_INFO";
    AnimalGrantPosition[AnimalGrantPosition["STRONGER_ENERGY"] = 1] = "STRONGER_ENERGY";
    AnimalGrantPosition[AnimalGrantPosition["WEAKER_INFO"] = 2] = "WEAKER_INFO";
    AnimalGrantPosition[AnimalGrantPosition["WEAKER_ENERGY"] = 3] = "WEAKER_ENERGY";
})(AnimalGrantPosition || (exports.AnimalGrantPosition = AnimalGrantPosition = {}));
class OpType {
    constructor(firstGrantFunction, secondGrantFunction, animalStack, modalities) {
    }
    getCognitiveFunction(grantIndex) {
        throw new Error("Not implemented yet.");
    }
}
exports.OpType = OpType;
OpType.GENERIC_TYPE_SYMBOL = Symbol();
OpType.GENERIC = new OpType(OpType.GENERIC_TYPE_SYMBOL);
