const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.request.createMany({
    data: [
      {
        topic: 'Пример обращения 1',
        message: 'Это тестовое обращение номер 1.',
      },
      {
        topic: 'Пример обращения 2',
        message: 'Это тестовое обращение номер 2.',
      },
      {
        topic: 'Пример обращения 3',
        message: 'Это тестовое обращение номер 3.',
      },
      {
        topic: 'Пример обращения 4',
        message: 'Это тестовое обращение номер 4.',
      },
    ],
  });
  console.log('Database seeded successfully!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
