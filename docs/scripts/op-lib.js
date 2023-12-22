

/**
 * @class
 */
export class CognitiveFunction {
    /**
     * @param {string|CognitiveFunction} cognitiveFunction A {@link CognitiveFunction} to copy or a letter+charge
     *     string.
     */
    constructor(cognitiveFunction) {
        if (cognitiveFunction instanceof CognitiveFunction) cognitiveFunction = cognitiveFunction.shortName;
        if (typeof cognitiveFunction !== 'string') throw new TypeError("Invalid type.");
    
    
        // Check length for validity.
        if (cognitiveFunction.length < 1 || cognitiveFunction.length > 2) throw new Error("Invalid length.");
    
    
        // If it's a one-letter function add a question mark for the introversion/extroversion
        if (cognitiveFunction.length === 1) cognitiveFunction = cognitiveFunction + '?';
    
        // Check first letter for validity.
        if (/[^FTSNDO]/.test(cognitiveFunction[0])) throw new Error("Invalid first letter.");
    
        // Check second letter for validity.
        if (/[^ie?]/.test(cognitiveFunction[1])) throw new Error("Invalid second letter.");
        
        
        this._shortName = cognitiveFunction
    }
    
    
    /**
     * @returns {string}
     */
    get shortName() { return this._shortName; }
    
    // SLEEP
    // get longName() { throw new Error("Not implemented."); }
    
    
    
    /**
     * Equivalent to shortName[0].
     * @return {string} One of 'F', 'T', 'S', 'N', 'D', 'O'.
     */
    get rawLetter() {
        return this.shortName[0];
    }
    
    /**
     *
     * @returns {undefined|string} 'F', 'T', 'S', 'N' or undefined
     */
    get letter() {
        return /[OD]/.test(this.rawLetter) ? undefined : this.rawLetter;
    }
    
    
    /**
     * Equivalent to shortName[1].
     * @return {string} 'i', 'e' or '?'.
     */
    get rawCharge() {
        return this.shortName[1];
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
        return /[OD?]/.test(this.shortName);
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
        
        return this.shortName === otherFunction.shortName;
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
        return this.shortName;
    }
}



/**
 * @readonly
 * @class
 */
class Quadra {
    static #isConstructorLocked = false;
    static ALPHA = new Quadra("Ti", "Si");
    static BETA = new Quadra("Ti", "Ni");
    static GAMMA = new Quadra("Fi", "Ni");
    static DELTA = new Quadra("Fi", "Si");
    static #isConstructorLocked = true;
    
    /**
     * Array containing all the Quadras.
     * @type {Quadra[]}
     */
    static All = [Quadra.ALPHA, Quadra.BETA, Quadra.GAMMA, Quadra.DELTA];
    
    
    static getInstance(cognitiveFun1, cognitiveFun2) {
        function checkFunction(cogFun, argName) {
            if (typeof cogFun === 'string') cogFun = new CognitiveFunction(cogFun);
    
            // REM It makes no sense to have partial quadras for now, so we're enforcing non-null + complete functions.
    
            if (!(cogFun instanceof CognitiveFunction)) {
                throw new TypeError(`Invalid ${argName} type.`);
            }
    
            if (cogFun.isPartial) throw new Error(`${argName} is a partial function.`);
    
            return cogFun
        }
    
        cognitiveFun1 = checkFunction(cognitiveFun1, "cognitiveFun1");
        cognitiveFun2 = checkFunction(cognitiveFun2, "cognitiveFun2");
        
        if (cognitiveFun1.hasAxisAffinityWith(cognitiveFun2)) {
            throw new Error("Provided functions must be on different axis.");
        }
    
        for (const quadra of this.All) {
            if (quadra.includes(cognitiveFun1) && quadra.includes(cognitiveFun2)) return quadra;
        }
    }
    
    
    /**
     * @param cognitiveFuns {...CognitiveFunction|string}
     * @return {boolean}
     */
    includes(...cognitiveFuns) {
        let count = 0;
    
        for (const qCogFun of this.allFunctions) {
            for (let argCogFun of cognitiveFuns) {
                // This will throw an error if the element is not a cognitive function.
                argCogFun = new CognitiveFunction(argCogFun);
            
                if (qCogFun.equalsTo(argCogFun)) count++;
            }
        }
    
        return count === cognitiveFuns.length;
    }
    
