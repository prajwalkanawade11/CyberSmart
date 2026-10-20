
const languageSelect = document.getElementById("language");
const messageInput = document.getElementById("message");
const checkerResult = document.getElementById("checkerResult");

let currentQuestion = 0;
let score = 0;
let answered = false;

// Common warning signs, not a definitive scam detector.
const warningRules = [
    {
        pattern: /\botp\b|one.time password|ओटीपी/,
        en: "The message mentions an OTP. Never share your OTP with anyone.",
        mr: "संदेशात OTP चा उल्लेख आहे. OTP कोणालाही सांगू नका."
    },
    {
        pattern: /upi pin|upi.pin|enter your pin|पिन टाका|पिन सांगा/,
        en: "The message mentions a PIN. Never disclose your UPI PIN.",
        mr: "संदेशात PIN चा उल्लेख आहे. UPI PIN कोणालाही सांगू नका."
    },
    {
        pattern: /click (here|this link)|verify immediately|urgent verification|क्लिक करा|तात्काळ पडताळणी/,
        en: "It uses a link or urgent verification request. Verify through an official channel.",
        mr: "लिंक किंवा तातडीच्या पडताळणीची मागणी आहे. अधिकृत माध्यमातून पडताळणी करा."
    },
    {
        pattern: /account.{0,25}(blocked|suspend|close)|blocked.{0,20}account|खाते बंद|खातं बंद/,
        en: "It threatens account suspension. Contact your bank using its official contact details.",
        mr: "खाते बंद करण्याची धमकी दिली आहे. बँकेच्या अधिकृत संपर्काद्वारे खात्री करा."
    },
    {
        pattern: /won a prize|claim your prize|lottery winner|you have won|बक्षीस जिंकले|लॉटरी/,
        en: "It mentions a prize or lottery. Unexpected prize claims may be fraudulent.",
        mr: "बक्षीस किंवा लॉटरीचा उल्लेख आहे. अनपेक्षित बक्षिसाचा दावा फसवणूक असू शकतो."
    },
    {
        pattern: /send money|pay immediately|transfer money|processing fee|पैसे पाठवा|तात्काळ पैसे/,
        en: "It requests money urgently. Verify the request independently before paying.",
        mr: "तातडीने पैसे मागितले आहेत. पैसे देण्यापूर्वी स्वतंत्रपणे खात्री करा."
    }
];

function currentLanguage() {
    return languageSelect.value;
}

// Change static website text.
function updateLanguage() {
    const lang = currentLanguage();

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-en][data-mr]").forEach(element => {
        element.textContent = element.dataset[lang];
    });

    messageInput.placeholder =
        messageInput.dataset["placeholder" + (lang === "en" ? "En" : "Mr")];

    renderQuestion();
    checkerResult.hidden = true;
}

languageSelect.addEventListener("change", updateLanguage);

// Check a message for common warning signs.
document.getElementById("checkBtn").addEventListener("click", () => {
    const lang = currentLanguage();
    const message = messageInput.value.trim();

    checkerResult.replaceChildren();
    checkerResult.className = "result";

    if (!message) {
        showCheckerMessage(
            lang === "en"
                ? "Please enter a sample message to check."
                : "तपासण्यासाठी नमुना संदेश टाका.",
            "error"
        );
        return;
    }

    const matches = warningRules.filter(rule =>
        rule.pattern.test(message)
    );

    const heading = document.createElement("h3");
    const description = document.createElement("p");

    if (matches.length > 0) {
        checkerResult.classList.add("warning");

        heading.textContent = lang === "en"
            ? "Warning signs detected"
            : "धोक्याची चिन्हे आढळली";

        description.textContent = lang === "en"
            ? "Review these warning signs carefully:"
            : "खालील धोक्याची चिन्हे काळजीपूर्वक तपासा:";

        const list = document.createElement("ul");

        matches.forEach(rule => {
            const item = document.createElement("li");
            item.textContent = rule[lang];
            list.appendChild(item);
        });

        checkerResult.append(heading, description, list);
    } else {
        checkerResult.classList.add("safe");

        heading.textContent = lang === "en"
            ? "No listed warning signs detected"
            : "या साधनाला ठरावीक धोक्याची चिन्हे आढळली नाहीत";

        description.textContent = lang === "en"
            ? "This does not mean the message is safe. Verify the sender independently and never share confidential details."
            : "याचा अर्थ संदेश सुरक्षित आहे असा नाही. पाठवणाऱ्याची स्वतंत्रपणे खात्री करा आणि गोपनीय माहिती शेअर करू नका.";

        checkerResult.append(heading, description);
    }

    checkerResult.hidden = false;
});

function showCheckerMessage(message, type) {
    checkerResult.textContent = message;
    checkerResult.className = "result " + type;
    checkerResult.hidden = false;
}

document.getElementById("clearBtn").addEventListener("click", () => {
    messageInput.value = "";
    checkerResult.replaceChildren();
    checkerResult.hidden = true;
});

