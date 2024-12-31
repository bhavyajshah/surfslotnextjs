import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const slots = await prisma.userSlot.findMany()

  for (const slot of slots) {
    await prisma.userSlot.update({
      where: { id: slot.id },
      data: {
        start: new Date(slot.start).toISOString(),
        end: new Date(slot.end).toISOString()
      }
    })
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