    /**
     * DON'T USE. Use {@link ALPHA}, {@link BETA}, {@link GAMMA}, {@link DELTA}, or {@link getInstance},
     * @private
     */
    constructor(diFunction, oiFunction) {
        if (Quadra.#isConstructorLocked) throw new Error("Private constructor, use static properties or methods.");
        
        // Initialized statically, no need to check values.
        diFunction = new CognitiveFunction(diFunction);
        oiFunction = new CognitiveFunction(oiFunction);
        
        this.diFunction = diFunction;
        this.oiFunction = oiFunction;
        
        this.deFunction = diFunction.opposite();
        this.oeFunction = oiFunction.opposite();
        this.feelingFunction = diFunction.isFeeling ? diFunction : this.deFunction;
        this.thinkingFunction = this.feelingFunction.opposite();
        this.sensingFunction = oiFunction.isSensing ? oiFunction : this.oeFunction;
        this.intuitionFunction = this.sensingFunction.opposite();
        
        /** @type {CognitiveFunction[]} */
        const allFunctions = [this.feelingFunction, this.thinkingFunction, this.sensingFunction, this.intuitionFunction];
        Object.freeze(allFunctions);
        this.allFunctions = allFunctions;
        
        
        Object.freeze(this);
        this.intuitionFunction = "";
        throw new Error("We shouldn't even be able to reach this.");
    }
    
    /**
     * @return {string}
     */
    get name() {
        switch (this) {
            case Quadra.ALPHA:
                return "Alpha";
            case Quadra.BETA:
                return "Beta";
            case Quadra.GAMMA:
                return "Gamma";
            case Quadra.DELTA:
                return "Delta";
            default:
                throw new Error("This shouldn't be possible.");
        }
    }
    
    
    /**
     *
     * @returns {Quadra}
     */
    opposite() {
        switch (this) {
            case Quadra.ALPHA:
                return Quadra.GAMMA;
            case Quadra.BETA:
                return Quadra.DELTA;
            case Quadra.GAMMA:
                return Quadra.ALPHA;
            case Quadra.DELTA:
                return Quadra.BETA;
            default:
                throw new Error("This shouldn't be possible.");
        }
    }
    
    // SLEEP Add oppositeObserverAxis and oppositeDeciderAxis.
}




/**
 * @readonly
 * @class
 */
export class AbsoluteAnimalPositions {
    // SLEEP Copy what we did for Quadra.
    
    static #Args = class Args {
        constructor(grantIndex1, grantIndex2) {
            this.grantIndex1 = grantIndex1;
            this.grantIndex2 = grantIndex2;
        }
    }
    
    /** @type {Readonly<AbsoluteAnimalPositions>} */
    static UPPER_INFO = this.#buildInstance(0, 1);
    
    /** @type {Readonly<AbsoluteAnimalPositions>} */
    static UPPER_ENERGY = this.#buildInstance(0, 2);
    
    /** @type {Readonly<AbsoluteAnimalPositions>} */
    static LOWER_INFO = this.#buildInstance(2, 3);
    
    /** @type {Readonly<AbsoluteAnimalPositions>} */
    static LOWER_ENERGY = this.#buildInstance(1, 3);
    
