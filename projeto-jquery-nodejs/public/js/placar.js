$("#botao-sync").click(sincronizarPlacar);

function inserePlacar() {
  var corpoTabela = $(".placar").find("tbody"); // busco elemento filho do tbody
  var usuario = "Sandy";
  var numPalavras = $("#contador-palavras").text();

  var linha = novaLinha(usuario, numPalavras); // busco funcao novaLinha
  linha.find(".botao-remover").click(removeLinha); // busco elemento filho do botao remover e insiro click nele.

  corpoTabela.append(linha);

  $(".placar").slideDown(500);
  scrollPlacar();
}

function scrollPlacar() {
  var posicaoPlacar = $(".placar").offset().top; // a posição que o placar esta em relacao ao topo.

  $("body").animate(
  {
    scrollTop: posicaoPlacar + "px"
  }, 1000);
}

function novaLinha(usuario, numPalavras) {
  var linha = $("<tr>"); // crio o elemento html tr
  var colunaUsuario = $("<td>").text(usuario); // crio meu elemento td que contera meu Usuario
  var colunaPalavras = $("<td>").text(numPalavras); // crio meu elemento td que contera numero de Palavras
  var colunaRemover = $("<td>");

  var link = $("<a>").attr("href","#").addClass("botao-remover"); // insiro link no elemento <a> que estou criando possuindo class tmb
  var icone = $("<i>").addClass("small").addClass("material-icons").text("delete"); // insiro material icons e texto delete no <i> que estou criando

  link.append(icone); // refiro icone como filho do link

  colunaRemover.append(link); // refiro link como filho da coluna remover

  linha.append(colunaUsuario);
  linha.append(colunaPalavras);
  linha.append(colunaRemover);

  return linha; // retorno da linha criada
}

function removeLinha (event) {
  event.preventDefault(); // impedir a pagina de saltar para cima
  var linha = $(this).parent().parent();

  linha.fadeOut(); //fadeOut não remove apenas oculta por isto setTimeout pq precisa impor um tempo para o fadeOut ocorrer e garantir a execucao da remocao apos este tempo
  setTimeout(function(){
    linha.remove();
  },1000);
}

function finalizaJogo() {
  campo.attr("disabled", true); // habilita disable no input
  campo.toggleClass("campo-desativado"); // borda no campo desativado é ligada
  inserePlacar(); // ao final do jogo insere placar com função feita separadamente
}

$("#botao-placar").click(mostrarPlacar);

function mostrarPlacar() { // funcao afim de ocupar e mostrar placar com slide suave
  $(".placar").slideToggle(600); // toggle

  var linhas = $("tbody>tr"); //seleciona todos os tr dentro do tbody

    linhas.each(function(){
      var usuario = $(this).find("td:nth-child(1)").text(); // seleciona texto do do primeiro td dentro da tr
      var palavras = $(this).find("td:nth-child(2)").text(); // seleciona texto dentro do segundo td dentro da tr

      var score = { // tornou-se um objeto
        usuario: usuario,
        pontos: palavras
      };

      placar.push(score); // envia placar por puxe com o objeto.
    });

      var dados = {
        placar: placar
      };

        $.post("http://localhost:3000/placar",dados, function(){
          console.log("Placar sincronizado com sucesso");
        });
}


function atualizaPlacar(){
  $.get("http://localhost:3000/placar", function(data){
    $(data).each(function(){ // para cada objeto aciona função
      var linha = novaLinha(this.usuario, this.pontos); // nova linha é este ponto e usuario

      linha.find(".botao-remover").click(removeLinha); // adiciona botão remover em novas linhas
      $("tbody").append(linha);
    });
  });
}
