import Moralis from 'moralis'
import { EvmChain } from '@moralisweb3/common-evm-utils'
import { PrismaClient } from '@prisma/client'

const moralisApiKey = process.env.MORALIS_API_KEY
const prisma = new PrismaClient()

const getLastProcessBlock = async () => {
  try {
    return await prisma.lastProcessdBlocks.findFirst({
      orderBy: {
        id: 'desc',
      },
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getNFTTransfersByBlock = async (blockNo: number, lastCursor: string) => {
  try {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey: moralisApiKey,
      })
    }

    const response = await Moralis.EvmApi.nft.getNFTTransfersByBlock({
      blockNumberOrHash: blockNo.toString(),
      cursor: lastCursor,
      chain: EvmChain.ETHEREUM,
      limit: 5,
      disableTotal: false,
    })

    return response.toJSON()
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const main = async () => {
  try {
    console.info('Start saveNftTokenAddresses')

    const lastProcessdBlock = await getLastProcessBlock()
    if (!lastProcessdBlock) {
      throw new Error('No last processed block')
    }

    const transfers = await getNFTTransfersByBlock(
      Number(lastProcessdBlock.latestBlockNo),
      lastProcessdBlock.lastCursor
    )

    if (transfers.cursor === undefined) {
      throw new Error('No cursor')
    }

    const savedTokenAddresses: Set<string> = new Set()

    for (const transfer of transfers.result) {
      const tokenAddress = transfer.token_address

      // すでにデータベースに存在するかチェック
      const existingToken = await prisma.tokens.findFirst({
        where: { address: tokenAddress },
      })

      if (existingToken !== null) {
        continue
      }

      // すでに保存する予定のアドレスとして存在するかチェック
      if (savedTokenAddresses.has(tokenAddress)) {
        continue
      }

      savedTokenAddresses.add(tokenAddress)
    }

    const tokenAddressesToCreate = Array.from(savedTokenAddresses).map(
      (address) => ({ address })
    )

    await prisma.tokens.createMany({
      data: tokenAddressesToCreate,
    })

    if (transfers.cursor === null) {
      const nextBlockNo = Number(lastProcessdBlock.latestBlockNo) + 1
      await prisma.lastProcessdBlocks.create({
        data: {
          latestBlockNo: nextBlockNo,
          lastCursor: '',
        },
      })
    } else {
      await prisma.lastProcessdBlocks.update({
        where: {
          id: lastProcessdBlock.id,
        },
        data: {
          lastCursor: transfers.cursor,
        },
      })
    }
  } catch (error) {
    console.log(error)
  } finally {
    await prisma.$disconnect()
  }
}
