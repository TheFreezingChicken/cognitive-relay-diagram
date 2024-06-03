/**
 * Returns the opposite grant order.
 * @throws {TypeError} If {@link grantOrder} is not a number.
 * @throws {Error} If {@link grantOrder} is not an integer or is out of range.
 */
export function oppositeGrantOrder(grantOrder: number): number {
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
 * Checks if the provided {@link grantOrder} is valid.
 * @throws {TypeError} If {@link grantOrder} is not a number.
 * @throws {Error} If {@link grantOrder} is not an integer or is out of bounds (0-3).
 */
function checkGrantOrder(grantOrder: number): void {
    if (!Number.isInteger(grantOrder)) throw new Error("Invalid Grant order index. Not an integer.");

    if (grantOrder < 0 || grantOrder >= 4) throw new Error("Invalid Grant order index. Out of bounds (0-3).");
}

function isInstanceOfEnum(enumObj: any, value: any): boolean {
    return Object.values(enumObj).includes(value);
}





enum Axis {
    OBSERVING = 'O',
    DECIDING = 'D'
}


namespace Axis {
    export function fromCharacter(character: string): Axis {
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

    export function opposite(axis: Axis): Axis {
        return axis === Axis.OBSERVING ? Axis.DECIDING : Axis.OBSERVING;
    }

    /* TODO Converted from javascript, requires more considerations.
    export function plus(axis: Axis, charge: any): any {
        if (charge == null) return axis;

        if (typeof charge === 'string') charge = Charge.fromCharacter(charge);
        if (!(isInstanceOfEnum(Charge, charge))) throw new Error("Not a valid charge.");

        return HumanNeed.fromString(axis + charge.coinLabel);
    }*/
}


enum RealityScope {
    CONCRETE = 'SF',
    ABSTRACT = 'NT'
}

namespace RealityScope {
    //export const All: Set<RealityScope> = new Set(Object.values(RealityScope) as RealityScope[]);

    export function fromCharacter(character: string): RealityScope {
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

    export function getLetterStringFromAxis(scope: RealityScope, axis: string | Axis): string {
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

    export function toString(scope: RealityScope): string {

        return scope;
    }
}


enum Charge {
    INTROVERTED = 'i',
    EXTROVERTED = 'e'
}

namespace Charge {
    //export const All: Charge[] = [Charge.INTROVERTED, Charge.EXTROVERTED];


    export function fromCharacter(character: string): Charge {
        switch (character) {
            case 'i':
                return Charge.INTROVERTED;
            case 'e':
                return Charge.EXTROVERTED;
            default:
                throw new Error("Invalid Charge character.");
        }
    }




    export function opposite(charge: Charge): Charge {
        switch (charge) {
            case Charge.INTROVERTED:
                return Charge.EXTROVERTED;
            case Charge.EXTROVERTED:
                return Charge.INTROVERTED;
            default:
                throw new Error("Impossible. Foreign Charge instance.");
        }
    }

    export function toString(charge: Charge): string {
        return charge;
    }
}


enum HumanNeed {
    OI_ORGANIZE = 'Oi',
    OE_GATHER = 'Oe',
    DI_SELF = 'Di',
    DE_TRIBE = 'De'
}

namespace HumanNeed {

    export function fromString(humanNeedLabel: string): HumanNeed {
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

    export function getCharge(humanNeed: HumanNeed): Charge {
        switch (humanNeed) {
            case HumanNeed.OI_ORGANIZE:
            case HumanNeed.DI_SELF:
                return Charge.INTROVERTED
            case HumanNeed.OE_GATHER:
            case HumanNeed.DE_TRIBE:
                return Charge.EXTROVERTED
        }
    }

    export function getAxis(humanNeed: HumanNeed): Axis {
        switch (humanNeed) {
            case HumanNeed.OI_ORGANIZE:
            case HumanNeed.OE_GATHER:
                return Axis.OBSERVING
            case HumanNeed.DI_SELF:
            case HumanNeed.DE_TRIBE:
                return Axis.DECIDING
        }
    }


}



enum Letter {
    SENSING = 'S',
    INTUITING = 'N',
    FEELING = 'F',
    THINKING = 'T'
}

namespace Letter {
    export function fromCharacter(character: string): Letter {
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
}



export class CognitiveFunction {
    protected _internalName: string;

    constructor(cognitiveFunction: string | CognitiveFunction) {
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

    get letter(): Letter | undefined {
        const char1 = this._internalName[0];

        if (/[OD]/.test(char1)) return undefined;

        return Letter.fromCharacter(char1);
    }

    get charge(): Charge | undefined {
        const char2 = this._internalName[1];

        if (char2 == '?') return undefined;

        return Charge.fromCharacter(char2);
    }

    get axis(): Axis {
        return Axis.fromCharacter(this._internalName[0]);
    }

    get shortName(): string {
        const charge = this.charge;

        // First character is always guaranteed, second one depends on presence of charge.
        return this._internalName[0] + (charge ?? '');
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

    toString(): string {
        return this.shortName;
    }
}



enum Modality {
    FF_TESTER = "FF",
    FM_VISUAL = "FM",
    MF_AUDIO = "MF",
    MM_KINESTHETIC = "MM",
}




export interface GrantIndexCouple {
    strongerIndex: number;
    weakerIndex: number;
}

export enum AnimalGrantPosition {
    STRONGER_INFO,
    STRONGER_ENERGY,
    WEAKER_INFO,
    WEAKER_ENERGY,
}

export namespace AnimalGrantPosition {
    export function toGrantIndexCouple(animalGrantPosition: AnimalGrantPosition): GrantIndexCouple {
        switch (animalGrantPosition) {
            case AnimalGrantPosition.STRONGER_INFO:
                return {
                    strongerIndex: 0,
                    weakerIndex: 1
                }
            case AnimalGrantPosition.STRONGER_ENERGY:
                return {
                    strongerIndex: 0,
                    weakerIndex: 2
                }
            case AnimalGrantPosition.WEAKER_INFO:
                return {
                    strongerIndex: 2,
                    weakerIndex: 3
                }
            case AnimalGrantPosition.WEAKER_ENERGY:
                return {
                    strongerIndex: 1,
                    weakerIndex: 3
                }
        }
    }
}



export class Animal {
    get shortName(): string {
        throw new Error("Not implemented yet.");
    }

}




export interface CognitiveFunctionInfo {
    readonly cognitiveFunction: CognitiveFunction;
    readonly grantIndex: number;
    readonly isSavior: boolean;
    readonly isMasculine: boolean;
    readonly isDoubleActivated: boolean;
}

export interface AnimalInfo {
    readonly animal: Animal;
    readonly stackIndex: number;
    readonly animalPosition: AnimalGrantPosition;
    readonly isSavior: boolean;
    readonly isDoubleActivated: boolean;
}



export class OpType {
    private static GENERIC_TYPE_SYMBOL = Symbol();
    static GENERIC: OpType = new OpType(OpType.GENERIC_TYPE_SYMBOL);


    constructor(
        firstGrantFunction: symbol | CognitiveFunction,
        secondGrantFunction?: CognitiveFunction,
        animalStack?: string,
        modalities?: Modality
    ) {
        animalStack?.replace(/"[^SCBP]"/, "");

        throw new Error("Not implemented yet.");
    }


    getCognitiveFunctionInfo(grantIndex: number): CognitiveFunctionInfo {
        throw new Error("Not implemented yet.");
    }

    getAnimalInfo(animalGrantPosition: AnimalGrantPosition): AnimalInfo {
        throw new Error("Not implemented yet.");
    }
}