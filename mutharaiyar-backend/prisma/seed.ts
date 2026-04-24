import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const tamilNaduDistricts = [
  'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli',
  'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Dindigul',
  'Thanjavur', 'Kanchipuram', 'Cuddalore', 'Nagapattinam', 'Villupuram',
  'Karur', 'Namakkal', 'Dharmapuri', 'Krishnagiri', 'Sivaganga',
  'Virudhunagar', 'Ramanathapuram', 'Theni', 'Pudukkottai', 'Kanyakumari',
  'Nilgiris', 'Perambalur', 'Ariyalur', 'Kallakurichi', 'Chengalpattu',
  'Tenkasi', 'Tirupathur', 'Ranipet', 'Tiruvannamalai', 'Mayiladuthurai',
];

const indianFirstNames = {
  male: [
    'Arjun','Vikram','Rajesh','Suresh','Mahesh','Ramesh','Dinesh','Ganesh',
    'Karthik','Arun','Anand','Ashwin','Balaji','Chandran','Deepak','Ezhil',
    'Gopal','Hari','Jagadish','Kannan','Lakshman','Murugan','Naveen','Prakash',
    'Ravi','Sanjay','Tarun','Uday','Venkat','Yogesh','Aditya','Bharath',
    'Chandra','Dhanush','Gautam','Harish','Ishaan','Jagan','Krishna','Mani',
  ],
  female: [
    'Priya','Kavya','Divya','Shreya','Meera','Deepika','Anitha','Sangeetha',
    'Lakshmi','Saraswathi','Kamala','Radha','Geetha','Sita','Uma','Vani',
    'Shanti','Devi','Malini','Rekha','Sudha','Vidya','Yamuna','Zara',
    'Bhavani','Chitra','Durga','Ganga','Indira','Janaki','Kiran','Latha',
    'Mythili','Nirmala','Padma','Revathi','Sujatha','Tara','Usha','Vasanti',
  ],
};

const indianLastNames = [
  'Kumar','Sharma','Singh','Patel','Reddy','Nair','Iyer','Rao',
  'Krishnan','Murugan','Raman','Subramanian','Venkatesh','Chandran','Balan',
  'Natarajan','Sundaram','Venkatesan','Raghavan','Srinivasan','Gopalakrishnan',
  'Ramachandran','Narayanan','Balakrishnan','Mahadevan','Sivakumar','Rajendran',
  'Mohan','Ganesan','Selvan','Arumugam','Perumal','Durai','Muthu','Senthil',
];

const educationLevels = [
  'Primary School','Secondary School','Higher Secondary','Diploma',
  'Undergraduate','Postgraduate','Doctorate','Professional Degree',
];

const jobTypes = [
  'Government Employee','Private Employee','Self Employed','Business Owner',
  'Farmer','Student','Homemaker','Retired','Freelancer','Teacher',
  'Doctor','Engineer','Lawyer','Accountant','Shopkeeper','Driver',
];

const jobDescriptions: Record<string, string[]> = {
  'Government Employee': ['Clerk','Officer','Teacher','Police Constable','Postal Worker'],
  'Private Employee': ['Software Developer','Marketing Executive','Sales Representative','HR Manager','Accountant'],
  'Self Employed': ['Consultant','Freelancer','Tutor','Photographer','Designer'],
  'Business Owner': ['Shop Owner','Restaurant Owner','Trading Business','Manufacturing','Transport Business'],
  'Farmer': ['Rice Farmer','Vegetable Farmer','Dairy Farmer','Poultry Farmer','Fruit Farmer'],
  'Student': ['School Student','College Student','University Student','Research Scholar','Intern'],
  'Homemaker': ['Homemaker','Housewife','Home Manager','Family Caregiver','Domestic Manager'],
  'Retired': ['Retired Government Employee','Retired Private Employee','Retired Teacher','Retired Officer','Pensioner'],
  'Freelancer': ['Freelance Writer','Freelance Designer','Freelance Developer','Freelance Consultant','Freelance Photographer'],
  'Teacher': ['Primary School Teacher','High School Teacher','College Professor','Tuition Teacher','Subject Teacher'],
  'Doctor': ['General Practitioner','Specialist Doctor','Surgeon','Pediatrician','Dentist'],
  'Engineer': ['Software Engineer','Civil Engineer','Mechanical Engineer','Electrical Engineer','Chemical Engineer'],
  'Lawyer': ['Advocate','Legal Advisor','Corporate Lawyer','Criminal Lawyer','Family Lawyer'],
  'Accountant': ['Chartered Accountant','Tax Consultant','Auditor','Finance Manager','Bookkeeper'],
  'Shopkeeper': ['Grocery Store Owner','Textile Shop Owner','Electronics Shop Owner','Medical Store Owner','General Store Owner'],
  'Driver': ['Auto Driver','Taxi Driver','Bus Driver','Truck Driver','Delivery Driver'],
};

