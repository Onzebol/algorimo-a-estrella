class Nodo {
    fila: number;
    columna: number;
    g: number;
    h: number;
    f: number;
    tipo: number;
    flecha: number;
    peso: number;
    anterior: Nodo | null = null;

    constructor(fila: number, columna: number, g: number, h: number, f: number, tipo: number, flecha: number, peso: number) {
        this.fila = fila;
        this.columna = columna;
        this.g = g;
        this.h = h;
        this.f = f;
        this.tipo = tipo;
        this.flecha = flecha;
        this.peso = peso;
    }
}

export default Nodo;