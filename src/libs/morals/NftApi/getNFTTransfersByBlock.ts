import Moralis from 'moralis'
import { EvmChain } from '@moralisweb3/common-evm-utils'

const moralisApiKey = process.env.MORALIS_API_KEY

export const getNFTTransfersByBlock = async (
  blockNo: number,
  lastCursor: string
) => {
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
