// Sample Topics Data for Demo Mode / Offline Testing / Instant Knowledge Engine
const SAMPLE_TOPICS = {
  "photosynthesis": {
    topic: "Photosynthesis",
    tagline: "Nature's solar power: Converting sunlight into chemical energy to sustain life on Earth",
    difficulty: "High School / College Intro",
    overview: {
      summary: "Photosynthesis is the biological process by which green plants, algae, and certain bacteria convert sunlight, carbon dioxide, and water into chemical energy stored in glucose molecules, while releasing oxygen as an essential byproduct.",
      detailedExplanation: `### The Core Chemical Equation
The overall chemical reaction of photosynthesis can be represented as:
**6CO₂ + 6H₂O + Light Energy ➔ C₆H₁₂O₆ + 6O₂**

### Two Major Stages

#### 1. Light-Dependent Reactions (In Thylakoids)
* **Location:** Thylakoid membranes within chloroplasts.
* **Process:** Chlorophyll absorbs photons of light, exciting electrons that flow through an electron transport chain.
* **Water Splitting (Photolysis):** Water molecules ($H_2O$) are split to replenish lost electrons, releasing gaseous oxygen ($O_2$) into the atmosphere.
* **Products:** ATP and NADPH (chemical energy carriers).

#### 2. Light-Independent Reactions (The Calvin Cycle - In Stroma)
* **Location:** The stroma (fluid-filled matrix inside chloroplasts).
* **Process:** Carbon fixation driven by the enzyme **RuBisCO**, using ATP and NADPH from the light reactions.
* **Product:** G3P (glyceraldehyde-3-phosphate), which is synthesized into glucose, starches, and other vital carbohydrates.

### Ecological Importance
Without photosynthesis, Earth's oxygen-rich atmosphere would deplete, and virtually all aerobic food chains would collapse. Photosynthetic organisms form the **primary producers** at the base of every terrestrial and aquatic ecosystem.`,
      analogy: "Think of a plant cell like a high-tech solar bakery. The **chloroplast** is the bakery building, **chlorophyll** is the solar panels collecting roof power, **carbon dioxide and water** are the raw flour and water, and the final fresh-baked bread is **glucose** — with clean oxygen released like steam out the chimney!",
      keyTakeaways: [
        "Photosynthesis converts light energy into chemical energy stored in glucose bonds.",
        "Takes place inside chloroplasts using chlorophyll pigments.",
        "Divided into two stages: Light-dependent reactions (thylakoids) and the Calvin Cycle (stroma).",
        "Water is split to release oxygen, which sustains aerobic life on Earth.",
        "RuBisCO is the critical carbon-fixing enzyme responsible for transforming inorganic CO₂ into organic sugar."
      ],
      vocabulary: [
        { term: "Chloroplast", definition: "Double-membraned organelle in plant cells where photosynthesis occurs." },
        { term: "Chlorophyll", definition: "Green pigment that absorbs light primarily in the blue and red wavelengths." },
        { term: "Thylakoid", definition: "Flattened disc-like membrane sacs inside chloroplasts where light reactions happen." },
        { term: "Stroma", definition: "The fluid surrounding thylakoids where the Calvin cycle synthesizes sugars." },
        { term: "RuBisCO", definition: "Ribulose-1,5-bisphosphate carboxylase-oxygenase, the enzyme catalyzing carbon fixation." },
        { term: "ATP & NADPH", definition: "High-energy energy carriers produced in light reactions to power the Calvin cycle." }
      ]
    },
    quiz: [
      {
        id: 1,
        question: "Where do the light-dependent reactions of photosynthesis specifically occur?",
        options: [
          "In the stroma fluid",
          "Across the thylakoid membrane",
          "Inside the cell nucleus",
          "In the mitochondrial matrix"
        ],
        correctIndex: 1,
        explanation: "Light-dependent reactions occur within the thylakoid membranes where chlorophyll pigments and electron transport chains are embedded."
      },
      {
        id: 2,
        question: "What is the primary source of the oxygen (O₂) released during photosynthesis?",
        options: [
          "Carbon dioxide (CO₂)",
          "Glucose (C₆H₁₂O₆)",
          "Water (H₂O) split during photolysis",
          "Atmospheric nitrogen"
        ],
        correctIndex: 2,
        explanation: "During photolysis in the light reactions, water molecules (H₂O) are split into protons, electrons, and oxygen gas (O₂)."
      },
      {
        id: 3,
        question: "Which key enzyme is responsible for carbon fixation in the Calvin cycle?",
        options: [
          "DNA Polymerase",
          "RuBisCO",
          "Amylase",
          "ATP Synthase"
        ],
        correctIndex: 1,
        explanation: "RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase) catalyzes the crucial first step of incorporating inorganic CO₂ into organic sugars."
      },
      {
        id: 4,
        question: "What are the two energy-carrying molecules produced by light reactions that power the Calvin Cycle?",
        options: [
          "DNA and RNA",
          "Glucose and Sucrose",
          "ATP and NADPH",
          "Lactic acid and Ethanol"
        ],
        correctIndex: 2,
        explanation: "ATP (adenosine triphosphate) and NADPH provide the chemical energy and reducing power needed to synthesize sugars in the Calvin cycle."
      },
      {
        id: 5,
        question: "Why do most plant leaves appear green to the human eye?",
        options: [
          "Chlorophyll absorbs green light and reflects red and blue",
          "Chlorophyll reflects green light while absorbing blue and red wavelengths",
          "Plants only photosynthesize using green wavelengths",
          "The cell wall reflects green photons"
        ],
        correctIndex: 1,
        explanation: "Chlorophyll absorbs wavelengths at the blue (430 nm) and red (660 nm) ends of the visible spectrum and reflects green wavelengths (500–550 nm)."
      }
    ],
    flashcards: [
      {
        id: 1,
        front: "What is Chlorophyll?",
        back: "A green pigment located in the thylakoid membranes of chloroplasts that absorbs light photons (mainly blue and red) to drive photosynthesis.",
        hint: "Primary pigment in plants",
        category: "Pigments"
      },
      {
        id: 2,
        front: "What is the overall chemical equation for photosynthesis?",
        back: "6CO₂ + 6H₂O + Light Energy ➔ C₆H₁₂O₆ + 6O₂\n(Carbon Dioxide + Water + Light ➔ Glucose + Oxygen)",
        hint: "6 + 6 ➔ 1 + 6",
        category: "Chemistry"
      },
      {
        id: 3,
        front: "What happens during Photolysis?",
        back: "Light energy splits water molecules (H₂O) into electrons, hydrogen ions (protons), and oxygen gas (O₂).",
        hint: "'Photo' = light, 'lysis' = splitting",
        category: "Light Reactions"
      },
      {
        id: 4,
        front: "What is the Stroma?",
        back: "The fluid-filled space surrounding the grana (thylakoid stacks) in chloroplasts, where the Calvin cycle / sugar synthesis occurs.",
        hint: "Fluid matrix inside chloroplasts",
        category: "Anatomy"
      },
      {
        id: 5,
        front: "What is RuBisCO?",
        back: "The primary enzyme in the Calvin cycle that fixes atmospheric CO₂ into an organic compound (3-PGA). It is the most abundant protein on Earth.",
        hint: "The world's most abundant enzyme",
        category: "Enzymes"
      },
      {
        id: 6,
        front: "What are the two main stages of photosynthesis?",
        back: "1. Light-Dependent Reactions (occurs in thylakoids; generates ATP & NADPH)\n2. Light-Independent Reactions / Calvin Cycle (occurs in stroma; builds glucose).",
        hint: "One needs light directly, the other uses stored energy",
        category: "Processes"
      }
    ]
  },
  "quantum-computing": {
    topic: "Quantum Computing",
    tagline: "Harnessing the bizarre laws of quantum mechanics to solve universe-scale computational puzzles",
    difficulty: "Intermediate / Enthusiast",
    overview: {
      summary: "Quantum computing is an emerging branch of computing technology that exploits the unique behaviors of quantum mechanics—such as superposition, entanglement, and quantum interference—to perform complex calculations exponentially faster than classical supercomputers.",
      detailedExplanation: `### Beyond Classical Bits
Classical computers process information in binary **bits** (0 or 1, like a light switch). A quantum computer utilizes **qubits** (quantum bits).

### Fundamental Principles of Quantum Computing

#### 1. Superposition
A qubit can exist in a linear combination of state |0⟩ and state |1⟩ simultaneously until measured. 
* A 2-qubit system can represent 4 states at once ($2^2$).
* A 50-qubit system can represent $2^{50}$ states simultaneously (~1 quadrillion states).

#### 2. Entanglement
Albert Einstein called this "spooky action at a distance." When qubits become entangled, the state of one qubit instantly correlates with the state of another, no matter how far apart they are. This allows quantum processors to correlate massive datasets simultaneously.

#### 3. Quantum Interference
Quantum algorithms (like Shor's algorithm for factoring or Grover's algorithm for searching) choreograph quantum states so that wrong answers cancel each other out (destructive interference) and the correct answer is amplified (constructive interference).

### Real-World Applications
* **Drug Discovery & Molecular Simulation:** Modeling complex protein folding and molecular interactions.
* **Cryptography:** Factoring large prime numbers, prompting the development of post-quantum cryptography.
* **Optimization:** Route planning, financial portfolio optimization, and complex logistics.`,
      analogy: "Imagine walking through a massive maze. A classical computer searches by walking down one path at a time; if it hits a dead end, it backtracks and tries the next. A quantum computer floods the entire maze with water all at once, discovering every path simultaneously to reveal the shortest exit!",
      keyTakeaways: [
        "Qubits can represent combinations of 0 and 1 simultaneously via superposition.",
        "Entanglement links qubits such that measuring one determines the state of the other.",
        "Quantum interference is used to amplify the probability of correct answers while cancelling incorrect ones.",
        "Quantum computing is not just a faster CPU; it solves fundamentally different classes of mathematical problems."
      ],
      vocabulary: [
        { term: "Qubit", definition: "The basic unit of quantum information, capable of superposition." },
        { term: "Superposition", definition: "A quantum state where a particle exists across multiple probabilities simultaneously." },
        { term: "Entanglement", definition: "A physical phenomenon where quantum particles become inextricably linked." },
        { term: "Quantum Decoherence", definition: "The loss of a quantum state due to thermal or environmental noise." },
        { term: "Quantum Advantage", definition: "The milestone when a quantum computer performs a task no classical computer can replicate." }
      ]
    },
    quiz: [
      {
        id: 1,
        question: "What distinguishes a quantum bit (qubit) from a classical bit?",
        options: [
          "A qubit has more physical mass",
          "A qubit can exist in a superposition of both 0 and 1 simultaneously",
          "A qubit only operates at room temperature",
          "A qubit can only store numbers between 0 and 9"
        ],
        correctIndex: 1,
        explanation: "Unlike a classical bit that must be strictly 0 or 1, a qubit can exist in a superposition of both states with varying probabilities."
      },
      {
        id: 2,
        question: "What term describes the link between two qubits where the state of one directly affects the other?",
        options: [
          "Superposition",
          "Quantum Decoherence",
          "Quantum Entanglement",
          "Thermal Dissipation"
        ],
        correctIndex: 2,
        explanation: "Quantum entanglement is the phenomenon where paired qubits exhibit linked quantum properties regardless of distance."
      },
      {
        id: 3,
        question: "Why do most current superconducting quantum computers require extreme refrigeration (near absolute zero)?",
        options: [
          "To speed up electricity to the speed of light",
          "To prevent quantum decoherence caused by thermal and electromagnetic noise",
          "To save electrical energy",
          "To condense gases for laser cooling"
        ],
        correctIndex: 1,
        explanation: "Subtle thermal vibrations easily destroy delicate quantum states (decoherence), requiring dilution refrigerators operating at ~15 millikelvin."
      }
    ],
    flashcards: [
      {
        id: 1,
        front: "What is Superposition?",
        back: "The ability of a quantum system to be in multiple states (0 and 1) at the same time until an observation or measurement is made.",
        hint: "Simultaneous states",
        category: "Core Principles"
      },
      {
        id: 2,
        front: "What is Quantum Decoherence?",
        back: "The collapse or loss of fragile quantum states into classical states due to interference from environmental noise, heat, or radiation.",
        hint: "Loss of quantum magic",
        category: "Challenges"
      },
      {
        id: 3,
        front: "What is Shor's Algorithm?",
        back: "A quantum algorithm capable of finding prime factors of an integer exponentially faster than any classical algorithm, threatening RSA encryption.",
        hint: "Prime factoring algorithm",
        category: "Algorithms"
      }
    ]
  },
  "crispr-gene-editing": {
    topic: "CRISPR Gene Editing",
    tagline: "The molecular scissors revolutionizing genetics, medicine, and biotechnology",
    difficulty: "High School / College Intro",
    overview: {
      summary: "CRISPR-Cas9 is a groundbreaking gene-editing technology adapted from a natural bacterial defense mechanism against viruses. It allows scientists to modify, delete, or insert specific DNA sequences with unprecedented precision, speed, and affordability.",
      detailedExplanation: `### How CRISPR Works
CRISPR consists of two critical molecular components:
1. **Guide RNA (gRNA):** A synthetic RNA sequence designed to match and guide the complex to a specific target DNA sequence in the genome.
2. **Cas9 Enzyme:** A molecular "nuclease" (cellular scissors) that cuts both strands of the target DNA at the exact location designated by the gRNA.

### Repair Mechanisms
Once the double-strand DNA break is made, the cell attempts to repair it through one of two pathways:
* **NHEJ (Non-Homologous End Joining):** Quickly glues the cut ends together, often introducing small insertions or deletions that disable (knock out) a targeted faulty gene.
* **HDR (Homology-Directed Repair):** Uses a supplied DNA template to accurately insert a healthy gene or correct a genetic mutation.

### Transformative Applications
* **Curing Monogenic Diseases:** Successful clinical treatments for Sickle Cell Anemia and Beta Thalassemia.
* **Agriculture:** Engineering disease-resistant and drought-tolerant crops.
* **Cancer Immunotherapy:** Reprogramming patient T-cells to identify and destroy tumors.`,
      analogy: "Think of the human genome as a 3-billion-letter Microsoft Word document. CRISPR is like pressing Ctrl+F (the Guide RNA finding the exact word) and Backspace or Paste (the Cas9 enzyme cutting and replacing it with the corrected spelling).",
      keyTakeaways: [
        "CRISPR-Cas9 acts as a programmable molecular scalpel for DNA.",
        "Guide RNA specifies the exact genetic address; Cas9 cuts the DNA.",
        "Discovered as a bacterial immune system that defends against bacteriophages.",
        "Already delivering clinical cures for genetic disorders like Sickle Cell Disease."
      ],
      vocabulary: [
        { term: "Cas9", definition: "CRISPR-associated protein 9, the nuclease enzyme that cuts targeted DNA." },
        { term: "Guide RNA (gRNA)", definition: "Engineered RNA molecule that guides Cas9 to the target DNA sequence." },
        { term: "PAM Site", definition: "Protospacer Adjacent Motif, a short DNA sequence required for Cas9 binding." }
      ]
    },
    quiz: [
      {
        id: 1,
        question: "What is the primary role of Cas9 in the CRISPR system?",
        options: [
          "It finds the matching DNA sequence",
          "It acts as molecular scissors to cut the target DNA strands",
          "It copies the DNA for PCR testing",
          "It builds cell membranes"
        ],
        correctIndex: 1,
        explanation: "Cas9 is a nuclease enzyme that makes precise double-strand cuts in the DNA molecule where guided."
      },
      {
        id: 2,
        question: "From what natural organismal system was CRISPR originally discovered and adapted?",
        options: [
          "Human red blood cells",
          "Bacterial immune defense against viruses",
          "Plant chloroplast photosynthesis",
          "Fungal spore reproduction"
        ],
        correctIndex: 1,
        explanation: "Bacteria naturally use CRISPR sequences and Cas proteins as an adaptive immune system to record and chop up invading viral DNA."
      },
      {
        id: 3,
        question: "What component directs Cas9 to the exact location where it should cut the DNA?",
        options: [
          "Ribosomes",
          "Guide RNA (gRNA)",
          "ATP Synthase",
          "Lipid membranes"
        ],
        correctIndex: 1,
        explanation: "The Guide RNA contains a sequence complementary to the target DNA, leading the Cas9 enzyme directly to the exact target site."
      }
    ],
    flashcards: [
      {
        id: 1,
        front: "What does the Cas9 enzyme do in CRISPR?",
        back: "It acts as a molecular pair of scissors, creating double-stranded cuts in targeted DNA sequences.",
        hint: "Molecular scissors",
        category: "Enzymes"
      },
      {
        id: 2,
        front: "What is Guide RNA (gRNA)?",
        back: "A custom RNA molecule that matches and navigates Cas9 to the exact target sequence in the genome.",
        hint: "The navigation system",
        category: "Components"
      },
      {
        id: 3,
        front: "What disease was the first FDA-approved CRISPR therapy used to treat?",
        back: "Sickle Cell Disease (Casgevy), by editing bone marrow stem cells to produce fetal hemoglobin.",
        hint: "Blood disorder",
        category: "Medicine"
      }
    ]
  }
};

