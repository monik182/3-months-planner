// TODO: move this to a separate file
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unknown error occurred'
}

export async function prismaHandler<T>(action: () => Promise<T>): Promise<T | null> {
  try {
    return await action()
  } catch (error) {
    console.log('Prisma Error RAW:', error)
    console.log('Prisma Error:', formatError(error))
    throw new Error('Something went wrong with the database operation.')
  }
}
