// Obtenha os eventos salvos no localStorage
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
let subtasksCounter = 0
const eventAdded = new Event('newEventAdded');
document.dispatchEvent(eventAdded);
function openAddEventModal() {
    const addEventModal = document.getElementById('addEventModal');
    addEventModal.style.display = 'block';
}

function closeAddEventModal() {
    const addEventModal = document.getElementById('addEventModal');
    addEventModal.style.display = 'none';
}

function addNewEvent() {
    const newEventDate = document.getElementById('newEventDate').value;
    const newEventTitle = document.getElementById('newEventTitle').value;
    const newEventDescription = document.getElementById('eventDescriptionInput').value;
    const newEventPriority = document.getElementById('eventPriorityInput').value;

    const newSubtasks = [];
    const subtasksContainer = document.getElementById('subtasksContainer');

    for (let i = 0; i < subtasksContainer.children.length; i++) {
        const subtaskInput = subtasksContainer.children[i].querySelector('input[type="text"]');
        const subtaskProgress = subtasksContainer.children[i].querySelector('input[type="checkbox"]').checked ? 100 : 0;

        newSubtasks.push({
            subtask: subtaskInput.value,
            progress: subtaskProgress
        });
    }

    if (newEventDate && newEventTitle) {
        const newEvent = {
            date: newEventDate,
            title: newEventTitle,
            description: newEventDescription,
            priority: newEventPriority,
            subtasks: newSubtasks
        };

        events.push(newEvent);
        displayEvents();
        saveEvents();
        updateCalendarInCode2();

        closeAddEventModal();
    } else {
        alert('Por favor, preencha todos os campos para adicionar um novo evento.');
    }
}
function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

function updateCalendarInCode2() {
    // Obtém os eventos do localStorage
    events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

    // Chama a função load() do CÓDIGO 2 para atualizar o calendário com os eventos
    if (typeof load === 'function') {
        load();
    }
}

// Função para editar um evento
function editEvent(index) {
    const editModal = document.getElementById('editModal');
    const editedEventTitle = document.getElementById('editedEventTitle');
    const editedEventDescription = document.getElementById('editedEventDescription');
    const editedEventPriority = document.getElementById('editedEventPriority');
    const editedEventCategory = document.getElementById('editedEventCategory');
    const subtasksEditContainer = document.getElementById('subtasksContainerEdit');

    // Preencher os campos do modal de edição com os valores atuais do evento selecionado
    const event = events[index];
    editedEventTitle.value = event.title;
    editedEventDescription.value = event.description;
    editedEventPriority.value = event.priority;
    editedEventCategory.value = event.category;

    // Preencher as subtarefas no modal de edição
    subtasksEditContainer.innerHTML = '';
    if (event.subtasks && event.subtasks.length > 0) {
        event.subtasks.forEach(subtask => {
            const subtaskDiv = document.createElement('div');
            const subtaskInput = document.createElement('input');
            subtaskInput.setAttribute('type', 'text');
            subtaskInput.value = subtask.subtask;

            const subtaskCheckbox = document.createElement('input');
            subtaskCheckbox.setAttribute('type', 'checkbox');
            subtaskCheckbox.checked = subtask.progress === 100;

            subtaskDiv.appendChild(subtaskInput);
            subtaskDiv.appendChild(subtaskCheckbox);
            subtasksEditContainer.appendChild(subtaskDiv);
        });
    }

    editModal.style.display = 'block';

    window.onclick = function(event) {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    };

    window.saveEditedEvent = function() {
        const editedTitle = editedEventTitle.value;
        const editedDescription = editedEventDescription.value;
        const editedPriority = editedEventPriority.value;
        const editedCategory = editedEventCategory.value;

        const editedSubtasks = [];
        const subtaskDivs = subtasksEditContainer.querySelectorAll('div');
        subtaskDivs.forEach(subtaskDiv => {
            const subtaskInput = subtaskDiv.querySelector('input[type="text"]');
            const subtaskCheckbox = subtaskDiv.querySelector('input[type="checkbox"]');
            editedSubtasks.push({
                subtask: subtaskInput.value,
                progress: subtaskCheckbox.checked ? 100 : 0
            });
        });

        if (editedTitle.trim() !== '') {
            event.title = editedTitle;
            event.description = editedDescription;
            event.priority = editedPriority;
            event.category = editedCategory;
            event.subtasks = editedSubtasks;

            displayEvents();
            saveEvents();
            closeEditModal();
        } else {
            alert('O título não pode estar vazio. Por favor, insira um novo título.');
        }
    };
}

// Função para fechar o modal de edição
function closeEditModal() {
    const editModal = document.getElementById('editModal');
    editModal.style.display = 'none';
}

