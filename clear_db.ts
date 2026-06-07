import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.payment.deleteMany();
  console.log("Deleted all payments");
  await prisma.reservation.deleteMany();
  console.log("Deleted all reservations");
  await prisma.room.deleteMany();
  console.log("Deleted all rooms");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
