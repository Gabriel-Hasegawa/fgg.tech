# FGG Tech — landing page

Site institucional estático da FGG Tech. HTML, CSS e JavaScript, sem backend, banco de dados ou etapa de build.

## Abrir no computador

Na pasta do projeto:

```bash
python -m http.server 8765
```

Depois abra `http://localhost:8765`.

Um servidor local é o modo recomendado. A prévia dos projetos em iframe e o envio do formulário dependem de HTTP. Abrir o `index.html` direto pelo explorador de arquivos pode impedir ícones externos e o formulário.

## Publicar

Envie a pasta inteira para uma hospedagem de arquivos estáticos (Netlify, Cloudflare Pages, GitHub Pages, hospedagem compartilhada). Não há comando de build.

Antes de publicar:

1. Defina o e-mail comercial em `js/config.js`.
2. Ative o FormSubmit (passos abaixo).
3. Se o Instagram oficial existir, preencha `instagram.url`.
4. Troque `REPLACE_DOMAIN` em `sitemap.xml` e descomente a linha `Sitemap` em `robots.txt`.
5. Quando houver domínio, troque `og:image` em `index.html` por uma URL absoluta (`https://seu-dominio/assets/images/og-fgg-tech.png`).

## Contatos

Tudo que muda com frequência está em `js/config.js`:

- endereço e busca do Google Maps
- WhatsApp (número, texto exibido e mensagem inicial)
- Instagram (deixe `url` vazio para ocultar os botões)
- e-mail destinatário do formulário
- assunto e limite de anexos

## Ativar o FormSubmit

O formulário usa [FormSubmit](https://formsubmit.co/documentation). Não há servidor próprio.

1. Coloque o e-mail comercial real em `emailForm.recipientEmail`. Não use um endereço fictício.
2. Abra o site publicado em HTTPS e envie uma mensagem de teste.
3. O FormSubmit manda um e-mail de confirmação para esse destinatário. A primeira mensagem fica retida até alguém clicar no link de ativação. Arquivos dessa primeira tentativa não são guardados.
4. Depois da ativação, envie outro teste, de preferência com um anexo pequeno, e confira se a mensagem e o arquivo chegaram.
5. O site só mostra sucesso quando a resposta do serviço traz `success` igual a `"true"`. Uma falha de rede, um e-mail não ativado ou um erro do serviço aparecem como erro.

Limites conferidos na documentação do FormSubmit:

- anexos até **10 MB no total** por envio
- o envio precisa ser `POST` com `multipart/form-data`
- formatos aceitos nesta página: PDF, PNG, JPG, JPEG e DOCX
- o campo Reply-To usa o e-mail digitado pelo visitante
- o assunto enviado é `Novo contato — Site FGG Tech`

O formulário envia os anexos por `fetch` para `https://formsubmit.co/ajax/{email}`, em `multipart/form-data`, para manter a pessoa na modal e ler a resposta JSON. A documentação oficial mostra o anexo no POST tradicional da página; o endpoint `/ajax/` está documentado com JSON. Por isso o teste com arquivo, depois da ativação, é obrigatório.

Se o anexo não chegar pelo endpoint AJAX, a alternativa gratuita compatível com site estático é o [Web3Forms](https://web3forms.com/) ou o [Formspree](https://formspree.io/). Os dois aceitam POST com anexo sem backend. O restante do site não depende do FormSubmit: o destino está só em `js/config.js` e o envio está em `js/main.js`.

## Adicionar um projeto

Edite `js/projects.js`. Cada item tem `name`, `description`, `image`, `status`, `url`, `preview` e `category`.

Projeto publicado:

```js
{
  name: 'Nome',
  description: 'Descrição curta.',
  image: 'assets/images/project-nome.webp',
  status: 'publicado',
  url: 'https://site-oficial.exemplo',
  preview: null,
  category: 'Landing page'
}
```

Projeto em desenvolvimento, com HTML local:

1. Coloque o `index.html` e os arquivos que ele usa em `projects/nome-do-projeto/`.
2. Gere uma prévia 16:9 em WebP e salve em `assets/images/`.
3. Aponte `preview` para o HTML, por exemplo `projects/nome-do-projeto/index.html`.
4. Deixe `url` como `null` e `status` como `'em-desenvolvimento'`.

Se o HTML ainda não existir, mantenha `preview: null`. O card abre um aviso e não cria link quebrado.

A prévia local abre em uma modal com iframe. O botão Ampliar aumenta a modal. O botão Abrir página carrega o mesmo HTML em outra aba.

## Onde editar textos e cores

- Textos institucionais: `index.html`
- Cores e espaçamento: variáveis no topo de `css/style.css`
- Projetos: `js/projects.js`
- Contatos: `js/config.js`

## Pendências

Itens que dependem de informação ou arquivo de quem publica o site:

- E-mail comercial destinatário (`recipientEmail` está vazio de propósito).
- Confirmação da ativação do FormSubmit nesse e-mail, inclusive um teste com anexo.
- URL do Instagram, se houver perfil oficial. Os botões ficam ocultos até lá.
- Domínio definitivo para `sitemap.xml`, `robots.txt` e a imagem Open Graph absoluta.
- HTML do Sistema Contábil.
- HTML do Gerador de Sites.
- Revisão dos textos institucionais, se a empresa quiser uma redação própria.

A demonstração da Hasegawa Denki já aponta para `projects/hasegawa/index.html`. O Case Master Info abre `https://casemasterinfo.com.br/` em uma nova aba.
