"use client"

import Tablero from "@/components/tablero";
import Nodo from "@/models/nodo";
import { useEffect, useState } from "react";

let mapaActual: Nodo[][] = [];
let inicio = { fila: 0, columna: 0 };
let fin = { fila: 0, columna: 0 };

let listaAbierta: Nodo[] = [];
let listaCerrada: Nodo[] = [];

const filas = 12;
const columnas = 23;
const obstaculos = 90;
const usarDiagonales = true;

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
      mapa[fila][columna].tipo = 3;
      obstaculosGenerados++;
    }
  }
    
  return mapa;
};

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
  nodo.tipo = 5;
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
      nodoActual.tipo = 4;
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
      if(vecino.tipo == 2){
        console.log('Llegamos');
        vecino.anterior = nodoActual;
        ruta(vecino);
        mapa[inicio.fila][inicio.columna].tipo = 1;
        mapa[fin.fila][fin.columna].tipo = 2;
        setMapa([...mapa]);
        listaAbierta = [];
        return;
      }
      if(vecino.tipo == 1 || vecino.tipo == 3){
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

    mapaActual[inicio.fila][inicio.columna].tipo = 1;
    mapaActual[inicio.fila][inicio.columna].anterior = null;

    mapaActual[fin.fila][fin.columna].tipo = 2;

    const mapaConObstaculos = generarObstaculos(mapaActual);

    listaAbierta = [];
    listaCerrada = [];
  
    listaAbierta.push(mapaActual[inicio.fila][inicio.columna]);

    setMapa(mapaConObstaculos);
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
