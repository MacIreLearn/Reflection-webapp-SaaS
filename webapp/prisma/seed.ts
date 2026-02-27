import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const adminPassword = "admin";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: { passwordHash: hashedPassword },
    create: {
      username: "admin",
      passwordHash: hashedPassword,
    },
  });

  console.log("Admin user created/updated:", admin.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
