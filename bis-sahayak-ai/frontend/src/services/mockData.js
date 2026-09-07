export const MOCK_STATS = {
  total_kb_records: 1250,
  standards_indexed: 450,
  bis_services: 12,
  consumer_services: 8,
  certification_rules: 15,
  faqs: 320,
}

export const MOCK_STANDARDS = [
  {
    standard_id: 'IS-456-2000',
    standard_number: 'IS 456:2000',
    title: 'Plain and Reinforced Concrete - Code of Practice',
    description: 'This standard covers plain and reinforced concrete in general. It gives methods of design of concrete structures, including limit state method.',
    category: 'Construction Material',
    applicability: 'Structural engineers, contractors, builders, and civil engineers working with concrete structures in India.',
    related_service: 'Product Certification (Scheme I)',
    keywords: ['concrete', 'cement', 'reinforced', 'structural', 'construction', 'building'],
    source: 'BIS Standards Database',
  },
  {
    standard_id: 'IS-15658-2006',
    standard_number: 'IS 15658:2006',
    title: 'High Strength Strands for Pre-stressed Concrete',
    description: 'This standard specifies requirements for high strength steel strands used in pre-stressed concrete construction.',
    category: 'Construction Material',
    applicability: 'Pre-stressed concrete manufacturers and construction companies.',
    related_service: 'Product Certification (Scheme I)',
    keywords: ['pre-stressed', 'concrete', 'steel', 'strands', 'construction'],
    source: 'BIS Standards Database',
  },
  {
    standard_id: 'IS-10322-2017',
    standard_number: 'IS 10322:2017',
    title: 'LED Lamps for General Purpose Lighting - Specifications',
    description: 'This standard prescribes requirements for LED lamps for general lighting purposes including performance, safety, and testing methods.',
    category: 'Electrical Product',
    applicability: 'LED lamp manufacturers, importers, and retailers selling LED lamps in India.',
    related_service: 'Compulsory Registration (CRS)',
    keywords: ['LED', 'lamp', 'lighting', 'energy', 'electrical', 'bulb'],
    source: 'BIS Standards Database',
  },
  {
    standard_id: 'IS-12269-2013',
    standard_number: 'IS 12269:2013',
    title: '53 Grade Ordinary Portland Cement - Specification',
    description: 'This standard prescribes the requirements for 53 grade ordinary Portland cement covering physical and chemical requirements.',
    category: 'Construction Material',
    applicability: 'Cement manufacturers and construction companies using 53 grade OPC.',
    related_service: 'Product Certification (Scheme I)',
    keywords: ['cement', 'OPC', '53 grade', 'construction', 'building material'],
    source: 'BIS Standards Database',
  },
  {
    standard_id: 'IS-1786-2008',
    standard_number: 'IS 1786:2008',
    title: 'High Strength Deformed Steel Bars and Wires',
    description: 'This standard covers high strength deformed steel bars and wires for use as reinforcement in concrete.',
    category: 'Construction Material',
    applicability: 'Steel manufacturers, construction companies, and structural engineers.',
    related_service: 'Product Certification (Scheme I)',
    keywords: ['steel', 'bars', 'reinforcement', 'concrete', 'TMT', 'deformed'],
    source: 'BIS Standards Database',
  },
  {
    standard_id: 'IS-302-2-3-2011',
    standard_number: 'IS 302-2-3:2011',
    title: 'Safety of Household and Similar Appliances - Particular Requirements for Electric Irons',
    description: 'Specifies safety requirements for electrically operated household irons including test methods.',
    category: 'Consumer Product',
    applicability: 'Electric iron manufacturers and importers in India.',
    related_service: 'Compulsory Registration (CRS)',
    keywords: ['electric', 'iron', 'appliance', 'safety', 'household'],
    source: 'BIS Standards Database',
  },
  {
    standard_id: 'IS-9873-2018',
    standard_number: 'IS 9873:2018',
    title: 'Safety of Toys - General Safety Requirements',
    description: 'Specifies general safety requirements for toys including mechanical, physical, chemical, and flammability requirements.',
    category: 'Consumer Product',
    applicability: 'Toy manufacturers, importers, and retailers.',
    related_service: 'Compulsory Registration (CRS)',
    keywords: ['toys', 'safety', 'children', 'consumer', 'play'],
    source: 'BIS Standards Database',
  },
  {
    standard_id: 'IS-2065-1998',
    standard_number: 'IS 2065:1998',
    title: 'Electric Instantaneous Water Heaters - Specifications',
    description: 'Covers requirements for electric instantaneous water heaters for domestic use including safety and performance.',
    category: 'Electrical Product',
    applicability: 'Water heater manufacturers and importers.',
    related_service: 'Product Certification (Scheme I)',
    keywords: ['water', 'heater', 'electric', 'domestic', 'geyser'],
    source: 'BIS Standards Database',
  },
  {
    standard_id: 'IS-14680-2017',
    standard_number: 'IS 14680:2017',
    title: 'Solar Photovoltaic Modules - Design Qualification and Type Approval',
    description: 'Specifies requirements for design qualification and type approval of crystalline silicon and thin-film PV modules.',
    category: 'Renewable Energy',
    applicability: 'Solar panel manufacturers and installers in India.',
    related_service: 'Product Certification (Scheme I)',
    keywords: ['solar', 'photovoltaic', 'PV', 'module', 'renewable', 'energy'],
    source: 'BIS Standards Database',
  },
  {
    standard_id: 'IS-16046-2015',
    standard_number: 'IS 16046:2015',
    title: 'Safety of Lithium Ion Cells and Batteries for Portable Applications',
    description: 'Covers safety requirements for secondary lithium ion cells and batteries used in portable electronic equipment.',
    category: 'Electrical Product',
    applicability: 'Battery manufacturers, mobile phone importers, consumer electronics companies.',
    related_service: 'Compulsory Registration (CRS)',
    keywords: ['lithium', 'battery', 'cell', 'portable', 'mobile', 'electronic'],
    source: 'BIS Standards Database',
  },
]

