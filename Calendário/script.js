
// variaveis globais

let nav = 0
let clicked = null
let subtasksCounter = 0
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : []


// variavel do modal:
const newEvent = document.getElementById('newEventModal')
const deleteEventModal = document.getElementById('deleteEventModal')
const backDrop = document.getElementById('modalBackDrop')
const eventTitleInput = document.getElementById('eventTitleInput')
// --------
const calendar = document.getElementById('calendar') // div calendar:
const weekdays = ['domingo','segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'] //array with weekdays:

//funções

function openModal(date) {
  clicked = date;
  const eventDay = events.find((event) => event.date === clicked);

  if (eventDay) {
    const eventText = document.getElementById('eventText');
    eventText.innerHTML = `
      <strong>Título:</strong> ${eventDay.title}<br>
      <strong>Descrição:</strong> ${eventDay.description}<br>
      <strong>Prioridade:</strong> ${eventDay.priority}<br>
      <div class="category-card">
        <strong>Categoria:</strong>
        <div class="category ${eventDay.category}">${eventDay.category.toUpperCase()}</div>
      </div>
      <strong>Subtarefas:</strong><br>

    `;

    if (eventDay.subtasks && eventDay.subtasks.length > 0) {
      eventDay.subtasks.forEach((subtask, index) => {
        eventText.innerHTML += `
          <div>
            <input type="checkbox" id="checkboxView${index}" ${subtask.progress === 100 ? 'checked' : ''}>
            <label for="checkboxView${index}">${subtask.subtask} (${subtask.progress}% completo)</label><br>
            <progress value="${subtask.progress}" max="100" id="progressBarView${index}"></progress><br>
          </div>
        `;
      });
    } else {
      eventText.innerHTML += 'Nenhuma subtarefa encontrada.<br>';
    }

    deleteEventModal.style.display = 'block';
  } else {
    newEvent.style.display = 'block';
  }

  backDrop.style.display = 'block';

  // Adicione um event listener para cada checkbox
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', () => updateProgressView(index));
  });
}

// Adicione um ouvinte para o evento 'newEventAdded' disparado pelo CÓDIGO 1
document.addEventListener('DOMContentLoaded', function() {
  // Esta função será executada quando o DOM for completamente carregado

  // Função para carregar os eventos
  function loadEvents() {
      // Obtém os eventos do localStorage
      events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
      
      // Chama a função load() para atualizar o calendário com os eventos
      load();
  }

  // Chama a função para carregar os eventos inicialmente
  loadEvents();

  // Adiciona um ouvinte para o evento 'newEventAdded' disparado pelo CÓDIGO 1
  document.addEventListener('newEventAdded', function() {
      // Quando o evento 'newEventAdded' é ouvido, recarrega os eventos
      loadEvents();
  });
});


function load (){ 
  const date = new Date() 
  

  //mudar titulo do mês:
  if(nav !== 0){
    date.setMonth(new Date().getMonth() + nav) 
  }
  
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()

  
  
  const daysMonth = new Date (year, month + 1 , 0).getDate()
  const firstDayMonth = new Date (year, month, 1)
  

  const dateString = firstDayMonth.toLocaleDateString('pt-br', {
    weekday: 'long',
    year:    'numeric',
    month:   'numeric',
    day:     'numeric',
  })
  

  const paddinDays = weekdays.indexOf(dateString.split(', ') [0])
  
  //mostrar mês e ano:
  document.getElementById('monthDisplay').innerText = `${date.toLocaleDateString('pt-br',{month: 'long'})}, ${year}`

  
  calendar.innerHTML =''

  // criando uma div com os dias:

  for (let i = 1; i <= paddinDays + daysMonth; i++) {
    const dayS = document.createElement('div')
    dayS.classList.add('day')

    const dayString = `${month + 1}/${i - paddinDays}/${year}`

    //condicional para criar os dias de um mês:
     
    if (i > paddinDays) {
      dayS.innerText = i - paddinDays
      

      const eventDay = events.find(event=>event.date === dayString)
      
      if(i - paddinDays === day && nav === 0){
        dayS.id = 'currentDay'
      }


      if(eventDay){
        const eventDiv = document.createElement('div')
        eventDiv.classList.add('event')
        eventDiv.innerText = eventDay.title
        dayS.appendChild(eventDiv)

      }

      dayS.addEventListener('click', ()=> openModal(dayString))

    } else {
      dayS.classList.add('padding')
    }

    
    calendar.appendChild(dayS)
  }
}
function addSubtask() {
  const subtasksContainer = document.getElementById('subtasksContainer');
  const subtaskDiv = document.createElement('div');
  subtaskDiv.classList.add('subtask-item');
  const subtaskInput = document.createElement('input');
  subtaskInput.setAttribute('type', 'text');
  subtaskInput.setAttribute('placeholder', 'Subtarefa');
  subtaskInput.setAttribute('id', `subtask${subtasksCounter}`);

  // Adicione o checkbox para controlar o progresso
  const subtaskCheckbox = document.createElement('input');
  subtaskCheckbox.setAttribute('type', 'checkbox');
  subtaskCheckbox.setAttribute('id', `checkbox${subtasksCounter}`);
  subtaskCheckbox.addEventListener('change', () => updateProgress());

  const progressBar = document.createElement('progress');
  progressBar.setAttribute('id', `progressBar${subtasksCounter}`);
  progressBar.setAttribute('max', '100');
  progressBar.setAttribute('value', '0');

  subtaskDiv.appendChild(subtaskInput);
  subtaskDiv.appendChild(subtaskCheckbox);
  subtaskDiv.appendChild(progressBar);

  subtasksContainer.appendChild(subtaskDiv);

  subtasksCounter++;
}
function updateProgressView(index) {
  const checkbox = document.getElementById(`checkboxView${index}`);
  const progressBar = document.getElementById(`progressBarView${index}`);

  if (checkbox && progressBar) {
    progressBar.value = checkbox.checked ? 100 : 0;

    // Atualizar o valor no objeto de eventos
    const eventToUpdate = events.find(event => event.date === clicked);
    if (eventToUpdate && eventToUpdate.subtasks[index]) {
      eventToUpdate.subtasks[index].progress = checkbox.checked ? 100 : 0;

      // Salvar os eventos atualizados no localStorage
      localStorage.setItem('events', JSON.stringify(events));
    }

    // Chame a função para atualizar o progresso geral, se necessário
    updateOverallProgress();
  }
}

