import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const rows = [
  {
    evmChainId: 1,
    latestBlockNo: 17807964,
    lastCursor: '',
  },
]

export const main = async () => {
  let counter = 1
  for (const row of rows) {
    await prisma.evmChainLastProcessdBlocks.upsert({
      where: {
        id: counter
      },
      update: {
        evmChainId: row.evmChainId,
        latestBlockNo: row.latestBlockNo,
        lastCursor: row.lastCursor,
      },
      create: {
        id: counter,
        evmChainId: row.evmChainId,
        latestBlockNo: row.latestBlockNo,
        lastCursor: row.lastCursor,
      }
    })

    counter++
  }

  prisma.$disconnect()
}
