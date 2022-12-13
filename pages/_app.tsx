import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // 여기로 피시용 모바일용 제어
    <div className="w-full max-w-xl mx-auto">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;