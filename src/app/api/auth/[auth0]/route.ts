import { handleAuth } from '@auth0/nextjs-auth0'

export const GET = handleAuth()
// export const GETfn = async () => {
//   return handleAuth()
// }

// export const GET = await GETfn()