function updateOverallProgress() {
  let totalSubtasks = 0;
  let completedSubtasks = 0;

  for (let i = 0; i < subtasksCounter; i++) {
    const checkbox = document.getElementById(`checkbox${i}`);
    if (checkbox && checkbox.checked) {
      completedSubtasks++;
    }
    totalSubtasks++;
  }

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    if (event.date === clicked) {
      const subtasks = event.subtasks || [];
      for (let j = 0; j < subtasks.length; j++) {
        const checkbox = document.getElementById(`checkboxView${j}`);
        if (checkbox && checkbox.checked) {
          completedSubtasks++;
        }
        totalSubtasks++;
      }
      break;
    }
  }

  const overallProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  // Salve o progresso geral no localStorage ou em outro local apropriado, se necessário
}


function updateProgress(index) {
  const checkbox = document.getElementById(`checkbox${index}`);
  const progressBar = document.getElementById(`progressBar${index}`);
  if (checkbox && progressBar) {
    progressBar.value = checkbox.checked ? 100 : 0;
  }
  updateLocalStorage(index, checkbox.checked);
  updateOverallProgress(); // Chame a função para atualizar o progresso geral
}
function updateLocalStorage(index, checked) {
  const eventToUpdate = events.find(event => event.date === clicked);
  if (eventToUpdate && eventToUpdate.subtasks[index]) {
    eventToUpdate.subtasks[index].progress = checked ? 100 : 0;

    // Encontrar e atualizar o evento modificado no array de eventos
    const eventIndex = events.findIndex(event => event.date === clicked);
    events[eventIndex] = eventToUpdate;

    // Salvar os eventos atualizados no localStorage
    localStorage.setItem('events', JSON.stringify(events));
  }
}

function closeModal(){
  eventTitleInput.classList.remove('error')
  newEvent.style.display = 'none'
  backDrop.style.display = 'none'
  deleteEventModal.style.display = 'none'

  eventTitleInput.value = ''
  clicked = null
  load()
  if (clicked) {
    const eventToUpdate = events.find(event => event.date === clicked);
    if (eventToUpdate) {
      const checkboxes = document.querySelectorAll(`input[id^="checkboxView"]`);
      checkboxes.forEach((checkbox, index) => {
        const progressBar = document.getElementById(`progressBarView${index}`);
        eventToUpdate.subtasks[index].progress = checkbox.checked ? 100 : 0;
      });
      
      // Atualize o evento modificado no array de eventos
      const eventIndex = events.findIndex(event => event.date === clicked);
      events[eventIndex] = eventToUpdate;
      
      // Salve os eventos atualizados no localStorage
      localStorage.setItem('events', JSON.stringify(events));
    }
  }

}
function saveEvent() {
  const eventTitle = document.getElementById('eventTitleInput').value;
  const eventDescription = document.getElementById('eventDescriptionInput').value;
  const eventPriority = document.getElementById('eventPriorityInput').value;
  const eventCategory = document.getElementById('eventCategoryInput').value;

  const subtasks = [];
  for (let i = 0; i < subtasksCounter; i++) {
    const subtask = document.getElementById(`subtask${i}`).value;
    subtasks.push({ subtask });
  }

  if (eventTitle) {
    eventTitleInput.classList.remove('error');

    const subtasks = [];
    for (let i = 0; i < subtasksCounter; i++) {
      const subtask = document.getElementById(`subtask${i}`).value;
      const checkbox = document.getElementById(`checkbox${i}`);
      subtasks.push({
        subtask,
        progress: checkbox.checked ? 100 : 0, // Captura o estado do checkbox
      });
    }

    events.push({
      date: clicked,
      title: eventTitle,
      description: eventDescription,
      priority: eventPriority,
      category: eventCategory,
      subtasks,
    });

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}


function deleteEvent(){

  events = events.filter(event => event.date !== clicked)
  localStorage.setItem('events', JSON.stringify(events))
  closeModal()
}

// botões 

function buttons (){
  document.getElementById('backButton').addEventListener('click', ()=>{
    nav--
    load()
    
  })
  document.getElementById('addSubtaskButton').addEventListener('click', addSubtask);
  document.getElementById('nextButton').addEventListener('click',()=>{
    nav++
    load()
    
  })

  document.getElementById('saveButton').addEventListener('click',()=> saveEvent())

  document.getElementById('cancelButton').addEventListener('click',()=>closeModal())

  document.getElementById('deleteButton').addEventListener('click', ()=>deleteEvent())

  document.getElementById('closeButton').addEventListener('click', ()=>closeModal())
  
}
buttons()
load()