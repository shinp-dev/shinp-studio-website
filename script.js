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
          const value = data[field.dataset.provenance];
          if (value) field.textContent = value;
        });
      })
      .catch(() => {});
  }
})();
