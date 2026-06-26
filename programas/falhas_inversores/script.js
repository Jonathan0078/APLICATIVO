// Database carregado do arquivo database.js
const faultDatabase = window.faultDatabase || [];

function getFaultLang() { return (window.i18n && window.i18n.lang) || 'pt'; }

function translateFaultText(pt) {
    var lang = getFaultLang();
    if (lang === 'en' && window.faultsEn) return window.faultsEn[pt] || pt;
    if (lang === 'es' && window.faultsEs) return window.faultsEs[pt] || pt;
    return pt;
}
// ==================== UTILITY FUNCTIONS ====================
function getUnique(arr, key) {
    const map = new Map();
    arr.forEach(item => { if (!map.has(item[key])) map.set(item[key], true); });
    return Array.from(map.keys()).sort();
}

function getModels(brand) {
    const models = new Set();
    faultDatabase.forEach(f => { if (f.brand === brand) models.add(f.model); });
    return Array.from(models).sort();
}

function populateSelects() {
    const brandSelect = document.getElementById('brandSelect');
    const modelSelect = document.getElementById('modelSelect');
    const brands = getUnique(faultDatabase, 'brand');
    brandSelect.innerHTML = '<option value="">' + i18n.t('falhas_inversores.all_brands') + '</option>';
    brands.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b; opt.textContent = b;
        brandSelect.appendChild(opt);
    });
    modelSelect.innerHTML = '<option value="">' + i18n.t('falhas_inversores.all_models') + '</option>';
}

function populateModels(brand) {
    const modelSelect = document.getElementById('modelSelect');
    modelSelect.innerHTML = '<option value="">' + i18n.t('falhas_inversores.all_models') + '</option>';
    if (!brand) return;
    const models = getModels(brand);
    models.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m; opt.textContent = m;
        modelSelect.appendChild(opt);
    });
}

function updateStats() {
    const brands = getUnique(faultDatabase, 'brand');
    const modelsSet = new Set();
    faultDatabase.forEach(f => modelsSet.add(f.brand + '|' + f.model));
    document.getElementById('statBrands').textContent = brands.length;
    document.getElementById('statModels').textContent = modelsSet.size;
    document.getElementById('statFaults').textContent = faultDatabase.length;
}

function showResult(fault) {
    const resultDiv = document.getElementById('faultResult');
    const noResults = document.getElementById('noResults');
    noResults.style.display = 'none';
    document.getElementById('resultCode').textContent = fault.code;
    document.getElementById('resultBrand').textContent = fault.brand;
    document.getElementById('resultModel').textContent = fault.model;
    document.getElementById('resultDescription').textContent = translateFaultText(fault.desc);
    const symptomsList = document.getElementById('resultSymptoms');
    symptomsList.innerHTML = '';
    fault.symptoms.forEach(s => { const li = document.createElement('li'); li.textContent = translateFaultText(s); symptomsList.appendChild(li); });
    const causesDiv = document.getElementById('resultCauses');
    causesDiv.innerHTML = '';
    fault.causes.forEach(c => { const div = document.createElement('div'); div.className = 'cause-item'; div.textContent = translateFaultText(c); causesDiv.appendChild(div); });
    const solutionsDiv = document.getElementById('resultSolutions');
    solutionsDiv.innerHTML = '';
    fault.solutions.forEach(s => { const div = document.createElement('div'); div.className = 'solution-item'; div.textContent = translateFaultText(s); solutionsDiv.appendChild(div); });
    resultDiv.classList.add('visible');
}

function showNoResults() {
    document.getElementById('faultResult').classList.remove('visible');
    document.getElementById('noResults').style.display = 'block';
    document.getElementById('faultCount').textContent = '';
}

