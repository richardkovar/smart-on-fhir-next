import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

//TODO: Study FHIR types and implement more accurate TypeScript interfaces.

function SoFNApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default SoFNApp