export const MOCK_SERVICES = [
  {
    service_id: 'svc-1',
    name: 'Product Certification (Scheme I)',
    description: 'ISI mark certification for mandatory BIS-certified products. Ensures product quality and safety compliance.',
    target_user: 'Manufacturers, Importers',
    category: 'Product Certification (Scheme I)',
  },
  {
    service_id: 'svc-2',
    name: 'Compulsory Registration (CRS)',
    description: 'Mandatory registration for electronics and IT products as per government notification.',
    target_user: 'Electronics Manufacturers',
    category: 'Compulsory Registration (CRS)',
  },
  {
    service_id: 'svc-3',
    name: 'Hallmarking',
    description: 'Gold and silver hallmarking certification to verify purity of precious metals.',
    target_user: 'Jewellers, Consumers',
    category: 'Hallmarking',
  },
  {
    service_id: 'svc-4',
    name: 'Laboratory Recognition',
    description: 'Recognition and accreditation of testing laboratories for BIS certification testing.',
    target_user: 'Testing Laboratories',
    category: 'Laboratory Recognition',
  },
  {
    service_id: 'svc-5',
    name: 'Foreign Manufacturers Certification (FMCS)',
    description: 'Certification scheme for foreign manufacturers to obtain BIS certification for products exported to India.',
    target_user: 'Foreign Manufacturers, Exporters',
    category: 'Foreign Manufacturers (FMCS)',
  },
  {
    service_id: 'svc-6',
    name: 'Standardization',
    description: 'Development and harmonization of Indian Standards with international standards.',
    target_user: 'Industry Bodies, Standards Committees',
    category: 'Standardization',
  },
  {
    service_id: 'svc-7',
    name: 'Verification',
    description: 'Verification of products to ensure conformity with relevant Indian Standards.',
    target_user: 'Manufacturers, Quality Assurance Teams',
    category: 'Verification',
  },
  {
    service_id: 'svc-8',
    name: 'Complaint Registration',
    description: 'Online complaint filing against substandard or non-compliant products sold in Indian market.',
    target_user: 'Consumers, Quality Watchdogs',
    category: 'Complaint',
  },
]