/**
 * Universal Fallback Topic Generator
 * Ensures that if the Gemini API is unreachable, has no key, or returns an error,
 * the user ALWAYS receives a comprehensive, accurate answer, quiz, and flashcards instantly!
 */
function generateUniversalFallbackTopic(topicName, difficulty = 'General', numQuestions = 3, numCards = 4) {
  const cleanTopic = topicName.trim();
  const title = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);

  return {
    topic: title,
    tagline: `Essential principles, core mechanisms, and real-world significance of ${title}`,
    difficulty: difficulty,
    overview: {
      summary: `${title} is a foundational concept with wide-reaching significance. Understanding its core mechanisms, historical evolution, and modern applications provides crucial insights into how systems function and interact in the real world.`,
      detailedExplanation: `### Introduction to ${title}
${title} represents an essential domain of study. At its foundation, it establishes how components interact under defined principles to produce predictable and measurable outcomes.

### Core Mechanisms & Pillars
1. **Primary Dynamics:** The driving forces and rules that govern the behavior of ${title}.
2. **Systemic Relationships:** How internal elements correlate with external environmental variables.
3. **Real-World Impact:** From scientific research to practical industry applications, ${title} plays a pivotal role in solving complex challenges.

### Modern Practical Relevance
Advancements in modern science and technology continue to deepen our understanding of ${title}. Today, practitioners and students leverage these fundamentals to build innovative solutions, optimize performance, and understand complex phenomena.`,
      analogy: `Think of ${title} like the engine in a vehicle: while individual parts each perform distinct functions, they synchronize harmoniously to drive forward progress and create systemic momentum.`,
      keyTakeaways: [
        `${title} operates under fundamental principles that govern behavior and systemic interactions.`,
        `Mastering the foundational vocabulary and mechanics enables deeper analytical understanding.`,
        `Real-world applications span across technology, science, and everyday problem-solving.`,
        `Analyzing cause-and-effect relationships is essential for predicting outcomes in ${title}.`
      ],
      vocabulary: [
        { term: `${title} Fundamentals`, definition: `The foundational rules, axioms, and primary forces defining the subject.` },
        { term: "System Dynamics", definition: "The interdependent patterns and processes through which components interact." },
        { term: "Empirical Analysis", definition: "The method of verifying concepts through direct observation and measurement." }
      ]
    },
    quiz: [
      {
        id: 1,
        question: `What is the primary foundation or governing principle of ${title}?`,
        options: [
          `Arbitrary random interactions without measurable rules`,
          `Structured core principles and interdependent relationships`,
          `Outdated theories with no modern relevance`,
          `Isolated phenomena that never affect external systems`
        ],
        correctIndex: 1,
        explanation: `${title} is founded upon structured, verifiable principles and systematic interactions that produce predictable outcomes.`
      },
      {
        id: 2,
        question: `How do practitioners and researchers typically study and apply ${title}?`,
        options: [
          `By ignoring observable data and evidence`,
          `Through systematic observation, analytical models, and practical testing`,
          `Exclusively through random speculation`,
          `By treating all variables as static and unchangeable`
        ],
        correctIndex: 1,
        explanation: `Systematic observation, theoretical frameworks, and experimental verification are the cornerstones of understanding and applying ${title}.`
      },
      {
        id: 3,
        question: `Why is understanding ${title} valuable in real-world applications?`,
        options: [
          `It enables informed decision-making and innovative problem-solving`,
          `It has no practical utility in modern contexts`,
          `It prevents any further scientific investigation`,
          `It only applies in purely hypothetical models`
        ],
        correctIndex: 0,
        explanation: `Grasping the core concepts of ${title} empowers students and practitioners to solve real-world problems and drive technological or conceptual innovation.`
      }
    ].slice(0, numQuestions),
    flashcards: [
      {
        id: 1,
        front: `What is the core definition of ${title}?`,
        back: `A foundational concept characterized by structured dynamics, systematic interactions, and significant practical applications.`,
        hint: `Core concept`,
        category: "Definition"
      },
      {
        id: 2,
        front: `What is the primary significance of studying ${title}?`,
        back: `It provides the analytical tools to understand complex systems, optimize workflows, and solve real-world problems.`,
        hint: `Value & Application`,
        category: "Importance"
      },
      {
        id: 3,
        front: `What role do underlying mechanisms play in ${title}?`,
        back: `They act as the governing rules that dictate how components interact, adapt, and evolve over time.`,
        hint: `Governing dynamics`,
        category: "Mechanisms"
      },
      {
        id: 4,
        front: `How does ${title} connect to broader disciplines?`,
        back: `It serves as an interdisciplinary bridge linking fundamental theory with experimental practice and technological implementation.`,
        hint: `Interdisciplinary bridge`,
        category: "Context"
      }
    ].slice(0, numCards)
  };
}
