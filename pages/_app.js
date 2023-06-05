import '@/styles/globals.css'
import { MoralisProvider } from "react-moralis";

export default function App({ Component, pageProps }) {
  //we added here intitalize on mount because we don't need any backend moralis features
  return <MoralisProvider initializeOnMount={false}>
    <Component {...pageProps} />
  </MoralisProvider>

}
