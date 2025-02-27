import mixpanel from 'mixpanel-browser'

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN

export function initMixpanel() {
  if (!MIXPANEL_TOKEN) {
    console.warn('Mixpanel token is missing! Check your .env file.')
    return
  }

  mixpanel.init(MIXPANEL_TOKEN, { debug: true, verbose: true, ignore_dnt: true, api_host: '/api/mixpanel', })
  return mixpanel
}
