import Moralis from 'moralis'
import { EvmChain } from '@moralisweb3/common-evm-utils'
import { PrismaClient } from '@prisma/client'

const apiKey = process.env.MORALIS_API_KEY

export class NftService {
  private prisma: PrismaClient
  private chain: EvmChain
  private limit: number
  private disableTotal: boolean

  constructor() {
    // Prisma
    this.prisma = new PrismaClient()

    // Moralis
    this.chain = EvmChain.ETHEREUM
    this.limit = 5
    this.disableTotal = false
  }

  public async getNFTTransfersByBlock(blockNo: number, lastCursor: string) {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey: apiKey,
      })
    }

    const response = await Moralis.EvmApi.nft.getNFTTransfersByBlock({
      blockNumberOrHash: blockNo.toString(),
      cursor: lastCursor,
      chain: this.chain,
      limit: this.limit,
      disableTotal: this.disableTotal,
    })

    return response.toJSON()
  }

  public async getLastProcessdBlock() {
    try {
      const lastProcessdBlocks = await this.prisma.lastProcessdBlocks.findFirst(
        {
          orderBy: {
            id: 'desc',
          },
        }
      )

      this.prisma.$disconnect()

      return lastProcessdBlocks
    } catch (error) {
      console.log(error)
    }
  }

  public async createLastProcessedBlock(nextBlockNo: number) {
    try {
      await this.prisma.lastProcessdBlocks.create({
        data: {
          latestBlockNo: nextBlockNo,
          lastCursor: '',
        },
      })

      this.prisma.$disconnect()
    } catch (error) {
      console.log(error)
    }
  }

  public async updateLastProcessedBlock(
    lastProcessedBlockId: number,
    cursor: string
  ) {
    try {
      await this.prisma.lastProcessdBlocks.update({
        where: {
          id: lastProcessedBlockId,
        },
        data: {
          lastCursor: cursor,
        },
      })

      this.prisma.$disconnect()
    } catch (error) {
      console.log(error)
    }
  }

  public async createTokens(transfers: any) {
    try {
      const savedTokenAddresses: Set<string> = new Set()

      for (const transfer of transfers) {
        const tokenAddress = transfer.token_address

        // すでにデータベースに存在するかチェック
        const existingToken = await this.prisma.tokens.findFirst({
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

      // Setを配列に変換
      const tokenAddressesToCreate = Array.from(savedTokenAddresses).map(
        (address) => ({ address })
      )

      await this.prisma.tokens.createMany({
        data: tokenAddressesToCreate,
      })

      this.prisma.$disconnect()
    } catch (error) {
      console.log(error)

      throw error
    }
  }
}
