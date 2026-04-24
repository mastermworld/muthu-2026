import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface LocationData {
  countries: Array<{
    value: string;
    label: string;
    name: string;
  }>;
  states: Record<string, Array<{
    value: string;
    label: string;
    name: string;
    country: string;
  }>>;
  districts: Record<string, Array<{
    value: string;
    label: string;
    name: string;
    state: string;
  }>>;
  taluks: Record<string, Array<{
    value: string;
    label: string;
    name: string;
    district: string;
  }>>;
  villages: Record<string, Array<{
    value: string;
    label: string;
    name: string;
    taluk: string;
  }>>;
}

async function seedLocations() {
  try {
    console.log('Starting location data seeding...');

    // Load location data
    const dataPath = path.join(__dirname, '..', 'src', 'data', 'locations.json');
    if (!fs.existsSync(dataPath)) {
      throw new Error('Location data file not found. Please run the CSV processing script first.');
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const locationData: LocationData = JSON.parse(rawData);

    console.log('Location data loaded successfully');

    // Clear existing data
    console.log('Clearing existing location data...');
    await prisma.village.deleteMany({});
    await prisma.taluk.deleteMany({});
    await prisma.district.deleteMany({});
    await prisma.state.deleteMany({});
    await prisma.country.deleteMany({});

    // Seed Countries
    console.log('Seeding countries...');
    const countryMap = new Map<string, number>();
    for (const country of locationData.countries) {
      const createdCountry = await prisma.country.create({
        data: {
          value: country.value,
          label: country.label,
          name: country.name,
        },
      });
      countryMap.set(country.value, createdCountry.id);
      console.log(`Created country: ${country.name}`);
    }

    // Seed States
    console.log('Seeding states...');
    const stateMap = new Map<string, number>();
    for (const [countryValue, states] of Object.entries(locationData.states)) {
      const countryId = countryMap.get(countryValue);
      if (!countryId) {
        console.warn(`Country ID not found for: ${countryValue}`);
        continue;
      }

      for (const state of states) {
        const createdState = await prisma.state.create({
          data: {
            value: state.value,
            label: state.label,
            name: state.name,
            countryId,
          },
        });
        stateMap.set(state.value, createdState.id);
        console.log(`Created state: ${state.name}`);
      }
    }

    // Seed Districts
    console.log('Seeding districts...');
    const districtMap = new Map<string, number>();
    for (const [stateValue, districts] of Object.entries(locationData.districts)) {
      const stateId = stateMap.get(stateValue);
      if (!stateId) {
        console.warn(`State ID not found for: ${stateValue}`);
        continue;
      }

      for (const district of districts) {
        const createdDistrict = await prisma.district.create({
          data: {
            value: district.value,
            label: district.label,
            name: district.name,
            stateId,
          },
        });
        districtMap.set(district.value, createdDistrict.id);
        console.log(`Created district: ${district.name}`);
      }
    }

    // Seed Taluks
    console.log('Seeding taluks...');
    const talukMap = new Map<string, number>();
    for (const [districtValue, taluks] of Object.entries(locationData.taluks)) {
      const districtId = districtMap.get(districtValue);
      if (!districtId) {
        console.warn(`District ID not found for: ${districtValue}`);
        continue;
      }

      for (const taluk of taluks) {
        const createdTaluk = await prisma.taluk.create({
          data: {
            value: taluk.value,
            label: taluk.label,
            name: taluk.name,
            districtId,
          },
        });
        talukMap.set(taluk.value, createdTaluk.id);
        console.log(`Created taluk: ${taluk.name}`);
      }
    }

    // Seed Villages
    console.log('Seeding villages...');
    let villageCount = 0;
    let duplicateCount = 0;
    
    for (const [talukValue, villages] of Object.entries(locationData.villages)) {
      const talukId = talukMap.get(talukValue);
      if (!talukId) {
        console.warn(`Taluk ID not found for: ${talukValue}`);
        continue;
      }

      // Process villages in batches for better performance
      const batchSize = 50; // Reduced batch size for individual inserts
      for (let i = 0; i < villages.length; i += batchSize) {
        const batch = villages.slice(i, i + batchSize);
        
        // Create villages one by one to handle duplicates
        for (const village of batch) {
          try {
            await prisma.village.create({
              data: {
                value: village.value,
                label: village.label,
                name: village.name,
                talukId,
              },
            });
            villageCount++;
          } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('Village_value_key')) {
              // Handle duplicate by appending taluk name to make it unique
              const uniqueValue = `${village.value}-${talukValue}`;
              try {
                await prisma.village.create({
                  data: {
                    value: uniqueValue,
                    label: village.label,
                    name: village.name,
                    talukId,
                  },
                });
                duplicateCount++;
                villageCount++;
                if (duplicateCount <= 10) { // Only log first 10 duplicates
                  console.log(`⚠️  Created village with unique value: ${village.name} (${uniqueValue})`);
                }
              } catch (secondError) {
                console.warn(`❌ Failed to create village ${village.name}:`, secondError);
              }
            } else {
              console.warn(`❌ Failed to create village ${village.name}:`, error);
            }
          }
        }

        if (villageCount % 1000 === 0) {
          console.log(`Created ${villageCount} villages... (${duplicateCount} duplicates handled)`);
        }
      }
    }

    if (duplicateCount > 0) {
      console.log(`✅ Handled ${duplicateCount} duplicate village names by making them unique`);
    }

    console.log('Location data seeding completed successfully!');
    console.log(`Summary:
      - Countries: ${locationData.countries.length}
      - States: ${Object.values(locationData.states).flat().length}
      - Districts: ${Object.values(locationData.districts).flat().length}
      - Taluks: ${Object.values(locationData.taluks).flat().length}
      - Villages: ${Object.values(locationData.villages).flat().length}
    `);

  } catch (error) {
    console.error('Error seeding location data:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedLocations();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedLocations }; 