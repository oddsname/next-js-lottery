import {useMoralis} from "react-moralis";
import {useEffect} from "react";

export default function Header() {
    const {enableWeb3, isWeb3Enabled, account} = useMoralis();

    useEffect(() => {
        console.log('hie');
    }, [isWeb3Enabled]);

    const connect = async () => {
        await enableWeb3();
    }

    return (
        <div>
            {account
                ? <div> Connected to {account}</div>
                : <button onClick={connect}>Connect</button>
            }
        </div>
    );
}