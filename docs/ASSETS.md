# Integração dos arquivos reais

## Inventário analisado individualmente

| Arquivo original | Conteúdo observado | Uso |
| --- | --- | --- |
| `logo encanto.jpg` | Logo quadrada oficial, monograma EP com coração, nome Encanto e Personalizados | Cabeçalho, rodapé e bloco da marca; ícones PNG com a imagem completa |
| `WhatsApp Image 2026-k10-29 at 16.10.28.jpeg` | Ímãs com bandeiras da Índia e Suíça, em base azul de corte | Categoria bandeiras, junto da foto da Alemanha |
| `WhatsApp Image 2026-10-29 atk 16.10.28.jpeg` | Três ímãs com bandeira alemã | Categoria bandeiras |
| `WhatsApp Image 2026-10-29 at 16.10.28.jpeg` | Coleção na geladeira com fotos familiares, aniversários e passeios/viagens | Hero e viagens; sem atribuir nomes ou destinos não confirmados |
| `WhatsApp Image 2026-10-29 at 16.10.27.jpeg` | Três ímãs com ensaio de gestação em família | Fotos e ocasiões especiais; é a mesma foto, adequada às duas categorias |
| `WhatsApp Video 2026-10-29 at 16.10.29.mp4` | Câmera percorre ímãs fotográficos na geladeira | Bloco após a galeria, com controles, sem autoplay |

Nenhuma imagem foi identificada como retrato da proprietária. Não foram inferidas identidades das pessoas impressas nos ímãs. O espaço Sobre usa a logo oficial até receber um retrato identificado.

## Preservação e desempenho

- Originais JPEG preservados sem alteração em `public/images/originais/`.
- Fotos WebP em resoluções de até 640, 960 e 1280 px, limitadas à resolução de origem; sem ampliação artificial. A foto vertical da coleção tem 586×1040 px e não foi ampliada no arquivo.
- Nenhuma edição nas fotografias impressas, bandeiras, contornos físicos ou cores. Apenas orientação EXIF, redução proporcional e compressão.
- Logo completa, sem redesenho ou recorte, em variantes de 240 e 480 px, WebP sem perdas após redimensionamento. Ícones completos de 64 e 180 px, preservando proporções. O ícone tipográfico provisório deixou de ser referenciado.
- Dimensões explícitas, srcset/sizes quando aplicáveis, carregamento lazy nativo na galeria e prioridade alta no hero. Produtos sempre com object-fit: contain.
- Vídeo original idêntico ao fornecido (3.397.632 bytes), resolução 480×854, duração aproximada de 11,7 s. Não houve recodificação, corte ou inserção de áudio. Prévia usa a foto real da coleção e a reprodução só ocorre por ação do visitante.
- Servidor local atualizado com MIME video/mp4 e suporte HTTP Range, incluindo respostas 206, para navegação na reprodução.
- Paleta rosa, vinho, creme e marrom preservada; rosa de apoio harmonizado com a logo. O vinho de ação mantém o contraste com o texto claro.

## Verificações desta integração

- Lint estrutural e build estático aprovados.
- 27 testes funcionais aprovados (menu, filtros, FAQ, teclado, mensagens, sem JS, movimento reduzido e seis larguras de 320 a 1920 px).
- 16 recursos reais de mídia/fontes referenciados no HTML e srcsets responderam HTTP 200 com tipos corretos.
- Streaming do MP4 testado com Range bytes=0-1023: HTTP 206 e 1024 bytes.
- Vídeo aberto e visualmente conferido no navegador. Logo, hero, galeria e rodapé revisados em capturas completas de 1440, 768 e 390 px.
- Nenhuma alteração de contato, preço, pagamento ou entrega. Sem deploy.

## Crítica da composição após integração

ROUND 3

Seen in one second: logo oficial e fotografia real dos ímãs no hero.

Idea (one sentence): a peça de papelaria afetiva da Encanto agora apresenta as próprias lembranças da marca.

Live thing: filtros de categoria, mensagem personalizada e vídeo acionado pelo visitante.

Layout words by section: hero=dupla editorial / galeria=coleção / vídeo=apresentação / processo=itinerário / sobre=carta / pedido=campo de cor / FAQ=lista / rodapé=marca.

Scores: design 7.0 · usability 8.0 · creativity 6.5 · content 7.0 → overall limitado a 6.0 pelo gate visual da skill.

Caps applied: o inspector continua registrando diferenças de estilo em relação à TasteSkill; não se alega aprovação integral do gate. A inspeção registrada antes de adicionar o poster indicou 6 FAIL e 3 WARN: extensão dos títulos solicitados, numeração solicitada, proporção do foco visual, um rótulo interpretado como eyebrow, fundo creme, variedade de tamanhos e ausência de poster. O poster foi adicionado posteriormente; os demais são mantidos pela composição e pelo conteúdo solicitado. Não houve falha funcional nesses achados.

Top three problems:
1. desktop-fold: foto vertical de baixa resolução tem largura limitada. Mantida inteira e sem ampliação de arquivo; futuro ensaio horizontal permitirá maior destaque.
2. mobile-fold: título fornecido ocupa quatro a cinco linhas. Mantida a frase solicitada e sua legibilidade, sem encobrir os controles.
3. desktop-page-01: foto de gestação aparece em duas categorias. Registrado como conteúdo real com dupla aplicação; um novo ensaio de eventos permitirá variedade.

As oito capturas da inspeção foram abertas e revisadas. O relatório histórico da implementação inicial permanece em QUALIDADE.md; o estado atual de fotografias e identidade é o descrito aqui.