    // SLEEP When we have an IDE that doesn't suck ass convert this to a static initializer.
    /**
     * @param grantIndex1 {number}
     * @param grantIndex2 {number}
     * @return {AbsoluteAnimalPositions}
     */
    static #buildInstance(grantIndex1, grantIndex2) {
        return new AbsoluteAnimalPositions(new this.#Args(grantIndex1, grantIndex2));
    }
    
    
    /**
     *
     * @param grantIndex1 {number}
     * @param grantIndex2 {number}
     * @return {AbsoluteAnimalPositions}
     */
    static getInstance(grantIndex1, grantIndex2) {
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
                return this.UPPER_INFO;
            // 0 + 2.
            case 2:
                return this.UPPER_ENERGY;
            // 1 + 3.
            case 4:
                return this.LOWER_ENERGY;
            // 2 + 3.
            case 5:
                return this.LOWER_INFO;
            default:
                throw new Error("Invalid index couple (same axis not allowed).");
        }
    }
    
    
    /**
     *
     * @param args {AbsoluteAnimalPositions.Args}
     */
    constructor(args) {
        if (!(args instanceof AbsoluteAnimalPositions.#Args)) throw new Error(
            "Private constructor. Use static methods or properties to obtain instances."
        );
        
        this.grantIndex1 = args.grantIndex1;
        this.grantIndex2 = args.grantIndex2;
    
        Object.freeze(this);
    }
}


// HERE Keep going with the re-visiting of the entire lib. Adding static Animals next.

/**
 * @class
 */
export class Animal {
    /**
     * @param {CognitiveFunction|string} cogFun1
     * @param {CognitiveFunction|string} cogFun2
     */
    constructor(cogFun1, cogFun2) {
        if (typeof cogFun1 === 'string') cogFun1 = new CognitiveFunction(cogFun1);
        if (typeof cogFun2 === 'string') cogFun2 = new CognitiveFunction(cogFun2);
        if (!(cogFun1 instanceof CognitiveFunction && cogFun2 instanceof CognitiveFunction))
            throw new Error('Invalid argument. Must be cognitive function name or CognitiveFunction.');
        
        if (cogFun1.hasAxisAffinityWith(cogFun2)) throw new Error(
            "Invalid argument. Functions must be on different axes D+O."
        );
        
        this._dFunction = cogFun1.isDeciding ? cogFun1 : cogFun2;
        this._oFunction = cogFun1.isObserving ? cogFun1 : cogFun2;
        
        let name;
        switch (true) {
            case cogFun1.isExtroverted && cogFun2.isExtroverted:
                name = AnimalNames.Play;
                break;
            case cogFun1.isIntroverted && cogFun2.isIntroverted:
                name = AnimalNames.Sleep;
                break;
            default:
                if (this._oFunction.isIntroverted) name = AnimalNames.Blast
                else name = AnimalNames.Consume;
        }
        this._name = name;
    }
    
    /**
     *
     * @returns {CognitiveFunction}
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
    
    
    invert() {
        const oppositeObserver = this.observingFunction.opposite()
        const oppositeDecider = this.observingFunction.opposite()
        
        return new Animal(oppositeObserver.shortName, oppositeDecider.shortName);
    }
    
    
    isSameAnimalOf(otherAnimal) {
        if (!(otherAnimal instanceof Animal)) return undefined;
        
        return otherAnimal.name === this.name;
    }
}


export class PersonalAnimal extends Animal {
    /**
     * @param opType {OpType}
     * @param cogFun1 {CognitiveFunction|string}
     * @param cogFun2 {CognitiveFunction|string}
     * @param sexualCharge1 {SexualCharge}
     * @param sexualCharge2 {SexualCharge}
     */
    constructor(opType, cogFun1, cogFun2, sexualCharge1, sexualCharge2) {
        super(cogFun1, cogFun2)
    }
}


export const MainUnbalances = {
    O: new CognitiveFunction('O'),
    D: new CognitiveFunction('D')
}

export const HumanNeeds = {
    Di: new CognitiveFunction('Di'),
    De: new CognitiveFunction('De'),
    Oi: new CognitiveFunction('Oi'),
    Oe: new CognitiveFunction('Oe')
}