export const MOCK_SERVICE_DETAIL = {
  required_documents: [
    'Application form with prescribed fee',
    'Manufacturing process flow chart',
    'Test reports from BIS-recognized laboratory',
    'Quality management system documentation',
    'Factory license and registration certificate',
    'Product labels and packaging details',
  ],
  process_steps: [
    'Submit application online through BIS portal',
    'Pay prescribed application and audit fees',
    'Factory audit and product testing by BIS team',
    'Review and evaluation of test results',
    'Grant of license and ISI/CRS marking permission',
    'Surveillance audits and renewal as per schedule',
  ],
  keywords: ['certification', 'ISI mark', 'BIS license', 'product testing', 'quality', 'compliance'],
}

const PRODUCT_RULES = [
  {
    keywords: ['led', 'lamp', 'bulb', 'light', 'lighting'],
    category: 'Electrical Product',
    standards: [
      { standard_number: 'IS 10322:2017', title: 'LED Lamps for General Purpose Lighting - Specifications', category: 'Electrical Product' },
      { standard_number: 'IS 16102:2012', title: 'Safety of LED Lamps for Lighting Services', category: 'Electrical Product' },
    ],
    cert_rules: [{ title: 'Compulsory Registration Scheme (CRS)', description: 'LED lamps fall under CRS mandatory registration for electronics.', compliance_requirements: ['Product must be tested at BIS-recognized lab', 'Registration must be obtained before sale in India', 'Product must bear CRS marking and registration number'] }],
    services: [{ name: 'Compulsory Registration (CRS)', description: 'Mandatory registration for electronics and IT products' }],
    steps: ['Get product tested at a BIS-recognized laboratory', 'Submit application through BIS online portal', 'Obtain CRS registration number', 'Ensure product labeling meets BIS requirements'],
    score: 78,
  },
  {
    keywords: ['cement', 'opc', 'concrete'],
    category: 'Construction Material',
    standards: [
      { standard_number: 'IS 12269:2013', title: '53 Grade Ordinary Portland Cement - Specification', category: 'Construction Material' },
      { standard_number: 'IS 456:2000', title: 'Plain and Reinforced Concrete - Code of Practice', category: 'Construction Material' },
    ],
    cert_rules: [{ title: 'Product Certification (Scheme I)', description: 'Cement requires ISI mark certification under BIS Scheme I.', compliance_requirements: ['Product must conform to relevant IS standard', 'Factory must be licensed by BIS', 'Product must bear ISI mark with license number'] }],
    services: [{ name: 'Product Certification (Scheme I)', description: 'ISI mark certification for mandatory BIS-certified products' }],
    steps: ['Apply for BIS Scheme I certification', 'Submit product samples for testing', 'Complete factory audit by BIS', 'Obtain ISI mark license', 'Maintain quality records for surveillance'],
    score: 85,
  },
  {
    keywords: ['steel', 'bar', 'rebar', 'tmt', 'wire', 'rod'],
    category: 'Construction Material',
    standards: [
      { standard_number: 'IS 1786:2008', title: 'High Strength Deformed Steel Bars and Wires', category: 'Construction Material' },
    ],
    cert_rules: [{ title: 'Product Certification (Scheme I)', description: 'Steel bars require ISI mark certification.', compliance_requirements: ['Product must meet tensile and chemical requirements', 'Testing at BIS-recognized lab', 'Factory license from BIS required'] }],
    services: [{ name: 'Product Certification (Scheme I)', description: 'ISI mark for steel reinforcement products' }],
    steps: ['Test product at BIS-recognized lab', 'Apply for BIS Scheme I license', 'Complete factory inspection', 'Obtain ISI mark permission'],
    score: 82,
  },
  {
    keywords: ['iron', 'ironing', 'appliance'],
    category: 'Consumer Product',
    standards: [
      { standard_number: 'IS 302-2-3:2011', title: 'Safety of Household Appliances - Electric Irons', category: 'Consumer Product' },
    ],
    cert_rules: [{ title: 'Compulsory Registration Scheme (CRS)', description: 'Electric irons fall under CRS mandatory registration.', compliance_requirements: ['Safety testing at BIS-recognized lab', 'Online registration before sale', 'CRS marking on product'] }],
    services: [{ name: 'Compulsory Registration (CRS)', description: 'Mandatory registration for consumer electronics' }],
    steps: ['Get product safety tested', 'Register on BIS CRS portal', 'Obtain registration number', 'Apply CRS marking'],
    score: 75,
  },
  {
    keywords: ['toy', 'toys', 'children', 'kids', 'play'],
    category: 'Consumer Product',
    standards: [
      { standard_number: 'IS 9873:2018', title: 'Safety of Toys - General Safety Requirements', category: 'Consumer Product' },
    ],
    cert_rules: [{ title: 'Compulsory Registration Scheme (CRS)', description: 'Toys require mandatory BIS registration.', compliance_requirements: ['Safety testing for mechanical, physical, chemical hazards', 'Age-appropriate labeling', 'Registration before sale in India'] }],
    services: [{ name: 'Compulsory Registration (CRS)', description: 'Mandatory registration for toys' }],
    steps: ['Test at BIS-recognized lab for safety compliance', 'Submit CRS application', 'Ensure labeling meets requirements', 'Obtain registration number'],
    score: 70,
  },
  {
    keywords: ['solar', 'photovoltaic', 'pv', 'panel', 'module'],
    category: 'Renewable Energy',
    standards: [
      { standard_number: 'IS 14680:2017', title: 'Solar PV Modules - Design Qualification and Type Approval', category: 'Renewable Energy' },
    ],
    cert_rules: [{ title: 'Product Certification (Scheme I)', description: 'Solar modules require BIS type approval.', compliance_requirements: ['Type approval testing per IS 14680', 'Factory audit by BIS', 'ISI marking on approved modules'] }],
    services: [{ name: 'Product Certification (Scheme I)', description: 'Certification for solar energy products' }],
    steps: ['Submit modules for type approval testing', 'Complete factory audit', 'Obtain BIS type approval', 'Apply ISI marking'],
    score: 80,
  },
  {
    keywords: ['battery', 'lithium', 'cell', 'portable', 'mobile', 'power bank'],
    category: 'Electrical Product',
    standards: [
      { standard_number: 'IS 16046:2015', title: 'Safety of Lithium Ion Cells and Batteries', category: 'Electrical Product' },
    ],
    cert_rules: [{ title: 'Compulsory Registration Scheme (CRS)', description: 'Lithium batteries fall under CRS mandatory registration.', compliance_requirements: ['Safety testing at BIS lab', 'Registration before sale', 'Safety marking on product'] }],
    services: [{ name: 'Compulsory Registration (CRS)', description: 'Mandatory registration for battery products' }],
    steps: ['Test battery safety at BIS-recognized lab', 'Submit CRS registration', 'Obtain registration number', 'Apply safety markings'],
    score: 76,
  },
  {
    keywords: ['water heater', 'geyser', 'instantaneous'],
    category: 'Electrical Product',
    standards: [
      { standard_number: 'IS 2065:1998', title: 'Electric Instantaneous Water Heaters', category: 'Electrical Product' },
    ],
    cert_rules: [{ title: 'Product Certification (Scheme I)', description: 'Water heaters require ISI mark certification.', compliance_requirements: ['Safety and performance testing', 'Factory license from BIS', 'ISI mark on product'] }],
    services: [{ name: 'Product Certification (Scheme I)', description: 'ISI certification for electrical heating appliances' }],
    steps: ['Test product at BIS-recognized lab', 'Apply for Scheme I license', 'Complete factory audit', 'Obtain ISI mark'],
    score: 80,
  },
  {
    keywords: ['prestressed', 'strand', 'pre-stressed'],
    category: 'Construction Material',
    standards: [
      { standard_number: 'IS 15658:2006', title: 'High Strength Strands for Pre-stressed Concrete', category: 'Construction Material' },
    ],
    cert_rules: [{ title: 'Product Certification (Scheme I)', description: 'Pre-stressed strands require ISI certification.', compliance_requirements: ['Tensile strength testing', 'Factory audit by BIS', 'ISI marking'] }],
    services: [{ name: 'Product Certification (Scheme I)', description: 'ISI certification for construction materials' }],
    steps: ['Test product at BIS lab', 'Apply for BIS license', 'Complete factory inspection', 'Obtain ISI mark'],
    score: 83,
  },
]

