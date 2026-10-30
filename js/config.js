/* Conteúdo da proprietária. Use apenas fotografias e informações aprovadas. */
window.ENCANTO_CONFIG = {
  whatsapp: '5511940596498', // Número oficial fornecido pela proprietária.
  instagram: 'https://www.instagram.com/_encantopersonalizados_26/', // Perfil oficial da marca.
  message: 'Olá! Conheci a Encanto Personalizados pelo site e gostaria de fazer um pedido de ímãs personalizados.',
  categories: { fotos: 'Ímãs com fotos', viagens: 'Ímãs de viagens', bandeiras: 'Ímãs com bandeiras', especiais: 'Lembranças especiais' },
  // Fotos de fallback para layouts que ainda possuam .collection-art.
  // A galeria atual usa imagens no HTML para funcionar também sem JavaScript.
  images: {
    fotos: { src: 'public/images/familia-gestacao-960.webp', alt: 'Três ímãs com fotografias de gestação em família', width: 960, height: 720 },
    viagens: { src: 'public/images/colecao-recordacoes-586.webp', alt: 'Coleção de ímãs com viagens e retratos de família na geladeira', width: 586, height: 1040 },
    bandeiras: { src: 'public/images/bandeiras-india-suica-960.webp', alt: 'Ímãs com as bandeiras da Índia e da Suíça', width: 960, height: 1280 },
    especiais: { src: 'public/images/familia-gestacao-960.webp', alt: 'Ímãs fotográficos como lembrança de uma gestação', width: 960, height: 720 }
  },
  ownerImage: null,
  about: {
    approved: false,
    paragraphs: [
      'A Encanto Personalizados nasceu do carinho pelos pequenos detalhes e da vontade de transformar momentos especiais em lembranças que fazem parte do nosso dia a dia.',
      'Cada ímã é uma oportunidade de guardar uma história, celebrar uma conquista ou presentear alguém querido.'
    ]
  }
};