export const Letters = {
    F: new CognitiveFunction('F'),
    T: new CognitiveFunction('T'),
    S: new CognitiveFunction('S'),
    N: new CognitiveFunction('N'),
}

export const CognitiveFunctions = {
    Fi: new CognitiveFunction('Fi'),
    Fe: new CognitiveFunction('Fe'),
    Ti: new CognitiveFunction('Ti'),
    Te: new CognitiveFunction('Te'),
    Si: new CognitiveFunction('Si'),
    Se: new CognitiveFunction('Se'),
    Ni: new CognitiveFunction('Ni'),
    Ne: new CognitiveFunction('Ne')
}


export const Animals = {
    S: new Animal('Di', 'Oi'),
    C: new Animal('Di', 'Oe'),
    B: new Animal('De', 'Oi'),
    P: new Animal('De', 'Oe'),
}

export const AnimalDominance = {
    Info: 'Info',
    Energy: 'Energy'
}

export const SocialEnergy = {
    I: 'I',
    E: 'E'
}

/**
 * @enum {string}
 */
export const SexualCharge = {
    M: 'M',
    F: 'F'
}

/**
 * @enum {string}
 */
export const RespectType = {
    Flex: 'Flex',
    Friends: 'Friends'
}

/**
 * @enum {string}
 */
export const AchievementType = {
    Responsibility: 'Responsibility',
    Specialize: 'Specialize'
}


/**
 * @class
 */
export class OpType {
    
