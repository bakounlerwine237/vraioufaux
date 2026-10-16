// On utilise localStorage pour sauvegarder les questions directement dans le navigateur.
// Cela fonctionne sans base de données externe.

const questionsContainer = document.getElementById('questions-container');
const questionForm = document.getElementById('question-form');
const questionInput = document.getElementById('question-input');

let questions = JSON.parse(localStorage.getItem('vraioufaux_questions')) || [];

function saveQuestions() {
    localStorage.setItem('vraioufaux_questions', JSON.stringify(questions));
}

function renderQuestions() {
    questionsContainer.innerHTML = '';

    if (questions.length === 0) {
        questionsContainer.innerHTML = '<p class="empty-state">Sois le premier à poser une question !</p>';
        return;
    }

    // On affiche les questions les plus récentes en premier
    const sortedQuestions = [...questions].reverse();

    sortedQuestions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';

        const questionText = document.createElement('p');
        questionText.textContent = q.text;

        const voteButtonsDiv = document.createElement('div');
        voteButtonsDiv.className = 'vote-buttons';

        const vraiBtn = document.createElement('button');
        vraiBtn.className = 'btn-vrai';
        vraiBtn.textContent = 'Vrai';
        vraiBtn.onclick = () => vote(q.id, 'vrai');

        const fauxBtn = document.createElement('button');
        fauxBtn.className = 'btn-faux';
        fauxBtn.textContent = 'Faux';
        fauxBtn.onclick = () => vote(q.id, 'faux');

        const voteCount = document.createElement('span');
        voteCount.className = 'vote-count';
        voteCount.textContent = `${q.vrai || 0} Vrai / ${q.faux || 0} Faux`;

        voteButtonsDiv.appendChild(vraiBtn);
        voteButtonsDiv.appendChild(fauxBtn);

        card.appendChild(questionText);
        card.appendChild(voteButtonsDiv);
        card.appendChild(voteCount);

        questionsContainer.appendChild(card);
    });
}

function addQuestion(text) {
    const newQuestion = {
        id: Date.now().toString(), // ID unique basé sur le temps
        text: text,
        vrai: 0,
        faux: 0
    };
    questions.push(newQuestion);
    saveQuestions();
    renderQuestions();
}

function vote(questionId, voteType) {
    const question = questions.find(q => q.id === questionId);
    if (question) {
        if (voteType === 'vrai') {
            question.vrai = (question.vrai || 0) + 1;
        } else if (voteType === 'faux') {
            question.faux = (question.faux || 0) + 1;
        }
        saveQuestions();
        renderQuestions();
    }
}

questionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = questionInput.value.trim();
    if (text) {
        addQuestion(text);
        questionInput.value = '';
    }
});

// Initialisation
renderQuestions();
