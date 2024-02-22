import {Animal, AnimalGrantPosition, Charge, CognitiveFunction} from "../docs/scripts2/op-lib";


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






const OpTypeChangeEvents = {
    INTERNAL_CHANGE: 'internalChange',
    UI_CHANGE: 'change'
} as const;





interface CoinState<T extends ObservableCoin> {
    stateProducer: T;
}

interface CognitiveFunctionState extends CoinState<ObservableGrantFunction> {
    grantOrder: number;
    cognitiveFunction: CognitiveFunction;
    isDemon: ?boolean;
    isMasculine: ?boolean;
}

interface AnimalState extends CoinState<ObservableGrantAnimal> {
    grantPosition: AnimalGrantPosition;
    animal: ?Animal;
    stackOrder: ?number;
    isDemon: ?boolean;
    isDoubleActivated: ?boolean;
}


/**
 * @class
 */
class OpEventTarget extends Object {
    protected _eventHandler = new EventTarget();
}



/**
 *
 */
class ObservableOpType extends OpEventTarget {
    #dominoSymbol: ?Symbol = null;

    get dominoSymbol(): ?Symbol {
        return this.#dominoSymbol;
    }


    #observableCognitiveFunctions: ObservableGrantFunction[];
    readonly #observableAnimals: Map<AnimalGrantPosition, ObservableGrantAnimal>;

    /**
     * This will be filled with null values if the stack order hasn't been set by the user yet.
     */
    readonly #animalStackStates: AnimalState[];



    constructor() {
        super();


        const obsFuns: ObservableGrantFunction[] = this.#observableCognitiveFunctions = new Array(4);
        const obsAnimals: Map<AnimalGrantPosition, ObservableGrantAnimal> = this.#observableAnimals = new Map();



            this.#animalStackStates = new Array(4);

        // Populating states.
        for (let i = 0; i < 4; i++) {
            obsFuns[i] = new ObservableGrantFunction(i);
        }

        // @ts-ignore
        for (const ap of AnimalGrantPosition.All) {
            obsAnimals.set(ap, new ObservableGrantAnimal(ap))
        }


        // Now that all the states are created and assigned to the corresponding collection, attach this instance to all the child observable coins.
        // Each coin will implement their own changes through adding their own listeners when attached.

        for (const cfs of obsFuns) {
            cfs._attachParentOpType(this);
        }

        for (const as of obsAnimals.values()) {
            as._attachParentOpType(this);
        }
    }




    getCognitiveFunState(grantOrder: number): CognitiveFunctionState {
        return this.#observableCognitiveFunctions[grantOrder].state;
    }

    /**
     * @param animalReference {AnimalGrantPosition|number}
     * @returns {AnimalState}
     */
    getAnimalState(animalReference) {
        switch (true) {
            case (animalReference instanceof AnimalGrantPosition):
                return this.#observableAnimals.get(animalReference).state;
            case (typeof animalReference === 'number'):
                return this.#animalStackStates[animalReference];
            default:
                throw new Error("Invalid argument.");
        }
    }


    /**
     *
     * @package
     */
    _dominoStarted() {
        this.#dominoSymbol = Symbol();
    }

    /**
     *
     * @package
     * @param {(function(): void)} action
     */
    _afterDominoEdit(action) {
        throw new Error("Not implemented yet.");
    }



    // HERE Keep fixing these methods

    switchLetter(grantOrder) {
        const cfs = this.getCognitiveFunState(grantOrder);
        /** @type {CognitiveFunctionStateEdit} */
        const stateEdits = {cognitiveFunction: cfs.cognitiveFunction.withOppositeLetter()}
        cfs.stateProducer.
    }

    switchCharge(grantOrder) {


        // Changing charges of middle axis functions would require ambiguous propagations, so we forbid it.
        if (grantOrder === 1 || grantOrder === 2) throw new Error("Can't change charges of middle axis functions.");


        const cfState = this.getCognitiveFunState(grantOrder);
        const cogFun = cfState.cognitiveFunction

        // Inverting charge or assigning introverted charge if there is no charge.
        cfState.startDominoUpdate(
            cogFun.charge == null ? cogFun.plusCharge(Charge.INTROVERTED) : cogFun.withOppositeCharge()
        )
    }


    switchMainAxis() {
        const firstFunState = this.getCognitiveFunState(0);
        const secondFunState = this.getCognitiveFunState(1);
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


class ObservableCoin<CS extends CoinState<*>> extends OpEventTarget {
    protected _parentOpType: ?ObservableOpType = null;

    #dominoSymbol: ?Symbol = null;

    #state: CS ;
    get state(): Readonly<CS> {
        return Object.freeze({...this.#state});
    }



    constructor(initialState: CS) {
        super();

        initialState.stateProducer = this;
        this.#state = initialState;
    }


    // HERE Keep converting to TS


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
     * Should be called only in ObservableOpType.
     * @access package
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
     * @param stateEdits {CS}
     * @access package
     */
    _startDominoEdit(stateEdits) {
        this._parentOpType._dominoStarted();
        this._dominoEdit(stateEdits);
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
     * @param stateEdits {CS}
     * @protected
     */
    _dominoEdit(stateEdits) {
        if (this._hasBeenDominoEdited) throw new Error("Already edited in the same domino edit.");
        this.#dominoSymbol = this._parentOpType._dominoSymbol;
        this._onEdit(stateEdits);
    };


    /**
     * @protected
     * @param {CS} stateEdits
     */
    _onEdit(stateEdits) {
        this.#state += {...this.#state, ...stateEdits};
        this._notifyCoins();
    };
}



/**
 * @class
 * @extends ObservableCoin<CognitiveFunctionState>
 */
class ObservableGrantFunction extends ObservableCoin {

    /**
     * @param grantOrder {number}
     */
    constructor(grantOrder) {
        super();
        throw new Error("Not implemented yet.");
    }




    _attachParentOpType(obsOpType) {
        super._attachParentOpType(obsOpType);

        // For all functions. Listen to update of the opposite one to change it accordingly.
        const oppositeFunState = opTypeState.getCognitiveFunState(oppositeGrantOrder(this.grantOrder));
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

    _onAttachParent(observableOpType) {
        throw new Error("Not implemented yet.");
        // TODO Implement from above (which is old).
    }
}




/**
 * Animal that's observable in within a parent type. What remains fixed is its positioning based on the Grant order of the functions within the parent
 * type. <br>
 * For example, if you're observing the {@link AnimalGrantPosition.STRONGER_INFO} Animal, it should update to:
 * - Consume for IxxPs and ExxPs
 * - Blast for IxxJs and ExxJs
 *
 * So every time the parent type changes, the Animal changes to maintain the Animal consistent to its Grant functions position.
 */
class ObservableGrantAnimal extends ObservableCoin {

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