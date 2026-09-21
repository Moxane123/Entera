import { SkillCategory, SkillItem, VerificationProfile } from '../types';

export const INITIAL_SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'tech',
    name: 'Technology',
    iconName: 'Cpu',
    description: 'Software development, cloud architecture, cybersecurity, data science, and systems engineering.',
    subcategories: ['Cloud Architecture', 'DevOps & SRE', 'Full-Stack Development', 'Cybersecurity', 'Machine Learning & AI', 'Mobile Development'],
    badgeColor: 'sky'
  },
  {
    id: 'engineering',
    name: 'Engineering',
    iconName: 'Settings',
    description: 'Mechanical, electrical, biomedical, robotics, aerospace, and chemical engineering disciplines.',
    subcategories: ['Mechanical Design', 'Embedded Systems', 'Robotics Automation', 'Civil & Structural', 'Power Systems', 'Chemical Processing'],
    badgeColor: 'blue'
  },
  {
    id: 'skilled-trades',
    name: 'Skilled Trades',
    iconName: 'Wrench',
    description: 'Electrical, plumbing, HVAC, welding, machining, and industrial maintenance.',
    subcategories: ['Electrical Systems', 'HVAC & Refrigeration', 'Precision Welding', 'Plumbing & Pipefitting', 'CNC Machining', 'Carpentry'],
    badgeColor: 'amber'
  },
  {
    id: 'construction',
    name: 'Construction',
    iconName: 'HardHat',
    description: 'General contracting, framing, masonry, heavy equipment operation, safety inspection, and surveying.',
    subcategories: ['Site Safety & OSHA', 'Structural Framing', 'Surveying & Geospatial', 'Heavy Machinery Operation', 'Commercial Project Management'],
    badgeColor: 'orange'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    iconName: 'Scissors',
    description: 'Apparel design, pattern making, tailoring, technical drapery, footwear, and textile development.',
    subcategories: ['Pattern Drafting & Draping', 'Technical Garment Production', 'Haute Couture Tailoring', 'Textile Science', 'Footwear Design'],
    badgeColor: 'rose'
  },
  {
    id: 'beauty',
    name: 'Beauty',
    iconName: 'Sparkles',
    description: 'Cosmetology, aesthetics, medical skincare, specialized haircare, permanent makeup, and nail artistry.',
    subcategories: ['Clinical Aesthetics', 'Advanced Hair Coloring', 'Medical Spa Treatment', 'Permanent Makeup (PMU)', 'Nail Prosthetics & Art'],
    badgeColor: 'pink'
  },
  {
    id: 'creative',
    name: 'Creative',
    iconName: 'Palette',
    description: 'Digital design, animation, 3D modeling, cinematography, sound engineering, and creative direction.',
    subcategories: ['Product & UI/UX Design', '3D Animation & VFX', 'Sound Engineering', 'Cinematography & Lighting', 'Brand Identity Systems'],
    badgeColor: 'purple'
  },
  {
    id: 'business',
    name: 'Business',
    iconName: 'Briefcase',
    description: 'Operations, executive leadership, product management, strategic negotiations, and organizational design.',
    subcategories: ['Product Management', 'Operations Scaling', 'Supply Chain Logistics', 'M&A Negotiation', 'Strategic Management'],
    badgeColor: 'indigo'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    iconName: 'Megaphone',
    description: 'Performance marketing, brand storytelling, conversion rate optimization, growth analytics, and SEO/SEM.',
    subcategories: ['Growth Analytics & CAC', 'Brand Storytelling', 'Technical SEO', 'Performance Media Buying', 'Public Relations'],
    badgeColor: 'emerald'
  },
  {
    id: 'events',
    name: 'Events',
    iconName: 'CalendarCheck',
    description: 'Live event production, conference logistics, crowd safety management, audiovisual staging, and hospitality orchestration.',
    subcategories: ['Live Production Staging', 'Crowd Safety & Permitting', 'Broadcast Audio/Video', 'Hospitality Logistics', 'Festival Operations'],
    badgeColor: 'teal'
  },
  {
    id: 'education',
    name: 'Education',
    iconName: 'GraduationCap',
    description: 'Curriculum development, instructional design, STEM pedagogy, corporate training, and neurodivergent learning.',
    subcategories: ['Instructional Design', 'STEM Pedagogy', 'Adaptive Learning Strategies', 'Corporate Learning & Dev', 'Assessment Formulation'],
    badgeColor: 'violet'
  },
  {
    id: 'finance',
    name: 'Finance',
    iconName: 'DollarSign',
    description: 'Financial modeling, risk analysis, actuarial science, audit accounting, and algorithmic trading.',
    subcategories: ['Financial Modeling & LBO', 'Forensic Accounting', 'Risk Management & Basel III', 'Tax Strategy', 'Actuarial Analysis'],
    badgeColor: 'emerald'
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    iconName: 'Sprout',
    description: 'Agronomy, hydroponics, soil microbiology, livestock management, and precision drone farming.',
    subcategories: ['Precision Soil Agronomy', 'Hydroponics & Controlled Ag', 'Crop Pathology & IPM', 'Livestock Health & Breeding', 'Agricultural Robotics'],
    badgeColor: 'lime'
  },
  {
    id: 'automotive',
    name: 'Automotive',
    iconName: 'Car',
    description: 'EV powertrain diagnostics, ECU tuning, engine rebuilding, ADAS calibration, and collision repair.',
    subcategories: ['EV High-Voltage Powertrains', 'Advanced Diagnostic Scan', 'Engine Rebuilding & Bluepr.', 'ADAS Sensor Calibration', 'Transmission Systems'],
    badgeColor: 'red'
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    iconName: 'Utensils',
    description: 'Executive culinary arts, master sommelier cellar management, luxury hotel operations, and food safety inspection.',
    subcategories: ['Executive Culinary Arts', 'Sommelier & Wine Curation', 'Luxury Property Operations', 'HACCP Food Safety Audit', 'Cocktail Mixology'],
    badgeColor: 'amber'
  },
  {
    id: 'other-practical',
    name: 'Other Practical Skills',
    iconName: 'Compass',
    description: 'Emergency medicine, maritime navigation, aviation maintenance, forensic investigation, and specialized crafts.',
    subcategories: ['Wilderness First Response', 'Maritime Navigation', 'Aviation Avionics Inspection', 'Restoration Horology', 'Locksmithing & Physical Sec'],
    badgeColor: 'slate'
  }
];