function performSearch() {
    const brand = document.getElementById('brandSelect').value;
    const model = document.getElementById('modelSelect').value;
    const query = document.getElementById('faultSearch').value.trim().toUpperCase();
    let results = faultDatabase;
    if (brand) results = results.filter(f => f.brand === brand);
    if (model) results = results.filter(f => f.model === model);
    if (query) results = results.filter(f => f.code.toUpperCase().includes(query));
    const countDiv = document.getElementById('faultCount');
    const suggestionsBox = document.getElementById('suggestionsBox');
    suggestionsBox.classList.remove('visible');
    if (results.length === 1) {
        countDiv.textContent = '1 ' + i18n.t('falhas_inversores.result_found');
        showResult(results[0]);
    } else if (results.length > 1) {
        countDiv.textContent = results.length + ' ' + i18n.t('falhas_inversores.results_found');
        if (results.length <= 50) showSuggestions(results);
        else { document.getElementById('faultResult').classList.remove('visible'); document.getElementById('noResults').style.display = 'none'; }
    } else {
        showNoResults();
    }
}
function showSuggestions(results) {
    const box = document.getElementById('suggestionsBox');
    box.innerHTML = '';
    const top = results.slice(0, 20);
    top.forEach(f => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.innerHTML = '<span class="code">' + f.code + '</span><span class="desc">' + f.brand + ' - ' + f.model + ': ' + translateFaultText(f.desc).substring(0, 50) + '</span>';
        div.addEventListener('click', function (e) { e.stopPropagation(); selectSuggestion(f); });
        box.appendChild(div);
    });
    if (results.length > 20) {
        const more = document.createElement('div');
        more.className = 'suggestion-item';
        more.style.textAlign = 'center'; more.style.fontWeight = '600'; more.style.color = 'var(--primary)';
        more.textContent = i18n.t('falhas_inversores.more_results').replace('{n}', results.length - 20);
        box.appendChild(more);
    }
    box.classList.add('visible');
}

function selectSuggestion(fault) {
    document.getElementById('faultSearch').value = fault.code;
    document.getElementById('suggestionsBox').classList.remove('visible');
    performSearch();
}

// Theme
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const saved = localStorage.getItem('falhas-inversores-theme');
    if (saved === 'dark') { document.body.classList.add('dark-theme'); toggle.checked = true; }
    else { document.body.classList.remove('dark-theme'); toggle.checked = false; }
    toggle.addEventListener('change', function () {
        if (this.checked) { document.body.classList.add('dark-theme'); localStorage.setItem('falhas-inversores-theme', 'dark'); }
        else { document.body.classList.remove('dark-theme'); localStorage.setItem('falhas-inversores-theme', 'light'); }
    });
}

// Autocomplete
function setupAutocomplete() {
    const input = document.getElementById('faultSearch');
    const box = document.getElementById('suggestionsBox');
    let timeout;

    input.addEventListener('input', function () {
        clearTimeout(timeout);
        const v = this.value.trim().toUpperCase();
        if (!v) { box.classList.remove('visible'); return; }
        timeout = setTimeout(() => {
            let results = faultDatabase;
            const brand = document.getElementById('brandSelect').value;
            const model = document.getElementById('modelSelect').value;
            if (brand) results = results.filter(f => f.brand === brand);
            if (model) results = results.filter(f => f.model === model);
            const filtered = results.filter(f => f.code.toUpperCase().includes(v));
            if (filtered.length === 0 || filtered.length > 50) { box.classList.remove('visible'); return; }
            showSuggestions(filtered);
        }, 200);
    });

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { performSearch(); box.classList.remove('visible'); }
        if (e.key === 'Escape') box.classList.remove('visible');
    });

    document.addEventListener('click', function (e) {
        if (!box.contains(e.target) && e.target !== input) box.classList.remove('visible');
    });
}

// Init
document.addEventListener('DOMContentLoaded', function () {
    populateSelects();
    updateStats();
    initTheme();
    setupAutocomplete();

    document.getElementById('brandSelect').addEventListener('change', function () {
        populateModels(this.value);
        document.getElementById('faultSearch').value = '';
        document.getElementById('suggestionsBox').classList.remove('visible');
        showNoResults();
    });

    document.getElementById('modelSelect').addEventListener('change', function () {
        document.getElementById('faultSearch').value = '';
        document.getElementById('suggestionsBox').classList.remove('visible');
        showNoResults();
    });

    document.getElementById('searchBtn').addEventListener('click', function () { performSearch(); });
    document.getElementById('faultSearch').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); performSearch(); } });
    document.getElementById('clearBtn').addEventListener('click', function () {
        document.getElementById('brandSelect').value = '';
        document.getElementById('modelSelect').innerHTML = '<option value="">' + i18n.t('falhas_inversores.all_models') + '</option>';
        document.getElementById('faultSearch').value = '';
        document.getElementById('suggestionsBox').classList.remove('visible');
        showNoResults();
    });

});