const DEFAULT_COMPLIANCE = {
  standards: [
    { standard_number: 'IS 10322:2017', title: 'General Product Safety Requirements', category: 'General' },
  ],
  cert_rules: [{ title: 'Product Certification (Scheme I)', description: 'Many products sold in India require BIS certification.', compliance_requirements: ['Check if your product is under mandatory BIS certification list', 'Get product tested at BIS-recognized lab', 'Apply through BIS portal'] }],
  services: [{ name: 'Product Certification (Scheme I)', description: 'General BIS product certification' }],
  steps: ['Verify if your product requires mandatory BIS certification', 'Get product tested at a BIS-recognized lab', 'Submit application through BIS portal', 'Complete factory audit if applicable'],
  score: 65,
}

export function generateMockCompliance(payload) {
  const text = `${payload.product_name || ''} ${payload.category || ''} ${payload.intended_use || ''} ${payload.description || ''}`.toLowerCase()
  const matched = PRODUCT_RULES.find((r) => r.keywords.some((kw) => text.includes(kw))) || DEFAULT_COMPLIANCE

  const allFields = ['product_name', 'category', 'intended_use', 'manufacturer', 'country', 'description']
  const filled = allFields.filter((f) => payload[f] && payload[f].trim())
  const missing = allFields.filter((f) => !payload[f] || !payload[f].trim())
  const completeness = Math.round((filled.length / allFields.length) * 100)

  const detectedCategories = []
  if (payload.category) detectedCategories.push(payload.category)
  if (matched.category && !detectedCategories.includes(matched.category)) detectedCategories.push(matched.category)

  return {
    readiness_score: matched.score + Math.floor(completeness / 10),
    compliance_status: matched.score >= 80
      ? { color: 'green', label: 'Information Available — Likely Ready' }
      : matched.score >= 60
        ? { color: 'yellow', label: 'Further Verification Required' }
        : { color: 'red', label: 'Certification / Compliance Attention Required' },
    field_completeness: completeness,
    filled_fields: filled,
    detected_categories: detectedCategories,
    relevant_standards: matched.standards,
    applicable_certification_rules: matched.cert_rules,
    related_bis_services: matched.services,
    next_steps: matched.steps,
    missing_fields: missing,
    disclaimer: 'This is an AI-generated assessment. Please verify all compliance requirements with official BIS sources before making business decisions.',
  }
}

