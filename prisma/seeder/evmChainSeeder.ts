import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const rows = [
  {
    name: 'ethereum',
    chainId: 1,
  },
]

export const main = async () => {
  let counter = 1
  for (const row of rows) {
    await prisma.evmChains.upsert({
      where: {
        id: counter
      },
      update: {
        name: row.name,
        chainId: row.chainId,
      },
      create: {
        id: counter,
        name: row.name,
        chainId: row.chainId,
      }
    })

    counter++
  }

  prisma.$disconnect()
}
