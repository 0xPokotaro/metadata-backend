import { EvmChain } from '@moralisweb3/common-evm-utils'
import { PrismaClient } from '@prisma/client'
import { getNFTContractMetadata } from '../../../libs/morals/NftApi/getNFTContractMetadata'
import { EVM_CHAIN } from '../../../config'

const prisma = new PrismaClient()

const createEvmChainNftCollection = async (
  evmChainTokenId: number,
  nftContractMetadata: any
) => {
  let syncedAt = new Date()
  if (nftContractMetadata.synced_at !== undefined) {
    syncedAt = new Date(nftContractMetadata.synced_at)
  }

  await prisma.evmChainNftCollections.create({
    data: {
      evmChainTokenId,
      name: nftContractMetadata.name,
      symbol: nftContractMetadata.symbol,
      contractType: nftContractMetadata.contract_type,
      syncedAt,
      possibleSpam: nftContractMetadata.possible_spam,
      verifiedCollection: nftContractMetadata.verified_collection,
    },
  })
}

export const main = async () => {
  try {
    const evmChainNftCollection = await prisma.evmChainNftCollections.findFirst(
      {
        orderBy: {
          id: 'desc',
        },
      }
    )

    let evmChainTokenId

    if (!evmChainNftCollection) {
      evmChainTokenId = EVM_CHAIN.ETHEREUM.CHAIN_ID
    } else {
      evmChainTokenId = evmChainNftCollection.evmChainTokenId + 1
    }

    const evmChainToken = await prisma.evmChainTokens.findFirst({
      where: {
        id: evmChainTokenId,
        evmChainId: EVM_CHAIN.ETHEREUM.CHAIN_ID,
      },
    })

    if (!evmChainToken) {
      throw new Error('No evmChainToken')
    }

    const nftContractMetadata: any = await getNFTContractMetadata(
      evmChainToken.address
    )
    console.log(nftContractMetadata)

    if (!nftContractMetadata) {
      throw new Error('No nftContractMetadata')
    }

    await createEvmChainNftCollection(evmChainToken.id, nftContractMetadata)

    console.log(evmChainNftCollection)
  } catch (error) {
    console.error(error)
  } finally {
    console.info('[END] saveNftTokenAddresses')
  }
}
