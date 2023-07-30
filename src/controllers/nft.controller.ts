import { Request, Response } from 'express'
import { NftService } from '../services/nft.service'

const processTransfers = async (
  nft: NftService,
  latestBlockNo: number,
  lastCursor: string
) => {
  const transfers = await nft.getNFTTransfersByBlock(latestBlockNo, lastCursor)

  if (transfers.cursor === undefined) {
    throw new Error('No cursor')
  }

  // コントラクトアドレスを登録
  await nft.createTokens(transfers.result)

  return transfers.cursor
}

export const register = async (req: Request, res: Response) => {
  try {
    const nft = new NftService()

    // 現在集計中のブロック番号を取得
    const lastProcessedBlock = await nft.getLastProcessdBlock()
    if (!lastProcessedBlock) {
      throw new Error('No last processed block')
    }

    const latestBlockNo = Number(lastProcessedBlock.latestBlockNo)
    const cursor = await processTransfers(
      nft,
      latestBlockNo,
      lastProcessedBlock.lastCursor
    )

    // 最後に集計したブロック番号を更新
    if (cursor === null) {
      const nextBlockNo = latestBlockNo + 1
      await nft.createLastProcessedBlock(nextBlockNo)
    } else {
      await nft.updateLastProcessedBlock(lastProcessedBlock.id, cursor)
    }

    return res.status(200).json({ message: 'Hello World!' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
