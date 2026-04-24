export interface Country {
  value: string;
  label: string;
  states?: State[];
}

export interface State {
  value: string;
  english: string;
  tamil: string;
}

export const countries: Country[] = [
  {
    value: "india",
    label: "India",
    states: [
      { value: "andhra-pradesh", english: "Andhra Pradesh", tamil: "ஆந்திரப் பிரதேசம்" },
      { value: "arunachal-pradesh", english: "Arunachal Pradesh", tamil: "அருணாச்சல பிரதேசம்" },
      { value: "assam", english: "Assam", tamil: "அசாம்" },
      { value: "bihar", english: "Bihar", tamil: "பீகார்" },
      { value: "chhattisgarh", english: "Chhattisgarh", tamil: "சத்தீஸ்கர்" },
      { value: "goa", english: "Goa", tamil: "கோவா" },
      { value: "gujarat", english: "Gujarat", tamil: "குஜராத்" },
      { value: "haryana", english: "Haryana", tamil: "ஹரியானா" },
      { value: "himachal-pradesh", english: "Himachal Pradesh", tamil: "இமாச்சல பிரதேசம்" },
      { value: "jharkhand", english: "Jharkhand", tamil: "ஜார்க்கண்ட்" },
      { value: "karnataka", english: "Karnataka", tamil: "கர்நாடகா" },
      { value: "kerala", english: "Kerala", tamil: "கேரளா" },
      { value: "madhya-pradesh", english: "Madhya Pradesh", tamil: "மத்தியப் பிரதேசம்" },
      { value: "maharashtra", english: "Maharashtra", tamil: "மகாராஷ்டிரா" },
      { value: "manipur", english: "Manipur", tamil: "மணிப்பூர்" },
      { value: "meghalaya", english: "Meghalaya", tamil: "மேகாலயா" },
      { value: "mizoram", english: "Mizoram", tamil: "மிசோரம்" },
      { value: "nagaland", english: "Nagaland", tamil: "நாகாலாந்து" },
      { value: "odisha", english: "Odisha", tamil: "ஒடிசா" },
      { value: "punjab", english: "Punjab", tamil: "பஞ்சாப்" },
      { value: "rajasthan", english: "Rajasthan", tamil: "ராஜஸ்தான்" },
      { value: "sikkim", english: "Sikkim", tamil: "சிக்கிம்" },
      { value: "tamil-nadu", english: "Tamil Nadu", tamil: "தமிழ்நாடு" },
      { value: "telangana", english: "Telangana", tamil: "தெலுங்கானா" },
      { value: "tripura", english: "Tripura", tamil: "திரிபுரா" },
      { value: "uttar-pradesh", english: "Uttar Pradesh", tamil: "உத்தரப் பிரதேசம்" },
      { value: "uttarakhand", english: "Uttarakhand", tamil: "உத்தரகாண்ட்" },
      { value: "west-bengal", english: "West Bengal", tamil: "மேற்கு வங்கம்" },
      { value: "andaman-nicobar", english: "Andaman and Nicobar Islands", tamil: "அந்தமான் நிக்கோபார் தீவுகள்" },
      { value: "chandigarh", english: "Chandigarh", tamil: "சண்டிகர்" },
      { value: "dadra-nagar-haveli", english: "Dadra and Nagar Haveli and Daman and Diu", tamil: "தாத்ரா மற்றும் நகர் ஹவேலி மற்றும் டாமன் மற்றும் டையூ" },
      { value: "delhi", english: "Delhi", tamil: "டெல்லி" },
      { value: "jammu-kashmir", english: "Jammu and Kashmir", tamil: "ஜம்மு மற்றும் காஷ்மீர்" },
      { value: "ladakh", english: "Ladakh", tamil: "லடாக்" },
      { value: "lakshadweep", english: "Lakshadweep", tamil: "லட்சத்தீவு" },
      { value: "puducherry", english: "Puducherry", tamil: "புதுச்சேரி" },
    ]
  },
  {
    value: "united-states",
    label: "United States",
    states: [
      { value: "alabama", english: "Alabama", tamil: "அலபாமா" },
      { value: "alaska", english: "Alaska", tamil: "அலாஸ்கா" },
      { value: "arizona", english: "Arizona", tamil: "அரிசோனா" },
      { value: "arkansas", english: "Arkansas", tamil: "ஆரக்கன்சா" },
      { value: "california", english: "California", tamil: "கலிபோர்னியா" },
      { value: "colorado", english: "Colorado", tamil: "கொலராடோ" },
      { value: "connecticut", english: "Connecticut", tamil: "கனெக்டிகட்" },
      { value: "delaware", english: "Delaware", tamil: "டெலாவேர்" },
      { value: "florida", english: "Florida", tamil: "புளோரிடா" },
      { value: "georgia", english: "Georgia", tamil: "ஜார்ஜியா" },
      { value: "hawaii", english: "Hawaii", tamil: "ஹவாய்" },
      { value: "idaho", english: "Idaho", tamil: "இடாஹோ" },
      { value: "illinois", english: "Illinois", tamil: "இலினாய்ஸ்" },
      { value: "indiana", english: "Indiana", tamil: "இந்தியானா" },
      { value: "iowa", english: "Iowa", tamil: "அயோவா" },
      { value: "kansas", english: "Kansas", tamil: "கேன்சஸ்" },
      { value: "kentucky", english: "Kentucky", tamil: "கென்டக்கி" },
      { value: "louisiana", english: "Louisiana", tamil: "லூசியானா" },
      { value: "maine", english: "Maine", tamil: "மெய்ன்" },
      { value: "maryland", english: "Maryland", tamil: "மேரிலாந்து" },
      { value: "massachusetts", english: "Massachusetts", tamil: "மாசசூசெட்ஸ்" },
      { value: "michigan", english: "Michigan", tamil: "மிச்சிகன்" },
      { value: "minnesota", english: "Minnesota", tamil: "மினசோட்டா" },
      { value: "mississippi", english: "Mississippi", tamil: "மிசிசிப்பி" },
      { value: "missouri", english: "Missouri", tamil: "மிசூரி" },
      { value: "montana", english: "Montana", tamil: "மொன்டானா" },
      { value: "nebraska", english: "Nebraska", tamil: "நெப்ராஸ்கா" },
      { value: "nevada", english: "Nevada", tamil: "நெவாடா" },
      { value: "new-hampshire", english: "New Hampshire", tamil: "நியூ ஹாம்ப்ஷயர்" },
      { value: "new-jersey", english: "New Jersey", tamil: "நியூ ஜெர்சி" },
      { value: "new-mexico", english: "New Mexico", tamil: "நியூ மெக்சிகோ" },
      { value: "new-york", english: "New York", tamil: "நியூயார்க்" },
      { value: "north-carolina", english: "North Carolina", tamil: "வடக்கு கரோலினா" },
      { value: "north-dakota", english: "North Dakota", tamil: "வடக்கு டகோட்டா" },
      { value: "ohio", english: "Ohio", tamil: "ஓஹியோ" },
      { value: "oklahoma", english: "Oklahoma", tamil: "ஓக்லஹோமா" },
      { value: "oregon", english: "Oregon", tamil: "ஒரேகான்" },
      { value: "pennsylvania", english: "Pennsylvania", tamil: "பென்சில்வேனியா" },
      { value: "rhode-island", english: "Rhode Island", tamil: "ரோட் தீவு" },
      { value: "south-carolina", english: "South Carolina", tamil: "தெற்கு கரோலினா" },
      { value: "south-dakota", english: "South Dakota", tamil: "தெற்கு டகோட்டா" },
      { value: "tennessee", english: "Tennessee", tamil: "டென்னசி" },
      { value: "texas", english: "Texas", tamil: "டெக்சாஸ்" },
      { value: "utah", english: "Utah", tamil: "உட்டா" },
      { value: "vermont", english: "Vermont", tamil: "வெர்மான்ட்" },
      { value: "virginia", english: "Virginia", tamil: "வர்ஜீனியா" },
      { value: "washington", english: "Washington", tamil: "வாஷிங்டன்" },
      { value: "west-virginia", english: "West Virginia", tamil: "மேற்கு வர்ஜீனியா" },
      { value: "wisconsin", english: "Wisconsin", tamil: "விஸ்கான்சின்" },
      { value: "wyoming", english: "Wyoming", tamil: "வயோமிங்" },
    ]
  },
  {
    value: "canada",
    label: "Canada",
    states: [
      { value: "alberta", english: "Alberta", tamil: "ஆல்பர்ட்டா" },
      { value: "british-columbia", english: "British Columbia", tamil: "பிரிட்டிஷ் கொலம்பியா" },
      { value: "manitoba", english: "Manitoba", tamil: "மானிட்டோபா" },
      { value: "new-brunswick", english: "New Brunswick", tamil: "நியூ பிரன்சுவிக்" },
      { value: "newfoundland-labrador", english: "Newfoundland and Labrador", tamil: "நியூஃபவுண்ட்லேண்ட் மற்றும் லாப்ரடோர்" },
      { value: "northwest-territories", english: "Northwest Territories", tamil: "வடமேற்கு பிரதேசங்கள்" },
      { value: "nova-scotia", english: "Nova Scotia", tamil: "நோவா ஸ்கோஷியா" },
      { value: "nunavut", english: "Nunavut", tamil: "நுனாவுட்" },
      { value: "ontario", english: "Ontario", tamil: "ஒன்ராறியோ" },
      { value: "prince-edward-island", english: "Prince Edward Island", tamil: "இளவரசர் எட்வர்ட் தீவு" },
      { value: "quebec", english: "Quebec", tamil: "கியூபெக்" },
      { value: "saskatchewan", english: "Saskatchewan", tamil: "சஸ்காட்செவன்" },
      { value: "yukon", english: "Yukon", tamil: "யூகோன்" },
    ]
  },
  {
    value: "united-kingdom",
    label: "United Kingdom",
    states: [
      { value: "england", english: "England", tamil: "இங்கிலாந்து" },
      { value: "scotland", english: "Scotland", tamil: "ஸ்காட்லாந்து" },
      { value: "wales", english: "Wales", tamil: "வேல்ஸ்" },
      { value: "northern-ireland", english: "Northern Ireland", tamil: "வடக்கு அயர்லாந்து" },
    ]
  },
  {
    value: "australia",
    label: "Australia",
    states: [
      { value: "new-south-wales", english: "New South Wales", tamil: "நியூ சவுத் வேல்ஸ்" },
      { value: "victoria", english: "Victoria", tamil: "விக்டோரியா" },
      { value: "queensland", english: "Queensland", tamil: "குயின்ஸ்லாந்து" },
      { value: "western-australia", english: "Western Australia", tamil: "மேற்கு ஆஸ்திரேலியா" },
      { value: "south-australia", english: "South Australia", tamil: "தெற்கு ஆஸ்திரேலியா" },
      { value: "tasmania", english: "Tasmania", tamil: "டாஸ்மேனியா" },
      { value: "northern-territory", english: "Northern Territory", tamil: "வடக்கு பிரதேசம்" },
      { value: "australian-capital-territory", english: "Australian Capital Territory", tamil: "ஆஸ்திரேலிய தலைநகரப் பிரதேசம்" },
    ]
  },
  {
    value: "afghanistan", label: "Afghanistan"
  },
  {
    value: "albania", label: "Albania"
  },
  {
    value: "algeria", label: "Algeria"
  },
  {
    value: "andorra", label: "Andorra"
  },
  {
    value: "angola", label: "Angola"
  },
  {
    value: "antigua-barbuda", label: "Antigua and Barbuda"
  },
  {
    value: "argentina", label: "Argentina"
  },
  {
    value: "armenia", label: "Armenia"
  },
  {
    value: "austria", label: "Austria"
  },
  {
    value: "azerbaijan", label: "Azerbaijan"
  },
  {
    value: "bahamas", label: "Bahamas"
  },
  {
    value: "bahrain", label: "Bahrain"
  },
  {
    value: "bangladesh", label: "Bangladesh"
  },
  {
    value: "barbados", label: "Barbados"
  },
  {
    value: "belarus", label: "Belarus"
  },
  {
    value: "belgium", label: "Belgium"
  },
  {
    value: "belize", label: "Belize"
  },
  {
    value: "benin", label: "Benin"
  },
  {
    value: "bhutan", label: "Bhutan"
  },
  {
    value: "bolivia", label: "Bolivia"
  },
  {
    value: "bosnia-herzegovina", label: "Bosnia and Herzegovina"
  },
  {
    value: "botswana", label: "Botswana"
  },
  {
    value: "brazil", label: "Brazil"
  },
  {
    value: "brunei", label: "Brunei"
  },
  {
    value: "bulgaria", label: "Bulgaria"
  },
  {
    value: "burkina-faso", label: "Burkina Faso"
  },
  {
    value: "burundi", label: "Burundi"
  },
  {
    value: "cabo-verde", label: "Cabo Verde"
  },
  {
    value: "cambodia", label: "Cambodia"
  },
  {
    value: "cameroon", label: "Cameroon"
  },
  {
    value: "central-african-republic", label: "Central African Republic"
  },
  {
    value: "chad", label: "Chad"
  },
  {
    value: "chile", label: "Chile"
  },
  {
    value: "china", label: "China"
  },
  {
    value: "colombia", label: "Colombia"
  },
  {
    value: "comoros", label: "Comoros"
  },
  {
    value: "congo-brazzaville", label: "Congo (Brazzaville)"
  },
  {
    value: "congo-kinshasa", label: "Congo (Kinshasa)"
  },
  {
    value: "costa-rica", label: "Costa Rica"
  },
  {
    value: "croatia", label: "Croatia"
  },
  {
    value: "cuba", label: "Cuba"
  },
  {
    value: "cyprus", label: "Cyprus"
  },
  {
    value: "czech-republic", label: "Czech Republic"
  },
  {
    value: "denmark", label: "Denmark"
  },
  {
    value: "djibouti", label: "Djibouti"
  },
  {
    value: "dominica", label: "Dominica"
  },
  {
    value: "dominican-republic", label: "Dominican Republic"
  },
  {
    value: "ecuador", label: "Ecuador"
  },
  {
    value: "egypt", label: "Egypt"
  },
  {
    value: "el-salvador", label: "El Salvador"
  },
  {
    value: "equatorial-guinea", label: "Equatorial Guinea"
  },
  {
    value: "eritrea", label: "Eritrea"
  },
  {
    value: "estonia", label: "Estonia"
  },
  {
    value: "eswatini", label: "Eswatini"
  },
  {
    value: "ethiopia", label: "Ethiopia"
  },
  {
    value: "fiji", label: "Fiji"
  },
  {
    value: "finland", label: "Finland"
  },
  {
    value: "france", label: "France"
  },
  {
    value: "gabon", label: "Gabon"
  },
  {
    value: "gambia", label: "Gambia"
  },
  {
    value: "georgia", label: "Georgia"
  },
  {
    value: "germany", label: "Germany"
  },
  {
    value: "ghana", label: "Ghana"
  },
  {
    value: "greece", label: "Greece"
  },
  {
    value: "grenada", label: "Grenada"
  },
  {
    value: "guatemala", label: "Guatemala"
  },
  {
    value: "guinea", label: "Guinea"
  },
  {
    value: "guinea-bissau", label: "Guinea-Bissau"
  },
  {
    value: "guyana", label: "Guyana"
  },
  {
    value: "haiti", label: "Haiti"
  },
  {
    value: "honduras", label: "Honduras"
  },
  {
    value: "hungary", label: "Hungary"
  },
  {
    value: "iceland", label: "Iceland"
  },
  {
    value: "indonesia", label: "Indonesia"
  },
  {
    value: "iran", label: "Iran"
  },
  {
    value: "iraq", label: "Iraq"
  },
  {
    value: "ireland", label: "Ireland"
  },
  {
    value: "israel", label: "Israel"
  },
  {
    value: "italy", label: "Italy"
  },
  {
    value: "jamaica", label: "Jamaica"
  },
  {
    value: "japan", label: "Japan"
  },
  {
    value: "jordan", label: "Jordan"
  },
  {
    value: "kazakhstan", label: "Kazakhstan"
  },
  {
    value: "kenya", label: "Kenya"
  },
  {
    value: "kiribati", label: "Kiribati"
  },
  {
    value: "korea-north", label: "Korea (North)"
  },
  {
    value: "korea-south", label: "Korea (South)"
  },
  {
    value: "kuwait", label: "Kuwait"
  },
  {
    value: "kyrgyzstan", label: "Kyrgyzstan"
  },
  {
    value: "laos", label: "Laos"
  },
  {
    value: "latvia", label: "Latvia"
  },
  {
    value: "lebanon", label: "Lebanon"
  },
  {
    value: "lesotho", label: "Lesotho"
  },
  {
    value: "liberia", label: "Liberia"
  },
  {
    value: "libya", label: "Libya"
  },
  {
    value: "liechtenstein", label: "Liechtenstein"
  },
  {
    value: "lithuania", label: "Lithuania"
  },
  {
    value: "luxembourg", label: "Luxembourg"
  },
  {
    value: "madagascar", label: "Madagascar"
  },
  {
    value: "malawi", label: "Malawi"
  },
  {
    value: "malaysia", label: "Malaysia"
  },
  {
    value: "maldives", label: "Maldives"
  },
  {
    value: "mali", label: "Mali"
  },
  {
    value: "malta", label: "Malta"
  },
  {
    value: "marshall-islands", label: "Marshall Islands"
  },
  {
    value: "mauritania", label: "Mauritania"
  },
  {
    value: "mauritius", label: "Mauritius"
  },
  {
    value: "mexico", label: "Mexico"
  },
  {
    value: "micronesia", label: "Micronesia"
  },
  {
    value: "moldova", label: "Moldova"
  },
  {
    value: "monaco", label: "Monaco"
  },
  {
    value: "mongolia", label: "Mongolia"
  },
  {
    value: "montenegro", label: "Montenegro"
  },
  {
    value: "morocco", label: "Morocco"
  },
  {
    value: "mozambique", label: "Mozambique"
  },
  {
    value: "myanmar", label: "Myanmar"
  },
  {
    value: "namibia", label: "Namibia"
  },
  {
    value: "nauru", label: "Nauru"
  },
  {
    value: "nepal", label: "Nepal"
  },
  {
    value: "netherlands", label: "Netherlands"
  },
  {
    value: "new-zealand", label: "New Zealand"
  },
  {
    value: "nicaragua", label: "Nicaragua"
  },
  {
    value: "niger", label: "Niger"
  },
  {
    value: "nigeria", label: "Nigeria"
  },
  {
    value: "north-macedonia", label: "North Macedonia"
  },
  {
    value: "norway", label: "Norway"
  },
  {
    value: "oman", label: "Oman"
  },
  {
    value: "pakistan", label: "Pakistan"
  },
  {
    value: "palau", label: "Palau"
  },
  {
    value: "panama", label: "Panama"
  },
  {
    value: "papua-new-guinea", label: "Papua New Guinea"
  },
  {
    value: "paraguay", label: "Paraguay"
  },
  {
    value: "peru", label: "Peru"
  },
  {
    value: "philippines", label: "Philippines"
  },
  {
    value: "poland", label: "Poland"
  },
  {
    value: "portugal", label: "Portugal"
  },
  {
    value: "qatar", label: "Qatar"
  },
  {
    value: "romania", label: "Romania"
  },
  {
    value: "russia", label: "Russia"
  },
  {
    value: "rwanda", label: "Rwanda"
  },
  {
    value: "saint-kitts-nevis", label: "Saint Kitts and Nevis"
  },
  {
    value: "saint-lucia", label: "Saint Lucia"
  },
  {
    value: "saint-vincent-grenadines", label: "Saint Vincent and the Grenadines"
  },
  {
    value: "samoa", label: "Samoa"
  },
  {
    value: "san-marino", label: "San Marino"
  },
  {
    value: "sao-tome-principe", label: "Sao Tome and Principe"
  },
  {
    value: "saudi-arabia", label: "Saudi Arabia"
  },
  {
    value: "senegal", label: "Senegal"
  },
  {
    value: "serbia", label: "Serbia"
  },
  {
    value: "seychelles", label: "Seychelles"
  },
  {
    value: "sierra-leone", label: "Sierra Leone"
  },
  {
    value: "singapore", label: "Singapore"
  },
  {
    value: "slovakia", label: "Slovakia"
  },
  {
    value: "slovenia", label: "Slovenia"
  },
  {
    value: "solomon-islands", label: "Solomon Islands"
  },
  {
    value: "somalia", label: "Somalia"
  },
  {
    value: "south-africa", label: "South Africa"
  },
  {
    value: "south-sudan", label: "South Sudan"
  },
  {
    value: "spain", label: "Spain"
  },
  {
    value: "sri-lanka", label: "Sri Lanka"
  },
  {
    value: "sudan", label: "Sudan"
  },
  {
    value: "suriname", label: "Suriname"
  },
  {
    value: "sweden", label: "Sweden"
  },
  {
    value: "switzerland", label: "Switzerland"
  },
  {
    value: "syria", label: "Syria"
  },
  {
    value: "taiwan", label: "Taiwan"
  },
  {
    value: "tajikistan", label: "Tajikistan"
  },
  {
    value: "tanzania", label: "Tanzania"
  },
  {
    value: "thailand", label: "Thailand"
  },
  {
    value: "timor-leste", label: "Timor-Leste"
  },
  {
    value: "togo", label: "Togo"
  },
  {
    value: "tonga", label: "Tonga"
  },
  {
    value: "trinidad-tobago", label: "Trinidad and Tobago"
  },
  {
    value: "tunisia", label: "Tunisia"
  },
  {
    value: "turkey", label: "Turkey"
  },
  {
    value: "turkmenistan", label: "Turkmenistan"
  },
  {
    value: "tuvalu", label: "Tuvalu"
  },
  {
    value: "uganda", label: "Uganda"
  },
  {
    value: "ukraine", label: "Ukraine"
  },
  {
    value: "united-arab-emirates", label: "United Arab Emirates"
  },
  {
    value: "uruguay", label: "Uruguay"
  },
  {
    value: "uzbekistan", label: "Uzbekistan"
  },
  {
    value: "vanuatu", label: "Vanuatu"
  },
  {
    value: "vatican-city", label: "Vatican City"
  },
  {
    value: "venezuela", label: "Venezuela"
  },
  {
    value: "vietnam", label: "Vietnam"
  },
  {
    value: "yemen", label: "Yemen"
  },
  {
    value: "zambia", label: "Zambia"
  },
  {
    value: "zimbabwe", label: "Zimbabwe"
  }
]; 