    static build512Type(animalStack, saviors, modality) {
        throw Error("Not implemented.")
        return undefined;
    }
    
    
    constructor(
        isSingleObserver,
        isSaviorDi,
        isSaviorOi,
        isSaviorSensing,
        isSaviorFeeling,
        isSaviorConsume,
        isSaviorSleep,
        isInfoDom,
        isIntroverted,
        hasMasculineSensory,
        hasMasculineDe,
        isFlex,
        isResponsibility
    ) {
        switch (isSingleObserver) {
            case 'O':
            case 'ODD':
            case true:
                this._coinMainUnbalance = MainUnbalances.O;
                break;
            case 'D':
            case 'DOO':
            case false:
                this._coinMainUnbalance = MainUnbalances.D;
                break;
            case null:
            case undefined:
                this._coinMainUnbalance = undefined;
                break;
            default:
                throw Error("Invalid argument for isSingleObserver.");
        }
    
        switch (isSaviorDi) {
            case 'Di':
            case true:
                this._coinDeciderCharge = HumanNeeds.Di;
                break;
            case 'De':
            case false:
                this._coinDeciderCharge = HumanNeeds.De;
                break;
            case null:
            case undefined:
                this._coinDeciderCharge = undefined;
                break;
            default:
                throw Error("Invalid argument for isSaviorDi.");
        }
    
    
        switch (isSaviorOi) {
            case 'Oi':
            case true:
                this._coinObserverCharge = HumanNeeds.Oi;
                break;
            case 'Oe':
            case false:
                this._coinObserverCharge = HumanNeeds.Oe;
                break;
            case null:
            case undefined:
                this._coinObserverCharge = undefined;
                break;
            default:
                throw Error("Invalid argument for isSaviorOi.");
        }
    
    
        switch (isSaviorSensing) {
            case 'S':
            case true:
                this._coinObserverLetter = Letters.S;
                break;
            case 'N':
            case false:
                this._coinObserverLetter = Letters.N;
                break;
            case null:
            case undefined:
                this._coinObserverLetter = undefined;
                break;
            default:
                throw Error("Invalid argument for isSaviorSensing.");
        }
    
    
    
        switch (isSaviorFeeling) {
            case 'F':
            case true:
                this._coinDeciderLetter = Letters.F;
                break;
            case 'T':
            case false:
                this._coinDeciderLetter = Letters.T;
                break;
            case null:
            case undefined:
                this._coinDeciderLetter = undefined;
                break;
            default:
                throw Error("Invalid argument for isSaviorFeeling.");
        }
    
    
        switch (isSaviorConsume) {
            case 'C':
            case 'Consume':
            case true:
                this._coinInfoAnimal = Animals.C;
                break;
            case 'B':
            case 'Blast':
            case false:
                this._coinInfoAnimal = Animals.B;
                break;
            case null:
            case undefined:
                this._coinInfoAnimal = undefined;
                break;
            default:
                throw Error("Invalid argument for isSaviorConsume.");
        }
    
    
        switch (isSaviorSleep) {
            case 'S':
            case 'Sleep':
            case true:
                this._coinEnergyAnimal = Animals.S;
                break;
            case 'P':
            case 'Play':
            case false:
                this._coinEnergyAnimal = Animals.P;
                break;
            case null:
            case undefined:
                this._coinEnergyAnimal = undefined;
                break;
            default:
                throw Error("Invalid argument for isSaviorSleep.");
        }
        
        
        switch (isInfoDom) {
            case 'I':
            case 'Info':
            case true:
                this._coinAnimalDominance = AnimalDominance.Info;
                break;
            case 'E':
            case 'Energy':
            case false:
                this._coinAnimalDominance = AnimalDominance.Energy;
                break;
            case null:
            case undefined:
                this._coinAnimalDominance = undefined;
                break;
            default:
                throw Error("Invalid argument for isInfoDom.");
        }
        
        
        switch (isIntroverted) {
            case 'I':
            case 'Introvert':
            case 'Introverted':
            case true:
                this._coinSocialEnergy = SocialEnergy.I;
                break;
            case 'E':
            case 'Extrovert':
            case 'Extroverted':
            case false:
                this._coinSocialEnergy = SocialEnergy.E;
                break;
            case null:
            case undefined:
                this._coinSocialEnergy = undefined;
                break;
            default:
                throw Error("Invalid argument for isIntroverted.");
        }
        
        
        switch (hasMasculineSensory) {
            case 'M':
            case 'Masculine':
            case 'S':
            case true:
                this._coinSensorySexual = SexualCharge.M;
                break;
            case 'F':
            case 'Feminine':
            case 'N':
            case false:
                this._coinSensorySexual = SexualCharge.F;
                break;
            case null:
            case undefined:
                this._coinSensorySexual = undefined;
                break;
            default:
                throw Error("Invalid argument for hasMasculineSensory.");
        }
        
        
        switch (hasMasculineDe) {
            case 'M':
            case 'Masculine':
            case true:
                this._coinDeSexual = SexualCharge.M;
                break;
            case 'F':
            case 'Feminine':
            case false:
                this._coinDeSexual = SexualCharge.F;
                break;
            case null:
            case undefined:
                this._coinDeSexual = undefined;
                break;
            default:
                throw Error("Invalid argument for hasMasculineDe.");
        }
        
        
        switch (isFlex) {
            case 'Flex':
            case true:
                this._coinRespect = RespectType.Flex;
                break;
            case 'Friends':
            case false:
                this._coinRespect = RespectType.Friends;
                break;
            case null:
            case undefined:
                this._coinRespect = undefined;
                break;
            default:
                throw Error("Invalid argument for isFlex.");
        }
    
    
        switch (isResponsibility) {
            case 'Responsibility':
            case true:
                this._coinAchievements = AchievementType.Responsibility
                break;
            case 'Specialize':
            case 'Specialization':
            case false:
                this._coinAchievements = AchievementType.Specialize;
                break;
            case null:
            case undefined:
                this._coinAchievements = undefined;
                break;
            default:
                throw Error("Invalid argument for isResponsibility.");
        }
    
    
        console.log(
            "Constructing OP type...\n",
            `ODD/DOO: ${isSingleObserver}\n`,
            `Oi/Oe: ${isSaviorOi}\n`,
            `Di/De: ${isSaviorDi}\n`,
            `S/N: ${isSaviorSensing}\n`,
            `F/T: ${isSaviorFeeling}\n`,
            `Consume/Blast: ${isSaviorConsume}\n`,
            `Sleep/Play: ${isSaviorSleep}\n`,
            `Info/Energy: ${isInfoDom}\n`,
            `Introvert/Extrovert: ${isIntroverted}\n`,
            `M/F Sensory: ${hasMasculineSensory}\n`,
            `M/F De: ${hasMasculineDe}\n`,
            `Flex/Friends: ${isFlex}\n`,
            `Responsibility/Specialize: ${isResponsibility}\n`,
        )
        
        
        const conflicts = this.getConflictingCoins();
    
        
        const saviorFunctions = new Array(2);
        let obFunc, decFunc;
        if (!conflicts.SaviorCharges) {
            const obLet = this._coinObserverLetter?.letter;
            const obCharge = this._coinObserverLetter?.charge;
            if (obLet || obCharge) obFunc = new CognitiveFunction((obLet ?? 'O') + (obCharge ?? ''));
    
            const decLet = this._coinDeciderLetter?.letter;
            const decCharge = this._coinDeciderLetter?.charge;
            if (decLet || decCharge) decFunc = new CognitiveFunction((decLet ?? 'D') + (decCharge ?? ''));
            
            switch (this._coinMainUnbalance) {
                case MainUnbalances.O:
                    saviorFunctions[0] = obFunc;
                    saviorFunctions[1] = decFunc;
                    break;
                case MainUnbalances.D:
                    saviorFunctions[0] = decFunc;
                    saviorFunctions[1] = obFunc;
                    break;
            }
        }
        
        
        
        
        const grantStack = new Array(4);
        
        // First and last function.
        grantStack[0] = saviorFunctions[0];
        grantStack[3] = grantStack[0]?.opposite();
        // If introversion/extroversion characters of first and second savior functions are matching, then the correct
        // second Grant function is the opposite of the second savior function, otherwise it's the savior function itself.
        const matchingSaviorsExtroversion = saviorFunctions[0]?.charge === saviorFunctions[1]?.charge;
        grantStack[1] = matchingSaviorsExtroversion ? saviorFunctions[1]?.opposite() : saviorFunctions[1];
        grantStack[2] = grantStack[1]?.opposite();
        this._grantStack = grantStack;
        
        
        // Instantiate Quadra only if at least one of the two savior functions is not undefined.
        if (decFunc || obFunc) this._quadra = new Quadra(
            decFunc?.isIntroverted ? decFunc : decFunc?.opposite(),
            obFunc?.isIntroverted ? obFunc : obFunc?.opposite()
        )
        const quad = this._quadra;
        
        
        // let socialStack;
        // switch (socialType) {
        //     case "#1":
        //         socialStack = "CSPB";
        //         break;
        //     case "#2":
        //         socialStack = "PCBS";
        //         break;
        //     case "#3":
        //         socialStack = "SBCP";
        //         break;
        //     case "#4":
        //         socialStack = "BPSC";
        //         break;
        // }
        // this._socialStack = socialStack;
    }
    
