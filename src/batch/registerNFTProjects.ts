import Moralis from 'moralis'
import { EvmChain } from '@moralisweb3/common-evm-utils'

export async function registerNFTProjects() {
  try {
    console.log('registerNFTProjects')
    await Moralis.start({
      apiKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImUxZTM3NzYwLTY5MjMtNDQ2Ny04ZWQ2LTAzMTQ3ZTczYWU3MCIsIm9yZ0lkIjoiMjQ4OTE5IiwidXNlcklkIjoiMjUyMTgzIiwidHlwZUlkIjoiZTliZWMzMjEtZmUzYS00YmM2LWE0MDAtYjJhMzQ5NjY1NjhmIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODM1MDM3OTcsImV4cCI6NDgzOTI2Mzc5N30.9W1lG5rSmTuCKA8Zm8yh_kZICRSMvC3-dBe-5IZZYPE',
    })

    const blockNumberOrHash = '15846571'

    const chain = EvmChain.ETHEREUM

    const response = await Moralis.EvmApi.nft.getNFTTransfersByBlock({
      blockNumberOrHash,
      chain,
    })

    console.log(response.toJSON())
  } catch (error) {
    console.log(error)
  }
}
