export function invertFun(cognitiveFunction) {
    let funChar = cognitiveFunction[0];
    let introChar = cognitiveFunction[1];
    
    switch (funChar) {
        case 'F':
            funChar = 'T';
            break;
        case 'T':
            funChar = 'F';
            break;
        case 'S':
            funChar = 'N';
            break;
        case 'N':
            funChar = 'S';
            break;
    }
    
    if (introChar === 'i') introChar = 'e' ; else introChar = 'i';
    
    return funChar + introChar;
}



export class Quadra {
    Di;
    De;
    Oi;
    Oe;
    Feeling;
    Thinking;
    Sensing;
    Intuition;
    
    constructor(quadraDi, quadraDe, quadraOi, quadraOe) {
        this.Di = quadraDi;
        this.De = quadraDe;
        this.Oi = quadraOi;
        this.Oe = quadraOe;
        this.Feeling = quadraDi[0] === 'F' ? quadraDi : quadraDe;
        this.Thinking = invertFun(this.Feeling);
        this.Sensing = quadraOi[0] === 'S' ? quadraOi : quadraOe;
        this.Intuition = invertFun(this.Sensing);
    }
}


export const Quadras = {
    alpha: new Quadra("Ti", "Fe", "Si", "Ne"),
    beta: new Quadra("Ti", "Fe", "Ni", "Se"),
    gamma: new Quadra("Fi", "Te", "Ni", "Se"),
    delta: new Quadra("Fi", "Te", "Si", "Ne"),
};


export class Animal {
    decidingFunction;
    observingFunction;
    
    constructor(dFunction, oFunction) {
        this.decidingFunction = dFunction;
        this.observingFunction = oFunction;
    }
}

export const Animals = {
    S: new Animal("Di", "Oi"),
    C: new Animal("Di", "Oe"),
    B: new Animal("De", "Oi"),
    P: new Animal("De", "Oe"),
};


export class OpType {
    quadra;
    isSingleObserver;
    isSingleDecider;
    grantStack;
    
    saviorFunctions;
    animalStack;
    
    modality;
    masculineFunctions;
    
    socialType;
    socialStack;
    
    
    
    constructor(quadraName, isSingleObserver, animalStack, modality, socialType) {
        const quadra = Quadras[quadraName.toLowerCase()];
        
        const saviorFunctions = new Array(2);
        
        const firstAnimal = Animals[animalStack[0]];
        
        if (isSingleObserver) {
            saviorFunctions[0] = quadra[firstAnimal.observingFunction];
            saviorFunctions[1] = quadra[firstAnimal.decidingFunction];
        } else {
            saviorFunctions[0] = quadra[firstAnimal.decidingFunction];
            saviorFunctions[1] = quadra[firstAnimal.observingFunction];
        }
        
        const grantStack = new Array(4);
        
        // First and last function.
        grantStack[0] = saviorFunctions[0];
        grantStack[3] = invertFun(grantStack[0]);
        
        // If introversion/extroversion characters of first and second savior functions are matching, then the correct
        // second Grant function is the opposite of the second savior function, otherwise it's the savior function itself.
        const matchingSaviorsExtroversion = saviorFunctions[0][1] === saviorFunctions[1][1];
        grantStack[1] = matchingSaviorsExtroversion ? invertFun(saviorFunctions[1]) : saviorFunctions[1];
        grantStack[2] = invertFun(grantStack[1]);
        
        const masculineFunctions = new Array(2);
        masculineFunctions[0] = modality[0] === "M" ? quadra.Sensing : quadra.Intuition;
        masculineFunctions[1] = modality[1] === "M" ? quadra.De : quadra.Di;
        
        let socialStack;
        switch (socialType) {
            case "#1":
                socialStack = ["C", "S", "P", "B"];
                break;
            case "#2":
                socialStack = ["P", "C", "B", "S"];
                break;
            case "#3":
                socialStack = ["S", "B", "C", "P"];
                break;
            case "#4":
                socialStack = ["B", "P", "S", "C"];
                break;
        }
        
        
        this.quadra = quadra
        this.isSingleObserver = isSingleObserver;
        this.isSingleDecider = !isSingleObserver;
        this.animalStack = animalStack;
        this.modality = modality;
        this.socialType = socialType;
        this.grantStack = grantStack;
        this.saviorFunctions = saviorFunctions;
        this.masculineFunctions = masculineFunctions;
        this.socialStack = socialStack;
    }
    
    
    saviorFunctionsToString() {
        const s1 = this.saviorFunctions[0];
        const s2 = this.saviorFunctions[1];
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


