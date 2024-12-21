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
        <div className='relative w-20 h-20'>
            <div className={`w-20 h-20 text-[8px] place-content-between grid grid-cols-3 grid-rows-3 ${color}`}>
                <div className={nodo.flecha == 1 ? 'bg-red-500' : ''}></div>
                <div className={nodo.flecha == 2 ? 'bg-red-500' : ''}></div>
                <div className={nodo.flecha == 3 ? 'bg-red-500' : ''}></div>
                <div className={nodo.flecha == 4 ? 'bg-red-500' : ''}></div>
                <div className={nodo.flecha == 5 ? 'bg-red-500' : ''}></div>
                <div className={nodo.flecha == 6 ? 'bg-red-500' : ''}></div>
                <div className={nodo.flecha == 7 ? 'bg-red-500' : ''}></div>
                <div className={nodo.flecha == 8 ? 'bg-red-500' : ''}></div>
                <div className={nodo.flecha == 9 ? 'bg-red-500' : ''}></div>
            </div>
            {nodo.tipo !== 3 && (
                <div className='w-10 h-10 flex flex-wrap absolute top-5 left-5'>
                    <p className='w-5 text-[8px]'>{nodo.g || ''}</p>
                    <p className='w-5 text-[8px] text-right'>{nodo.h || ''}</p>
                    <p className='w-10 text-center font-bold'>{nodo.f || ''}</p>
                </div>
            )}
        </div>
    );
};

export default Celda;