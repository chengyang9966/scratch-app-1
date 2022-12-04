import {  useEffect } from "react";
import Toast from "react-bootstrap/Toast";
import { useAppContext } from "../contextLib";
import ToastContainer from 'react-bootstrap/ToastContainer'
 function OnError() {
    const { errorMsg,setErrorMsg } = useAppContext();
 
  const checkShowMessage=(error)=>{
    let message = error.toString();
      // Auth errors
    if (!(error instanceof Error) && error.message) {
        message = error.message;
      }
      return message
  }
  useEffect(()=>{
    const timer = setTimeout(()=>{
        setErrorMsg((msg) => msg.filter((_, index) => index !== 0));
    },5000)
     return ()=>clearTimeout(timer)
     // eslint-disable-next-line
  },[errorMsg])
  return (
    <ToastContainer position="top-end" >
        { errorMsg.map(x=>{
            return(
                <Toast bg='danger' onClose={(e)=>setErrorMsg((msg) => msg.filter((text) => text.id !== x.id))} >
                <Toast.Header >{x.title?x.title:"Error"}</Toast.Header>
                <Toast.Body>{checkShowMessage(x.message)}</Toast.Body>
                </Toast>
            )
        })}
    </ToastContainer>
    
  );
}
export default OnError