// Quiz questions in English and Marathi.
const questions = [
    {
        en: "Someone asks you to share your OTP over a phone call. What should you do?",
        mr: "फोनवर कोणी OTP मागितला तर तुम्ही काय कराल?",
        options: [
            { en: "Share it immediately", mr: "लगेच सांगू" },
            { en: "Never share it", mr: "OTP सांगणार नाही" },
            { en: "Post it online", mr: "ऑनलाइन टाकू" }
        ],
        answer: 1,
        why: {
            en: "Never share your OTP with callers or strangers.",
            mr: "फोन करणाऱ्या किंवा अनोळखी व्यक्तीला OTP सांगू नका."
        }
    },
    {
        en: "A stranger sends you an unexpected payment link. What is safest?",
        mr: "अनोळखी व्यक्ती अनपेक्षित पेमेंट लिंक पाठवते. सुरक्षित पर्याय कोणता?",
        options: [
            { en: "Open it immediately", mr: "लगेच उघडू" },
            { en: "Forward it to everyone", mr: "सर्वांना पाठवू" },
            { en: "Avoid it and verify independently", mr: "लिंक टाळू आणि स्वतंत्रपणे पडताळणी करू" }
        ],
        answer: 2,
        why: {
            en: "Unknown links can lead to phishing or fraudulent payment pages.",
            mr: "अनोळखी लिंक बनावट वेबसाइट किंवा फसव्या पेमेंट पेजकडे नेऊ शकते."
        }
    },
    {
        en: "Do you generally need a UPI PIN to receive money?",
        mr: "पैसे मिळवण्यासाठी सामान्यतः UPI PIN आवश्यक असतो का?",
        options: [
            { en: "Yes, always", mr: "हो, नेहमी" },
            { en: "No", mr: "नाही" },
            { en: "Only for prizes", mr: "फक्त बक्षिसांसाठी" }
        ],
        answer: 1,
        why: {
            en: "Receiving money generally does not require entering your UPI PIN.",
            mr: "पैसे स्वीकारण्यासाठी सामान्यतः UPI PIN टाकण्याची गरज नसते."
        }
    },
    {
        en: "You notice money lost through a cyber fraud. What should you do?",
        mr: "सायबर फसवणुकीमुळे पैसे गेले. काय करावे?",
        options: [
            { en: "Wait several weeks", mr: "काही आठवडे थांबावे" },
            { en: "Delete all evidence", mr: "सर्व पुरावे हटवावेत" },
            { en: "Contact 1930 promptly and report it", mr: "त्वरित 1930 वर संपर्क करून तक्रार करावी" }
        ],
        answer: 2,
        why: {
            en: "Report financial cyber fraud promptly and contact your bank.",
            mr: "आर्थिक सायबर फसवणुकीची त्वरित तक्रार करा आणि बँकेशी संपर्क साधा."
        }
    },
    {
        en: "A job recruiter asks for an advance fee before offering a job. What should you do?",
        mr: "नोकरी देण्यापूर्वी भरती करणारी व्यक्ती पैसे मागते. काय करावे?",
        options: [
            { en: "Pay without checking", mr: "तपासणी न करता पैसे द्यावेत" },
            { en: "Verify the company independently", mr: "कंपनीची स्वतंत्रपणे पडताळणी करावी" },
            { en: "Share your bank PIN", mr: "बँक PIN सांगावा" }
        ],
        answer: 1,
        why: {
            en: "Verify the employer and the offer before making any payment.",
            mr: "कोणतेही पैसे देण्यापूर्वी नियोक्ता आणि ऑफरची पडताळणी करा."
        }
    }
];

function renderQuestion() {
    const lang = currentLanguage();
    const questionElement = document.getElementById("question");
    const numberElement = document.getElementById("questionNumber");
    const optionsElement = document.getElementById("options");
    const feedback = document.getElementById("quizFeedback");
    const nextButton = document.getElementById("nextBtn");

    optionsElement.replaceChildren();
    feedback.textContent = "";
    answered = false;

    if (currentQuestion >= questions.length) {
        numberElement.textContent = lang === "en"
            ? "Quiz completed"
            : "प्रश्नमंजुषा पूर्ण";

        questionElement.textContent = lang === "en"
            ? `Your score: ${score} out of ${questions.length}`
            : `तुमचे गुण: ${questions.length} पैकी ${score}`;

        feedback.textContent = lang === "en"
            ? "Review the awareness section to learn more."
            : "अधिक माहितीसाठी जनजागृती विभाग पुन्हा पाहा.";

        nextButton.textContent = lang === "en" ? "Try Again" : "पुन्हा प्रयत्न करा";
        nextButton.disabled = false;
        return;
    }

    const question = questions[currentQuestion];

    numberElement.textContent = lang === "en"
        ? `Question ${currentQuestion + 1} of ${questions.length}`
        : `प्रश्न ${currentQuestion + 1} / ${questions.length}`;

    questionElement.textContent = question[lang];

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option";
        button.textContent = option[lang];

        button.addEventListener("click", () => {
            if (answered) return;

            answered = true;

            const correct = index === question.answer;

            if (correct) score++;

            Array.from(optionsElement.children).forEach((item, i) => {
                item.disabled = true;

                if (i === question.answer) {
                    item.classList.add("correct");
                } else if (i === index) {
                    item.classList.add("incorrect");
                }
            });

            feedback.textContent = correct
                ? (lang === "en" ? "Correct! " : "बरोबर! ") + question.why[lang]
                : (lang === "en" ? "Not quite. " : "चुकीचे. ") + question.why[lang];

            nextButton.disabled = false;
        });

        optionsElement.appendChild(button);
    });

    nextButton.disabled = true;
    nextButton.textContent = currentQuestion === questions.length - 1
        ? (lang === "en" ? "See Results" : "निकाल पाहा")
        : (lang === "en" ? "Next Question" : "पुढील प्रश्न");
}

document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentQuestion >= questions.length) {
        currentQuestion = 0;
        score = 0;
    } else {
        if (!answered) return;
        currentQuestion++;
    }

    renderQuestion();
});

languageSelect.addEventListener("change", () => {
    currentQuestion = 0;
    score = 0;
    updateLanguage();
});

// Display the first question when the website opens.
renderQuestion();
