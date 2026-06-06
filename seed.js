const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.room.createMany({
      data: [
        { roomNumber: '100', type: 'Standard', pricePerNight: 150, status: 'OCCUPIED' },
        { roomNumber: '101', type: 'Standard', pricePerNight: 150, status: 'AVAILABLE' },
        { roomNumber: '102', type: 'Standard', pricePerNight: 150, status: 'AVAILABLE' },
        { roomNumber: '103', type: 'Standard', pricePerNight: 150, status: 'CLEANING_REQUIRED' },
        { roomNumber: '104', type: 'Deluxe Suite', pricePerNight: 280, status: 'AVAILABLE' },
        { roomNumber: '105', type: 'Deluxe Suite', pricePerNight: 280, status: 'AVAILABLE' },
        { roomNumber: '106', type: 'Presidential Gem', pricePerNight: 500, status: 'AVAILABLE' },
      ]
    });

    // Create a dummy reservation for room 100
    const room100 = await prisma.room.findUnique({ where: { roomNumber: '100' } });
    if (room100) {
      await prisma.reservation.create({
        data: {
          guestName: 'Raheem',
          checkIn: new Date(Date.now() - 86400000), // Yesterday
          checkOut: new Date(Date.now() + 86400000), // Tomorrow
          status: 'CHECKED_IN',
          source: 'WEBSITE',
          totalAmount: 300,
          roomId: room100.id
        }
      });
    }

    console.log("Database seeded successfully!");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
