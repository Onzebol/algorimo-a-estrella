"use client"

import Tablero from "@/components/tablero";
import Nodo from "@/models/nodo";
import { useState } from "react";

const filas = 20;
const columnas = 20;
const obstaculos = 150;
let mapaInicial: Nodo[][] = [];
let inicio = { fila: 0, columna: 0 };
let fin = { fila: 0, columna: 0 };

let listaAbierta: Nodo[] = [];
let listaCerrada: Nodo[] = [];

function ruta(nodo: Nodo){
  nodo.tipo = 5;
  if(nodo.anterior != null){
    ruta(nodo.anterior);
  }
}

export default function Home() {
  const [mapa, setMapa] = useState<Nodo[][]>([]);

  function generarMapa() {
    mapaInicial = [];

    for (let i = 0; i < filas; i++) {
      const fila = [];
      for (let j = 0; j < columnas; j++) {
        fila.push(new Nodo(i, j, 0, 0, 0, 0, 0, 0));
      }
      mapaInicial.push(fila);
    }
  
    
  
    inicio = {fila: Math.ceil(Math.random() * filas - 1), columna: Math.ceil(Math.random() * columnas - 1)};
    do {
      fin = {fila: Math.ceil(Math.random() * filas - 1), columna: Math.ceil(Math.random() * columnas - 1)};
    } while (inicio.fila == fin.fila && inicio.columna == fin.columna);

    mapaInicial[inicio.fila][inicio.columna].tipo = 1;
    mapaInicial[inicio.fila][inicio.columna].anterior = null;

    mapaInicial[fin.fila][fin.columna].tipo = 2;

    for (let i = 0; i < obstaculos; i++) {
      const fila = Math.floor(Math.random() * filas);
      const columna = Math.floor(Math.random() * columnas);
      if (mapaInicial[fila][columna].tipo == 0) {
        mapaInicial[fila][columna].tipo = 3;
      } else {
        i--;
      }
    }
  
    listaAbierta = [];
    listaCerrada = [];
  
    listaAbierta.push(mapaInicial[inicio.fila][inicio.columna]);
  
    setMapa([...mapaInicial]);
  }

  function calcular(){
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
    console.log(nodoActual);
    listaCerrada.push(nodoActual);


    const vecinos = [];

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
        listaAbierta.push(vecino);
      } else {
        if(g < vecino.g){
          vecino.g = g;
          vecino.h = h;
          vecino.f = f;
          vecino.anterior = nodoActual;
        }
      }
    }

    listaAbierta.sort((a, b) => a.f - b.f);



    setMapa([...mapa]);

    setTimeout(calcular, 1);
  }

  return (
    <>
    <div className="overflow-auto">
      <Tablero mapa={mapa}/>
      </div>
      <button className="bg-blue-500 text-white p-2" onClick={calcular}>Siguiente paso</button>
      <button className="bg-red-500 text-white p-2" onClick={generarMapa}>Reiniciar</button>
    </>
  );
}
