# Refinamento visual e conversão

Este documento descreve o estado atual. Os relatórios QUALIDADE.md e ASSETS.md preservam o histórico das etapas anteriores.

## Alterações

- Seção de pedidos com título, texto de apoio e um único CTA. Formulário, seletor, textarea, diálogo de contato ausente e aviso antigo foram removidos do HTML, dos eventos JS e dos estilos exclusivos.
- WhatsApp oficial: `5511940596498`, centralizado em `js/config.js`. Mensagem principal: “Olá! Conheci a Encanto Personalizados pelo site e gostaria de fazer um pedido de ímãs personalizados.” Links montados com `encodeURIComponent`; CTAs de produtos acrescentam a categoria. Todos usam o mesmo número, `target="_blank"` e `rel="noopener noreferrer"`. O HTML mantém links funcionais sem JavaScript.
- Botão de tema com ícones SVG de sol/lua, aria-label atualizado e estado aria-pressed. Funciona por clique e teclado, sem recarregar a página.
- Primeira visita segue `prefers-color-scheme`. Escolha manual fica na chave `encanto-theme` do localStorage; se o armazenamento estiver bloqueado, a alternância continua funcionando na visita. Mudanças de preferência do sistema são acompanhadas enquanto não existe escolha manual. Alterações em outra aba também são sincronizadas.
- `js/theme.js` é carregado de forma síncrona antes das folhas CSS: aplica o atributo data-theme e o theme-color antes da apresentação. CSS centraliza as paletas e a propriedade color-scheme.
- Claro: creme, rosa e vinho fornecidos. Escuro: fundos #251B21, #392831 e #45313B, texto #FFF1E9, secundário #D8C0C7 e destaque #B96D86. Controles usam rosa ligeiramente mais claro (#BF768E) com texto escuro para alcançar contraste mínimo de 4,5:1. O CTA da seção escura usa #E8A0B2.
- Logo preservada em superfície clara nos dois temas, sem filtros, inversão ou edição da imagem.
- Hero com moldura em arco, proporção aproximada 3:4, contorno discreto e imagem contida integralmente. Foi escolhida a moldura em vez de uma máscara oval para não cortar os ímãs nas extremidades da fotografia.
- Galeria com containers de 32px de raio (26px no mobile), espaçamento interno consistente e object-fit: contain. Fotos de bandeiras permanecem completas na composição dupla.
- Hover de escala 1.02 somente em dispositivos com hover e sem preferência por movimento reduzido; transições discretas. A regra de reduced-motion remove deslocamento e animação.
- Estilo arredondado preparado para um futuro retrato da proprietária; nenhum retrato foi identificado ou inventado.

## Verificação

51 asserções de navegador aprovadas, registradas em test-results.json:

- Claro e escuro em 320, 390, 768, 1024, 1440 e 1920 px, sem rolagem horizontal.
- Sistema, alternância sem reload, teclado, rótulos acessíveis, persistência após recarga e localStorage bloqueado.
- Contraste calculado de corpo, botões, seção de pedidos e filtro ativo >= 4,5:1 em ambos os temas.
- Todos os CTAs com número correto, mensagem principal correta, codificação e categoria quando pertinente; links internos preservados. Nenhum WhatsApp foi aberto e nenhuma mensagem foi enviada.
- Formulário, campos, aviso e diálogo antigos ausentes.
- Fotos carregando após rolagem em desktop e mobile, sem filtros e com contenção.
- Menu, Escape, restauração de foco, filtros e FAQ.
- Movimento reduzido, arquivo local e conteúdo/contato disponíveis sem JavaScript.
- Sem exceções JavaScript no percurso automatizado.

Capturas completas e da primeira tela foram revisadas em claro/escuro, desktop/celular. A captura completa foi feita após rolar a página para ativar imagens lazy. A navegação real da prévia do Codex também foi conferida, incluindo a logo no tema escuro.

`npm run lint` e `npm run build` aprovados. O servidor local continua na porta 4173. Não houve instalação de dependências, alteração de arquivos fotográficos ou deploy.

## TasteSkill

A skill local design-taste-frontend continua disponível e foi usada como referência de cores por função, contraste, composição e movimento. O refinamento preserva a direção editorial já adotada. As escolhas expressamente solicitadas — cantos maiores, moldura com linha fina, ícones de tema e textos existentes — prevalecem sobre preferências estéticas contrárias da skill. Não se alega nova aprovação integral do gate estético; as verificações desta etapa são as descritas acima.

## Pendências preservadas

Instagram, retrato identificado da proprietária, aprovação da história e das condições comerciais, domínio público e metadados sociais definitivos. O WhatsApp não é mais uma pendência. O projeto continua com noindex até a aprovação para publicação.
