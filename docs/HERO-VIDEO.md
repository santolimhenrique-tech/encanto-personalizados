# Vídeo de fundo e header compacto

Vídeo fornecido: 8952233-uhd_3840_2160_25fps.mp4, original de 30.865.503 bytes e duração de 11,24 segundos. Derivados H.264/yuv420p com faststart, sem áudio: familia-hero-720.mp4 (1280×720, 2.705.423 bytes) e familia-hero-360.mp4 (640×360, 1.052.482 bytes). Não foram aplicados filtros de cor.

A imagem anterior permanece no HTML e aparece antes do vídeo. A fonte de vídeo só é atribuída após load, a conclusão da abertura e uma janela ociosa, quando a Hero está visível. Movimento reduzido, economia de dados e conexão informada como 3G ou inferior mantêm somente a imagem. Erro ou reprodução bloqueada também preservam o fallback. Vídeo pausa fora da viewport ou quando a aba perde visibilidade.

Sem a API de informações da conexão, não é possível detectar automaticamente sua velocidade; o carregamento permanece adiado. Não há bibliotecas adicionadas ao projeto. Ferramenta de transcodificação temporária em work/media-tools, fora do projeto versionado.

Header desktop: 108px com logo 92×92px, a partir de 701px. Mobile preservado. Header já era estático, sem offset sticky a corrigir.

Sem commit, push ou deploy nesta etapa.
