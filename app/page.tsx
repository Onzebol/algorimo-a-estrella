"use client"

import Tablero from "@/components/tablero";
import Nodo, { TipoNodo } from "@/models/nodo";
import { useEffect, useState } from "react";

let mapaActual: Nodo[][] = [];
let inicio = { fila: 0, columna: 0 };
let fin = { fila: 0, columna: 0 };

let listaAbierta: Nodo[] = [];
let listaCerrada: Nodo[] = [];

const filas = 20;
const columnas = 30;
const obstaculos = 90;
const paredes = 200;
const usarDiagonales = false;

const generarMapa = (): Nodo[][] => {
  const mapa: Nodo[][] = [];
  for (let i = 0; i < filas; i++) {
    const fila: Nodo[] = [];
    for (let j = 0; j < columnas; j++) {
      fila.push(new Nodo(i, j, 0, 0, 0, 0, 0));
    }
    mapa.push(fila);
  }
  return mapa;
};

const generarObstaculos = (mapa: Nodo[][]): Nodo[][] => {
  let obstaculosGenerados = 0;
  while (obstaculosGenerados < obstaculos) {
    const fila = Math.floor(Math.random() * filas);
    const columna = Math.floor(Math.random() * columnas);
    if (mapa[fila][columna].tipo === 0) {
      mapa[fila][columna].tipo = TipoNodo.OBSTACULO;
      obstaculosGenerados++;
    }
  }
    
  return mapa;
};

function generarParedes(mapa: Nodo[][]): Nodo[][] {
  let paredesGeneradas = 0;
  while (paredesGeneradas < paredes) {
    const fila = Math.floor(Math.random() * filas);
    const columna = Math.floor(Math.random() * columnas);
    if (mapa[fila][columna].tipo === TipoNodo.VACIO && mapa[fila][columna].paredes.arriba === false && mapa[fila][columna].paredes.derecha === false && mapa[fila][columna].paredes.abajo === false && mapa[fila][columna].paredes.izquierda === false) {
      mapa[fila][columna].paredes = { arriba: Math.random() < 0.5, derecha: Math.random() < 0.5, abajo: Math.random() < 0.5, izquierda: Math.random() < 0.5 };

      if (mapa[fila][columna].paredes.arriba === true && fila > 0) {
        mapa[fila - 1][columna].paredes.abajo = true;
        if(mapa[fila-1][columna].paredes.arriba && mapa[fila-1][columna].paredes.derecha && mapa[fila-1][columna].paredes.abajo && mapa[fila-1][columna].paredes.izquierda){
          mapa[fila-1][columna].tipo = TipoNodo.OBSTACULO;
        }
      }
      if (mapa[fila][columna].paredes.derecha === true && columna < columnas - 1) {
        mapa[fila][columna + 1].paredes.izquierda = true;
        if(mapa[fila][columna+1].paredes.arriba && mapa[fila][columna+1].paredes.derecha && mapa[fila][columna+1].paredes.abajo && mapa[fila][columna+1].paredes.izquierda){
          mapa[fila][columna+1].tipo = TipoNodo.OBSTACULO;
        }
      }
      if (mapa[fila][columna].paredes.abajo === true && fila < filas - 1) {
        mapa[fila + 1][columna].paredes.arriba = true;
        if(mapa[fila+1][columna].paredes.arriba && mapa[fila+1][columna].paredes.derecha && mapa[fila+1][columna].paredes.abajo && mapa[fila+1][columna].paredes.izquierda){
          mapa[fila+1][columna].tipo = TipoNodo.OBSTACULO;
        }
      }
      if (mapa[fila][columna].paredes.izquierda === true && columna > 0) {
        mapa[fila][columna - 1].paredes.derecha = true;
        if(mapa[fila][columna-1].paredes.arriba && mapa[fila][columna-1].paredes.derecha && mapa[fila][columna-1].paredes.abajo && mapa[fila][columna-1].paredes.izquierda){
          mapa[fila][columna-1].tipo = TipoNodo.OBSTACULO;
        }
        
      }

      if(mapa[fila][columna].paredes.arriba && mapa[fila][columna].paredes.derecha && mapa[fila][columna].paredes.abajo && mapa[fila][columna].paredes.izquierda){
        mapa[fila][columna].tipo = TipoNodo.OBSTACULO;
      }

      paredesGeneradas++;
    }
  }

  return mapa;
}

function verificarParedEnMedio(origen: Nodo, destino: Nodo): boolean {
  if (origen.fila === destino.fila) {
    return verificarParedHorizontal(origen, destino);
  } else if (origen.columna === destino.columna) {
    return verificarParedVertical(origen, destino);
  } else {
    return verificarParedDiagonal(origen, destino);
  }
}