    /**
     * Returns true if indexOrFunction points to a savior function.
     * @param indexOrFunction {number, string, CognitiveFunction} Either a Grant index or a function.
     * @return {boolean}
     * @throws Will throw an error if the argument is not a function.
     */
    isSaviorFunction(indexOrFunction) {
        throw Error("Not implemented.");
    }
    
    /**
     * Returns true if indexOrFunction points to a masculine function.
     * @param indexOrFunction {number, string, CognitiveFunction} Either a Grant index or a function.
     * @returns {boolean}
     * @throws Will throw an error if the argument is not a function.
     */
    isMasculineFunction(indexOrFunction) {
        throw Error("Not implemented.");
    }
    
    
    get isPartial() {
        return !(
            this._coinMainUnbalance &&
            this._coinDeciderCharge &&
            this._coinObserverCharge &&
            this._coinDeciderLetter &&
            this._coinObserverLetter &&
            this._coinInfoAnimal &&
            this._coinEnergyAnimal &&
            this._coinAnimalDominance &&
            this._coinSocialEnergy &&
            this._coinSensorySexual &&
            this._coinDeSexual &&
            this._coinRespect &&
            this._coinAchievements
        )
    }
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isSingleObserver() {
        const coin = this._coinMainUnbalance;
        
        return coin && coin === MainUnbalances.O
    }
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isSingleDecider() {
        // We need to do the && to maintain 'undefined' on _coinMainUnbalance.
        return this._coinMainUnbalance && !this.isSingleObserver;
    }
    
