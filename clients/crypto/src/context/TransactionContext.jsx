import React, {useEffect, useState} from 'react';
import { ethers} from "ethers";
// 1 50 47 sendtran
import {contractABI, contractAddress} from '../utils/constants';

export const TransactionContext = React.createContext();

const {ethereum} = window;

const getEtherrumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI,signer);
    return transactionContract;
}

export const TransactionProvider =({children}) =>{

const [currentAccount, setCurrentAccount] = useState("");
const [formData,setFormData] = useState({addressTo:'',amount:'',keyword:'',message:''});
const [isLoading, setIsLoading] = useState(false);
const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
const [transactions, setTransactions] = useState([]);


const getAllTransactions = async () => {
  try {
    if(!ethereum) return alert("Please install metamask");
    const transactionContract = getEtherrumContract();

    const availableTransactions = await transactionContract.getAllTransactions();
    const structuredTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / (10 ** 18)
      }));

      console.log(structuredTransactions);

      setTransactions(structuredTransactions);
      
} catch (error) {
      console.log(error);
  }

}

const handleChange = (e,name) =>{
    setFormData((prevState)=>({...prevState, [name]: e.target.value}));
} 

 const checkWalletIsConnected = async () => {
 try{
    if(!ethereum) return alert("Please install metamask");
 const accounts = await ethereum.request({method: 'eth_accounts'}); 
 if(accounts.length){
   setCurrentAccount(accounts[0]);

   getAllTransactions();
 }else{
     console.log("No accounts found");
 }
 console.log(accounts);
}
catch(error){
    console.log(error);
    throw new Error("no  eth object");
}
}

const checkIfTransactionExist = async() => {
    try{
    const transactionContract = getEtherrumContract();
    const transactionCount = await transactionContract.getTransactionCount();
    
    window.localStorage.setItem("transactionCount", transactionCount)
    }catch(error){
    console.log(error);
    throw new Error("no  eth object");
    }
}

const connectWallet = async () =>{
try {
    if(!ethereum) return alert("Please install metamask");
    const accounts = await ethereum.request({method: 'eth_requestAccounts',});
    setCurrentAccount(accounts[0]);
} catch (error) {
    console.log(error);
    throw new Error("no  eth object");
}

}

const sendTransaction= async()=>{
    try {
        if(!ethereum) return alert("Please install metamask");
        
        const{addressTo, amount, keyword, message} = formData;
        const transactionContract = getEtherrumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
         method:'eth_sendTransaction',
         params: [{
             from:currentAccount,
             to: addressTo,
             gas: '0x5208',
             value: parsedAmount._hex,
         }]
        });

      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
      setIsLoading(true);
      console.log('Loading',transactionHash.hash);
      await transactionHash.wait();
      setIsLoading(false);
      console.log('Success',transactionHash.hash);

      const transactionCount = await  transactionContract.getTransactionCount();
     
      setTransactionCount(transactionCount.toNumber());
    } catch (error) {
        console.log(error);
    
        throw new Error("no  eth object");
        
    }
}


useEffect(()=> {
  checkWalletIsConnected();
  checkIfTransactionExist();
},[])



 return (<TransactionContext.Provider value={{connectWallet,currentAccount,formData,setFormData,handleChange,sendTransaction,transactions,isLoading}}>
     {children}
 </TransactionContext.Provider>);
}