function verificarParedHorizontal(origen: Nodo, destino: Nodo): boolean {
  if (origen.columna < destino.columna) {
    return origen.paredes.derecha || destino.paredes.izquierda;
  } else {
    return origen.paredes.izquierda || destino.paredes.derecha;
  }
}

function verificarParedVertical(origen: Nodo, destino: Nodo): boolean {
  if (origen.fila < destino.fila) {
    return origen.paredes.abajo || destino.paredes.arriba;
  } else {
    return origen.paredes.arriba || destino.paredes.abajo;
  }
}

function verificarParedDiagonal(origen: Nodo, destino: Nodo): boolean {
  if (origen.fila > destino.fila) {
    if (origen.columna < destino.columna) {
      return verificarParedArribaDerecha(origen, destino);
    } else {
      return verificarParedArribaIzquierda(origen, destino);
    }
  } else {
    if (origen.columna < destino.columna) {
      return verificarParedAbajoDerecha(origen, destino);
    } else {
      return verificarParedAbajoIzquierda(origen, destino);
    }
  }
}

function verificarParedArribaDerecha(origen: Nodo, destino: Nodo): boolean {
  return (
    (origen.paredes.derecha && origen.paredes.arriba) ||
    (destino.paredes.izquierda && destino.paredes.abajo) ||
    (origen.paredes.arriba && destino.paredes.abajo) ||
    (origen.paredes.derecha && destino.paredes.izquierda)
  );
}

function verificarParedArribaIzquierda(origen: Nodo, destino: Nodo): boolean {
  return (
    (origen.paredes.izquierda && origen.paredes.arriba) ||
    (destino.paredes.derecha && destino.paredes.abajo) ||
    (origen.paredes.arriba && destino.paredes.abajo) ||
    (origen.paredes.izquierda && destino.paredes.derecha)
  );
}

function verificarParedAbajoDerecha(origen: Nodo, destino: Nodo): boolean {
  return (
    (origen.paredes.derecha && origen.paredes.abajo) ||
    (destino.paredes.izquierda && destino.paredes.arriba) ||
    (origen.paredes.abajo && destino.paredes.arriba) ||
    (origen.paredes.derecha && destino.paredes.izquierda)
  );
}

function verificarParedAbajoIzquierda(origen: Nodo, destino: Nodo): boolean {
  return (
    (origen.paredes.izquierda && origen.paredes.abajo) ||
    (destino.paredes.derecha && destino.paredes.arriba) ||
    (origen.paredes.abajo && destino.paredes.arriba) ||
    (origen.paredes.izquierda && destino.paredes.derecha)
  );
}



function limpiarMapa(mapa: Nodo[][]): Nodo[][] {
  const mapaNuevo = [...mapa];
  for (const fila of mapaNuevo) {
    for (const nodo of fila) {
      if (nodo.tipo == 0 || nodo.tipo == 4 || nodo.tipo == 5) {
        nodo.g = 0;
        nodo.h = 0;
        nodo.f = 0;
        nodo.anterior = null;
        nodo.tipo = 0;
        nodo.actualizaciones = 0;
      }
    }
  }

  return mapaNuevo;
}

function inicializarListas() {
  listaAbierta = [];
  listaCerrada = [];

  listaAbierta.push(mapaActual[inicio.fila][inicio.columna]);
}

const ruta = (nodo: Nodo) => {
  nodo.tipo = TipoNodo.CAMINO;
  if (nodo.anterior != null) {
    ruta(nodo.anterior);
  }
};

