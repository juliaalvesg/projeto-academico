document.getElementById('FormSignUp').addEventListener('submit', function(event) {
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

    // Criar um objeto JSON com os valores capturados
    const dadosCadastro = {
        nome: nome,
        sobrenome: sobrenome,
        email: email,
        senha: senha
      };
  
      // Exibir os dados no console
      console.log('Dados do Cadastro:', dadosCadastro);

    // Aqui você pode adicionar a lógica para enviar os dados a um servidor ou realizar outras operações com esses dados
    // Por exemplo, fazer uma requisição AJAX para um servidor para salvar os dados
  });