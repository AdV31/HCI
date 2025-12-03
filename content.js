// content.js

// --- CONFIGURATION ---
const DOMAINS = {
    YOUTUBE: 'youtube.com',
    INSTAGRAM: 'instagram.com',
    TIKTOK: 'tiktok.com'
};

// Temps en millisecondes (1000 ms * 60 s * minutes)
const THRESHOLDS = {
    [DOMAINS.YOUTUBE]: 60 * 60 * 1000,      // 1 Heure
    [DOMAINS.INSTAGRAM]: 30 * 60 * 1000,    // 30 Minutes
    [DOMAINS.TIKTOK]: 30 * 60 * 1000        // 30 Minutes
};

// --- DATABASE OF 20 HCI QUESTIONS ---
const quizData = [
    {
        q: "What are the 4 phases of the 'Double Diamond' design process?",
        options: [
            "Discover, Define, Develop, Deliver",
            "Design, Debug, Deploy, Deliver",
            "Data, Definition, Design, Development",
            "Dream, Draw, Develop, Done"
        ],
        answer: 0 // Index of correct answer
    },
    {
        q: "Which of the following is NOT a Usability Goal?",
        options: [
            "Efficiency (Efficacité)",
            "Safety (Sécurité)",
            "Entertainment (Divertissement)",
            "Learnability (Apprenabilité)"
        ],
        answer: 2
    },
    {
        q: "Talking to a smart speaker (like Alexa) is which Interaction Type?",
        options: [
            "Manipulating",
            "Conversing",
            "Instructing",
            "Exploring"
        ],
        answer: 1
    },
    {
        q: "In Interaction Design, what is 'Affordance'?",
        options: [
            "The cost of the software",
            "A visual clue that indicates how an object should be used",
            "The speed of the processor",
            "The emotional attachment to a product"
        ],
        answer: 1
    },
    {
        q: "According to Miller (1956), what is the capacity of working memory (Magic Number)?",
        options: [
            "3 plus or minus 1",
            "10 plus or minus 2",
            "7 plus or minus 2",
            "Unlimited"
        ],
        answer: 2
    },
    {
        q: "What is the 'Gulf of Execution'?",
        options: [
            "The gap between the user's goal and the physical system",
            "The gap between the system state and the user's perception",
            "The time it takes to execute a program",
            "The difference between good and bad design"
        ],
        answer: 0
    },
    {
        q: "What is 'Cognitive Load'?",
        options: [
            "The amount of electricity a computer uses",
            "The mental effort required to learn or perform a task",
            "The weight of the brain",
            "The number of files on a hard drive"
        ],
        answer: 1
    },
    {
        q: "Which data gathering method provides rich qualitative data but is time-consuming to analyze?",
        options: [
            "Questionnaires",
            "Web Analytics",
            "Unstructured Interviews",
            "Likert Scales"
        ],
        answer: 2
    },
    {
        q: "Which scale uses opposite adjective pairs (e.g., Useful - Useless)?",
        options: [
            "Likert Scale",
            "Semantic Differential Scale",
            "Binary Scale",
            "Nominal Scale"
        ],
        answer: 1
    },
    {
        q: "In an experiment, which variable does the researcher manipulate?",
        options: [
            "Dependent Variable",
            "Independent Variable",
            "Controlled Variable",
            "Random Variable"
        ],
        answer: 1
    },
    {
        q: "What does BSD stand for in Experimental Design?",
        options: [
            "Between-Subject Design",
            "Basic-System Design",
            "Balanced-Study Design",
            "Behavioral-Science Data"
        ],
        answer: 0
    },
    {
        q: "In a Within-Subject Design (WSD):",
        options: [
            "Each participant experiences only one condition",
            "Each participant experiences ALL conditions",
            "Participants are not needed",
            "Only one condition is tested total"
        ],
        answer: 1
    },
    {
        q: "If a p-value is less than 0.05, the result is usually considered:",
        options: [
            "Statistically Significant",
            "Random Noise",
            "An Error",
            "Inconclusive"
        ],
        answer: 0
    },
    {
        q: "What statistical test is used to compare means of 3 or more groups?",
        options: [
            "T-test",
            "ANOVA (Analysis of Variance)",
            "Correlation",
            "Regression"
        ],
        answer: 1
    },
    {
        q: "What are Don Norman's 3 levels of Emotional Design?",
        options: [
            "Happy, Sad, Angry",
            "Visceral, Behavioral, Reflective",
            "Visual, Audio, Tactile",
            "Input, Process, Output"
        ],
        answer: 1
    },
    {
        q: "Who introduced the term 'Affective Computing'?",
        options: [
            "Alan Turing",
            "Steve Jobs",
            "Rosalind Picard",
            "Don Norman"
        ],
        answer: 2
    },
    {
        q: "What is 'Telepresence'?",
        options: [
            "Watching TV",
            "The sense of being present at a remote location",
            "Sending an email",
            "Using a VR headset for gaming only"
        ],
        answer: 1
    },
    {
        q: "What is 'Anthropomorphism' in HCI?",
        options: [
            "Studying ancient humans",
            "Attribtuting human qualities to objects or animals",
            "Designing for animals",
            "Using ergonomics in chairs"
        ],
        answer: 1
    },
    {
        q: "What is a potential downside of using Interface Metaphors?",
        options: [
            "They help users understand quickly",
            "They can limit the user's understanding if the metaphor is too strict (breaking the model)",
            "They look nice",
            "They use icons"
        ],
        answer: 1
    },
    {
        q: "What is the main difference between Nominal and Ordinal data scales?",
        options: [
            "Nominal has order, Ordinal does not",
            "Nominal is just categories (names), Ordinal has a meaningful order",
            "They are the same",
            "Ordinal is only for numbers, Nominal is for text"
        ],
        answer: 1
    }
];

