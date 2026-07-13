const bcrypt = require('bcryptjs')

async function main() {
  const passwords = ['Admin@07', 'Content@123', 'PYP@123', 'Mock@123']
  for (const pass of passwords) {
    const hash = await bcrypt.hash(pass, 10)
    console.log(`${pass} => ${hash}`)
  }
}

main()
