# Ajustes finais — 30/10/2026

## Tipografia

A família exata do parágrafo `.hero-description` era DM Sans, herdada de `body { font-family: var(--sans) }`. Ela continua sendo servida localmente, em WOFF2 nos pesos 400 e 500, e agora é aplicada também aos títulos, slogans, numeração das etapas e demais textos. As definições e o preload de Cormorant Garamond foram retirados do carregamento da aplicação. A logo continua sendo a imagem oficial intacta.

A hierarquia foi ajustada com tamanhos responsivos, peso 500 nos títulos, tracking e entrelinhas apropriados à DM Sans. O Hero mantém a frase fornecida, com quebras naturais e balanceadas.

## Fotografias

As imagens da galeria usam raio de 12px diretamente no bitmap renderizado. Cada imagem conserva sua proporção, com width/height automáticos e limites correspondentes à área de apresentação. Isso evita que o arredondamento seja aplicado apenas a um retângulo maior com object-fit: contain e fique invisível na foto vertical. Fundos e padding decorativos dos containers de produtos foram retirados; os ímãs continuam inteiros.

O oval 3:4 do Hero, com object-fit: cover e centralização, foi preservado. As logos, vídeo e arquivos originais não foram alterados.

## Conteúdo

- Aviso provisório do Sobre removido sem substituição; demais textos e logo mantidos.
- Resposta sobre várias unidades substituída pelo texto aprovado pelo usuário.
- Perguntas e respostas sobre pagamento e entregas removidas; permanecem três perguntas em details/summary nativos.
- Seção discreta “Onde estamos”, antes do rodapé, com o texto fornecido e Guarulhos — SP. Sem endereço exato ou mapa.

## Validação

62 verificações de navegador aprovadas, registradas em test-results.json:

- DM Sans carregada e aplicada aos textos renderizados nos dois temas.
- Fotos com raio de 12px e razão entre largura/altura correspondente à imagem original, verificadas em 390 e 1440 px nos dois temas.
- Oval do Hero preservado.
- FAQ com três perguntas, resposta nova exata e accordion funcional. A resposta de várias unidades também foi aberta na prévia do Codex.
- Aviso provisório ausente e logo presente no Sobre.
- Texto de Guarulhos e posição da seção antes do rodapé.
- Regressões de WhatsApp, mensagens, filtros, menu, Escape, teclado, tema inicial/persistido e movimento reduzido.
- Responsividade nos temas claro/escuro em 320, 390, 768, 1024, 1440 e 1920 px, sem overflow horizontal.
- Carregamento lazy das imagens, modo sem JavaScript, arquivo local, contraste de corpo/botões e ausência de exceções JavaScript.

Capturas desktop/mobile nos dois temas revisadas. Lint estrutural e build estático aprovados. Nenhuma biblioteca instalada e nenhum deploy realizado.
