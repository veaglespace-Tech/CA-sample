import { prisma } from './src/db.js'; 
async function test() { 
  try { 
    const plans = await prisma.purchasePlan.findMany({ 
      where: { 
        OR: [{ serviceSlug: 'increase-authorised-capital' }] 
      } 
    }); 
    console.log(plans); 
  } catch(e) { 
    console.error(e); 
  } finally { 
    await prisma.$disconnect(); 
  } 
} 
test();
