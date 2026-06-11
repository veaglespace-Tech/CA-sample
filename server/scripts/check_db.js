import "dotenv/config";
import { prisma } from './src/db.js'

async function main() {
  try {
    const contacts = await prisma.contactQuery.findMany()
    console.log('ContactQuery table:', JSON.stringify(contacts, null, 2))
    
    const leads = await prisma.lead.findMany({ where: { formType: 'CONTACT' } })
    console.log('Lead table (CONTACT):', JSON.stringify(leads, null, 2))
  } catch (error) {
    console.error('Database query failed:', error)
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
