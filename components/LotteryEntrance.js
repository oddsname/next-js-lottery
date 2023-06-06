import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddresses, contractAbis } from "../constants";
import {useEffect, useState} from "react";
import { ethers } from "ethers";

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const [entranceFee, setEntranceFee] = useState("0");

    const chainId = parseInt(chainIdHex);
    const abi = contractAbis[chainId];
    const contractAddress = contractAddresses[chainId]

    const enterLottery = useWeb3Contract({
        abi,
        contractAddress,
        functionName: 'enterLottery',
        params: {},
        msgValue: entranceFee,
    });

    const getEntranceFee = useWeb3Contract({
        abi,
        contractAddress,
        functionName: 'getEntranceFee',
        params: {},
        // msgValue,
    });

    useEffect(() => {
        if(isWeb3Enabled) {
            getEntranceFee.runContractFunction().then((val) => {
                if(val) {
                    setEntranceFee(val.toString());
                }
            });
        }
    }, [isWeb3Enabled])

    const formatEntranceFee = () => {
        return ethers.utils.formatUnits(entranceFee, 'ether');
    }

    const onButtonClick = async () => {
        await enterLottery.runContractFunction();
    }

    const renderContent = () => {

        return (
            <div>
                <button onClick={onButtonClick}>Enter Lottery</button>
                <div>Lottery Entrance Fee: {formatEntranceFee()}</div>
            </div>
        )
    }

    return (
        <div>
            { contractAddress
                ? renderContent()
                : <div>No Address Detected </div>
            }
        </div>
    )
}