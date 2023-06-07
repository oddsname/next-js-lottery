import {contractAddresses, contractAbis} from "./../constants/index";
import {useMoralis, useWeb3Contract} from "react-moralis";
import {useState} from "react";
import {ethers} from "ethers";

export function useLottery(enterFee='0') {
    const {chainId: chainIdHex, web3} = useMoralis();

    const chainId = parseInt(chainIdHex);
    const abi = contractAbis[chainId]
    const contractAddress = contractAddresses[chainId];

    const signer = web3.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const [entranceFee, setEntranceFee] = useState(enterFee);
    const [numberOfPlayers, setNumberOfPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");

    const enterLotteryContract = useWeb3Contract({
        abi,
        contractAddress,
        functionName: 'enterLottery',
        params: {},
        msgValue: entranceFee,
    });

    const getEntranceFeeContract = useWeb3Contract({
        abi,
        contractAddress,
        functionName: 'getEntranceFee',
        params: {},
        // msgValue,
    });

    const getNumberOfPlayersContract = useWeb3Contract({
        abi,
        contractAddress,
        functionName: 'getNumberOfPlayers',
        params: {}
    });

    const getRecentWinner = useWeb3Contract({
        abi,
        contractAddress,
        functionName: 'getRecentWinner',
        params: {}
    });

    const joinLottery = async (onResult) => {
        await enterLotteryContract.runContractFunction(onResult);
    }

    const resetNumberOfPlayers = async () => {
       const value = await getNumberOfPlayersContract.runContractFunction();

       if(value && value.toString()) {
           setNumberOfPlayers(value.toString());
       }
    }

    const resetEntranceFee = async () => {
        const value = await getEntranceFeeContract.runContractFunction();

        if(value && value.toString()) {
            setEntranceFee(value.toString());
        }
    }

    const resetResentWinner = async () => {
        const value = await getRecentWinner.runContractFunction();

        if(value && value.toString()) {
            setRecentWinner(value.toString());
        }
    }

    return {
        chainId,
        abi,
        contractAddress,
        entranceFee,
        numberOfPlayers,
        recentWinner,
        resetEntranceFee,
        joinLottery,
        resetNumberOfPlayers,
        resetResentWinner,
        contract
    }
}