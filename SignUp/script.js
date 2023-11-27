document.addEventListener('DOMContentLoaded', function() {
  // Adiciona um evento de envio ao formulário
  var formulario = document.getElementById('FormSignUp');

  formulario.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Obter os valores dos campos
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Exemplo de saída dos valores no console (você pode salvar/enviar para um servidor)
    console.log('Nome:', nome);
    console.log('Sobrenome:', sobrenome);
    console.log('Email:', email);
    console.log('Senha:', senha);

})
});