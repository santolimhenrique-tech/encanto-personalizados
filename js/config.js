/* Conteúdo da proprietária. Use apenas fotografias e informações aprovadas. */
window.ENCANTO_CONFIG = {
  whatsapp: '5511940596498', // Número oficial fornecido pela proprietária.
  instagram: 'https://www.instagram.com/_encantopersonalizados_26/', // Perfil oficial da marca.
  message: 'Olá! Conheci a Encanto Personalizados pelo site e gostaria de fazer um pedido de produtos personalizados.',
  categories: { imas: 'Ímãs', broches: 'Broches', chaveiros: 'Chaveiros' },
  productNames: { imas: 'Ímãs personalizados', broches: 'Broches personalizados', chaveiros: 'Chaveiros personalizados' },
  // Fotos de fallback para layouts que ainda possuam .collection-art.
  // A galeria atual usa imagens no HTML para funcionar também sem JavaScript.
  images: {
    chaveiros: { src: 'public/images/chaveiros-temas-960.webp', alt: 'Quatro chaveiros personalizados com temas Pet, Viagem, Fé e Formatura', width: 960, height: 1051 },
    imas: { src: 'public/images/familia-gestacao-960.webp', alt: 'Três ímãs com fotografias de gestação em família', width: 960, height: 720 },
    broches: { src: 'public/images/bandeiras-india-suica-960.webp', alt: 'Broches com as bandeiras da Índia e da Suíça', width: 960, height: 1280 },
  },
  ownerImage: null,
  about: {
    approved: false,
    paragraphs: [
      'A Encanto Personalizados nasceu do carinho pelos pequenos detalhes e da vontade de transformar momentos especiais em lembranças que fazem parte do nosso dia a dia.',
      'Cada produto é uma oportunidade de guardar uma história, celebrar uma conquista ou presentear alguém querido.'
    ]
  }
};
