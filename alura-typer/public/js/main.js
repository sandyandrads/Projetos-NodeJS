$(".frase"); // seleciono meu elemento classe frase no html.

// variaveis globais //

var campo = $(".campo-digitacao"); // seleciono input
var tempoInicial = $("#tempo-digitacao").text(); // guardamos variavel de tempo inicial de modo global
var nome = $("#inserirNome");

// funcoes carregadas //
$(function (){
  atualizaTamanhoFrase();
  inicializaContadores();
  inicializaConometro();
  inicializaMarcadores();
  $("#botao-reiniciar").click(reiniciaJogo);

});

// Frases acima do campo input //

function atualizaTamanhoFrase(){
      var frase = $(".frase").text(); // seleciono meu texto dentro do elemento
      var numPalavras = frase.split(" ").length; // com split quebro meu texto por espaços (" ") e length trás a quantidade de palavras

      var tamanhoFrase = $("#tamanho-frase"); // seleciono meu spam contador de palavras
      tamanhoFrase.text(numPalavras); // troco meu texto pelo resultado do numero
}

// contadores abaixo do campo input //

function inicializaContadores(){
      campo.on("input", function(){ // evento no elemento input
        var conteudo = campo.val(); // a variavel conteudo possui o value do campo
        var qtdPalavras = conteudo.split(/\S+/).length - 1; // variavel recebe quantidade de palavras com caracteres especiais e dá numero de palavras através do length
        $("#contador-palavras").text(qtdPalavras); //variavel qtdPalavras representada no html agora.

        var conteudoSemEspaco = conteudo.replace(/\s+/g,''); // corringo bug do espaco contar como caractere

        var qtdCaracteres = conteudoSemEspaco.length; // conteudo apresentando seu tamanho de string
        $("#contador-caracteres").text(qtdCaracteres); // inserindo valor de tamnho da string no html
      });
}

function inicializaConometro(){

    campo.one("focus", function(){ // funcao one é um evento unico, se usassemos input ocorreria um bug que cada vez que saissemos do campo e retornassemos a recontagem começava.
      var tempoRestante = $("#tempo-digitacao").text(); // seleciono o texto do tempo-digitacao vindo do html
      $("#botao-reiniciar").attr("disabled",true); //impossibilita restarta o tempo no meio do jogo
      var conometroID = setInterval(function(){
        tempoRestante--; // tempo - 1 segundo
        $("#tempo-digitacao").text(tempoRestante); // insere tempo restante no html

          if (tempoRestante < 1) { // se contador zerar
            clearInterval(conometroID); // conometro encerra contagem
            $("#botao-reiniciar").attr("disabled",false); // habilitamos o botão apos fim do jogo
            finalizaJogo(); // funcao a parte
          }
      },1000); // 1000 milisegundos

    });
}

function atualizaTempoInicial(tempo){
  tempoInicial = tempo;
  $("#tempo-digitacao").text(tempo);
}

function finalizaJogo() {
  campo.attr("disabled", true); // habilita disable no input
  campo.toggleClass("campo-desativado"); // borda no campo desativado é ligada
  inserePlacar(); // ao final do jogo insere placar com função feita separadamente
  form(nome);
}

function reiniciaJogo(){
  campo.attr("disabled",false); // desabilita disabled do campo
  campo.val(""); //limpa campo
  $("#contador-palavras").text("0"); // reinicia contador de palavras
  $("#contador-caracteres").text("0"); // reinicia contador de caracteres
  $("#tempo-digitacao").text(tempoInicial); // reinicia tempo de contagem
  inicializaConometro(); // chama função conometro;
  campo.toggleClass("campo-desativado"); // borda no campo é desligada.

  campo.removeClass("borda-vermelha");
  campo.removeClass("borda-verde");
}

function inicializaMarcadores() {
  campo.on("input", function(){ // input no campo
      var frase = $(".frase").text();
    var digitado = campo.val(); // resgato minha frase html
    var comparavel = frase.substr(0, digitado.length); // comparo frase digitada com frase html
      if (digitado == comparavel) { // se igual
        campo.addClass("borda-verde");
        campo.removeClass("borda-vermelha");
      } else { // se diferente
        campo.addClass("borda-vermelha");
        campo.removeClass("borda-verde");
      }
  });
}
