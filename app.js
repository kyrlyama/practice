// Функция загрузки данных
async function fetchData() {
  try {
    const response = await fetch('get_glasses.php');
    if (!response.ok) throw new Error("Ошибка загрузки данных с сервера");

    const glassesArray = await response.json();
    const casesData = { cases: glassesArray };

    return { casesData };
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    return { casesData: { cases: [] } };
  }
}

// Заполнение моделей телефонов при выборе бренда
function setupBrandSelection(casesData) {
  const searchBrandSelect = document.getElementById("searchBrand");
  const searchModelSelect = document.getElementById("searchModel");

  function updateModels(selectElement, selectedBrand) {
    const models = [...new Set(casesData.cases.filter(c => c.brand === selectedBrand).map(c => c.model))];

    models.forEach(model => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      selectElement.appendChild(option);
    });
  }

  searchBrandSelect.addEventListener("change", () => updateModels(searchModelSelect, searchBrandSelect.value));
}

// Функция отображения данных в таблице
function populateCasesTable(casesData) {
  const tableBody = document.getElementById("casesTable").getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";

  if (!casesData || !casesData.cases || casesData.cases.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red;">Нет данных для отображения</td></tr>`;
    return;
  }

  casesData.cases
    .sort((a, b) => b.quantity - a.quantity)
    .forEach((caseData, index) => addCaseToTable(caseData, index));
}

// Функция добавления строки в таблицу — с цветными бейджами магазина
function addCaseToTable(caseData, index) {
  const tableBody = document.getElementById("casesTable").getElementsByTagName("tbody")[0];
  const row = tableBody.insertRow();

  const shopBadges = (caseData.shop || '').split(', ').filter(Boolean).map(shop => {
    const cls = shop === 'Fama' ? 'shop-badge--fama' : 'shop-badge--astri';
    return `<span class="shop-badge ${cls}">${shop}</span>`;
  }).join('');

  row.innerHTML = `
      <td>${caseData.brand || ''}</td>
      <td>${caseData.model || ''}</td>
      <td>${caseData.glass_type || ''}</td>
      <td>${caseData.quantity > 0 ? caseData.quantity : '<span class="text-danger">Нет в наличии</span>'}</td>
      <td>${shopBadges}</td>
  `;
}

// Фильтрация товаров по наличию
function setupAvailabilityFilters(casesData) {
  const onlyAvailable = document.getElementById("onlyAvailable");
  const onlyUnavailable = document.getElementById("onlyUnvailable");
  const onlyFama = document.getElementById("onlyFama");
  const onlyAstri = document.getElementById("onlyAstri");

  function filterData() {
    let filteredCases = [...casesData.cases];

    if (onlyAvailable.checked) {
      filteredCases = filteredCases.filter(c => c.quantity > 0);
    }

    if (onlyUnavailable.checked) {
      filteredCases = filteredCases.filter(c => c.quantity === 0);
    }

    if (onlyFama.checked) {
      filteredCases = filteredCases.filter(c => c.shop.includes('Fama'));
    }

    if (onlyAstri.checked) {
      filteredCases = filteredCases.filter(c => c.shop.includes('Astri'));
    }

    populateCasesTable({ cases: filteredCases });
  }

  onlyAvailable.addEventListener("change", filterData);
  onlyUnavailable.addEventListener("change", filterData);
  onlyFama.addEventListener("change", filterData);
  onlyAstri.addEventListener("change", filterData);
}

// Фильтрация товаров по критериям
function searchCases(casesData) {
  const searchBrand = document.getElementById("searchBrand").value.trim();
  const searchModel = document.getElementById("searchModel").value.trim();
  const searchCaseType = document.getElementById("searchCaseType").value.trim();

  const filteredCases = casesData.cases.filter(caseData => {
    return (
      (searchBrand === "" || caseData.brand === searchBrand) &&
      (searchModel === "" || caseData.model === searchModel) &&
      (searchCaseType === "" || caseData.glass_type === searchCaseType)    );
  });

  populateCasesTable({ cases: filteredCases });
}