// Função para salvar as alterações do evento editado
function saveEditedEvent(index) {
    const editedEventTitle = document.getElementById('editedEventTitle').value;
    events[index].title = editedEventTitle;

    displayEvents();
    closeEditModal();
    saveEvents();
}
function addSubtask() {
    const subtasksContainer = document.getElementById('subtasksContainer');

    const subtaskDiv = document.createElement('div');
    const subtaskInput = document.createElement('input');
    subtaskInput.setAttribute('type', 'text');
    subtaskInput.placeholder = 'Insira a subtarefa';

    const subtaskCheckbox = document.createElement('input');
    subtaskCheckbox.setAttribute('type', 'checkbox');

    const removeSubtaskButton = document.createElement('button');
    removeSubtaskButton.textContent = 'Remover';
    removeSubtaskButton.onclick = function() {
        subtasksContainer.removeChild(subtaskDiv);
    };

    subtaskDiv.appendChild(subtaskInput);
    subtaskDiv.appendChild(subtaskCheckbox);
    subtaskDiv.appendChild(removeSubtaskButton);

    subtasksContainer.appendChild(subtaskDiv);
}

// Função para deletar um evento específico
function deleteEvent(index) {
    if (confirm('Tem certeza de que deseja excluir este evento?')) {
        events.splice(index, 1);
        displayEvents();
        saveEvents();
    }
}

// Função para deletar todos os eventos
function deleteEvents() {
    if (confirm('Tem certeza de que deseja excluir todos os eventos?')) {
        localStorage.removeItem('events');
        displayEvents();
    }
}

// Função para abrir o modal com a lista expandida
function openModal() {
    const modal = document.getElementById('modal');
    const expandedEventsList = document.getElementById('expandedEvents');
    expandedEventsList.innerHTML = '';

    events.forEach(event => {
        const listItem = document.createElement('li');
        listItem.textContent = `Data: ${event.date} - Título: ${event.title}`;
        expandedEventsList.appendChild(listItem);
    });

    modal.style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Função para exibir os eventos na lista
function displayEvents() {
    const eventsList = document.getElementById('events');
    eventsList.innerHTML = '';

    events.forEach((event, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span class="info">Data:</span> ${event.date}<br><span class="info">Título:</span> ${event.title}`;

        const buttonsDiv = document.createElement('div'); // Criando a div para os botões
        buttonsDiv.classList.add('display-row'); // Adicionando a classe display-row à div

        const viewButton = document.createElement('button');
        const viewIcon = document.createElement('i');
        viewIcon.classList.add('fas', 'fa-eye');
        viewButton.appendChild(viewIcon);
        viewButton.onclick = () => viewEvent(index);
        buttonsDiv.appendChild(viewButton);

        const editButton = document.createElement('button');
        const editIcon = document.createElement('i');
        editIcon.classList.add('fas', 'fa-edit');
        editButton.appendChild(editIcon);
        editButton.onclick = () => editEvent(index);
        buttonsDiv.appendChild(editButton);

        const deleteButton = document.createElement('button');
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fas', 'fa-trash');
        deleteButton.appendChild(deleteIcon);
        deleteButton.onclick = () => deleteEvent(index);
        buttonsDiv.appendChild(deleteButton);

        listItem.appendChild(buttonsDiv); // Adicionando a div de botões ao item da lista

        eventsList.appendChild(listItem);
        listItem.classList.add('event-card');
        buttonsDiv.classList.add('btn-group');
    });
}

function viewEvent(index) {
    const modal = document.getElementById('viewEventModal');
    const event = events[index];

    // Preencher o modal com as informações do evento
    const eventDetails = document.getElementById('eventDetails');
    eventDetails.innerHTML = `
        <p><strong>Data:</strong> ${event.date}</p>
        <p><strong>Título:</strong> ${event.title}</p>
        <p><strong>Descrição:</strong> ${event.description}</p>
        <p><strong>Prioridade:</strong> ${event.priority}</p>
        <p><strong>Subtarefas:</strong></p>
        <ul>
            ${event.subtasks.map(subtask => `<li>${subtask.subtask} - Progresso: ${subtask.progress}%</li>`).join('')}
        </ul>
    `;

    modal.style.display = 'block';

    window.onclick = function(event) {
        if (event.target === modal) {
            closeViewEventModal();
        }
    };
}
function closeViewEventModal() {
    const modal = document.getElementById('viewEventModal');
    modal.style.display = 'none';
}


// Salvar eventos no localStorage
function saveEditedEvent(index) {
    const editedEventTitle = document.getElementById('editedEventTitle').value;

    // Verifica se o índice está dentro dos limites da matriz de eventos
    if (index >= 0 && index < events.length) {
        // Verifica se o evento está definido antes de tentar modificar o título
        if (events[index]) {
            events[index].title = editedEventTitle;

            displayEvents();
            saveEvents();

            closeEditModal(); // Fecha o modal após salvar as alterações
        } else {
            console.error('Evento indefinido.');
        }
    } else {
        console.error('Índice do evento fora dos limites.');
    }
}



// Exiba os eventos ao carregar a página
displayEvents();
