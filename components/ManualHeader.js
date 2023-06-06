import {useMoralis} from "react-moralis";
import {useEffect} from "react";

export default function ManualHeader() {
    const {enableWeb3, isWeb3Enabled, account, Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis();

    useEffect(() => {
        if(!isWeb3Enabled && window.localStorage.getItem('connected')) {
            enableWeb3().then(() => {});
        }
    }, [isWeb3Enabled]);

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`account change to ${account}`);
            if(account === null) {
                window.localStorage.removeItem('connected');
                deactivateWeb3().then(() => {});
            }
        })
    }, []);

    const connect = async () => {
        await enableWeb3();
        window.localStorage.setItem('connected', 'true');
    }

    return (
        <div>
            {account
                ? <div> Connected to {account}</div>
                : <button onClick={connect} disabled={isWeb3EnableLoading}>Connect</button>
            }
        </div>
    );
}