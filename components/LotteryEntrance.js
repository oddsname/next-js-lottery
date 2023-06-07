import {useWeb3Contract, useMoralis} from "react-moralis";
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {useNotification} from "web3uikit";
import {useLottery} from "@/hooks/useLottery";

export default function LotteryEntrance() {
    const {isWeb3Enabled, web3} = useMoralis();
    const dispatch = useNotification();
    const {
        resetEntranceFee,
        joinLottery,
        resetNumberOfPlayers,
        resetResentWinner,
        contractAddress,
        entranceFee,
        numberOfPlayers,
        recentWinner,
        contract
    } = useLottery();

    useEffect(() => {
        if (isWeb3Enabled) {
            resetContractData();

            contract.on('WinnerPicked', async () => {
                console.log('WinnerPicked!!!!');
                await resetContractData();
            })

            contract.on('LotteryEnter', async () => {
                console.log('LotteryEnter!!!');
                await resetContractData();
            })

            return () => {
                contract.removeAllListeners('WinnerPicked')
                contract.removeAllListeners('LotteryEnter');
            }
        }
    }, [isWeb3Enabled])

    const resetContractData = async () => {
        await resetEntranceFee()
        await resetResentWinner();
        await resetNumberOfPlayers();
    }

    const formatEntranceFee = () => {
        return ethers.utils.formatUnits(entranceFee, 'ether');
    }

    const onButtonClick = async () => {
        await joinLottery({
            onSuccess: handleSuccess,
            onError: (err) => console.log(err)
        })
    }

    const handleSuccess = async (tx) => {
        await tx.wait(1);

        successNotification();
    }

    const successNotification = () => {
        dispatch({
            type: 'info',
            message: "Transaction Complete!",
            title: 'Tx Notification',
            position: "topR",
        })
    }

    const renderContent = () => {
        return (
            <div>
                <button onClick={onButtonClick}>Enter Lottery</button>
                <div>
                    <p>Lottery Entrance Fee: {formatEntranceFee()}</p>
                    <p>Number of Players: {numberOfPlayers}</p>
                    {recentWinner ? "Recent Winner: " + recentWinner : ''}
                </div>
            </div>
        )
    }

    return (
        <div>
            {contractAddress
                ? renderContent()
                : <div>No Address Detected </div>
            }
        </div>
    )
}