    /**
     *
     * @returns {CognitiveFunction[]}
     */
    get grantStack() {
        return this._grantStack;
    }
    
    
    
    
    /**
     *
     * @returns {
     *      {InfoAnimal: boolean, DominanceAndSocialEnergy: boolean, SaviorCharges: boolean, EnergyAnimal: boolean}
     * }
     */
    getConflictingCoins() {
        // If savior charges are defined an animal is created and we invert it.
        let saviorAnimal;
        try {
            saviorAnimal = new Animal(this._coinDeciderCharge, this._coinObserverCharge);
        } catch (e) {  }
        let oppositeSaviorAnimal = saviorAnimal && saviorAnimal.invert();
        
        
        // Find the animal that can't be Savior because it must be Last.
        let incompatibleAnimal;
        if (this._coinAnimalDominance && this._coinSocialEnergy) {
            switch(this._coinAnimalDominance[0] + this._coinSocialEnergy[0]) {
                case 'II':
                    incompatibleAnimal = Animals.P;
                    break;
                case 'IE':
                    incompatibleAnimal = Animals.S;
                    break;
                case 'EI':
                    incompatibleAnimal = Animals.B;
                    break;
                case 'EE':
                    incompatibleAnimal = Animals.C;
                    break;
                default:
                    throw Error("Impossible case.")
            }
        }
    
        return {
            SaviorCharges: (
                oppositeSaviorAnimal?.isSameAnimalOf(this._coinInfoAnimal) ||
                oppositeSaviorAnimal?.isSameAnimalOf(this._coinEnergyAnimal) ||
                saviorAnimal?.isSameAnimalOf(incompatibleAnimal)
            ) ?? false,
        
            InfoAnimal: (
                this._coinInfoAnimal?.isSameAnimalOf(oppositeSaviorAnimal) ||
                this._coinInfoAnimal?.isSameAnimalOf(incompatibleAnimal)
            ) ?? false,
        
            EnergyAnimal: (
                this._coinEnergyAnimal?.isSameAnimalOf(oppositeSaviorAnimal) ||
                this._coinEnergyAnimal?.isSameAnimalOf(incompatibleAnimal)
            ) ?? false,
        
            DominanceAndSocialEnergy: (
                incompatibleAnimal?.isSameAnimalOf(saviorAnimal) ||
                incompatibleAnimal?.isSameAnimalOf(this._coinInfoAnimal) ||
                incompatibleAnimal?.isSameAnimalOf(this._coinEnergyAnimal)
            ) ?? false
        };
    }
    
    
    
    saviorFunctionsToString() {
        const s1 = this._saviorFunctions[0];
        const s2 = this._saviorFunctions[1];
        return s1 + "/" + s2;
    }
    
    animalStackToString() {
        const a1 = this.animalStack[0];
        const a2 = this.animalStack[1];
        const a3 = this.animalStack[2];
        const a4 = this.animalStack[3];
        return a1 + a2 + "/" + a3 + "(" + a4 + ")";
    }
    
    
    
    toString() {
        const mod = this.modality;
        const sav = this.saviorFunctionsToString();
        const anim = this.animalStackToString();
        return mod + "-" + sav + "-" + anim + "-" + this.socialType;
    }
    
    
}