import { prisma } from "../config/db.js";
import { mainNav, getAllNavigationLinks, getServiceInfoBySlug } from "../../client/lib/navigation-data.js";
import { businessRegistration, taxPayroll, compliances, trademarkIP, lawyerServices, documentation, othersMenu, consultExpert } from "../../client/lib/navigation-data.js";

function getMegaData(key) {
  switch (key) {
    case "consult": return { type: "simple", data: consultExpert };
    case "business": return { type: "two-panel", data: businessRegistration };
    case "tax": return { type: "two-panel", data: taxPayroll };
    case "compliances": return { type: "two-panel", data: compliances };
    case "trademark": return { type: "two-panel", data: trademarkIP };
    case "lawyer": return { type: "two-panel", data: { sections: lawyerServices.sections.filter(s => s.links && s.links.length > 0) } };
    case "documentation": return { type: "two-panel", data: { sections: documentation.sections.filter(s => s.links && s.links.length > 0) } };
    case "others": return { type: "two-panel", data: { sections: othersMenu.sections.filter(s => s.links && s.links.length > 0) } };
    default: return null;
  }
}

function normalizeSlug(label) {
  return String(label)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\|/g, " ")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function sync() {
  console.log("Starting DB Sync from Navigation...");
  for (let i = 0; i < mainNav.length; i++) {
    const mainNavItem = mainNav[i];
    console.log(`Syncing Category: ${mainNavItem.label}`);
    
    // Upsert Category
    const catSlug = normalizeSlug(mainNavItem.label);
    const category = await prisma.serviceCategory.upsert({
      where: { slug: catSlug },
      update: { name: mainNavItem.label, sortOrder: i + 1, isActive: true },
      create: { slug: catSlug, name: mainNavItem.label, sortOrder: i + 1, isActive: true }
    });

    const megaData = getMegaData(mainNavItem.key);
    if (!megaData || !megaData.data.sections) continue;

    for (let j = 0; j < megaData.data.sections.length; j++) {
      const section = megaData.data.sections[j];
      console.log(`  Syncing Subcategory: ${section.title}`);
      
      // Upsert Subcategory
      const subCatSlug = normalizeSlug(section.title);
      const subcategory = await prisma.serviceSubcategory.upsert({
        where: { 
          categoryId_slug: {
            categoryId: category.id,
            slug: subCatSlug
          }
        },
        update: { name: section.title, sortOrder: j + 1 },
        create: { categoryId: category.id, slug: subCatSlug, name: section.title, sortOrder: j + 1 }
      });

      for (let k = 0; k < section.links.length; k++) {
        const link = section.links[k];
        const rawSlug = link.href.startsWith("/") ? link.href.substring(1) : link.href;
        const slug = normalizeSlug(rawSlug);
        
        // Upsert Service
        await prisma.service.upsert({
          where: { slug: slug },
          update: { 
            name: link.label, 
            categoryId: category.id,
            subcategoryId: subcategory.id 
          },
          create: {
            slug: slug,
            name: link.label,
            shortDesc: `Professional service for ${link.label}`,
            categoryId: category.id,
            subcategoryId: subcategory.id
          }
        });
      }
    }
  }
  
  console.log("Sync Complete!");
}

sync().catch(console.error).finally(() => prisma.$disconnect());
