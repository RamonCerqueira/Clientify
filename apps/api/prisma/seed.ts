import { PrismaClient, Plan, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  const tenantName = 'Tenant Demo';
  const tenant = await prisma.tenant.upsert({
    where: { slug: slugify(tenantName, { lower: true, strict: true }) },
    update: {},
    create: {
      name: tenantName,
      slug: slugify(tenantName, { lower: true, strict: true }),
      plan: Plan.PRO,
      billingEmail: 'demo@clientify.local',
    },
  });

  const password = await bcrypt.hash('12345678', 10);
  await prisma.user.upsert({
    where: { email: 'owner@clientify.local' },
    update: {},
    create: {
      name: 'Owner Demo',
      email: 'owner@clientify.local',
      password,
      tenantId: tenant.id,
      role: UserRole.OWNER,
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
