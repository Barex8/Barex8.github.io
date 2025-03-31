import { useEffect, useState } from 'react'
import './App.css'
import { ItemsList } from './Data'
import Chat from './ChatGEMINIAI';

export default function Principal() {

  const [itemsToSelect,setItemsToSelect] = useState(ItemsList);
  const [itemsSelected,setItemsSelected] = useState([]);
  const [score,setScore] = useState(0);

  // Función que el hijo usará para enviar datos al padre
  const getChatResponse = (tags) => {
    let completeItems = ([...itemsSelected,...itemsToSelect]);
    //setItemsSelected([]); esto no se puede hacer porque vacía el array después de ejecutar el bloque de código, entonces no actua como si estuviera vacío.
    const cleanedTags = tags.map((i) => { // es necesario guardar en una variable. Por que map hace una copia del array y su return son los valores que se van a ir pusheand a la nueva variable.
      console.error(i)
  
        let cleanedName = i.replace(/\n/g, "") // Quitar todos los saltos de línea
        return cleanedName;
      });
      console.error(cleanedTags)


    let newItemsSelected = [];
    let newItemsToSelect = completeItems.filter(item => { //Con filter hacemos lo mismo que .map, pero si es false se elimina del array
      if (cleanedTags.includes(item.name)) { // Si la IA dice una etiqueta que está en itemsToSelect
        console.error("Tags return: ",item.name);
        newItemsSelected.push(item); //lo guarda
        return false; // Lo elimina de newItemsSelected
      }
      return true; // Lo mantiene en newItemsSelected
    });

    setItemsToSelect(newItemsToSelect);
    setItemsSelected([...newItemsSelected]);    
  };

  useEffect(() => { //useEffect se ejecuta cuando cambia el estado de una variable, en este caso itemsSelected.
    const totalScore = itemsSelected.reduce((acc, item) => acc + item.score, 0); //acc empieza como 0 (indicado al final) y le suma cada iteración item
  setScore(totalScore)
  },[itemsSelected])

    //Se ejecuta cuando se empieza a arrastrar un objeto
    const handleDragStart = (e,item) => { //e: especie de evento del navegador, item: objeto que se va a arrastrar
      e.dataTransfer.setData('item',JSON.stringify(item)); //guarda la información del item arrastrado (dataTransfer se utiliza unicamente para drag&drop), con la clave 'item' (cuando se recupere devolvera un array con su información).
    };

    //Se ejecuta cuando el usuario suela un elemento en un área específica, en este casdo targetList.
    const handleDrop = (e,targetList) =>{ 
      e.preventDefault(); // Bloqueamos que el navegador no permita arrastrar objetos
      const item = JSON.parse(e.dataTransfer.getData('item')); // recuperamos la info con la clave item y con parse lo convertimos a objeto
      
      if(targetList === itemsSelected)
        {
          if(!targetList.some(i => i.id === item.id)){
            setItemsSelected(prevItemsSelect => [...prevItemsSelect,item]); // Cuando a setState instancias directamente una variable y llamas a una función (=>) sabe que esa variable es el valor de su variable asociada (itemsSelected).
            setItemsToSelect(prev => prev.filter(i => i.id != item.id)); // Esto sería igual a hacer un foreach que va borrando si cumple la condición
          }

        }
      else if(targetList === itemsToSelect)
        {
          if(!targetList.some(i => i.id === item.id)){
          setItemsToSelect(prev => [...prev,item]); 
          setItemsSelected(prev => prev.filter(i => i.id != item.id));
          }
        }
    };

    //Permite que el área acepte el item arrastrado
    const handleDragOver = (e) =>{
      e.preventDefault(); //Evita que el navegador maneje si se le arrastra un elemento encima.
    };


    return (
        <div className="principal">
          <Chat tagsName={ItemsList.map( obj => obj.name)} returnResponse={getChatResponse}/>
          <h2> Nivel humor negro: {score}</h2>
            <div className='itemsSelected' onDrop={(e) => handleDrop(e,itemsSelected)}
              onDragOver ={handleDragOver}> 
            <ShowAllItems items={itemsSelected} handleDragStart={handleDragStart} />
            </div>
            <div className='itemsToSelect' onDrop={(e) => handleDrop(e, itemsToSelect)}
          onDragOver={handleDragOver}>
            <ShowAllItems items={itemsToSelect} handleDragStart={handleDragStart}/>
            </div>
        </div>
    )
}

function ShowAllItems({items,handleDragStart}){
    const listItems = items.map(i => (
        <li key= {i.id} draggable onDragStart={(e) => handleDragStart(e, i)} className='card'>
            <img src={i.src} alt={i.name} className='imgCard'title= {i.description}/>
            <br />
            <p className="cardName"> {i.name}</p>
        </li>
    ));

    const renderCondition = () => { //como jsx no permite hacer un if en el return hay que guardarlo en una variable antes del return
      if (items.length <=0) {
        return <p className="placeHolderContainer">Arrastra las cartas del contenedor de abajo</p>;
      } else {
        return ;
      }
    };

    return(
      <>
        {renderCondition()}
        <ul>{listItems}</ul>
      </>);
    
    
}