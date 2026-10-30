# Encanto Personalizados

Landing page estática em HTML5, CSS3 e JavaScript ES6+, sem frameworks, checkout, autenticação, banco de dados ou dependências de runtime. Nenhum deploy realizado.

## Abrir

Na pasta deste projeto (`outputs/encanto-personalizados`), execute:

```sh
npm start
```

Acesse http://127.0.0.1:4173/. Mantenha o terminal aberto enquanto usa a prévia; Ctrl+C encerra o servidor. Não é necessário instalar pacotes. O comando usa apenas Node.js e serve a pasta correta independentemente da localização do terminal. A partir da pasta inicial do chat, também pode usar `npm --prefix outputs/encanto-personalizados start`. Se a porta estiver ocupada, use `npm start -- --port 4174` e acesse a porta indicada no terminal.

Também é possível abrir `index.html` diretamente. Os CTAs já apontam para o WhatsApp oficial e funcionam também sem JavaScript.

## Estrutura

- `index.html`: conteúdo semântico, oito seções, SEO e Open Graph básicos.
- `css/style.css`: cores, tipografia, composição, responsividade e movimento reduzido.
- `css/fonts.css` e `public/fonts`: DM Sans local em WOFF2 (pesos 400 e 500) e licenças OFL. A família é a mesma do parágrafo original do Hero.
- `js/config.js`: contato, categorias, imagens e história da marca.
- `js/main.js`: menu, seleção de categorias, FAQ nativo e mensagens WhatsApp.
- `js/theme.js`: tema inicial aplicado antes do CSS, preferência do sistema e persistência local.
- `public/images`: logo oficial, fotos reais e variantes WebP; originais preservados em `originais/`.
- `public/videos`: vídeo original dos produtos, com reprodução manual.
- `.agents/skills/design-taste-frontend`: TasteSkill instalada localmente, pronta para versionamento.
- `scripts`: validação e build sem instalação de pacotes.
- `tests/browser.mjs`: testes de navegador, requer Node 22+ e Chrome/Edge instalado.
- `docs`: resultados e decisões de design.

## Editar o conteúdo

O WhatsApp oficial, 5511940596498, e a mensagem de pedido estão centralizados em `js/config.js`. Todos os CTAs abrem o WhatsApp diretamente, com mensagem codificada via encodeURIComponent; os links de produto acrescentam a categoria. A seção de pedidos contém apenas título, texto e um botão, sem formulário ou avisos antigos. O HTML mantém um destino real de fallback para navegação sem JavaScript. Ao mudar o contato futuramente, atualizar também esse fallback.

O Instagram só aparece se uma URL HTTPS válida do Instagram for configurada. A alternância de tema respeita prefers-color-scheme na primeira visita e salva a escolha na chave localStorage `encanto-theme`. A preferência é aplicada antes dos estilos, sem recarregar a página. Se o armazenamento estiver bloqueado, o tema ainda funciona durante a visita. A logo e as fotos mantêm as cores originais nos dois temas.

Cada fotografia pode ser configurada assim, substituindo os valores pelos dados reais:

```js
images: {
  fotos: {
    src: 'public/images/familia.webp',
    alt: 'Descrição fiel dos ímãs visíveis na fotografia',
    width: 1200,
    height: 900,
    srcset: 'public/images/familia-600.webp 600w, public/images/familia.webp 1200w',
    sizes: '(max-width: 700px) 90vw, 45vw'
  }
}
```

A galeria atual e o hero usam imagens reais diretamente no HTML, incluindo srcset onde a resolução de origem permite. Para substituir uma foto, editar seu elemento img/picture em index.html; images em config.js serve como fallback para layouts com .collection-art. As fotos da galeria carregam de forma nativa com loading="lazy"; o hero tem prioridade alta. Os produtos usam object-fit: contain, sem filtros ou recortes. Configure ownerImage com a mesma estrutura caso seja fornecido um retrato confirmado da proprietária. Consulte docs/ASSETS.md para o inventário e classificação.

