import {esbuildPlugin} from '@web/dev-server-esbuild'
import {playwrightLauncher} from '@web/test-runner-playwright'
const getBrowser = product =>
  playwrightLauncher({
    product,
    createBrowserContext: ({browser}) => {
      return browser.newContext({permissions: ['clipboard-read']})
    },
  })

export default {
  files: ['test/*'],
  nodeResolve: true,
  plugins: [esbuildPlugin({ts: true, target: 'es2020'})],
  browsers: [getBrowser('chromium')],
  testFramework: {
    config: {
      timeout: 1000,
    },
  },
}