// --- LOGIC DE NAVIGATION ---
let lastUrl = location.href;

// 1. Initial Check (Au chargement de la page)
checkAndShowOverlay();

// 2. Intervalle pour détecter les changements d'URL (SPA Navigation)
// Cela permet de détecter quand on clique sur une nouvelle vidéo YouTube sans recharger la page
setInterval(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        // On relance la vérification à chaque changement de page/vidéo
        checkAndShowOverlay();
    }
}, 1000);


// --- FONCTIONS ---

function getCurrentDomainKey() {
    const hostname = window.location.hostname;
    if (hostname.includes('youtube.com')) return DOMAINS.YOUTUBE;
    if (hostname.includes('instagram.com')) return DOMAINS.INSTAGRAM;
    if (hostname.includes('tiktok.com')) return DOMAINS.TIKTOK;
    return null;
}

function checkAndShowOverlay() {
    const domain = getCurrentDomainKey();
    if (!domain) return; // Si on n'est pas sur un site ciblé, on ne fait rien

    // Récupérer le timestamp du dernier succès pour ce domaine précis
    const lastUnlockStr = localStorage.getItem(`focus_unlock_time_${domain}`);
    const now = Date.now();
    const threshold = THRESHOLDS[domain];

    // Logique de verrouillage :
    // 1. Si pas de timestamp (jamais répondu) -> BLOQUER
    // 2. Si (Maintenant - DernierSuccès) > Seuil -> BLOQUER
    if (!lastUnlockStr || (now - parseInt(lastUnlockStr, 10)) > threshold) {
        
        // On vérifie qu'un overlay n'est pas déjà affiché pour éviter les doublons
        if (!document.getElementById("focus-app-overlay")) {
            initFocusApp();
        }
    } else {
        // Optionnel : On peut loguer le temps restant pour le debug
        // console.log(`Focus App: Unlocked. Time remaining: ${(threshold - (now - lastUnlockStr))/60000} mins`);
    }
}

function initFocusApp() {
    const randomIndex = Math.floor(Math.random() * quizData.length);
    const currentQuestion = quizData[randomIndex];
    createOverlay(currentQuestion);
}

function createOverlay(questionData) {
    const overlay = document.createElement("div");
    overlay.id = "focus-app-overlay";

    let optionsHtml = '<div class="focus-options">';
    questionData.options.forEach((opt, index) => {
        optionsHtml += `<button class="focus-option-btn" data-index="${index}">${opt}</button>`;
    });
    optionsHtml += '</div>';

    overlay.innerHTML = `
    <div class="focus-header">WAIT!</div>
    <div class="focus-question-container">
        <p class="focus-question"><strong>Q:</strong> ${questionData.q}</p>
        ${optionsHtml}
    </div>
    <div class="asian-mum-quote">
       <span style="font-size: 24px;">👀</span> "I am watching you... Answer correctly."
    </div>
  `;

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    const buttons = overlay.querySelectorAll('.focus-option-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            handleAnswer(e.target, questionData.answer, overlay);
        });
    });
}

function handleAnswer(clickedBtn, correctIndex, overlay) {
    const selectedIndex = parseInt(clickedBtn.getAttribute('data-index'));

    if (selectedIndex === correctIndex) {
        clickedBtn.classList.add('correct');
        setTimeout(() => {
            alert("CORRECT! \nAsian Mum is proud (for now).\nYou may proceed.");
            overlay.remove();
            document.body.style.overflow = "auto";
            
            // --- SAUVEGARDE DU TEMPS ---
            // On enregistre l'heure actuelle comme nouveau point de départ
            const domain = getCurrentDomainKey();
            if (domain) {
                localStorage.setItem(`focus_unlock_time_${domain}`, Date.now().toString());
            }
            
        }, 300);
    } else {
        clickedBtn.classList.add('wrong');
        setTimeout(() => {
            alert("WRONG!\nFailure is not an option. Try again.");
            clickedBtn.classList.remove('wrong');
        }, 300);
    }
}