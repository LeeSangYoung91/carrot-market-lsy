import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";   //swr전역 설정 

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // 여기로 피시용 모바일용 제어
    
    <SWRConfig
    value={{
      //refreshInterval:2000  2000ms마다 새로고침을 하고싶을때 
      fetcher: (url: string) =>
        fetch(url).then((response) => response.json()),
    }}
  >
    <div className="w-full max-w-xl mx-auto">
      <Component {...pageProps} />
    </div>

  </SWRConfig>
);
}


export default MyApp;