const maritalStatuses = ['Single','Married','Divorced','Widowed'];
const bloodGroups = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

const generateProfilePicture = (gender: string): string => {
  const maleImages = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  ];
  const femaleImages = [
    'https://images.unsplash.com/photo-1494790108755-2616b612b820?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  ];
  return faker.helpers.arrayElement(gender === 'Male' ? maleImages : femaleImages);
};

const generateMobileNumber = (): string => {
  const prefix = faker.helpers.arrayElement(['6','7','8','9']);
  return prefix + faker.string.numeric(9);
};

const generateAddress = (): string => {
  const num = faker.helpers.arrayElement(['1','2','3','5','10','15','20','25','50','100']);
  const street = faker.helpers.arrayElement([
    'Main Street','Gandhi Road','Anna Salai','Nehru Street','Bharathi Street',
    'Kamaraj Road','Patel Road','Rajaji Street','Subash Road','Tilak Street',
  ]);
  return `${num}, ${street}`;
};

const generateBirthdate = (): string => {
  return faker.date.between({ from: '1950-01-01', to: '2005-12-31' }).toISOString().split('T')[0];
};

async function main() {
  console.log('Starting seed...');

  await prisma.survey.deleteMany({});
  await prisma.iDCardTemplate.deleteMany({});

  console.log('Generating 100 users...');

  const usedMobiles = new Set<string>();
  const usedEmails = new Set<string>();

  for (let i = 0; i < 100; i++) {
    const gender = faker.helpers.arrayElement(['Male','Female']);
    const first = faker.helpers.arrayElement(indianFirstNames[gender.toLowerCase() as 'male' | 'female']);
    const last = faker.helpers.arrayElement(indianLastNames);

    let mobile: string;
    do { mobile = generateMobileNumber(); } while (usedMobiles.has(mobile));
    usedMobiles.add(mobile);

    let email: string;
    do {
      email = `${first.toLowerCase()}.${last.toLowerCase()}${faker.number.int({ min: 1, max: 9999 })}@gmail.com`;
    } while (usedEmails.has(email));
    usedEmails.add(email);

    const jobType = faker.helpers.arrayElement(jobTypes);
    const descs = jobDescriptions[jobType] || [jobType];

    await prisma.survey.create({
      data: {
        profilePicture: generateProfilePicture(gender),
        fullName: `${first} ${last}`,
        gender,
        mobile,
        email,
        birthdate: generateBirthdate(),
        maritalStatus: faker.helpers.arrayElement(maritalStatuses),
        address: generateAddress(),
        education: faker.helpers.arrayElement(educationLevels),
        jobType,
        jobDescription: faker.helpers.arrayElement(descs),
        bloodGroup: faker.helpers.arrayElement(bloodGroups),
      },
    });

    if ((i + 1) % 25 === 0) console.log(`  ${i + 1}/100 users created`);
  }

  await prisma.iDCardTemplate.create({
    data: {
      name: 'Default Mutharaiyar Template',
      description: 'Default ID card template for Mutharaiyar community members',
      organizationTitle: 'Mutharaiyar Community',
      organizationLogo: '/mutharaiyar-logo.png',
      style: 'modern',
      layout: 'horizontal',
      primaryColor: '#ff6b35',
      secondaryColor: '#f7931e',
      accentColor: '#dc2626',
      textColor: '#ffffff',
      fontFamily: 'Inter',
      showQR: true,
      qrPosition: 'right',
      showFields: {
        photo: true, name: true, memberId: true, jobTitle: true,
        department: false, email: true, phone: true, address: true,
        bloodGroup: false, emergencyContact: false, validFrom: true,
        validUntil: false, signature: false,
      },
      isActive: true,
      isDefault: true,
    },
  });

  const total = await prisma.survey.count();
  console.log(`\nDone! ${total} users + 1 template seeded.`);
}

main()
  .catch((e) => { console.error('Seed error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