A história proposta no briefing está guardada em `about.paragraphs`, com `approved: false`. Ela não é apresentada como fato confirmado. Após revisão da proprietária, ajustar o texto e ativar `approved: true`. O texto visível atual se limita à proposta de produtos informada. O FAQ contém três perguntas aprovadas; a resposta sobre várias unidades já foi confirmada e as perguntas sobre pagamento e entregas foram removidas.

## Validação e build

```sh
npm run lint
npm run build
npm run test:browser
```

Não é necessário `npm install`. O lint do projeto valida sintaxe JS, IDs, âncoras, caminhos, título principal e JSON. Não equivale a uma auditoria completa HTML/WCAG. `build` valida e copia apenas a aplicação para `dist/`. Os testes de navegador exigem o servidor local ativo na porta 4173; também aceitam uma URL como argumento direto (`node tests/browser.mjs URL`).

Na Vercel, usar a pasta deste projeto como Root Directory. O `vercel.json` define framework nulo, comando `node scripts/build.mjs` e saída `dist`. A skill, testes e relatórios não são copiados para a aplicação publicada. Como é um site estático, hidratação não se aplica.

## Antes de publicar

A revisão técnica e a configuração atual da Vercel estão em `docs/PRODUCAO.md`. O código local está preparado, mas o repositório informado ainda estava vazio na auditoria; os arquivos precisam ser enviados antes de importar pela integração Git.


- WhatsApp e Instagram oficiais já configurados e verificados.
- Adicionar retrato identificado da proprietária, quando disponível. As quatro fotos de produtos já estão integradas.
- Logo oficial já integrada integralmente, inclusive nos ícones do navegador.
- Aprovar a história da marca, caso se deseje substituir o texto atual.
- Habilitar as variáveis de sistema da Vercel. O build usa a URL real de produção para canonical, og:url, og:image absoluta e sitemap; SITE_URL permite fixar um domínio próprio.
- A imagem social já usa a logo oficial; a URL absoluta é gerada no build.
- O bloqueio noindex já foi removido da página aprovada. Robots e sitemap são gerados com a URL real no build.
- Fazer um teste manual do WhatsApp com o número oficial e dos dispositivos reais.
- Autorizar o deploy separadamente.

## Limites da entrega

Galeria interativa com as quatro fotos reais fornecidas, logo oficial e vídeo dos produtos. Uma mesma foto de gestação aparece em fotos e ocasiões especiais; a coleção da geladeira reúne viagens e fotos pessoais. Nenhum retrato foi identificado como sendo da proprietária. A integração WhatsApp já utiliza o número oficial fornecido; os links foram validados sem envio de mensagens. Não foram inventados preços, materiais, medidas, prazos, avaliações ou condições comerciais.

TasteSkill instalada a partir de https://github.com/Leonxlnx/taste-skill, pasta `skills/taste-skill`, nome interno `design-taste-frontend`. Orientações lidas e aplicadas durante esta execução; a instalação local poderá ser descoberta pelo agente no próximo turno. Veja `docs/PRODUCAO.md` para a revisão técnica atual e `docs/AJUSTES-FINAIS.md` para os últimos ajustes visuais; `docs/REFINAMENTO.md` registra a etapa anterior. `docs/QUALIDADE.md` registra a inspeção histórica da primeira implementação.

A localização informada é Guarulhos — SP, apresentada antes do rodapé. As fotografias após o Hero têm raio de 12px no próprio elemento de imagem, sem corte dos produtos. O Hero mantém o oval 3:4 com object-fit: cover.

Para testar exatamente a saída de produção: `npm run build`, depois `npm run preview -- --port 4180` e acessar http://127.0.0.1:4180/. Com essa prévia ativa, executar `npm run test:production` e `node tests/browser.mjs http://127.0.0.1:4180/`.
