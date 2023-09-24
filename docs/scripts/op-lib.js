// String must be either a single uppercase letter or a full name with first letter uppercase.
export function invertAnimal(animal) {
    let result;
    const error = new Error("Invalid animal.");
    
    
    // Blast is the opposite of Consume, and Sleep is the opposite of Play.
    switch (animal[0]) {
        case "S":
            if (animal.length > 1) {
                if (animal === "Sleep") result = "Play";
                else throw error;
            } else {
                result = "P";
            }
            break;
        case "C":
            if (animal.length > 1) {
                if (animal === "Consume") result = "Blast";
                else throw error;
            } else {
                result = "B";
            }
            break;
        case "B":
            if (animal.length > 1) {
                if (animal === "Blast") result = "Consume";
                else throw error;
            } else {
                result = "C";
            }
            break;
        case "P":
            if (animal.length > 1) {
                if (animal === "Play") result = "Sleep";
                else throw error;
            } else {
                result = "S";
            }
            break;
        default:
            throw error; // Invalid input if the first character doesn't match any case.
    }
    
    return result;
}

/**
 *
 * @param {string} cogFun1
 * @param {string} cogFun2
 * @returns {string}
 */
export function getAnimalLetter(cogFun1, cogFun2) {
    if (cogFun1.length + cogFun2.length < 4) throw new Error(
        "Invalid cognitive functions. Each one must be 2 characters."
    );
    
    const isFirstGroupDecider = cogFun1[0].match("F|T");
    
    let animal;
    // Using introversion/extroversion letters to identify animal.
    switch (cogFun1[1] + cogFun2[1]) {
        case "ii":
            animal = "S";
            break;
        case "ee":
            animal = "P";
            break;
        // For the next two cases we need to check the first letter as well.
        case "ie":
            if (isFirstGroupDecider) animal = "C";
            else animal = "B";
            break;
        case "ei":
            if (isFirstGroupDecider) animal = "B";
            else animal = "C";
            break;
    }
    
    return animal;
}

/**
 * @class
 */
class PartialCognitiveFunction {
    /**
     * @param {string|PartialCognitiveFunction} cogFunName
     */
    constructor(cogFunName) {
        if (cogFunName instanceof PartialCognitiveFunction) cogFunName = cogFunName.name;
        if (typeof cogFunName !== 'string') throw new TypeError('Not a string.');
    
    
        // Check length for validity.
        if (cogFunName.length < 1 || cogFunName.length > 2) throw new Error('Invalid length.');
    
    
        // If it's a one-letter function add a question mark for the introversion/extroversion
        if (cogFunName.length === 1) cogFunName = cogFunName + '?';
    
        // Check first letter for validity.
        if (/[^FTSNDO?]/.test(cogFunName[0])) throw new Error('Invalid first letter.');
    
        // Check second letter for validity.
        if (/[^ie?]/.test(cogFunName[1])) throw new Error('Invalid second letter.');
    
        // Check that we don't have only question marks.
        if (!/[^?]/.test(cogFunName)) throw new Error('Only question marks.');
        
        
        this._cogFunName = cogFunName
        
        if (!this.isActuallyPartial) console.warn('Complete Cognitive Function was instantiated as partial.');
    }
    
    
    /**
     * @returns {string}
     */
    get name() { return this._cogFunName; }
    get letter() {
        const letter = this.name[0];
        return letter === '?' ? undefined : letter;
    }
    get charge() {
        const charge = this.name[1];
        return charge === '?' ? undefined : charge;
    }
    
    
    
