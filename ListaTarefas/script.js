// Esta seção é onde você vai pegar os eventos salvos no localStorage e exibi-los na lista

// Obtenha os eventos salvos no localStorage
const events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

// Função para exibir os eventos na lista
function displayEvents() {
    const eventsList = document.getElementById('events');

    // Limpe a lista antes de adicionar os eventos
    eventsList.innerHTML = '';

    // Adicione cada evento como um item de lista na página
    events.forEach(event => {
        const listItem = document.createElement('li');
        listItem.textContent = `Data: ${event.date} - Título: ${event.title}`;
        eventsList.appendChild(listItem);
    });
}

// Exiba os eventos ao carregar a página
displayEvents();
