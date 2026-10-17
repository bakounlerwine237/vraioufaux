// 1. Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB51k1C3rBbJSeNRKETLFkRMwkjngaj88w",
  authDomain: "vraioufaux-5922d.firebaseapp.com",
  databaseURL: "https://vraioufaux-5922d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vraioufaux-5922d",
  storageBucket: "vraioufaux-5922d.firebasestorage.app",
  messagingSenderId: "104735598785",
  appId: "1:104735598785:web:3746abdeee0e78547e4c40"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const dbRef = firebase.database().ref('questions');

// Récupération des éléments du DOM
const questionsContainer = document.getElementById('questions-container');
const questionForm = document.getElementById('question-form');
const questionInput = document.getElementById('question-input');

// 2. Écouter les données en temps réel
dbRef.on('value', (snapshot) => {
    const data = snapshot.val();
    questionsContainer.innerHTML = '';

    if (!data) {
        questionsContainer.innerHTML = '<p class="empty-state">Sois le premier à poser une question !</p>';
        return;
    }

    const questionsArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
    }));

    questionsArray.sort((a, b) => b.id - a.id);

    questionsArray.forEach((q) => {
        const card = document.createElement('div');
        card.className = 'question-card';

        const questionText = document.createElement('p');
        questionText.textContent = q.text;

        const voteButtonsDiv = document.createElement('div');
        voteButtonsDiv.className = 'vote-buttons';

        const vraiBtn = document.createElement('button');
        vraiBtn.className = 'btn-vrai';
        vraiBtn.textContent = 'Vrai';
        vraiBtn.onclick = () => voter(q.id, 'vrai', q.vrai, q.faux);

        const fauxBtn = document.createElement('button');
        fauxBtn.className = 'btn-faux';
        fauxBtn.textContent = 'Faux';
        fauxBtn.onclick = () => voter(q.id, 'faux', q.vrai, q.faux);

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
});

// 3. Ajouter une question
questionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = questionInput.value.trim();
    if (text) {
        dbRef.child(Date.now()).set({
            text: text,
            vrai: 0,
            faux: 0
        });
        questionInput.value = '';
    }
});

// 4. Voter
function voter(id, type, currentVrai, currentFaux) {
    const updates = {};
    if (type === 'vrai') {
        updates['/questions/' + id + '/vrai'] = (currentVrai || 0) + 1;
    } else if (type === 'faux') {
        updates['/questions/' + id + '/faux'] = (currentFaux || 0) + 1;
    }
    firebase.database().ref().update(updates);
}
