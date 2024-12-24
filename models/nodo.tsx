class Nodo {
    fila: number;
    columna: number;
    g: number;
    h: number;
    f: number;
    tipo: TipoNodo;
    peso: number;
    anterior: Nodo | null = null;
    actualizaciones: number = 0;
    creado: Date = new Date();
    actualizado: Date = new Date();
    paredes: { arriba: boolean, derecha: boolean, abajo: boolean, izquierda: boolean } = { arriba: false, derecha: false, abajo: false, izquierda: false };

    constructor(fila: number, columna: number, g: number, h: number, f: number, tipo: number, peso: number) {
        this.fila = fila;
        this.columna = columna;
        this.g = g;
        this.h = h;
        this.f = f;
        this.tipo = tipo;
        this.peso = peso;
    }
}

export enum TipoNodo {
    VACIO = 0,
    INICIO = 1,
    FIN = 2,
    OBSTACULO = 3,
    VISITADO = 4,
    CAMINO = 5
}

export default Nodo;