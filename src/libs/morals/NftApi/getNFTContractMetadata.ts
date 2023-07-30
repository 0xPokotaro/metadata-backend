import Moralis from 'moralis'
import { EvmChain } from '@moralisweb3/common-evm-utils'

const moralisApiKey = process.env.MORALIS_API_KEY

export const getNFTContractMetadata = async (tokenAddress: string) => {
  try {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey: moralisApiKey,
      })
    }

    const response = await Moralis.EvmApi.nft.getNFTContractMetadata({
      chain: EvmChain.ETHEREUM,
      address: tokenAddress,
    })

    if (response === null) {
      return null
    }

    return response.toJSON()
  } catch (error) {
    console.error(error)
    throw error
  }
}