export const MOCK_CHAT_RESPONSE = {
  response: `Based on your query, here is the relevant information:

**BIS Certification Requirements**

For most products sold in India, BIS certification is mandatory under the following schemes:

1. **Scheme I (ISI Mark)** - For products listed under the BIS (Conformity to Assessment and Certification) Regulations
2. **Compulsory Registration Scheme (CRS)** - For electronics and IT products
3. **FMCS** - For foreign manufacturers

**Required Documents:**
- Application form
- Product test reports
- Manufacturing process details
- Quality management documentation
- Factory license

**Next Steps:**
1. Identify which BIS scheme applies to your product
2. Get your product tested at a BIS-recognized laboratory
3. Submit application through the BIS portal
4. Complete factory audit process

For specific product requirements, please share your product details.`,
  sources: [
    { title: 'BIS Certification Procedures', type: 'regulation' },
    { title: 'IS 10322:2017 - LED Standards', type: 'standard' },
  ],
  suggested_questions: [
    'What is the difference between Scheme I and CRS?',
    'How long does BIS certification take?',
    'What are the fees for BIS certification?',
  ],
  disclaimer: 'This information is for guidance purposes. Please verify with official BIS sources.',
  traceability: {
    user_intent: 'BIS certification requirements for products',
    retrieved_knowledge: {
      count: 5,
      source_types: ['standards', 'services', 'regulations'],
      source_files: ['bis_standards.json', 'certification_rules.json', 'bis_services.json'],
    },
    matched_items: [
      { type: 'standard', title: 'BIS Certification Procedures' },
      { type: 'service', title: 'Product Certification (Scheme I)' },
    ],
    response_method: 'RAG (Retrieval-Augmented Generation)',
    summary: 'Response generated using RAG pipeline with 5 records from 3 source types.',
  },
}
