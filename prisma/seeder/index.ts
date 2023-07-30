import { main as handlerEvmChainSeeder } from './evmChainSeeder'
import { main as handlerEvmChainLastProcessdBlocksSeeder } from './evmChainLastProcessdBlockSeeder'

async function main() {
  await handlerEvmChainSeeder()
  await handlerEvmChainLastProcessdBlocksSeeder()
}

main()
  .then(async () => {
    process.exit(0)
  })
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
