import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();
  const role = process.env.ADMIN_ROLE?.trim().toLowerCase() || "admin";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  }

  if (!["admin", "staff"].includes(role)) {
    throw new Error("ADMIN_ROLE must be admin or staff");
  }

  const passwordHash = await hash(password, 12);

  const adminUser = await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash,
      role,
    },
    create: {
      email,
      passwordHash,
      role,
    },
  });

  console.log(`Admin user ready: ${adminUser.email} (${adminUser.role})`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