export default function Home() {
  const [mapa, setMapa] = useState<Nodo[][]>([]);

  useEffect(() => {
    console.log('useEffect');
    nuevoMapa();
  }, []);

  function buscarRuta() {
    setMapa(limpiarMapa(mapaActual));
    inicializarListas();
    calcular();
  }

  function buscarRutaRapido() {
    setMapa(limpiarMapa(mapaActual));
    inicializarListas();
    calcular(50);
  }

  function buscarRutaLento() {
    setMapa(limpiarMapa(mapaActual));
    inicializarListas();
    calcular(500);
  }

  function calcular(espera: number = 0) {
    if(listaAbierta.length == 0){
      return;
    }

    const nodoActual = listaAbierta.shift();
    if (nodoActual == undefined) {
      return;
    }
    if (nodoActual.tipo == 0){
      nodoActual.tipo = TipoNodo.VISITADO;
    }
    listaCerrada.push(nodoActual);

    const vecinos = [];

    if (usarDiagonales) {
      if(nodoActual.fila > 0 && nodoActual.columna > 0){
        vecinos.push(mapa[nodoActual.fila - 1][nodoActual.columna - 1]);
        vecinos[vecinos.length - 1].peso = 14;
      }
      if(nodoActual.fila > 0 && nodoActual.columna < columnas - 1){
        vecinos.push(mapa[nodoActual.fila - 1][nodoActual.columna + 1]);
        vecinos[vecinos.length - 1].peso = 14;
      }
      if(nodoActual.fila < filas - 1 && nodoActual.columna > 0){
        vecinos.push(mapa[nodoActual.fila + 1][nodoActual.columna - 1]);
        vecinos[vecinos.length - 1].peso = 14;
      }
      if(nodoActual.fila < filas - 1 && nodoActual.columna < columnas - 1){
        vecinos.push(mapa[nodoActual.fila + 1][nodoActual.columna + 1]);
        vecinos[vecinos.length - 1].peso = 14;
      }
    }
    if(nodoActual.fila > 0){
      vecinos.push(mapa[nodoActual.fila - 1][nodoActual.columna]);
      vecinos[vecinos.length - 1].peso = 10;
    }
    if(nodoActual.columna > 0){
      vecinos.push(mapa[nodoActual.fila][nodoActual.columna - 1]);
      vecinos[vecinos.length - 1].peso = 10;
    }
    if(nodoActual.fila < filas - 1){
      vecinos.push(mapa[nodoActual.fila + 1][nodoActual.columna]);
      vecinos[vecinos.length - 1].peso = 10;
    }
    if(nodoActual.columna < columnas - 1){
      vecinos.push(mapa[nodoActual.fila][nodoActual.columna + 1]);
      vecinos[vecinos.length - 1].peso = 10;
    }

    for(const vecino of vecinos){
      console.log('vecino', vecino);
      console.log(verificarParedEnMedio(nodoActual, vecino));
      if(verificarParedEnMedio(nodoActual, vecino)){
        continue;
      }
      if(vecino.tipo == TipoNodo.FIN){
        console.log('Llegamos');
        vecino.anterior = nodoActual;
        ruta(vecino);
        mapa[inicio.fila][inicio.columna].tipo = 1;
        mapa[fin.fila][fin.columna].tipo = 2;
        setMapa([...mapa]);
        listaAbierta = [];
        return;
      }
      if(vecino.tipo == TipoNodo.INICIO || vecino.tipo == TipoNodo.OBSTACULO){
        continue;
      }
      if(listaCerrada.includes(vecino)){
        continue;
      }

      const g = nodoActual.g + vecino.peso;
      const h = (Math.abs(fin.fila - vecino.fila) + Math.abs(fin.columna - vecino.columna)) * 10;
      const f = g + h;

      if(!listaAbierta.includes(vecino)){
        vecino.g = g;
        vecino.h = h;
        vecino.f = f;
        vecino.anterior = nodoActual;
        vecino.actualizado = new Date();  
        listaAbierta.push(vecino);
      } else {
        if(g < vecino.g){
          vecino.g = g;
          vecino.h = h;
          vecino.f = f;
          vecino.anterior = nodoActual;
          vecino.actualizado = new Date();
          vecino.actualizaciones++;
        }
      }
    }

    listaAbierta.sort((a, b) => {
      if (a.f === b.f) {
        return b.actualizado.getTime() - a.actualizado.getTime();
      }

      return a.f - b.f;
    });

    setMapa([...mapa]);


    if (espera > 0) {
      setTimeout(() => calcular(espera), espera);
    } else {
      calcular();
    }
  }

  function nuevoMapa() {
    mapaActual = generarMapa();

    inicio = {fila: Math.ceil(Math.random() * filas - 1), columna: Math.ceil(Math.random() * columnas - 1)};
    do {
      fin = {fila: Math.ceil(Math.random() * filas - 1), columna: Math.ceil(Math.random() * columnas - 1)};
    } while (inicio.fila == fin.fila && inicio.columna == fin.columna);

    mapaActual[inicio.fila][inicio.columna].tipo = TipoNodo.INICIO;
    mapaActual[inicio.fila][inicio.columna].anterior = null;

    mapaActual[fin.fila][fin.columna].tipo = TipoNodo.FIN;

    //const mapaConObstaculos = generarObstaculos(mapaActual);

    const mapaConParedes = generarParedes(mapaActual);

    listaAbierta = [];
    listaCerrada = [];
  
    listaAbierta.push(mapaActual[inicio.fila][inicio.columna]);

    setMapa(mapaConParedes);
  }

  return (
    <>
      <div className="overflow-auto">
        <Tablero mapa={mapa}/>
      </div>
      <button className="bg-blue-500 text-white p-2" onClick={buscarRuta}>Buscar ruta</button>
      <button className="bg-blue-500 text-white p-2" onClick={buscarRutaRapido}>Buscar ruta rapido</button>
      <button className="bg-blue-500 text-white p-2" onClick={buscarRutaLento}>Buscar ruta despacio</button>
      <button className="bg-red-500 text-white p-2" onClick={nuevoMapa}>Nuevo mapa aleatorio</button>
    </>
  );
}