export const INITIAL_SKILLS: SkillItem[] = [
  {
    id: 'skill-tech-cloud-arch',
    name: 'Cloud Infrastructure & High-Availability Architecture',
    slug: 'cloud-infrastructure-architecture',
    categoryId: 'tech',
    categoryName: 'Technology',
    subcategory: 'Cloud Architecture',
    description: 'Design, provision, and maintain multi-region, disaster-resilient cloud architectures utilizing Infrastructure as Code (Terraform), Kubernetes orchestration, and zero-trust security topologies.',
    availableLevels: ['Intermediate', 'Advanced', 'Master / Specialist'],
    activeStatus: 'active',
    verificationStatus: 'verified',
    tags: ['Terraform', 'Kubernetes', 'AWS/GCP', 'Zero-Trust', 'Multi-Region'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-03-01T14:30:00Z',
    verificationProfile: {
      id: 'vp-cloud-arch-adv',
      profileName: 'Advanced Cloud Architect Verification Profile',
      targetSkillLevel: 'Advanced',
      availableMethods: [
        {
          id: 'vm-1',
          type: 'credential_document',
          name: 'Professional Cloud Certification',
          description: 'Official verified certificate from AWS (Solutions Architect Pro), GCP (Professional Cloud Architect), or CKA.',
          isRequired: true,
          weightPercentage: 20
        },
        {
          id: 'vm-2',
          type: 'practical_task',
          name: 'High-Availability Sandbox Deployment',
          description: 'Deploy an automated multi-AZ Terraform script meeting 99.99% uptime benchmark with simulated node failover.',
          isRequired: true,
          weightPercentage: 40
        },
        {
          id: 'vm-3',
          type: 'knowledge_assessment',
          name: 'Scenario & Architecture Resilience Exam',
          description: 'Proctored 60-minute technical evaluation covering network partitioning, latency budgets, and disaster recovery.',
          isRequired: true,
          weightPercentage: 25
        },
        {
          id: 'vm-4',
          type: 'supervisor_attestation',
          name: 'Principal Engineer Attestation',
          description: 'Attestation from an active CTO, VP of Infrastructure, or Principal Architect confirming production oversight.',
          isRequired: false,
          weightPercentage: 15
        }
      ],
      requiredMethods: ['credential_document', 'practical_task', 'knowledge_assessment'],
      optionalMethods: ['supervisor_attestation', 'peer_confirmation'],
      evidenceRequirements: [
        {
          id: 'ev-1',
          title: 'Official Cloud Provider Certification or License',
          description: 'Verifiable digital credential URL or signed PDF from AWS, Google Cloud, or CNCF credential portal.',
          acceptedFormats: ['PDF', 'Credly URL', 'Official Verification Link'],
          minFilesCount: 1,
          maxFilesCount: 3,
          requiresOfficialIssuerVerification: true,
          sampleDocumentDescription: 'AWS Certified Solutions Architect Professional badge / certificate ID.',
          isMandatory: true
        },
        {
          id: 'ev-2',
          title: 'Infrastructure-as-Code Repository Artifacts',
          description: 'Public or reviewed GitHub repository link containing modular Terraform/OpenTofu and Helm definitions.',
          acceptedFormats: ['Git Repository URL', 'ZIP Archive', 'Architecture Diagram (PDF)'],
          minFilesCount: 1,
          maxFilesCount: 5,
          requiresOfficialIssuerVerification: false,
          sampleDocumentDescription: 'Clean IaC repository with README, cost estimations, and automated terraform-compliance tests.',
          isMandatory: true
        }
      ],
      assessmentRequirements: {
        enabled: true,
        title: 'Distributed Systems & Cloud Fault Tolerance Assessment',
        format: 'Scenario Simulation',
        durationMinutes: 60,
        questionCount: 35,
        passingScorePercentage: 82,
        maxAttemptsAllowed: 2,
        coolingPeriodDays: 14,
        isProctored: true,
        proctoringNotes: 'Browser lockdown mode with randomized network disruption scenarios.'
      },
      practicalTaskRequirements: {
        enabled: true,
        taskTitle: 'Zero-Downtime Chaos Engineering Challenge',
        taskDescription: 'You will receive a containerized e-commerce microservices cluster. You must configure auto-scaling policies, ingress load balancing, secret encryption, and survive an automated chaos test killing 50% of application pods without request failure.',
        expectedDeliverables: [
          'Terraform / OpenTofu deployment scripts',
          'Kubernetes Helm Chart definitions with HPA and PodDisruptionBudgets',
          'Prometheus / Grafana latency and error budget dashboard export',
          'Post-mortem architectural writeup (max 2 pages)'
        ],
        evaluationRubric: [
          { criteria: 'High Availability & Failover', points: 35, description: 'Zero 5xx errors returned during automated chaos injection.' },
          { criteria: 'Security & Secret Segregation', points: 25, description: 'Zero plain-text secrets; RBAC strictly adheres to least privilege.' },
          { criteria: 'Cost & Resource Efficiency', points: 20, description: 'Appropriate compute sizing and spot/preemptible strategy.' },
          { criteria: 'Observability & Telemetry', points: 20, description: 'Clear alerting thresholds and distributed trace instrumentation.' }
        ],
        submissionFormat: 'Git Repository link + 5-minute Loom walkthrough',
        estimatedHoursToComplete: 4,
        reviewedBy: 'Independent Industry Assessor'
      },
      confirmationRequirements: {
        enabled: true,
        requiredConfirmationsCount: 1,
        eligibleSignersDescription: 'Principal SRE, VP of Engineering, or Staff Cloud Architect with 7+ years proven track record.',
        requireIdentityVerification: true,
        attestationPrompt: 'I verify that the applicant has architected and managed production systems sustaining mission-critical traffic.',
        verificationExpiryMonths: 24
      },
      passingCriteria: {
        overallMinScorePercentage: 80,
        mustPassAllMandatoryEvidence: true,
        mustPassAssessment: true,
        mustPassPracticalTask: true,
        mustPassConfirmation: false,
        evaluatorConsensusRequired: 'Single Certified Reviewer',
        rubricSummary: 'Applicant must achieve at least 82% on the simulation exam and score ≥80/100 on the practical chaos engineering task.'
      },
      validityPeriodMonths: 24,
      validityPeriodLabel: '2 Years',
      reVerificationRequirements: {
        requiresFullRetake: false,
        ceCreditsRequired: 20,
        refresherAssessment: true,
        updatedWorkEvidenceRequired: true,
        instructions: 'Submit proof of ongoing production oversight or cloud vendor recertification within 90 days before expiry.'
      }
    }
  },
  {
    id: 'skill-trade-master-electrician',
    name: 'Master Industrial & Commercial Electrician',
    slug: 'master-industrial-electrician',
    categoryId: 'skilled-trades',
    categoryName: 'Skilled Trades',
    subcategory: 'Electrical Systems',
    description: 'Install, troubleshoot, and certify three-phase power distribution, motor control centers (MCC), PLC wiring, transformers, and industrial switchgear in compliance with NEC and NFPA 70E standards.',
    availableLevels: ['Intermediate', 'Advanced', 'Master / Specialist'],
    activeStatus: 'active',
    verificationStatus: 'verified',
    tags: ['NEC Compliance', 'Three-Phase Power', 'NFPA 70E', 'PLC Control', 'Switchgear'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-02-18T16:00:00Z',
    verificationProfile: {
      id: 'vp-master-electrician-mstr',
      profileName: 'Master Electrician Trade Verification Profile',
      targetSkillLevel: 'Master / Specialist',
      availableMethods: [
        {
          id: 'vm-elec-1',
          type: 'credential_document',
          name: 'State / Jurisdictional Master License',
          description: 'Government-issued Master Electrician or Journeyman Electrical license with active good standing.',
          isRequired: true,
          weightPercentage: 30
        },
        {
          id: 'vm-elec-2',
          type: 'practical_task',
          name: 'Live 480V Control Panel Wiring & Schematic Diagnostic',
          description: 'In-person or recorded multi-camera demonstration of conduit bending, motor starter wiring, and fault finding.',
          isRequired: true,
          weightPercentage: 40
        },
        {
          id: 'vm-elec-3',
          type: 'knowledge_assessment',
          name: 'National Electrical Code (NEC) Code Mastery Exam',
          description: 'Open-book 90-minute examination on conductor sizing, transformer calculations, and arc-flash protection.',
          isRequired: true,
          weightPercentage: 20
        },
        {
          id: 'vm-elec-4',
          type: 'supervisor_attestation',
          name: 'Union Business Agent or Licensed Electrical Inspector Attestation',
          description: 'Formal sign-off confirming 8,000+ verifiable hours of industrial installation.',
          isRequired: true,
          weightPercentage: 10
        }
      ],
      requiredMethods: ['credential_document', 'practical_task', 'knowledge_assessment', 'supervisor_attestation'],
      optionalMethods: ['peer_confirmation'],
      evidenceRequirements: [
        {
          id: 'ev-elec-1',
          title: 'Active Master Electrician License or Red Seal Certification',
          description: 'Clear photograph or scanned copy of the state-issued license showing license number, expiration date, and jurisdiction.',
          acceptedFormats: ['PDF', 'High-Resolution JPG / PNG'],
          minFilesCount: 1,
          maxFilesCount: 2,
          requiresOfficialIssuerVerification: true,
          sampleDocumentDescription: 'State Electrical Licensing Board official card.',
          isMandatory: true
        },
        {
          id: 'ev-elec-2',
          title: 'Proof of NFPA 70E Arc Flash Safety Training',
          description: 'Current certification of arc flash electrical safety compliance within the last 3 years.',
          acceptedFormats: ['PDF', 'Certificate Image'],
          minFilesCount: 1,
          maxFilesCount: 2,
          requiresOfficialIssuerVerification: true,
          sampleDocumentDescription: 'NFPA 70E or OSHA 30 Construction safety certification.',
          isMandatory: true
        }
      ],
      assessmentRequirements: {
        enabled: true,
        title: 'NEC Industrial Calculations & Arc-Flash Hazard Examination',
        format: 'Multiple Choice & Case Study',
        durationMinutes: 90,
        questionCount: 50,
        passingScorePercentage: 85,
        maxAttemptsAllowed: 2,
        coolingPeriodDays: 30,
        isProctored: true,
        proctoringNotes: 'Calculators and current NEC codebook permitted; no external browser tabs.'
      },
      practicalTaskRequirements: {
        enabled: true,
        taskTitle: 'Three-Phase Motor Control Center (MCC) Troubleshooting',
        taskDescription: 'Diagnose an injected open-phase and ground-fault condition in a 480V 3-phase motor starter circuit with start/stop latching relays. Demonstrate Lockout/Tagout (LOTO) protocols, multimeter safety, and wire replacement.',
        expectedDeliverables: [
          'Safety checklist with calibrated multimeter verification',
          'Correctly identified open-phase root cause report',
          'Single-line schematic revision reflecting repairs',
          'Photographic evidence of finished neat wiring adhering to wire trough fill limits'
        ],
        evaluationRubric: [
          { criteria: 'LOTO & Electrical Safety Protocol', points: 40, description: 'Zero safety violations; proper PPE and zero-energy test.' },
          { criteria: 'Fault Isolation Speed & Method', points: 30, description: 'Logical systematic troubleshooting using voltage drop & resistance.' },
          { criteria: 'Workmanship & Code Conformance', points: 30, description: 'Wire labels, torque specs on lugs, and neat conduit entries.' }
        ],
        submissionFormat: 'Proctored in-person test or 3-camera verified video assessment',
        estimatedHoursToComplete: 3,
        reviewedBy: 'Certified Master Verifier'
      },
      confirmationRequirements: {
        enabled: true,
        requiredConfirmationsCount: 1,
        eligibleSignersDescription: 'Licensed Master Electrician, Municipal Electrical Inspector, or Master Signatory Contractor.',
        requireIdentityVerification: true,
        attestationPrompt: 'I confirm that this tradesperson possesses master-level competency, safety adherence, and independent field oversight ability.',
        verificationExpiryMonths: 36
      },
      passingCriteria: {
        overallMinScorePercentage: 85,
        mustPassAllMandatoryEvidence: true,
        mustPassAssessment: true,
        mustPassPracticalTask: true,
        mustPassConfirmation: true,
        evaluatorConsensusRequired: 'Single Certified Reviewer',
        rubricSummary: 'Must obtain 100% on the safety section of the practical task, ≥85% overall, and positive attestation from licensed inspector.'
      },
      validityPeriodMonths: 36,
      validityPeriodLabel: '3 Years',
      reVerificationRequirements: {
        requiresFullRetake: false,
        ceCreditsRequired: 16,
        refresherAssessment: true,
        updatedWorkEvidenceRequired: false,
        instructions: 'Submit 16 hours of approved NEC Code update continuing education units prior to the 3-year renewal.'
      }
    }
  },
  {
    id: 'skill-auto-diagnostic-tech',
    name: 'Advanced EV & Hybrid Automotive Diagnostic Specialist',
    slug: 'ev-hybrid-automotive-diagnostic',
    categoryId: 'automotive',
    categoryName: 'Automotive',
    subcategory: 'EV High-Voltage Powertrains',
    description: 'Diagnose high-voltage battery management systems (BMS), inverter isolation faults, CAN/LIN bus communication collapses, and regenerative braking actuators across modern electric vehicles.',
    availableLevels: ['Intermediate', 'Advanced', 'Master / Specialist'],
    activeStatus: 'active',
    verificationStatus: 'verified',
    tags: ['High-Voltage EV', 'Battery Management', 'CAN Bus', 'Oscilloscope', 'Isolation Faults'],
    createdAt: '2024-02-01T11:00:00Z',
    updatedAt: '2024-02-28T10:00:00Z',
    verificationProfile: {
      id: 'vp-ev-tech-adv',
      profileName: 'EV Master Diagnostic Profile',
      targetSkillLevel: 'Advanced',
      availableMethods: [
        {
          id: 'vm-auto-1',
          type: 'credential_document',
          name: 'ASE L3 (Light Duty Hybrid/Electric) or Equivalent',
          description: 'Official National Institute for Automotive Service Excellence (ASE) certification in L3 or factory master credential.',
          isRequired: true,
          weightPercentage: 25
        },
        {
          id: 'vm-auto-2',
          type: 'practical_task',
          name: 'Oscilloscope CAN Bus & High-Voltage De-energizing Test',
          description: 'Hands-on isolation test: demonstrate 1,000V rated glove inspection, HV interlock loop (HVIL) test, and 4-channel scope trace.',
          isRequired: true,
          weightPercentage: 45
        },
        {
          id: 'vm-auto-3',
          type: 'knowledge_assessment',
          name: 'High Voltage Powertrain & BMS Diagnostics Exam',
          description: '60-minute diagnostic case exam evaluating thermal runaway protection, cell balancing algorithms, and insulation resistance math.',
          isRequired: true,
          weightPercentage: 20
        },
        {
          id: 'vm-auto-4',
          type: 'peer_confirmation',
          name: 'Master Tech / Dealership Shop Foreman Endorsement',
          description: 'Confirmation from ASE Master Tech verifying 3+ years active shop diagnostic experience.',
          isRequired: false,
          weightPercentage: 10
        }
      ],
      requiredMethods: ['credential_document', 'practical_task', 'knowledge_assessment'],
      optionalMethods: ['peer_confirmation', 'supervisor_attestation'],
      evidenceRequirements: [
        {
          id: 'ev-auto-1',
          title: 'ASE L3 or OEM Master EV Certification Record',
          description: 'Direct ASE verification myASE credential link or authorized OEM dealership certification certificate.',
          acceptedFormats: ['PDF', 'myASE URL', 'High-Resolution Scan'],
          minFilesCount: 1,
          maxFilesCount: 3,
          requiresOfficialIssuerVerification: true,
          sampleDocumentDescription: 'ASE transcript showing active L3 status and high-voltage safety credentials.',
          isMandatory: true
        },
        {
          id: 'ev-auto-2',
          title: 'Diagnostic Case Logbook / PicoScope Waveform Files',
          description: 'Three real-world diagnostic case studies with raw oscilloscope waveforms (.psdata or exported CSV/PDF).',
          acceptedFormats: ['PicoScope Data (.psdata)', 'PDF Case Study Report', 'Images'],
          minFilesCount: 1,
          maxFilesCount: 5,
          requiresOfficialIssuerVerification: false,
          sampleDocumentDescription: 'Waveform capturing CAN High/Low distortion, terminating resistor calculation, and repair proof.',
          isMandatory: true
        }
      ],
      assessmentRequirements: {
        enabled: true,
        title: 'High-Voltage EV Architecture & Diagnostic Exam',
        format: 'Scenario Simulation',
        durationMinutes: 60,
        questionCount: 40,
        passingScorePercentage: 80,
        maxAttemptsAllowed: 3,
        coolingPeriodDays: 14,
        isProctored: true,
        proctoringNotes: 'Includes interactive oscilloscope waveform reading simulations.'
      },
      practicalTaskRequirements: {
        enabled: true,
        taskTitle: 'HV Battery Pack Isolation Fault & Bus Troubleshooting',
        taskDescription: 'Given an EV vehicle with an isolation fault DTC (megohm resistance < 100 ohms/volt), utilize a megohmmeter (Megger) to locate the ground fault among modules while strictly following NFPA 70E high-voltage safety protocols.',
        expectedDeliverables: [
          'Safety protocol execution video / live review (Glove air-leak check, Cat III 1000V meter validation)',
          'Megohmmeter test logs indicating exact module failure location',
          'CAN bus decoding sheet with decoded hex packet IDs',
          'Final verified safe re-energizing procedure'
        ],
        evaluationRubric: [
          { criteria: 'High Voltage Safety & PPE Discipline', points: 40, description: 'Zero tolerance for improper de-energizing or uncertified test leads.' },
          { criteria: 'Systematic Fault Tree Analysis', points: 30, description: 'Direct isolation of the fault without unnecessary component replacement.' },
          { criteria: 'Oscilloscope & Meter Proficiency', points: 30, description: 'Accurate time-base and voltage-scale adjustments on scope traces.' }
        ],
        submissionFormat: 'Live Shop Practical Assessment or Verified High-Definition Video Log',
        estimatedHoursToComplete: 3,
        reviewedBy: 'Certified Master Verifier'
      },
      confirmationRequirements: {
        enabled: true,
        requiredConfirmationsCount: 1,
        eligibleSignersDescription: 'ASE Master Automotive Technician, OEM Service Director, or Senior Fleet Maintenance Supervisor.',
        requireIdentityVerification: true,
        attestationPrompt: 'I confirm that this technician works independently and safely with high-voltage battery systems and vehicle electronics.',
        verificationExpiryMonths: 24
      },
      passingCriteria: {
        overallMinScorePercentage: 82,
        mustPassAllMandatoryEvidence: true,
        mustPassAssessment: true,
        mustPassPracticalTask: true,
        mustPassConfirmation: false,
        evaluatorConsensusRequired: 'Single Certified Reviewer',
        rubricSummary: 'Zero infractions on high-voltage PPE, ≥80% on the theoretical exam, and successful megohmmeter isolation test.'
      },
      validityPeriodMonths: 24,
      validityPeriodLabel: '2 Years',
      reVerificationRequirements: {
        requiresFullRetake: false,
        ceCreditsRequired: 12,
        refresherAssessment: true,
        updatedWorkEvidenceRequired: true,
        instructions: 'Complete 12 hours of manufacturer EV safety updates and submit one recent advanced diagnostic case report.'
      }
    }
  },
  {
    id: 'skill-fashion-pattern-maker',
    name: 'Couture Pattern Drafting & Technical Apparel Construction',
    slug: 'couture-pattern-drafting',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    subcategory: 'Pattern Drafting & Draping',
    description: 'Transform complex 2D sketches into production-ready 3D graded patterns using flat pattern drafting, live dress form draping, and digital CAD tools (Clo3D/Optitex), with complete construction tech packs.',
    availableLevels: ['Intermediate', 'Advanced', 'Master / Specialist'],
    activeStatus: 'active',
    verificationStatus: 'verified',
    tags: ['Clo3D', 'Pattern Draping', 'Grading', 'Tech Packs', 'Couture Tailoring'],
    createdAt: '2024-02-10T14:00:00Z',
    updatedAt: '2024-03-05T12:00:00Z',
    verificationProfile: {
      id: 'vp-fashion-pattern-adv',
      profileName: 'Technical Apparel & Pattern Drafting Profile',
      targetSkillLevel: 'Advanced',
      availableMethods: [
        {
          id: 'vm-fash-1',
          type: 'portfolio_demonstration',
          name: 'Couture Pattern & Finished Garment Portfolio',
          description: 'Submission of 3 fully executed original garments with pattern pieces, seam allowance details, and fit adjustments.',
          isRequired: true,
          weightPercentage: 40
        },
        {
          id: 'vm-fash-2',
          type: 'practical_task',
          name: 'Timed 3D CAD / Live Form Draping Task',
          description: 'Create a tailored asymmetrical jacket pattern from a technical illustration within 6 hours, including digital tech pack.',
          isRequired: true,
          weightPercentage: 40
        },
        {
          id: 'vm-fash-3',
          type: 'knowledge_assessment',
          name: 'Textile Behavior & Grading Calculation Exam',
          description: 'Evaluation covering fabric grainlines, bias stretch coefficients, ASTM sizing standards, and production seam tolerances.',
          isRequired: true,
          weightPercentage: 20
        }
      ],
      requiredMethods: ['portfolio_demonstration', 'practical_task', 'knowledge_assessment'],
      optionalMethods: ['peer_confirmation'],
      evidenceRequirements: [
        {
          id: 'ev-fash-1',
          title: 'Comprehensive Garment Tech Pack Documentation',
          description: 'Full manufacturing tech pack including Bill of Materials (BOM), point-of-measure (POM) graded specs, and stitch types (ISO 4915).',
          acceptedFormats: ['PDF Document', 'Figma / Illustrator Vector Tech Pack'],
          minFilesCount: 1,
          maxFilesCount: 4,
          requiresOfficialIssuerVerification: false,
          sampleDocumentDescription: 'Production-ready tech pack with construction callouts and grade rule table across sizes 2-16.',
          isMandatory: true
        },
        {
          id: 'ev-fash-2',
          title: 'High-Resolution Photography of Interior & Exterior Seams',
          description: 'Macro photos showing French seams, bound edges, canvas pad-stitching, and balanced sleeve pitch.',
          acceptedFormats: ['JPG / PNG High Res', 'Portfolio Web Link'],
          minFilesCount: 4,
          maxFilesCount: 15,
          requiresOfficialIssuerVerification: false,
          sampleDocumentDescription: 'Close-up photos of lining finishes, zipper insertion, and collar roll on a mannequin.',
          isMandatory: true
        }
      ],
      assessmentRequirements: {
        enabled: true,
        title: 'Textile Physics, Grading & Pattern Mathematics Exam',
        format: 'Open Response Rubric',
        durationMinutes: 60,
        questionCount: 30,
        passingScorePercentage: 80,
        maxAttemptsAllowed: 2,
        coolingPeriodDays: 14,
        isProctored: false,
        proctoringNotes: 'Includes calculation questions on shrinkage allowance and directional nap yield optimization.'
      },
      practicalTaskRequirements: {
        enabled: true,
        taskTitle: 'Asymmetrical Tailored Lapel & Sleeve Pattern Drafting',
        taskDescription: 'From a provided architectural sketch, draft a structured jacket pattern featuring an asymmetrical peak lapel, two-piece curved sleeve, and floating chest canvas. Submit export in DXF-AAMA or Clo3D project file with rendered drape.',
        expectedDeliverables: [
          'Digital pattern file (.dxf or .zprj Clo3D) with grainlines and notches marked',
          'Fabric cutting layout with calculated marker efficiency (>82%)',
          'Muslin toile fit analysis photos showing balance line alignment',
          'Summary of ease allowances applied for wool crepe'
        ],
        evaluationRubric: [
          { criteria: 'Fit Balance & Grainline Truing', points: 35, description: 'Center front and grainlines hang vertically without twisting or pulling.' },
          { criteria: 'Technical Marker Efficiency & Grading', points: 25, description: 'Efficient layout minimizing fabric waste; clean grading curves.' },
          { criteria: 'Internal Structure & Craftsmanship', points: 25, description: 'Lapel roll line and shoulder canvas properly engineered.' },
          { criteria: 'Tech Pack Completeness', points: 15, description: 'Precise tolerance limits and unambiguous stitch callouts.' }
        ],
        submissionFormat: 'Digital Pattern Archive (DXF/Clo3D) + PDF Tech Pack + Fit Photos',
        estimatedHoursToComplete: 6,
        reviewedBy: 'Independent Industry Assessor'
      },
      confirmationRequirements: {
        enabled: false,
        requiredConfirmationsCount: 0,
        eligibleSignersDescription: 'Head Pattern Maker, Atelier Director, or Technical Apparel Director.',
        requireIdentityVerification: false,
        attestationPrompt: ''
      },
      passingCriteria: {
        overallMinScorePercentage: 80,
        mustPassAllMandatoryEvidence: true,
        mustPassAssessment: true,
        mustPassPracticalTask: true,
        mustPassConfirmation: false,
        evaluatorConsensusRequired: 'Single Certified Reviewer',
        rubricSummary: 'Requires ≥80% score on the practical pattern and tech pack evaluation by an accredited atelier assessor.'
      },
      validityPeriodMonths: 0, // Lifetime
      validityPeriodLabel: 'Non-expiring (Lifetime)',
      reVerificationRequirements: {
        requiresFullRetake: false,
        refresherAssessment: false,
        updatedWorkEvidenceRequired: false,
        instructions: 'Foundational craft principles are non-expiring once formally verified.'
      }
    }
  },
  {
    id: 'skill-beauty-clinical-aesthetician',
    name: 'Advanced Clinical Aesthetics & Dermal Therapy',
    slug: 'advanced-clinical-aesthetics',
    categoryId: 'beauty',
    categoryName: 'Beauty',
    subcategory: 'Clinical Aesthetics',
    description: 'Perform advanced medical-grade chemical exfoliation, microneedling (collagen induction therapy), dermaplaning, laser skin resurfacing safety, and customized barrier repair protocols in compliance with sanitation standards.',
    availableLevels: ['Intermediate', 'Advanced', 'Master / Specialist'],
    activeStatus: 'active',
    verificationStatus: 'verified',
    tags: ['Microneedling', 'Chemical Peels', 'Dermaplaning', 'Skin Biology', 'Bloodborne Pathogens'],
    createdAt: '2024-02-15T09:30:00Z',
    updatedAt: '2024-03-02T11:00:00Z',
    verificationProfile: {
      id: 'vp-beauty-aesthetician-adv',
      profileName: 'Clinical Aesthetics Verification Profile',
      targetSkillLevel: 'Advanced',
      availableMethods: [
        {
          id: 'vm-bty-1',
          type: 'credential_document',
          name: 'State Esthetician / Dermal Therapist License',
          description: 'Active license issued by the State Board of Cosmetology or national licensing authority with zero disciplinary actions.',
          isRequired: true,
          weightPercentage: 30
        },
        {
          id: 'vm-bty-2',
          type: 'practical_task',
          name: 'Live Aseptic Field & Microneedling Protocol Execution',
          description: 'Live or video proctored demonstration of medical disinfection, skin depth calibration, post-procedure occlusion, and disposal.',
          isRequired: true,
          weightPercentage: 40
        },
        {
          id: 'vm-bty-3',
          type: 'knowledge_assessment',
          name: 'Dermal Pathology, Contraindications & Fitzpatrick Scale Exam',
          description: 'Exam on skin phototypes (Fitzpatrick I-VI), erythema management, chemical peel pH/pKa dynamics, and infectious pathogens.',
          isRequired: true,
          weightPercentage: 20
        },
        {
          id: 'vm-bty-4',
          type: 'supervisor_attestation',
          name: 'Medical Director (Dermatologist / Plastic Surgeon) Endorsement',
          description: 'Signed statement from a supervising MD confirming safe clinical practice.',
          isRequired: false,
          weightPercentage: 10
        }
      ],
      requiredMethods: ['credential_document', 'practical_task', 'knowledge_assessment'],
      optionalMethods: ['supervisor_attestation'],
      evidenceRequirements: [
        {
          id: 'ev-bty-1',
          title: 'State Master Esthetician or Cosmetology Board License',
          description: 'Legible copy of current license showing state verification URL and expiry date.',
          acceptedFormats: ['PDF', 'High-Res Photo'],
          minFilesCount: 1,
          maxFilesCount: 2,
          requiresOfficialIssuerVerification: true,
          sampleDocumentDescription: 'State Cosmetology / Dermal Therapy Board official credential.',
          isMandatory: true
        },
        {
          id: 'ev-bty-2',
          title: 'OSHA Bloodborne Pathogens & Infection Control Certificate',
          description: 'Accredited certificate completed within the last 12 months.',
          acceptedFormats: ['PDF', 'JPG'],
          minFilesCount: 1,
          maxFilesCount: 2,
          requiresOfficialIssuerVerification: true,
          sampleDocumentDescription: 'Current OSHA 29 CFR 1910.1030 certificate.',
          isMandatory: true
        }
      ],
      assessmentRequirements: {
        enabled: true,
        title: 'Clinical Dermatology & Chemical Formulations Assessment',
        format: 'Multiple Choice & Case Study',
        durationMinutes: 45,
        questionCount: 35,
        passingScorePercentage: 85,
        maxAttemptsAllowed: 2,
        coolingPeriodDays: 21,
        isProctored: true,
        proctoringNotes: 'Focuses heavily on contraindications (e.g., Accutane, active herpes simplex, keloid propensity).'
      },
      practicalTaskRequirements: {
        enabled: true,
        taskTitle: 'Aseptic Technique, Consultation & Chemical Treatment Protocol',
        taskDescription: 'Conduct a client intake consultation for Fitzpatrick IV skin with post-inflammatory hyperpigmentation (PIH). Prepare an aseptic medical tray, explain prep neutralizers, apply a modified Jessner peel, and outline aftercare instructions.',
        expectedDeliverables: [
          'Client consultation chart with Fitzpatrick analysis and medical screening',
          'Video of sterile field setup, glove exchange, and eye safety draping',
          'Step-by-step treatment log documenting peel timing and frost evaluation',
          'Emergency adverse-reaction management protocol sheet'
        ],
        evaluationRubric: [
          { criteria: 'Infection Control & Cross-Contamination Prevention', points: 40, description: 'Flawless aseptic field; zero touch contamination of non-sterile surfaces.' },
          { criteria: 'Fitzpatrick Phototype Safety Analysis', points: 30, description: 'Appropriate choice of acids avoiding hyperpigmentation triggering.' },
          { criteria: 'Client Communication & Aftercare Formulation', points: 30, description: 'Clear warning on sun exposure, barrier repair, and SPF reapplication.' }
        ],
        submissionFormat: 'Recorded 20-minute procedure video + Patient Chart PDF',
        estimatedHoursToComplete: 2,
        reviewedBy: 'Certified Master Verifier'
      },
      confirmationRequirements: {
        enabled: true,
        requiredConfirmationsCount: 1,
        eligibleSignersDescription: 'Board Certified Dermatologist, Plastic Surgeon, or Medical Spa Director.',
        requireIdentityVerification: true,
        attestationPrompt: 'I attest that this aesthetician maintains exemplary hygiene, clinical judgment, and patient safety standards.',
        verificationExpiryMonths: 24
      },
      passingCriteria: {
        overallMinScorePercentage: 85,
        mustPassAllMandatoryEvidence: true,
        mustPassAssessment: true,
        mustPassPracticalTask: true,
        mustPassConfirmation: false,
        evaluatorConsensusRequired: 'Single Certified Reviewer',
        rubricSummary: 'Zero tolerance for any violation of sterile field rules; ≥85% score across consultation and practical.'
      },
      validityPeriodMonths: 24,
      validityPeriodLabel: '2 Years',
      reVerificationRequirements: {
        requiresFullRetake: false,
        ceCreditsRequired: 14,
        refresherAssessment: true,
        updatedWorkEvidenceRequired: false,
        instructions: 'Renew OSHA Bloodborne certification and submit proof of 14 hours of advanced dermal continuing education.'
      }
    }
  },
  {
    id: 'skill-agri-precision-agronomist',
    name: 'Precision Soil Agronomist & Crop Health Consultant',
    slug: 'precision-soil-agronomy',
    categoryId: 'agriculture',
    categoryName: 'Agriculture',
    subcategory: 'Precision Soil Agronomy',
    description: 'Formulate precision variable-rate nutrient prescription maps (VRA), interpret multi-spectral NDVI satellite and drone imagery, diagnose crop micronutrient deficiencies, and engineer regenerative soil microbiome restoration plans.',
    availableLevels: ['Intermediate', 'Advanced', 'Master / Specialist'],
    activeStatus: 'active',
    verificationStatus: 'verified',
    tags: ['Soil Microbiology', 'NDVI Drone', 'Variable Rate', 'GIS / AgTech', 'Crop Pathology'],
    createdAt: '2024-02-18T08:00:00Z',
    updatedAt: '2024-03-01T15:00:00Z',
    verificationProfile: {
      id: 'vp-agri-agronomist-adv',
      profileName: 'Certified Precision Agronomist Profile',
      targetSkillLevel: 'Advanced',
      availableMethods: [
        {
          id: 'vm-agr-1',
          type: 'credential_document',
          name: 'Certified Crop Adviser (CCA) or Agronomy Degree',
          description: 'Official CCA certification from the American Society of Agronomy or degree in Soil Science/Agronomy.',
          isRequired: true,
          weightPercentage: 25
        },
        {
          id: 'vm-agr-2',
          type: 'practical_task',
          name: 'Multi-Zone Variable Rate Prescription Mapping (VRA)',
          description: 'Ingest 500-acre electro-conductivity (EC) and grid soil test data to generate shapefiles for tractor rate controllers.',
          isRequired: true,
          weightPercentage: 45
        },
        {
          id: 'vm-agr-3',
          type: 'knowledge_assessment',
          name: 'Soil Chemistry, Cation Exchange (CEC) & Pathology Exam',
          description: 'Detailed assessment covering base saturation math, phosphorus fixation, nitrogen leaching mitigation, and fungi identification.',
          isRequired: true,
          weightPercentage: 20
        },
        {
          id: 'vm-agr-4',
          type: 'peer_confirmation',
          name: 'Lead Agronomist or Co-op Director Endorsement',
          description: 'Peer sign-off confirming successful field advisory recommendations on commercial acreage.',
          isRequired: false,
          weightPercentage: 10
        }
      ],
      requiredMethods: ['credential_document', 'practical_task', 'knowledge_assessment'],
      optionalMethods: ['peer_confirmation', 'supervisor_attestation'],
      evidenceRequirements: [
        {
          id: 'ev-agr-1',
          title: 'Certified Crop Adviser (CCA) Credential or University Diploma',
          description: 'Verifiable CCA certificate or university diploma in Soil Science, Agronomy, or Plant Pathology.',
          acceptedFormats: ['PDF', 'Credential URL'],
          minFilesCount: 1,
          maxFilesCount: 2,
          requiresOfficialIssuerVerification: true,
          sampleDocumentDescription: 'American Society of Agronomy active CCA verification number.',
          isMandatory: true
        },
        {
          id: 'ev-agr-2',
          title: 'Sample Nutrient Management Plan & Soil Test Analysis',
          description: 'Anonymized full-season nutrient management plan with soil chemistry breakdowns and leaf tissue analysis reports.',
          acceptedFormats: ['PDF Report', 'GIS Shapefile / GeoJSON'],
          minFilesCount: 1,
          maxFilesCount: 3,
          requiresOfficialIssuerVerification: false,
          sampleDocumentDescription: 'Comprehensive soil report detailing CEC, organic matter %, pH, and targeted potash/phosphate application.',
          isMandatory: true
        }
      ],
      assessmentRequirements: {
        enabled: true,
        title: 'Soil Science, Fertilizer Calculations & Plant Pathology Assessment',
        format: 'Scenario Simulation',
        durationMinutes: 75,
        questionCount: 40,
        passingScorePercentage: 80,
        maxAttemptsAllowed: 2,
        coolingPeriodDays: 21,
        isProctored: true,
        proctoringNotes: 'Includes calculating fertilizer blend ratios (e.g. Urea, DAP, Potash) for target yield goals.'
      },
      practicalTaskRequirements: {
        enabled: true,
        taskTitle: 'Precision Variable Rate Nitrogen & Lime Prescription Project',
        taskDescription: 'Given spatial grid soil samples (pH 5.2 to 6.8, organic matter 1.8% to 4.5%) and yield history across 400 acres, create a multi-zone variable rate lime application map and in-season side-dress nitrogen strategy that limits environmental runoff.',
        expectedDeliverables: [
          'GIS Prescription Maps in Shapefile / GeoJSON compatible with John Deere / Trimble controllers',
          'Nitrogen mass-balance budget factoring in mineralization, cover crops, and soil CEC',
          'Environmental stewardship report ensuring compliance with regional watershed water quality rules',
          'Economic ROI projection comparing uniform vs. variable rate application'
        ],
        evaluationRubric: [
          { criteria: 'Nutrient Math & Lime Buffering Index', points: 35, description: 'Accurate calculations preventing over-liming and micronutrient lockout.' },
          { criteria: 'GIS Data Formatting & Controller Compatibility', points: 25, description: 'Valid attribute tables with rate columns matching agricultural equipment specs.' },
          { criteria: 'Environmental Leaching Mitigation', points: 25, description: 'Effective split-application strategy matching plant uptake curves.' },
          { criteria: 'Clarity of Farm Advisory Deliverable', points: 15, description: 'Actionable instructions for farm operators with machine calibration guidance.' }
        ],
        submissionFormat: 'Zip archive containing GIS shapefiles + PDF advisory report',
        estimatedHoursToComplete: 5,
        reviewedBy: 'Independent Industry Assessor'
      },
      confirmationRequirements: {
        enabled: true,
        requiredConfirmationsCount: 1,
        eligibleSignersDescription: 'Certified Professional Agronomist (CPAg), Ag Extension Agent, or Senior Research Agronomist.',
        requireIdentityVerification: true,
        attestationPrompt: 'I confirm that this agronomist develops reliable, scientifically rigorous crop recommendations and stewardship plans.',
        verificationExpiryMonths: 24
      },
      passingCriteria: {
        overallMinScorePercentage: 80,
        mustPassAllMandatoryEvidence: true,
        mustPassAssessment: true,
        mustPassPracticalTask: true,
        mustPassConfirmation: false,
        evaluatorConsensusRequired: 'Single Certified Reviewer',
        rubricSummary: 'Requires ≥80% score across chemical calculations and valid geospatial prescription deliverables.'
      },
      validityPeriodMonths: 24,
      validityPeriodLabel: '2 Years',
      reVerificationRequirements: {
        requiresFullRetake: false,
        ceCreditsRequired: 40,
        refresherAssessment: false,
        updatedWorkEvidenceRequired: true,
        instructions: 'Accumulate 40 continuing education units approved by the International Certified Crop Adviser board every 2 years.'
      }
    }
  },
  {
    id: 'skill-hosp-master-sommelier',
    name: 'Master Sommelier & Wine Cellar Management',
    slug: 'master-sommelier-cellar-management',
    categoryId: 'hospitality',
    categoryName: 'Hospitality',
    subcategory: 'Sommelier & Wine Curation',
    description: 'Expert blind tasting identification, global appellation law (AOC/DOCG/AVA), food-and-wine sensory pairing design, commercial cellar inventory management, rare vintage provenance verification, and high-volume dining room decanting service.',
    availableLevels: ['Intermediate', 'Advanced', 'Master / Specialist'],
    activeStatus: 'active',
    verificationStatus: 'verified',
    tags: ['Blind Tasting', 'Appellation Law', 'Cellar Management', 'Decanting', 'Vintage Provenance'],
    createdAt: '2024-02-22T10:00:00Z',
    updatedAt: '2024-03-04T16:00:00Z',
    verificationProfile: {
      id: 'vp-hosp-sommelier-mstr',
      profileName: 'Master Sommelier Verification Profile',
      targetSkillLevel: 'Master / Specialist',
      availableMethods: [
        {
          id: 'vm-som-1',
          type: 'credential_document',
          name: 'Court of Master Sommeliers (CMS) or WSET Level 4 Diploma',
          description: 'Certified or Advanced Sommelier diploma from Court of Master Sommeliers or WSET Level 4.',
          isRequired: true,
          weightPercentage: 25
        },
        {
          id: 'vm-som-2',
          type: 'practical_task',
          name: 'Live Deductive Blind Tasting & Decanting Service Exam',
          description: 'Identification of 6 classic grape varieties, region of origin, and vintage in a timed 25-minute deductive tasting grid.',
          isRequired: true,
          weightPercentage: 45
        },
        {
          id: 'vm-som-3',
          type: 'knowledge_assessment',
          name: 'Global Viticulture, Vinification & Appellation Mastery Exam',
          description: 'Exhaustive written exam on soil profiles, pruning methods, clonal selections, and strict regional wine decrees worldwide.',
          isRequired: true,
          weightPercentage: 20
        },
        {
          id: 'vm-som-4',
          type: 'supervisor_attestation',
          name: 'Master Sommelier (MS) or Michelin-Starred Beverage Director Sign-off',
          description: 'Formal endorsement of candidate beverage program leadership.',
          isRequired: true,
          weightPercentage: 10
        }
      ],
      requiredMethods: ['credential_document', 'practical_task', 'knowledge_assessment', 'supervisor_attestation'],
      optionalMethods: ['peer_confirmation'],
      evidenceRequirements: [
        {
          id: 'ev-som-1',
          title: 'CMS / WSET Level 3 or 4 Diploma Certificate',
          description: 'Official diploma from Court of Master Sommeliers or Wine & Spirit Education Trust.',
          acceptedFormats: ['PDF', 'Certificate Photo'],
          minFilesCount: 1,
          maxFilesCount: 2,
          requiresOfficialIssuerVerification: true,
          sampleDocumentDescription: 'Official parchment showing graduate registration number.',
          isMandatory: true
        },
        {
          id: 'ev-som-2',
          title: 'Curated 100+ Bottle Beverage Program & Tasting Menu Pairing Sheet',
          description: 'Full restaurant beverage list designed by applicant including margin pricing calculations, cellar temperature logs, and wine-food harmony logic.',
          acceptedFormats: ['PDF Document'],
          minFilesCount: 1,
          maxFilesCount: 3,
          requiresOfficialIssuerVerification: false,
          sampleDocumentDescription: 'Complete 12-page dining room wine list with regional sub-headings and glass pour margins.',
          isMandatory: true
        }
      ],
      assessmentRequirements: {
        enabled: true,
        title: 'Global Viticulture & Appellation Jurisprudence Examination',
        format: 'Oral & Technical Exam',
        durationMinutes: 60,
        questionCount: 45,
        passingScorePercentage: 85,
        maxAttemptsAllowed: 2,
        coolingPeriodDays: 30,
        isProctored: true,
        proctoringNotes: 'Live audio/video oral questioning covering producer specifics, sub-appellations, and distillation laws.'
      },
      practicalTaskRequirements: {
        enabled: true,
        taskTitle: 'Deductive Blind Tasting & Table-Side Vintage Port Decanting',
        taskDescription: 'Execute standard Court of Master Sommeliers deductive tasting on 6 unknown wines (3 white, 3 red) within 25 minutes. Follow immediately with opening an aged vintage Port with candle flame decanting and proper sediment separation.',
        expectedDeliverables: [
          'Deductive tasting grid filled out adhering to CMS grid standards (Sight, Nose, Palate, Initial Conclusion, Final Conclusion)',
          'High-definition video of decanting service adhering to dining room etiquette and glass positioning',
          'Flawless cork extraction without crumb fall or bottle agitation'
        ],
        evaluationRubric: [
          { criteria: 'Deductive Tasting Accuracy', points: 40, description: 'Correct identification of structural elements (acidity, alcohol, tannin, oak) and grape variety.' },
          { criteria: 'Service Technique & Sediment Separation', points: 30, description: 'Candle positioning, steady pour, and table posture.' },
          { criteria: 'Beverage Pairing & Temperature Knowledge', points: 30, description: 'Sensory justification for food matches and glass shape pairings.' }
        ],
        submissionFormat: 'In-person examination or 2-camera proctored video recording',
        estimatedHoursToComplete: 2,
        reviewedBy: 'Certified Master Verifier'
      },
      confirmationRequirements: {
        enabled: true,
        requiredConfirmationsCount: 1,
        eligibleSignersDescription: 'Master Sommelier (MS), Master of Wine (MW), or Michelin Star General Manager.',
        requireIdentityVerification: true,
        attestationPrompt: 'I verify that this candidate demonstrates exemplary palate accuracy, gracious hospitality, and cellar governance.',
        verificationExpiryMonths: 36
      },
      passingCriteria: {
        overallMinScorePercentage: 85,
        mustPassAllMandatoryEvidence: true,
        mustPassAssessment: true,
        mustPassPracticalTask: true,
        mustPassConfirmation: true,
        evaluatorConsensusRequired: '2 of 3 Consensus',
        rubricSummary: 'Applicant must achieve ≥85% on the deductive tasting and pass both oral defense and table-side service without procedural error.'
      },
      validityPeriodMonths: 36,
      validityPeriodLabel: '3 Years',
      reVerificationRequirements: {
        requiresFullRetake: false,
        ceCreditsRequired: 20,
        refresherAssessment: true,
        updatedWorkEvidenceRequired: true,
        instructions: 'Submit active cellar inventory oversight records and complete a periodic blind-tasting refresher session.'
      }
    }
  }
];
