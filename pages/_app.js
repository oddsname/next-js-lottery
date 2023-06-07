import '@/styles/globals.css'
import {MoralisProvider} from "react-moralis";
import {NotificationProvider} from "web3uikit";

export default function App({Component, pageProps}) {
    //we added here intitalize on mount because we don't need any backend moralis features
    return (
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <Component {...pageProps} />
            </NotificationProvider>
        </MoralisProvider>
    )
}
