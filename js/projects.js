/**
 * Portfólio da FGG Tech.
 * Para incluir um projeto, copie um item e ajuste os campos.
 *
 * name         Nome exibido no card
 * description  Texto curto
 * image        Prévia 16:9 em WebP, relativa à raiz do site
 * status       'publicado' ou 'em-desenvolvimento'
 * url          Site oficial. Usado apenas quando status é 'publicado'
 * preview      Caminho local do index.html, por exemplo 'projects/hasegawa/index.html'
 *              Use null enquanto o HTML não existir
 * category     Rótulo do card
 */
window.PROJECTS_DATA = [
  {
    name: 'Case Master Info',
    description: 'Landing page Case Master Info.',
    image: 'assets/images/project-casemaster.webp',
    status: 'publicado',
    url: 'https://casemasterinfo.com.br/',
    preview: null,
    category: 'Landing page'
  },
  {
    name: 'Hasegawa Denki',
    description: 'Landing page Hasegawa Denki.',
    image: 'assets/images/project-hasegawa.webp',
    status: 'em-desenvolvimento',
    url: null,
    preview: 'projects/hasegawa/index.html',
    category: 'Landing page'
  },
  {
    name: 'Sistema Contábil',
    description: 'Sistema contábil.',
    image: 'assets/images/project-contabil.webp',
    status: 'em-desenvolvimento',
    url: null,
    preview: null,
    category: 'Sistema web'
  },
  {
    name: 'Gerador de Sites',
    description: 'Sistema de geração de sites.',
    image: 'assets/images/project-gerador-sites.webp',
    status: 'em-desenvolvimento',
    url: null,
    preview: null,
    category: 'Aplicação digital'
  }
];
