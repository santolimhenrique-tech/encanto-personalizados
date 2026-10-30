# Revisão de produção — 30/10/2026

## Resultado

O código local está preparado para publicação estática na Vercel, sem alteração do design ou da stack. Há uma pendência externa: o repositório informado no GitHub está vazio. Não é possível confirmar arquivos versionados onde ainda não há commits. Nenhum push ou deploy foi realizado.

Repositório auditado: https://github.com/santolimhenrique-tech/encanto-personalizados.git

`git ls-remote` não retornou refs; o clone de auditoria informou repositório vazio e `git status` confirmou “No commits yet on main”. A cópia foi feita em work/, separada dos arquivos do site.

## Itens solicitados

| Item | Resultado |
| --- | --- |
| Stack | HTML5, CSS e JavaScript vanilla. Sem frameworks, bibliotecas instaladas, API, banco ou servidor necessário em produção. |
| index.html | Na raiz da pasta real do projeto: outputs/encanto-personalizados. O ZIP específico da Vercel coloca index.html diretamente na raiz do arquivo extraído. |
| Caminhos | Conferidos HTML, srcset, poster, arquivos CSS, fontes e imagem social, incluindo maiúsculas/minúsculas para Linux. 25 URLs da saída dist/ responderam HTTP 200, sem fallback HTML indevido para assets. |
| GitHub | Pendente: remoto vazio, sem commits ou arquivos. Enviar o conteúdo corrigido antes de importar pela integração Git. |
| WhatsApp | Os nove CTAs usam https://wa.me/5511940596498 e a mensagem de pedido; categorias continuam acrescentando seu contexto pelo JavaScript. |
| Instagram | Os dois ícones usam https://www.instagram.com/_encantopersonalizados_26/, com nova aba, aria-label e rel seguro. |
| Temas | Claro/escuro, preferência do sistema, escolha persistida e armazenamento bloqueado testados. |
| Mobile | Testes em 320, 390, 768, 1024, 1440 e 1920 px, nos dois temas, sem overflow horizontal. |
| SEO/OG | Indexação liberada. Title, description, idioma, OG de marca, logo social e dados da imagem conferidos. Canonical, og:url, imagem absoluta, sitemap e robots são finalizados no build com a URL real. |
| Links/JS/conteúdo | Âncoras e assets válidos, sem exceções JavaScript no percurso, sem avisos provisórios visíveis. Textos de rascunho desativados no config não aparecem na página. |
| Vídeo | MP4 original de 3.397.632 bytes, 480×854, duração 11,704 s. Metadados moov antes de mdat: reprodução progressiva já adequada. Poster e controles preservados, sem autoplay; preload alterado para none. Nenhuma requisição MP4 antes da reprodução no teste. Reproduziu e decodificou sem erro. |
| Vercel | Publicação por dist/, inteiramente estática. Node.js é usado apenas no build e na prévia local. |

## Correções realizadas

1. Removido `noindex, nofollow` da página aprovada; produção passa a usar `index, follow`.
2. Adicionada imagem social com cópia da logo oficial original, sem edição ou recorte. Incluídos tipo, dimensões e descrição da imagem, nome do site e card social quadrado.
3. Adicionada finalização de metadados no build: usa SITE_URL quando informada, ou a URL de produção exposta pela Vercel. Não foi inventado um domínio público. Gera canonical, og:url, og:image absoluta, robots.txt e sitemap.xml.
4. Build passa a limpar exclusivamente a saída dist/ verificada, recusando links simbólicos. Isso evita resíduos de builds anteriores. Originais, notas Markdown, fontes não utilizadas e ícone provisório não são enviados à saída pública; continuam preservados no código-fonte.
5. Vídeo passa a aguardar interação, eliminando seu download no carregamento inicial. O arquivo não foi recodificado; hashes da origem e da saída são idênticos.
6. Install Command desativado por não haver dependências. Node 24.x fixado, compatível com a versão validada. Adicionado `npm run preview` para testar o artefato final.
7. Lint ampliado para srcset, URLs de fontes e diferenças de caixa nos caminhos.

## Evidência de validação

- `npm run lint`: aprovado.
- `npm run build`: aprovado.
- `node tests/production.mjs`: 25 URLs locais aprovadas, CTAs oficiais, metadados, ausência de provisórios e streaming parcial (HTTP 206, 1024 bytes) aprovados.
- `node tests/browser.mjs http://127.0.0.1:4180/`: 62 verificações aprovadas sobre o build de produção, incluindo temas, mobile, fotos, FAQ, localização e regressões de navegação.
- Build Vercel simulado em pasta isolada work/: canonical, imagem social absoluta, robots e sitemap corretos. Domínio reservado usado somente nessa fixture, sem gravá-lo no projeto entregue.
- Reprodução real no navegador de teste: 480×854, 11,704 s, sem erro. Antes de reproduzir houve zero solicitações MP4. Recursos iniciais observados nesse teste local: aproximadamente 220 KB, excluindo o documento principal. Isso não é uma medição de Core Web Vitals em produção.
- Nenhuma mensagem foi enviada ao WhatsApp ou Instagram. Os destinos foram validados; registro do telefone e disponibilidade do serviço externo não são certificados por essa auditoria.

## Configuração na Vercel

Primeiro extraia o pacote e envie os arquivos extraídos ao GitHub. Não envie somente o ZIP: a Vercel precisa encontrar index.html, package.json e vercel.json no repositório.

| Campo | Selecionar |
| --- | --- |
| Framework Preset | Other |
| Root Directory | ./ se index.html estiver na raiz do repositório. Se enviar a estrutura completa deste chat, selecionar outputs/encanto-personalizados. |
| Build Command | node scripts/build.mjs |
| Output Directory | dist |
| Install Command | Vazio/desativado; já declarado como string vazia em vercel.json. |
| Node.js Version | 24.x, também fixado em package.json. |
| Environment Variables | Habilitar “Enable access to System Environment Variables”. SITE_URL é opcional para fixar o domínio público próprio completo, começando por https://. |

O vercel.json já declara framework null (Other), build, saída e instalação. Não selecionar public como Output Directory: nesta estrutura, public contém assets em subpastas, enquanto a página está em index.html na raiz do projeto.

Sem domínio próprio, o build usa VERCEL_PROJECT_PRODUCTION_URL e, como fallback, VERCEL_URL. Com domínio próprio, SITE_URL tem prioridade. A URL precisa ser pública, HTTPS e sem subpasta, query ou fragmento. Depois de mudar o domínio, gerar novo build/deploy para atualizar os metadados.

Não há segredo, banco, checkout ou variável de API a configurar.

## Referências oficiais consultadas

- https://vercel.com/docs/builds/configure-a-build
- https://vercel.com/docs/project-configuration/vercel-json
- https://vercel.com/docs/environment-variables/system-environment-variables
- https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