// Привязка фильтрации кнопки поиска "Найти"
function setupSearchHandler(casesData) {
  document.getElementById("advancedSearchButton").addEventListener("click", (event) => {
    event.preventDefault();
    searchCases(casesData);
  });
}

// Функция обработки добавления товара
function setupFormHandler(casesData) {
  const form = document.getElementById('addProductForm');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const selectedShops = document.querySelectorAll('.shop-option.active');
    const shopNames = Array.from(selectedShops).map(el => el.textContent);
    const shopString = shopNames.join(', ');

    const newCase = {
      brand: form.brand.value,
      model: form.model.value,
      case_type: form.case_type.value,
      quantity: parseInt(form.quantity.value),
      shop: shopString
    };

    if (!newCase.brand || !newCase.model || !newCase.case_type || !newCase.shop) {
      alert("Пожалуйста, заполните все поля корректно!");
      return;
    }

    const response = await fetch('add_glass.php', {
      method: 'POST',
      body: JSON.stringify(newCase)
    });
    const result = await response.json();

    if (!result.success) {
      alert("Ошибка сохранения: " + result.error);
      return;
    }

    const { casesData: freshData } = await fetchData();
    populateCasesTable(freshData);
    showToast('Товар добавлен ✓');
    showCheckmark();
    form.reset();

    document.querySelectorAll('.shop-option').forEach(option => option.classList.remove('active'));
  });
}

// Инициализация
window.onload = async () => {
  const { casesData } = await fetchData();
  populateCasesTable(casesData);
  setupBrandSelection(casesData);
  setupAvailabilityFilters(casesData);
  setupSearchHandler(casesData);
  setupFormHandler(casesData);
  setupPhotoPreview();
};

// Функция переключения между панелями + подсветка активной вкладки
function togglePanel(id, btn) {
  const panel = document.getElementById(id);
  const isVisible = panel.style.display === 'block';

  document.getElementById('panel-add').style.display = 'none';
  document.getElementById('panel-search').style.display = 'none';
  document.getElementById('panel-glasses').style.display = 'none';

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  if (!isVisible) {
    panel.style.display = 'block';
    if (btn) btn.classList.add('active');
  }
}

// Степпер количества (+/-)
function stepQuantity(direction) {
  const input = document.getElementById('quantity');
  let value = parseInt(input.value) || 0;
  value = Math.max(0, value + direction);
  input.value = value;
}

// Независимое переключение магазина (можно оба сразу)
function toggleShop(element) {
  element.classList.toggle('active');
}

// Функция уменьшения количества товара на складе
async function removeGlass() {
  const form = document.getElementById('addProductForm');

    const selectedShops = document.querySelectorAll('.shop-option.active');
    const shopNames = Array.from(selectedShops).map(el => el.textContent);
    const shopString = shopNames.join(', ');

    const newCase = {
      brand: form.brand.value,
      model: form.model.value,
      case_type: form.case_type.value,
      quantity: parseInt(form.quantity.value),
      shop: shopString
    };

    if (!newCase.brand || !newCase.model || !newCase.case_type || !newCase.shop) {
      alert("Пожалуйста, заполните все поля корректно!");
      return;
    }

    const response = await fetch('remove_glass.php', {
      method: 'POST',
      body: JSON.stringify(newCase)
    });
    const result = await response.json();

    if (!result.success) {
      alert("Ошибка сохранения: " + result.error);
      return;
    }

    const { casesData: freshData } = await fetchData();
    populateCasesTable(freshData);
    showToast('Количество обновлено ✓');
    showCheckmark();

    document.querySelectorAll('.shop-option').forEach(option => option.classList.remove('active'));
}

//Читать содержимое файла и выводить его в консоль
function setupPhotoPreview() {
  const photoInput = document.getElementById('salesPhoto');
  const preview = document.getElementById('photoPreview');
  const uploadZone = document.querySelector('.upload-zone');

  photoInput.addEventListener('change', () => {
    const file = photoInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      preview.innerHTML = `
        <div class="photo-preview-box">
          <img src="${event.target.result}">
          <button type="button" class="photo-preview-box__remove" onclick="clearPhoto()">×</button>
        </div>
      `;
      uploadZone.style.display = 'none';
    };
    reader.readAsDataURL(file);
  });
}

