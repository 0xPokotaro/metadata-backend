import { PrismaClient, TokenTypes } from '@prisma/client'
import { EVM_CHAIN } from '../../../config'
import { getNFTTransfersByBlock } from '../../../libs/morals/NftApi/getNFTTransfersByBlock'

const prisma = new PrismaClient()

const getLastProcessBlock = async () => {
  try {
    return await prisma.evmChainLastProcessdBlocks.findFirst({
      orderBy: {
        id: 'desc',
      },
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const main = async () => {
  try {
    console.info('[START] saveNftTokenAddresses')

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
      const existingToken = await prisma.evmChainTokens.findFirst({
        where: {
          evmChainId: EVM_CHAIN.ETHEREUM.CHAIN_ID,
          tokenType: TokenTypes.NFT,
          address: tokenAddress,
        },
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
      (address) => ({
        evmChainId: EVM_CHAIN.ETHEREUM.CHAIN_ID,
        tokenType: TokenTypes.NFT,
        address,
      })
    )

    await prisma.evmChainTokens.createMany({
      data: tokenAddressesToCreate,
    })

    if (transfers.cursor === null) {
      const nextBlockNo = Number(lastProcessdBlock.latestBlockNo) + 1
      await prisma.evmChainLastProcessdBlocks.create({
        data: {
          evmChainId: EVM_CHAIN.ETHEREUM.CHAIN_ID,
          latestBlockNo: nextBlockNo,
          lastCursor: '',
        },
      })
    } else {
      await prisma.evmChainLastProcessdBlocks.update({
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
    console.info('[END] saveNftTokenAddresses')
  }
}
