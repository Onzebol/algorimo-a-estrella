
  "use client"
  
import Celda from './celda';
import Nodo from '@/models/nodo';

interface TableroProps {
  mapa: Nodo[][];
}
  
  const Tablero: React.FC<TableroProps> = ({mapa}) => {
      return (
        <div className={"flex flex-wrap gap-[1px] w-[" + (mapa[0]?.length*80 + (mapa[0]?.length-1)*1) + "px] bg-black"}>
          {mapa.map((element, x) => (
            element.map((n, y) => (
              <Celda key={`${x}-${y}`} nodo={n} />
            ))
          ))}
        </div>
      );
  };
  
  export default Tablero;