// Убрать выбранное фото и вернуть зону загрузки
function clearPhoto() {
  document.getElementById('salesPhoto').value = '';
  document.getElementById('photoPreview').innerHTML = '';
  document.querySelector('.upload-zone').style.display = 'block';
}

//Окно с подтверждением добавления товара 
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notify';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Отправка фото на распознавание ИИ Excel 
async function analyzePhoto() {
  const photoInput = document.getElementById('salesPhoto');
  const file = photoInput.files[0];

  if (!file) {
    alert('Сначала выбери фото');
    return;
  }

  const button = document.getElementById('analyzeBtn');
  button.disabled = true;
  button.textContent = 'Распознаю...';

  const reader = new FileReader();
  reader.onload = async (event) => {
    const base64Image = event.target.result;

    try {
      const response = await fetch('analyze_photo.php', {
        method: 'POST',
        body: JSON.stringify({ image: base64Image })
      });

      const result = await response.json();

if (result.error) {
  alert('Ошибка распознавания: ' + result.error + '\n\n' + (result.details || ''));
  return;
}

if (!Array.isArray(result)) {
  alert('Не удалось распознать фото, попробуй ещё раз');
  return;
}

      populateResultsTable(result);
      showToast('Фото распознано ✓');

    } catch (error) {
      alert('Ошибка: ' + error.message);
    } finally {
      button.disabled = false;
      button.textContent = 'Распознать';
    }
  };
  reader.readAsDataURL(file);
}

// Заполняет таблицу результатами распознавания ИИ
function populateResultsTable(rows) {
  const tableBody = document.getElementById('resultsTableBody');
  tableBody.innerHTML = '';

  rows.forEach(row => {
    addEmptyRow(row, row.confidence === false);
  });
}

// Добавляет одну пустую редактируемую строку в таблицу результатов
function addEmptyRow(rowData = {}, uncertain = false) {
  const tableBody = document.getElementById('resultsTableBody');
  const row = tableBody.insertRow();

  const fields = ['sale_date', 'cost_price', 'name', 'quantity', 'price', 'sum', 'payment'];

  fields.forEach(field => {
    const cell = row.insertCell();
    if (uncertain) cell.classList.add('cell-uncertain');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control form-control-sm';
    input.value = rowData[field] || '';
    cell.appendChild(input);
  });
}


// Собирает данные таблицы и скачивает как Excel-файл
function downloadExcel() {
  const shop = document.getElementById('docShop').value;
  const invoice = document.getElementById('docInvoice').value;
  const date = document.getElementById('docDate').value;

  const rows = [];
  rows.push(['Likefon OÜ', '', '', '', 'Saateleht nr.', invoice]);
  rows.push(['', '', '', '', shop.toUpperCase(), date]);
  rows.push(['Müüja:', 'Likefon OÜ', '', 'Maksja:', 'Eraisik']);
  rows.push(['IBAN:', 'EE372200221075983753', '', 'Pank:']);
  rows.push([]);
  rows.push(['Дата', 'С/б', 'Название', 'Кол-во', 'Цена', 'Сумма', 'Оплата']);

  const tableBody = document.getElementById('resultsTableBody');
  Array.from(tableBody.rows).forEach(row => {
    const values = Array.from(row.cells).map(cell => cell.querySelector('input').value);
    rows.push(values);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Продажи');

  const filename = `${shop}_${invoice || 'накладная'}.xlsx`;
  XLSX.writeFile(workbook, filename);
}


// Кратковременная зелёная галочка рядом с кнопками магазина
function showCheckmark() {
  const check = document.getElementById('actionCheckmark');
  check.classList.remove('fade-out');
  check.classList.add('show');

  setTimeout(() => check.classList.add('fade-out'), 400);
  setTimeout(() => check.classList.remove('show', 'fade-out'), 5400);
}