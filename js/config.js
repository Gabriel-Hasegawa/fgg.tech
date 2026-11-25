/**
 * Configuração central da FGG Tech.
 * Altere contatos, endereço e envio de e-mail aqui.
 * O HTML e o restante do JavaScript leem este objeto.
 */
window.SITE_CONFIG = {
  company: {
    name: 'FGG Tech',
    addressStreet: 'Rua XV de Novembro, 757, Centro',
    addressCity: 'Paraguaçu Paulista — SP',
    mapsQuery: 'Rua XV de Novembro, 757, Centro, Paraguaçu Paulista - SP'
  },

  whatsapp: {
    displayNumber: '+55 18 99618-2841',
    number: '5518996182841',
    defaultMessage: 'Olá! Conheci a FGG Tech pelo site e gostaria de conversar sobre um projeto.'
  },

  instagram: {
    /*
     * Preencha a URL completa quando o perfil oficial existir.
     * Exemplo: url: 'https://www.instagram.com/fggtech/'
     * Enquanto url estiver vazio, os botões do Instagram permanecem ocultos.
     * Não inventar usuário.
     */
    url: '',
    handle: ''
  },

  emailForm: {
    /*
     * E-mail comercial que recebe as mensagens do formulário.
     * Deixe vazio até o endereço real estar definido.
     * Também aceita o e-mail aleatório gerado pelo FormSubmit, se preferir ocultar o endereço.
     */
    recipientEmail: '',
    endpointBase: 'https://formsubmit.co/ajax/',
    subject: 'Novo contato — Site FGG Tech',
    captcha: 'false',
    template: 'table',
    /* Limite documentado pelo FormSubmit: 10 MB somados, em todos os anexos do envio. */
    maxTotalBytes: 10 * 1024 * 1024,
    allowedExtensions: ['.pdf', '.png', '.jpg', '.jpeg', '.docx']
  }
};
