/**
 * Comportamento da landing: navegação, portfólio, modais e formulário.
 * Os dados ficam em config.js e projects.js.
 */
(function () {
  const config = window.SITE_CONFIG || {};
  const projects = Array.isArray(window.PROJECTS_DATA) ? window.PROJECTS_DATA : [];

  const navLinks = Array.from(document.querySelectorAll('.dock a[data-nav]'));
  const sections = ['inicio', 'solucoes', 'sobre', 'projetos', 'contato']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const previewDialog = document.getElementById('preview-dialog');
  const previewFrame = document.getElementById('preview-frame');
  const previewEmpty = document.getElementById('preview-empty');
  const previewTitle = document.getElementById('preview-title');
  const previewKicker = document.getElementById('preview-kicker');
  const previewExpand = document.getElementById('preview-expand');
  const previewOpen = document.getElementById('preview-open');
  const previewClose = document.getElementById('preview-close');

  const emailDialog = document.getElementById('email-dialog');
  const emailForm = document.getElementById('email-form');
  const emailClose = document.getElementById('email-close');
  const emailSubmit = document.getElementById('email-submit');
  const emailError = document.getElementById('email-error');
  const emailStatus = document.getElementById('email-status');
  const emailSuccess = document.getElementById('email-success');
  const emailConfigNote = document.getElementById('email-config-note');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const fileInput = document.getElementById('contact-files');
  const fileList = document.getElementById('file-list');

  let selectedFiles = [];
  let sending = false;

  document.getElementById('year').textContent = String(new Date().getFullYear());

  applyContactConfig();
  renderProjects();
  initNavigation();
  initPreview();
  initEmailForm();

  function applyContactConfig() {
    const whatsapp = config.whatsapp || {};
    const company = config.company || {};
    const instagram = config.instagram || {};

    const whatsappHref = whatsapp.number
      ? `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.defaultMessage || '')}`
      : '';

    document.querySelectorAll('[data-whatsapp]').forEach((link) => {
      if (whatsappHref) link.href = whatsappHref;
    });

    document.querySelectorAll('[data-whatsapp-label]').forEach((node) => {
      if (whatsapp.displayNumber) node.textContent = whatsapp.displayNumber;
    });

    const mapsHref = company.mapsQuery
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.mapsQuery)}`
      : '';

    document.querySelectorAll('[data-maps]').forEach((link) => {
      if (mapsHref) link.href = mapsHref;
    });

    const street = document.querySelector('[data-address-street]');
    const city = document.querySelector('[data-address-city]');
    if (street && company.addressStreet) street.textContent = company.addressStreet;
    if (city && company.addressCity) city.textContent = company.addressCity;

    const instagramReady = typeof instagram.url === 'string' && instagram.url.startsWith('https://');
    document.querySelectorAll('[data-instagram]').forEach((link) => {
      if (!instagramReady) {
        link.hidden = true;
        link.removeAttribute('href');
        return;
      }
      link.hidden = false;
      link.href = instagram.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });

    const label = document.querySelector('[data-instagram-label]');
    if (label) label.textContent = instagram.handle || 'Abrir perfil';
  }

  function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    if (!projects.length) {
      grid.innerHTML = '<p>Nenhum projeto cadastrado em projects.js.</p>';
      return;
    }

    grid.innerHTML = projects.map((project, index) => {
      const external = isPublishedLink(project);
      const status = statusMeta(project.status);
      const tag = external ? 'a' : 'button';
      const attrs = external
        ? `href="${escapeAttr(project.url)}" target="_blank" rel="noopener noreferrer"`
        : `type="button" data-project="${index}"`;

      return `
        <${tag} class="project-card" ${attrs}>
          <span class="project-media">
            <img src="${escapeAttr(project.image)}" alt="Prévia do projeto ${escapeAttr(project.name)}" width="1600" height="900" loading="lazy" decoding="async">
          </span>
          <span class="project-copy">
            <span class="project-category">${escapeHtml(project.category || '')}</span>
            <h3>${escapeHtml(project.name || 'Projeto')}</h3>
            <p>${escapeHtml(project.description || '')}</p>
            <span class="status ${status.className}">
              <svg class="icon" aria-hidden="true"><use href="assets/icons/sprite.svg#${status.icon}"></use></svg>
              ${escapeHtml(status.label)}
            </span>
          </span>
        </${tag}>
      `;
    }).join('');

    grid.querySelectorAll('img').forEach((image) => {
      image.addEventListener('error', () => {
        image.alt = `${image.alt}. Imagem de prévia indisponível.`;
        image.removeAttribute('src');
      });
    });

    grid.addEventListener('click', (event) => {
      const card = event.target.closest('[data-project]');
      if (!card) return;
      const project = projects[Number(card.dataset.project)];
      if (!project || isPublishedLink(project)) return;
      openPreview(project);
    });
  }

  function initNavigation() {
    if (!navLinks.length || !sections.length) return;

    const setActive = (id) => {
      navLinks.forEach((link) => {
        if (link.dataset.nav === id) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };

    setActive('inicio');

    if (!('IntersectionObserver' in window)) return;

    const visible = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
      const current = [...sections].reverse().find((section) => visible.get(section.id));
      if (current) setActive(current.id);
    }, {
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    });

    sections.forEach((section) => observer.observe(section));
  }

  function initPreview() {
    if (!previewDialog) return;

    previewClose.addEventListener('click', closePreview);
    previewExpand.addEventListener('click', () => {
      const expanded = previewDialog.classList.toggle('is-expanded');
      previewExpand.textContent = expanded ? 'Reduzir' : 'Ampliar';
      previewExpand.setAttribute('aria-pressed', expanded ? 'true' : 'false');
    });

    previewDialog.addEventListener('close', () => {
      previewFrame.removeAttribute('src');
      previewDialog.classList.remove('is-expanded');
      previewExpand.textContent = 'Ampliar';
      previewExpand.setAttribute('aria-pressed', 'false');
    });
  }

  function openPreview(project) {
    const localPreview = isLocalPreview(project.preview);
    previewTitle.textContent = project.name || 'Projeto';
    previewKicker.textContent = project.status === 'publicado' ? 'Publicado' : 'Em desenvolvimento';
    previewFrame.title = `Demonstração de ${project.name || 'projeto'}`;

    if (localPreview) {
      previewEmpty.hidden = true;
      previewFrame.hidden = false;
      previewFrame.src = project.preview;
      previewExpand.hidden = false;
      previewOpen.hidden = false;
      previewOpen.href = project.preview;
    } else {
      previewFrame.hidden = true;
      previewFrame.removeAttribute('src');
      previewExpand.hidden = true;
      previewOpen.hidden = true;
      previewEmpty.hidden = false;
      document.getElementById('preview-empty-text').textContent =
        `A demonstração de ${project.name} está sendo preparada. O HTML principal ainda não foi adicionado ao portfólio.`;
    }

    if (typeof previewDialog.showModal === 'function') previewDialog.showModal();
    previewClose.focus();
  }

  function closePreview() {
    previewDialog.close();
  }

  function initEmailForm() {
    if (!emailDialog || !emailForm) return;

    document.querySelectorAll('[data-email-open]').forEach((button) => {
      button.addEventListener('click', openEmail);
    });

    emailClose.addEventListener('click', () => {
      if (!sending) emailDialog.close();
    });

    emailDialog.addEventListener('cancel', (event) => {
      if (sending) event.preventDefault();
    });

    emailDialog.addEventListener('close', resetEmailForm);

    fileInput.addEventListener('change', () => {
      addFiles(fileInput.files);
      fileInput.value = '';
    });

    emailForm.addEventListener('submit', submitEmail);
    syncEmailAvailability();
  }

  function openEmail() {
    syncEmailAvailability();
    if (typeof emailDialog.showModal === 'function') emailDialog.showModal();
    if (recipientEmail()) emailInput.focus();
    else emailClose.focus();
  }

  function recipientEmail() {
    const email = config.emailForm && config.emailForm.recipientEmail;
    return typeof email === 'string' ? email.trim() : '';
  }

  function emailIsConfigured() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail());
  }

  function syncEmailAvailability() {
    const ready = emailIsConfigured();
    emailConfigNote.hidden = ready;
    emailSubmit.disabled = !ready || sending;
    emailInput.disabled = !ready || sending;
    messageInput.disabled = !ready || sending;
    fileInput.disabled = !ready || sending;
  }

  function addFiles(fileListInput) {
    const incoming = Array.from(fileListInput || []);
    const errors = [];

    incoming.forEach((file) => {
      const extension = extensionOf(file.name);
      const allowed = config.emailForm.allowedExtensions.map((item) => item.toLowerCase());
      if (!allowed.includes(extension)) {
        errors.push(`${file.name}: use PDF, PNG, JPG, JPEG ou DOCX.`);
        return;
      }
      const withoutCurrent = selectedFiles.filter((item) => item.name !== file.name);
      const total = withoutCurrent.reduce((sum, item) => sum + item.size, 0) + file.size;
      if (total > config.emailForm.maxTotalBytes) {
        errors.push(`${file.name}: os anexos passam de 10 MB no total.`);
        return;
      }
      selectedFiles = withoutCurrent.concat(file);
    });

    renderFiles();
    showFormError(errors[0] || '');
  }

  function renderFiles() {
    fileList.innerHTML = selectedFiles.map((file, index) => `
      <li>
        <span>${escapeHtml(file.name)} · ${formatBytes(file.size)}</span>
        <button type="button" data-remove-file="${index}">Remover</button>
      </li>
    `).join('');

    fileList.querySelectorAll('[data-remove-file]').forEach((button) => {
      button.addEventListener('click', () => {
        selectedFiles.splice(Number(button.dataset.removeFile), 1);
        renderFiles();
      });
    });
  }

  async function submitEmail(event) {
    event.preventDefault();
    if (sending) return;

    showFormError('');
    emailStatus.textContent = '';

    if (!emailIsConfigured()) {
      showFormError('O e-mail de destino ainda não foi configurado.');
      return;
    }

    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    let invalid = false;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput.setAttribute('aria-invalid', 'true');
      invalid = true;
    } else {
      emailInput.removeAttribute('aria-invalid');
    }

    if (message.length < 3) {
      messageInput.setAttribute('aria-invalid', 'true');
      invalid = true;
    } else {
      messageInput.removeAttribute('aria-invalid');
    }

    const totalBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalBytes > config.emailForm.maxTotalBytes) {
      showFormError('Os anexos passam de 10 MB no total.');
      return;
    }

    if (invalid) {
      showFormError('Preencha o e-mail e a mensagem para enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('message', message);
    formData.append('_replyto', email);
    formData.append('_subject', config.emailForm.subject);
    formData.append('_captcha', config.emailForm.captcha);
    formData.append('_template', config.emailForm.template);
    selectedFiles.forEach((file, index) => {
      const fieldName = index === 0 ? 'attachment' : `attachment_${index + 1}`;
      formData.append(fieldName, file, file.name);
    });

    const endpoint = `${config.emailForm.endpointBase}${recipientEmail()}`;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 30000);

    sending = true;
    syncEmailAvailability();
    emailSubmit.textContent = 'Enviando…';
    emailStatus.textContent = 'Enviando mensagem.';
    emailForm.setAttribute('aria-busy', 'true');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });

      const raw = await response.text();
      let data = null;
      try { data = JSON.parse(raw); } catch (error) { data = null; }

      const success = data && (data.success === true || data.success === 'true');
      if (!response.ok || !success) {
        const serviceMessage = data && data.message ? String(data.message) : '';
        showFormError(serviceMessage || 'O serviço de e-mail não confirmou o envio.');
        emailStatus.textContent = '';
        return;
      }

      emailForm.hidden = true;
      emailConfigNote.hidden = true;
      emailSuccess.hidden = false;
      emailStatus.textContent = '';
    } catch (error) {
      const aborted = error && error.name === 'AbortError';
      showFormError(aborted
        ? 'O envio demorou demais e foi interrompido. Tente novamente.'
        : 'Não foi possível concluir o envio. Verifique a conexão e tente novamente.');
      emailStatus.textContent = '';
    } finally {
      window.clearTimeout(timer);
      sending = false;
      emailSubmit.textContent = 'Enviar mensagem';
      emailForm.removeAttribute('aria-busy');
      if (!emailSuccess.hidden) return;
      syncEmailAvailability();
    }
  }

  function resetEmailForm() {
    if (sending) return;
    emailForm.reset();
    emailForm.hidden = false;
    emailSuccess.hidden = true;
    selectedFiles = [];
    renderFiles();
    showFormError('');
    emailStatus.textContent = '';
    emailInput.removeAttribute('aria-invalid');
    messageInput.removeAttribute('aria-invalid');
    syncEmailAvailability();
  }

  function showFormError(message) {
    if (!message) {
      emailError.hidden = true;
      emailError.textContent = '';
      return;
    }
    emailError.hidden = false;
    emailError.textContent = message;
  }

  function isPublishedLink(project) {
    return project.status === 'publicado' && typeof project.url === 'string' && /^https?:\/\//.test(project.url);
  }

  function isLocalPreview(preview) {
    return typeof preview === 'string'
      && preview.startsWith('projects/')
      && preview.endsWith('.html')
      && !preview.includes('..');
  }

  function statusMeta(status) {
    if (status === 'publicado') {
      return { label: 'Publicado', className: 'status-live', icon: 'i-check' };
    }
    return { label: 'Em desenvolvimento', className: 'status-wip', icon: 'i-clock' };
  }

  function extensionOf(name) {
    const index = String(name).lastIndexOf('.');
    return index >= 0 ? String(name).slice(index).toLowerCase() : '';
  }

  function formatBytes(bytes) {
    const number = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${number.format(bytes / 1024)} KB`;
    return `${number.format(bytes / (1024 * 1024))} MB`;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, '&#39;');
  }
})();
