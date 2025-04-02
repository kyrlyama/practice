// Функция загрузки данных
async function fetchData() {
  try {
    let casesData = localStorage.getItem("casesData");
    if (!casesData) {
      const response = await fetch('cases.json');
      if (!response.ok) throw new Error("Ошибка загрузки cases.json");

      casesData = await response.json();
      localStorage.setItem("casesData", JSON.stringify(casesData));
    } else {
      casesData = JSON.parse(casesData);
    }

    return { casesData };
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    return { casesData: { cases: [] } };
  }
}

// Функция сохранения данных
function saveCasesData(casesData) {
  localStorage.setItem("casesData", JSON.stringify(casesData));
}

// Заполнение моделей телефонов при выборе бренда
function setupBrandSelection(casesData) {
  const brandSelect = document.getElementById("brand");
  const modelSelect = document.getElementById("model");
  const searchBrandSelect = document.getElementById("searchBrand");
  const searchModelSelect = document.getElementById("searchModel");

  function updateModels(selectElement, selectedBrand) {
    selectElement.innerHTML = '<option value="">Выберите модель...</option>';
    const models = [...new Set(casesData.cases.filter(c => c.brand === selectedBrand).map(c => c.model))];

    models.forEach(model => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      selectElement.appendChild(option);
    });

    selectElement.removeAttribute("disabled");
  }

  brandSelect.addEventListener("change", () => updateModels(modelSelect, brandSelect.value));
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

// Функция добавления строки в таблицу
function addCaseToTable(caseData, index) {
  const tableBody = document.getElementById("casesTable").getElementsByTagName("tbody")[0];
  const row = tableBody.insertRow();
  row.innerHTML = `
      <td>${caseData.brand}</td>
      <td>${caseData.model}</td>
      <td>${caseData.case_type}</td>
      <td>${caseData.gender}</td>
      <td>${caseData.price} €</td>
      <td>${caseData.quantity > 0 ? caseData.quantity : '<span class="text-danger">Нет в наличии</span>'}</td>
      <td>${caseData.color}</td>
  `;
}

// Фильтрация товаров по наличию
function setupAvailabilityFilters(casesData) {
  const onlyAvailable = document.getElementById("onlyAvailable");
  const onlyUnavailable = document.getElementById("onlyUnvailable");

  function filterData() {
    let filteredCases = [...casesData.cases];

    if (onlyAvailable.checked) {
      filteredCases = filteredCases.filter(c => c.quantity > 0);
    }

    if (onlyUnavailable.checked) {
      filteredCases = filteredCases.filter(c => c.quantity === 0);
    }

    populateCasesTable({ cases: filteredCases });
  }

  onlyAvailable.addEventListener("change", filterData);
  onlyUnavailable.addEventListener("change", filterData);
}

// Фильтрация товаров по критериям
function searchCases(casesData) {
  const searchBrand = document.getElementById("searchBrand").value.trim();
  const searchModel = document.getElementById("searchModel").value.trim();
  const searchCaseType = document.getElementById("searchCaseType").value.trim();
  const searchGender = document.getElementById("searchGender").value.trim();
  const searchQuantity = document.getElementById("searchQuantity").value ? parseInt(document.getElementById("searchQuantity").value) : null;
  const searchColor = document.getElementById("searchColor").value.trim();
  const searchPrice = document.getElementById("searchPrice").value ? parseFloat(document.getElementById("searchPrice").value) : null;

  const filteredCases = casesData.cases.filter(caseData => {
    return (
      (searchBrand === "" || caseData.brand === searchBrand) &&
      (searchModel === "" || caseData.model === searchModel) &&
      (searchCaseType === "" || caseData.case_type === searchCaseType) &&
      (searchGender === "" || caseData.gender === searchGender) &&
      (searchQuantity === null || caseData.quantity === searchQuantity) &&
      (searchColor === "" || caseData.color.toLowerCase().includes(searchColor.toLowerCase())) &&
      (searchPrice === null || caseData.price === searchPrice)
    );
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

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const newCase = {
      brand: form.brand.value,
      model: form.model.value,
      case_type: form.case_type.value,
      gender: form.gender.value,
      price: parseFloat(form.price.value),
      quantity: parseInt(form.quantity.value),
      color: form.color.value
    };

    if (!newCase.brand || !newCase.model || !newCase.case_type || !newCase.gender || !newCase.color ||
      isNaN(newCase.price) || newCase.price < 0 || newCase.price > 18) {
      alert("Пожалуйста, заполните все поля корректно!");
      return;
    }

    // Добавление нового товара в начало массива товаров
    casesData.cases.unshift(newCase);

    // Сохранение обновленных данных в localStorage.
    saveCasesData(casesData);
    
    // Обновление таблицы с товарами, чтобы отобразить новый товар.
    populateCasesTable(casesData);

    // Очистка формы после успешного добавления товара.
    form.reset();
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
};

