$('#botao-frase').click(fraseAleatoria); // quando clico no botao mudo a frase
$('#botao-frase-id').click(buscaFrase); //quando clico escolho a frase por um numero

function fraseAleatoria() {
  $('#spinner').toggle(); // ativa visualização do spinner enquanto carrega nova frase

  $.get('http://localhost:3000/frases', trocaFraseAleatoria) //solicitacao pro node.js //tirar ; porque atrapalha .fail
    .fail(function () {
      $('#erro').toggle(); // ao falhar mostra mensagem erro
      setTimeout(function () {
        $('#erro').toggle(); // a execução de erro somente dura 1.5 segundos
      }, 1500);
    })
    .always(function () {
      // sempre executa independente de falha ou não
      $('#spinner').toggle(); // encerra visualização do spinner
    });
}

function trocaFraseAleatoria(data) {
  // insiro argumento data
  var frase = $('.frase'); //trazendo elemento frase
  var numeroAleatorio = Math.floor(Math.random() * data.length); // isto ocorre pq math.random trabalho com valor 0 a 1 e multiplicado pelo tamanho do argumento data trás valor exato do nosso array

  frase.text(data[numeroAleatorio].texto); // informo que retiro o texto da minha frase do meu array trasito pelo argumento data aleatoriamente com o atributo texto.
  atualizaTamanhoFrase(); // atualiza o contador de palavras da nossa frase;
  atualizaTempoInicial(data[numeroAleatorio].tempo); // atualiza tempo para novas frases
}

function buscaFrase() {
  console.log('Cheguei aqui!');

  $('#spinner').toggle(); // novamente mostro spinner
  var fraseId = $('#frase-id').val(); //pego o valor digitado no input number

  var dados = { id: fraseId }; // queremos o atributo id do objeto

  $.get('http://localhost:3000/frases', dados, trocaFrase)
    .fail(function () {
      $('#erro').toggle(); // mostro span erro antes oculto
      setTimeout(function () {
        $('#erro').toggle(); // erro some novamente
      }, 2000); // erro some apos 2 segundos
    })
    .always(function () {
      //idependente de falhas ou não
      $('#spinner').toggle(); // spinner some
    });
}

function trocaFrase(data) {
  console.log(data);

  var frase = $('.frase');
  frase.text(data.texto); //o conteudo da frase queremos como parametro o objeto com a caracteristica texto
  atualizaTamanhoFrase(); //atualiza contado de palavras da frases
  atualizaTempoInicial(data.tempo); //atualiza tempo de contagem com a caracteristica tempo do objeto
}
