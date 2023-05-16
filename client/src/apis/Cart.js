import React,{useState} from "react";
import { useCart } from "react-use-cart";


function Cart  (){
  const  { cartTotal }  =  useCart ( ) ; 
  
  const[korpa,setKorpa]=useState(0)
    const {
        isEmpty, // prazan
        totalUniqueItems,//koliko ima elemenatau korpu
        items,//
        updateItemQuantity,//azuriraj kolicinu
        removeItem,// obrisi item
      } = useCart();
      if (isEmpty) return <p>Korpa je prazna</p>;
    const dajKorpu=()=>{

      return(
            <div>
             
          <table className="table table-hover">
            <tbody>
              <tr>
                <th>Ime</th>
                <th>Cena</th>
                
                <th>Koli</th>
                <th>ukupno</th>
                <th>Delete</th>
              </tr>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.ime}</td>
                  <td>{item.price}</td>
                  <td className="col-sm-2"><input type='number' className="input-sm"  defaultValue={item.quantity} 
                    onChange={(e)=>updateItemQuantity(item.id,
                      Number(e.target.value))}
                /></td>
                    <td id="vrednost" >{item.price * item.quantity}</td>
                  
                  <td onClick={() => removeItem(item.id)}>&times;</td>
                </tr>
              ))}
          </tbody>
          </table>
          <h2 >Zbir: {cartTotal.toFixed(2)}</h2>
          
        </div>
        )
    }

return(
  <div>
     <div className="col-sm-4"><h1 onClick={()=>setKorpa(1)}>Cart ({totalUniqueItems})</h1></div>
            <div className="col-sm-4">
                <br></br>
      </div>
        {korpa !==0 ? dajKorpu() : null}
  </div>
)}
export default Cart;