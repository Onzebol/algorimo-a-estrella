
  "use client"
  
import Celda from './celda';
import Nodo from '@/models/nodo';

interface TableroProps {
  mapa: Nodo[][];
}
  
  const Tablero: React.FC<TableroProps> = ({mapa}) => {
      return (
        <div style={{ gridTemplateColumns: `repeat(${mapa[0] ? mapa[0].length : 1}, 48px)`}} className={`grid justify-center align-middle gap-[0px] bg-gray-500`}>
          {mapa.map((fila, i) => (
            fila.map((nodo, j) => (
              <Celda key={i + '-' + j} nodo={nodo} />
            ))
          ))}
        </div>
      );
  };
  
  export default Tablero;