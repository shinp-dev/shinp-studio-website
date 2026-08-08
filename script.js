(() => {
  const year = document.querySelector('#copyright-year');
  if (year) year.textContent = String(new Date().getFullYear());

  const provenanceFields = document.querySelectorAll('[data-provenance]');
  if (provenanceFields.length) {
    fetch('/provenance/provenance.json')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!data) return;
        provenanceFields.forEach((field) => {
          const key = field.dataset.provenance;
          const value = data[key];
          if (!value) return;
          if (['repository', 'run', 'attestation'].includes(key) && /^https:\/\//.test(value)) {
            const link = document.createElement('a');
            link.className = 'provenance-link';
            link.href = value;
            link.textContent = value;
            field.replaceChildren(link);
            return;
          }
          field.textContent = value;
        });
      })
      .catch(() => {});
  }
})();
