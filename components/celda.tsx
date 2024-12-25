"use client"

import Nodo from '@/models/nodo';
import React from 'react';

interface CeldaProps {
    nodo: Nodo;
}

const Celda: React.FC<CeldaProps> = ({ nodo }) => {
    const getColor = (tipo: number) => {
        switch (tipo) {
            case 1: return 'bg-green-500';
            case 2: return 'bg-red-500';
            case 3: return 'bg-black';
            case 4: return 'bg-blue-500';
            case 5: return 'bg-orange-500';
            default: return 'bg-gray-300';
        }
    };

    const color = getColor(nodo.tipo);

    return (
        <div className={`w-12 h-12 ${color} flex justify-center items-center relative`}> 
            {nodo.tipo !== 3 && (
                <div className='w-10 h-10 flex flex-wrap justify-center'>
                    <p className='w-4 text-[8px]'>{nodo.g || ''}</p>
                    <p className='w-2 text-[8px] text-center'>{nodo.actualizaciones || ''}</p>
                    <p className='w-4 text-[8px] text-right'>{nodo.h || ''}</p>
                    <p className='w-10 text-center font-bold'>{nodo.f || ''}</p>
                </div>
            )}
            {nodo.paredes.arriba && <div className={`w-[52px] h-[4px] bg-black absolute top-[-2px] left-[-2px] rounded-sm z-[9999]`}></div>}
            {nodo.paredes.derecha && <div className={`w-[4px] h-[52px] bg-black absolute top-[-2px] right-[-2px] rounded-sm z-[9999]`}></div>}
            {nodo.paredes.abajo && <div className={`w-[52px] h-[4px] bg-black absolute bottom-[-2px] left-[-2px] rounded-sm z-[9999]`}></div>}
            {nodo.paredes.izquierda && <div className={`w-[4px] h-[52px] bg-black absolute top-[-2px] left-[-2px] rounded-sm z-[9999]`}></div>}
        </div>
    );
};

export default Celda;