    /**
     * @returns {boolean|undefined}
     */
    get isIntroverted() {
        const charge = this.name[1];
        if (charge === '?') {
            return undefined;
        } else return charge === 'i';
    }
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isExtroverted() {
        const charge = this.name[1];
        if (charge === '?') {
            return undefined;
        } else {
            return charge === 'e';
        }
    }
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isObserving() {
        if (this.name[0] === '?') {
            return undefined
        } else {
            return /[SNO]/.test(this.name[0]);
        }
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
     * @returns {boolean|undefined}
     */
    get isSensing() {
        if (/[?O]/.test(this.name[0])) {
            return undefined
        } else {
            return this.name[0] === 'S';
        }
    }
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isIntuition() {
        if (/[?O]/.test(this.name[0])) {
            return undefined
        } else return this.name[0] === 'N';
    }
    
    
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isDeciding() {
        if (this.name[0] === '?') {
            return undefined
        } else {
            return /[FT]/.test(this.name[0]);
        }
    }
    
    get isFeeling() {
        if (/[?D]/.test(this.name[0])) {
            return undefined
        } else {
            return this.name[0] === 'F';
        }
    }
    
    /**
     *
     * @returns {boolean|undefined}
     */
    get isThinking() {
        if (/[?D]/.test(this.name[0])) {
            return undefined
        } else {
            return this.name[0] === 'T';
        }
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
    
    
    /**
     * @returns {PartialCognitiveFunction|CognitiveFunction}
     */
    opposite() {
        let letter = this.name[0];
        let charge = this.name[1];
        
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
        
        if (charge === 'i') charge = 'e' ; else charge = 'i';
        
        const result = letter + charge;
    
        return CognitiveFunction.bestInstanceFromString(result);
    }
    
    /**
     *
     * @returns {PartialCognitiveFunction|CognitiveFunction}
     */
    withOppositeLetter() {
        let letter = this.name[0];
        
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
    
        const result = letter + this.name[1];
    
        return CognitiveFunction.bestInstanceFromString(result);
    }
    
    withOppositeCharge() {
        let charge = this.name[1];
        
        if (charge === '?') return new PartialCognitiveFunction(this);
        
        if (charge === 'i') charge = 'e' ; else charge = 'i';
    
        const result = this.name[0] + charge;
    
        return CognitiveFunction.bestInstanceFromString(result);
    }
    
    
    /**
     * Returns true only if this instance of PartialCognitiveFunction
     * @returns {boolean}
     */
    get isActuallyPartial() {
        return /[OD?]/.test(this.name);
    }
    
    /**
     * @param {any | PartialCognitiveFunction} otherFunction
     * @returns {boolean|undefined}
     */
    equalsTo(otherFunction) {
        if (typeof otherFunction === 'string') otherFunction = new PartialCognitiveFunction(otherFunction);
        if (!(otherFunction instanceof PartialCognitiveFunction)) return undefined;
        
        return this.name === otherFunction.name;
    }
    
    hasAffinityWith(otherFunction) {
        // HERE Code
        throw new Error('not implemented.');
    }
    
    /**
     * @param otherFunction
     * @returns {boolean|undefined}
     */
    isSameAxisOf(otherFunction) {
        if (typeof otherFunction === 'string') otherFunction = CognitiveFunction.bestInstanceFromString(otherFunction);
        if (!(otherFunction instanceof PartialCognitiveFunction)) throw new Error('Invalid argument. Not a function.');
        
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


/**
 * @class
 */
class CognitiveFunction extends PartialCognitiveFunction{
    static bestInstanceFromString(cogFunName) {
        if (typeof cogFunName !== 'string') throw new Error ('Argument is not a string.');
        return /[DO?]/.test(cogFunName) ? new PartialCognitiveFunction(cogFunName) : new CognitiveFunction(cogFunName);
    }
    
    /**
     * @param {string|PartialCognitiveFunction} cogFunName
     */
    constructor(cogFunName) {
        // We must keep super() call first because of the PartialCognitiveFunction to string conversion check.
        super(cogFunName);
        
        // Check length for validity.
        if (cogFunName.length !== 2) throw new Error('Invalid length.');
    
        // No partial functions allowed.
        if (cogFunName.includes('?')) throw new Error('Invalid function (partial).');
    }
}



/**
 * @class
 */
class Quadra {
    
    /**
     *
     * @param {CognitiveFunction|string} diFunction
     * @param {CognitiveFunction|string} oiFunction
     */
    constructor(diFunction, oiFunction) {
        // SLEEP Make constructor recognize the two functions automatically, regardless of order of the arguments.
        if (typeof diFunction === 'string') diFunction = new CognitiveFunction(diFunction);
        if (typeof oiFunction === 'string') oiFunction = new CognitiveFunction(oiFunction);
        
        if (!(diFunction instanceof CognitiveFunction && oiFunction instanceof CognitiveFunction))
            throw new TypeError("One or more arguments can't be converted to CognitiveFunction.");
        
        if (!(diFunction.isDeciding && diFunction.isIntroverted && oiFunction.isObserving && oiFunction.isIntroverted)) {
            throw new Error('Invalid arguments. First argument must be Di and second argument must be Oi.');
        }
    
        this._deFunction = diFunction.opposite();
        this._oeFunction = oiFunction.opposite();
        this._feelingFunction = diFunction.isFeeling ? diFunction : this._deFunction;
        this._thinkingFunction = this._feelingFunction.opposite();
        this._sensingFunction = oiFunction.isSensing ? oiFunction : this._oeFunction;
        this._intuitionFunction = this._sensingFunction.opposite();
        this._diFunction = diFunction;
        this._oiFunction = oiFunction;
    }
    
    
    /**
     *
     * @returns {CognitiveFunction}
     */
    get diFunction() {
        return this._diFunction;
    }
    
    /**
     *
     * @returns {CognitiveFunction}
     */
    get oiFunction() {
        return this._oiFunction;
    }
    
    /**
     *
     * @returns {CognitiveFunction}
     */
    get deFunction() {
        return this._deFunction;
    }
    
    /**
     *
     * @returns {CognitiveFunction}
     */
    get oeFunction() {
        return this._oeFunction;
    }
    
    /**
     *
     * @returns {CognitiveFunction}
     */
    get feelingFunction() {
        return this._feelingFunction;
    }
    
    /**
     *
     * @returns {CognitiveFunction}
     */
    get thinkingFunction() {
        return this._thinkingFunction;
    }
    
    /**
     *
     * @returns {CognitiveFunction}
     */
    get sensingFunction() {
        return this._sensingFunction;
    }
    
    /**
     *
     * @returns {CognitiveFunction}
     */
    get intuitionFunction() {
        return this._intuitionFunction;
    }
    
    /**
     *
     * @returns {Quadra}
     */
    opposite() { return new Quadra(this.diFunction.withOppositeLetter(), this.oiFunction.withOppositeLetter()); }
    
    // SLEEP Add oppositeObserverAxis and oppositeDeciderAxis.
}

/**
 * @enum {Quadra}
 */
export const Quadras = {
    alpha: new Quadra("Ti", "Si"),
    beta: new Quadra("Ti", "Ni"),
    gamma: new Quadra("Fi", "Ni"),
    delta: new Quadra("Fi", "Si"),
};

/**
 * @class
 */
export class PartialAnimal {
    /**
     * @param {PartialCognitiveFunction} cogFun1
     * @param {PartialCognitiveFunction} cogFun2
     */
    constructor(cogFun1, cogFun2) {
        if (typeof cogFun1 === 'string') cogFun1 = CognitiveFunction.bestInstanceFromString(cogFun1);
        if (typeof cogFun2 === 'string') cogFun2 = CognitiveFunction.bestInstanceFromString(cogFun2);
        if (!(cogFun1 instanceof PartialCognitiveFunction && cogFun2 instanceof PartialCognitiveFunction))
            throw new Error('Invalid argument. Must be cognitive function name or PartialCognitiveFunction.');
        
        if (cogFun1.isSameAxisOf(cogFun2)) throw new Error(
            "Invalid argument. Functions must be on different axes D+O."
        );
        
        this._dFunction = cogFun1.isDeciding ? cogFun1 : cogFun2;
        this._oFunction = cogFun1.isObserving ? cogFun1 : cogFun2;
    }
    
    
    get decidingFunction() {
        return this._dFunction;
    }
    
    get observingFunction() {
        return this._oFunction;
    }
    
    // SLEEP Add animal full name getter.
}

export class Animal extends PartialAnimal {
    // SLEEP Make "fromString" similar to CogFun.
    
    /**
     * @param {CognitiveFunction} cogFun1
     * @param {CognitiveFunction} cogFun2
     */
    constructor(cogFun1, cogFun2) {
        // Must call super() first because of string conversion check.
        super(cogFun1, cogFun2);
        
        if (!(cogFun1 instanceof CognitiveFunction && cogFun2 instanceof CognitiveFunction)) throw new Error(
            "Invalid arguments. Only CognitiveFunction is allowed."
        );
    }
}


const GenericAnimals = {
    S: new PartialAnimal("Di", "Oi"),
    C: new PartialAnimal("Di", "Oe"),
    B: new PartialAnimal("De", "Oi"),
    P: new PartialAnimal("De", "Oe"),
};


/**
 * @class
 */
export class CognitiveType {
    // HERE Should remain only this to fix.
    /**
     * @type {Boolean}
     */
    _isSingleObserver;
    
    /**
     * @type {PartialAnimal}
     */
    _doubleActivatedAnimal;
    _quadra;
    _saviorFunctions;
    _grantStack;
    _masculineFunctions;
    _socialStack;
    _animalStack;
    _modality;
    _socialType;
    
    
    get isSingleObserver() {
        return this._isSingleObserver;
    }
    
    get animalStack() {
        return this._animalStack;
    }
    
    get modality() {
        return this._modality;
    }
    
    get socialType() {
        return this._socialType;
    }
    
    get isSingleDecider() {
        return !this._isSingleObserver;
    }
    
    get doubleActivatedAnimal() {
        return this._doubleActivatedAnimal;
    }
    
    get quadra() {
        return this._quadra;
    }
    
    get saviorFunctions() {
        return this._saviorFunctions;
    }
    
    get grantStack() {
        return this._grantStack;
    }
    
    get masculineFunctions() {
        return this._masculineFunctions;
    }
    
    get socialStack() {
        return this._socialStack;
    }
    
    constructor(quadraName, isSingleObserver, animalStack, modality, socialType) {
        console.log(
            'Constructing OP type...\n',
            `Quadra: ${quadraName}\n`,
            `Is single observer: ${isSingleObserver}\n`,
            `Animal Stack: ${animalStack}\n`,
            `Modality: ${modality}\n`,
            `Social Type: ${socialType}\n`
        )
    
        this._isSingleObserver = isSingleObserver;
        this._animalStack = animalStack;
        this._doubleActivatedAnimal = invertAnimal(animalStack[3]);
        this._modality = modality;
        this._socialType = socialType;
    
    
        const quadra = Quadras[quadraName.toLowerCase()];
        this._quadra = quadra
        
        
        const firstAnimal = GenericAnimals[animalStack[0]];
        const saviorFunctions = new Array(2);
        if (isSingleObserver) {
            saviorFunctions[0] = quadra[firstAnimal.observingFunction];
            saviorFunctions[1] = quadra[firstAnimal.decidingFunction];
        } else {
            saviorFunctions[0] = quadra[firstAnimal.decidingFunction];
            saviorFunctions[1] = quadra[firstAnimal.observingFunction];
        }
        this._saviorFunctions = saviorFunctions;
        
        
        const grantStack = new Array(4);
        // First and last function.
        grantStack[0] = saviorFunctions[0];
        grantStack[3] = invertFun(grantStack[0]);
        // If introversion/extroversion characters of first and second savior functions are matching, then the correct
        // second Grant function is the opposite of the second savior function, otherwise it's the savior function itself.
        const matchingSaviorsExtroversion = saviorFunctions[0][1] === saviorFunctions[1][1];
        grantStack[1] = matchingSaviorsExtroversion ? invertFun(saviorFunctions[1]) : saviorFunctions[1];
        grantStack[2] = invertFun(grantStack[1]);
        this._grantStack = grantStack;
        
        
        const masculineFunctions = new Array(2);
        masculineFunctions[0] = modality[0] === "M" ? quadra.Sensing : quadra.Intuition;
        masculineFunctions[1] = modality[1] === "M" ? quadra.De : quadra.Di;
        this._masculineFunctions = masculineFunctions;
        
        
        let socialStack;
        switch (socialType) {
            case "#1":
                socialStack = "CSPB";
                break;
            case "#2":
                socialStack = "PCBS";
                break;
            case "#3":
                socialStack = "SBCP";
                break;
            case "#4":
                socialStack = "BPSC";
                break;
        }
        this._socialStack = socialStack;
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

export const PartialFunctions = {
    F: new PartialCognitiveFunction('F'),
    T: new PartialCognitiveFunction('T'),
    S: new PartialCognitiveFunction('S'),
    N: new PartialCognitiveFunction('N'),
    Di: new PartialCognitiveFunction('Di'),
    De: new PartialCognitiveFunction('De'),
    Oi: new PartialCognitiveFunction('Oi'),
    Oe: new PartialCognitiveFunction('Oe')
}