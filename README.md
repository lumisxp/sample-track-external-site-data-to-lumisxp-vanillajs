# Como coletar dados para uma instalação do LumisXP
Esse exemplo demonstra como coletar dados de um website para uma instalação do [**LumisXP**](https://lumisxp.lumis.com.br/) usando Javascript puro.
Os arquivos de exemplo encontram-se na pasta `static` desse repositório. Nela existem três arquivos HTML usados para simular uma navegação, um arquivo Javascript utilizado para inicializar a [API de coleta de dados do **LumisXP**](https://lumisxp.lumis.com.br/doc/lumisportal/12.2.0/pt-BR/lumis.customization_and_development.technical_documentation.monitor.javascript_api.html) e um arquivo CSS para definir regras básicas de estilização.

# Requisitos antes de executar o exemplo
Antes de executar esse exemplo, alguns ajustes precisam ser feitos no [**LumisXP**](https://lumisxp.lumis.com.br/) para liberar as chamadas vindas do servidor de exemplo.
Para ver esses ajustes, veja a [página esplicativa no manual](https://lumisxp.lumis.com.br/doc/lumisportal/12.2.0/pt-BR/lumis.customization_and_development.technical_documentation.monitor.javascript_api.completesamples.html).

# Como executar esse exemplo
Para facilitar a execução desse exemplo, recomenda-se a instalação do [Node.JS](https://nodejs.org/).
Em seguida, em um terminal dentro da pasta onde esse exemplo foi clonado, basta executar:

```Bash
$ npm install
$ npm run start
```

Em seguida, digitar `http://localhost:3000` em um navegador da internet.

# Explicando o código
Esse exemplo considera que o servidor para o qual os dados serão coletados é `http://localhost:8080`. Caso seja outro, o exemplo precisa ser adaptado de acordo.

Nas páginas, dentro do elemento `<head>`, há o primeiro block de script que faz:

```Javascript
// servidor LumisXP
var lumisXPServer = "http://localhost:8080";

// pre-inicialização
window.lum_track=window.lum_track||function(){(lum_track.q=lum_track.q||[]).push([+new Date].concat([].slice.call(arguments)))};
lum_track('config',{baseHref:lumisXPServer});

// pós-inicialização
document.addEventListener("DOMContentLoaded", function(){
	// coletar pageview assim que a API do LumisXP estiver disponível
	lum_track("event", "lumis.portal.monitor.ev.pageview");
});

// armazenar horário de acesso para calcular tempo gasto na página
var lastPageviewTime = new Date().getTime()

// coletar evento de leavepage no beforeUnload da janela
window.addEventListener("beforeunload", function() {
	var duration = new Date().getTime() - lastPageviewTime

	lum_track("event", "lumis.portal.monitor.ev.leavepage", {
		"lum_event.duration": duration
	});
});
```

Separando esse trecho em partes, temos:

#### 1 - Uma pré inicialização do script de rastreamento do [**LumisXP**](https://lumisxp.lumis.com.br/)
```Javascript
// servidor LumisXP
var lumisXPServer = "http://localhost:8080";

// pre-inicialização
window.lum_track=window.lum_track||function(){(lum_track.q=lum_track.q||[]).push([+new Date].concat([].slice.call(arguments)))};
lum_track('config',{baseHref:lumisXPServer});
```
Essa pré inicialização serve para preparar o básico do código para preparar a página para que a [API de coleta de dados do **LumisXP**](https://lumisxp.lumis.com.br/doc/lumisportal/12.2.0/pt-BR/lumis.customization_and_development.technical_documentation.monitor.javascript_api.html) possa ser utilizada.

#### 2 - Agenda a coleta de um evento de _pageview_ uma vez que o DOM esteja carregado
```Javascript
// pós-inicialização
document.addEventListener("DOMContentLoaded", function(){
	// coletar pageview assim que a API do LumisXP estiver disponível
	lum_track("event", "lumis.portal.monitor.ev.pageview");
});
```
Esse trecho dispara uma coleta de um evento de _pageview_ assim que:
1. O DOM da página esteja pronto; e
2. A [API de coleta de dados do **LumisXP**](https://lumisxp.lumis.com.br/doc/lumisportal/12.2.0/pt-BR/lumis.customization_and_development.technical_documentation.monitor.javascript_api.html) já tenha sido carregada corretamente na página.


#### 3 - Agenda uma coleta do evento de _leavepage_ para quando o usuário estiver prestes a sair da página
```Javascript
// armazenar horário de acesso para calcular tempo gasto na página
var lastPageviewTime = new Date().getTime()

// coletar evento de leavepage no beforeUnload da janela
window.addEventListener("beforeunload", function() {
	var duration = new Date().getTime() - lastPageviewTime

	lum_track("event", "lumis.portal.monitor.ev.leavepage", {
		"lum_event.duration": duration
	});
});
```

O evento de _leavepage_ (saída da página), que é utilizado em alguns relatórios padrão do [**LumisXP**](https://lumisxp.lumis.com.br/), requer que um valor seja passado no campo `lum_event.duration` que representa o número de milissegundos que o usuário permaneceu na página.

Esse tempo é calculado armazenando na variável `lastPageviewTime` a data e hora atual em milissegundos e depois subtraindo dessa variável a data e hora em milissegundos do momento que o usuário saiu da página.

Após esse primeiro trecho de Javascript, é feita a inclusão da [API de coleta de dados do **LumisXP**](https://lumisxp.lumis.com.br/doc/lumisportal/12.2.0/pt-BR/lumis.customization_and_development.technical_documentation.monitor.javascript_api.html):

```HTML
<script async src='http://localhost:8080/lumis/portal/monitor/script/track.js'></script>
```

Essa tag de script inclui a API de forma assíncrona, para ter o menor impacto no carregamento da página o possível.