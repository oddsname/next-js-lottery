import {useWeb3Contract, useMoralis} from "react-moralis";
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {useNotification} from "web3uikit";
import {useLottery} from "@/hooks/useLottery";

export default function LotteryEntrance() {
    const {isWeb3Enabled} = useMoralis();
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
        getContract
    } = useLottery();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isWeb3Enabled) {
            resetContractData();

            const contract = getContract();

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
        setLoading(true);
        await joinLottery({
            onSuccess: handleSuccess,
            onError: (err) => {
                console.log(err)
                setLoading(false);
            }
        })
    }

    const handleSuccess = async (tx) => {
        await tx.wait(1);

        successNotification();
        setLoading(false);
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
            <div className='p-5'>
                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                    onClick={onButtonClick}
                    disabled={loading}
                >
                    { loading
                        ? <div className='animate-spin spinner-border h-8 w-8 border-b-2 rounded-full'></div>
                        : <div>Enter Lottery</div>
                    }
                </button>
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