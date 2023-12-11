// Функция задержки выполнения асинхронного кода на указанное количество миллисекунд
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Получение ссылки на кнопку "Сортировать"
const sortButton = document.getElementById("sortButton");

// Навешивание обработчика клика
sortButton.addEventListener("click", async () => {
  // Вызов функции сортировки
  await sort();
});

// Основная функция для запуска сортировки в зависимости от выбранного алгоритма
async function sort() {
  // Получение входных данных и выбранного алгоритма сортировки
  const inputNumbers = document.getElementById("inputNumbers").value;
  const numbers = inputNumbers.split(",").map(Number);
  const algorithm = document.getElementById("sortingAlgorithm").value;

  // Получение элемента для визуализации сортировки
  const visualizationDiv = document.getElementById("visualization");
  visualizationDiv.innerHTML = "";

  // Выбор соответствующего алгоритма сортировки и его запуск
  switch (algorithm) {
    case "bubble":
      await bubbleSort(numbers, visualizationDiv);
      break;
    case "insertion":
      await insertionSort(numbers, visualizationDiv);
      break;
    case "selection":
      await selectionSort(numbers, visualizationDiv);
      break;
    case "quick":
      await quickSort(numbers, visualizationDiv, 0, numbers.length - 1);
      break;
    case "merge":
      await mergeSort(numbers, visualizationDiv, 0, numbers.length - 1);
      break;
    default:
      break;
  }
}

// Алгоритм сортировки пузырьком
async function bubbleSort(numbers, visualizationDiv) {
  // Вложенные циклы для прохода по массиву и сравнения/обмена элементов
  for (let i = 0; i < numbers.length - 1; i++) {
    for (let j = 0; j < numbers.length - 1 - i; j++) {
      // Визуализация текущих сравниваемых элементов
      await visualize(numbers, visualizationDiv, j, j + 1);

      // Если текущий элемент больше следующего, производится обмен
      if (numbers[j] > numbers[j + 1]) {
        const temp = numbers[j];
        numbers[j] = numbers[j + 1];
        numbers[j + 1] = temp;

        // Визуализация обмена
        await visualize(numbers, visualizationDiv, j, j + 1, true);
      }
    }
  }

  // Завершение визуализации сортировки
  await showCompletion(visualizationDiv);
}

// Алгоритм сортировки вставками
async function insertionSort(numbers, visualizationDiv) {
  // Цикл для прохода по массиву и вставки элементов на правильные позиции
  for (let i = 1; i < numbers.length; i++) {
    let key = numbers[i];
    let j = i - 1;

    while (j >= 0 && numbers[j] > key) {
      // Визуализация текущих сравниваемых элементов
      await visualize(numbers, visualizationDiv, j + 1, j);

      numbers[j + 1] = numbers[j];
      j = j - 1;
    }

    numbers[j + 1] = key;
    // Визуализация вставки
    await visualize(numbers, visualizationDiv, j + 1, i, true);
  }

  // Завершение визуализации сортировки
  await showCompletion(visualizationDiv);
}

// Алгоритм сортировки выбором
async function selectionSort(numbers, visualizationDiv) {
  // Вложенные циклы для поиска минимального элемента и обмена с текущим
  for (let i = 0; i < numbers.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < numbers.length; j++) {
      // Визуализация текущих сравниваемых элементов
      await visualize(numbers, visualizationDiv, minIndex, j);

      if (numbers[j] < numbers[minIndex]) {
        minIndex = j;
      }
    }

    const temp = numbers[i];
    numbers[i] = numbers[minIndex];
    numbers[minIndex] = temp;

    // Визуализация обмена
    await visualize(numbers, visualizationDiv, i, minIndex, true);
  }

  // Завершение визуализации сортировки
  await showCompletion(visualizationDiv);
}

// Алгоритм быстрой сортировки
async function quickSort(numbers, visualizationDiv, low, high) {
  // Рекурсивное разделение и сортировка подмассивов
  if (low < high) {
    const partitionIndex = await partition(
      numbers,
      visualizationDiv,
      low,
      high
    );

    await quickSort(numbers, visualizationDiv, low, partitionIndex - 1);
    await quickSort(numbers, visualizationDiv, partitionIndex + 1, high);
  }
}

// Вспомогательная функция для разделения массива в алгоритме быстрой сортировки
async function partition(numbers, visualizationDiv, low, high) {
  const pivot = numbers[high];
  let i = low - 1;

  for (let j = low; j <= high - 1; j++) {
    // Визуализация текущих сравниваемых элементов
    await visualize(numbers, visualizationDiv, j, high);

    if (numbers[j] < pivot) {
      i++;
      const temp = numbers[i];
      numbers[i] = numbers[j];
      numbers[j] = temp;

      // Визуализация обмена
      await visualize(numbers, visualizationDiv, i, j, true);
      await showCompletion(visualizationDiv);
    }
  }

  const temp = numbers[i + 1];
  numbers[i + 1] = numbers[high];
  numbers[high] = temp;

  // Визуализация обмена
  await visualize(numbers, visualizationDiv, i + 1, high, true);
  await showCompletion(visualizationDiv);

  return i + 1;
}

// Алгоритм сортировки слиянием
async function mergeSort(numbers, visualizationDiv, left, right) {
  // Рекурсивное разделение и сортировка подмассивов, затем их слияние
  if (left < right) {
    const mid = Math.floor((left + right) / 2);

    await mergeSort(numbers, visualizationDiv, left, mid);
    await mergeSort(numbers, visualizationDiv, mid + 1, right);

    await merge(numbers, visualizationDiv, left, mid, right);
    // Завершение визуализации сортировки
    await showCompletion(visualizationDiv);
  }
}

// Вспомогательная функция для слияния двух отсортированных подмассивов
async function merge(numbers, visualizationDiv, left, mid, right) {
  const n1 = mid - left + 1;
  const n2 = right - mid;

  const leftArray = new Array(n1);
  const rightArray = new Array(n2);

  // Копирование элементов во временные массивы
  for (let i = 0; i < n1; i++) {
    leftArray[i] = numbers[left + i];
  }
  for (let j = 0; j < n2; j++) {
    rightArray[j] = numbers[mid + 1 + j];
  }

  let i = 0;
  let j = 0;
  let k = left;

  // Слияние двух подмассивов в основной массив
  while (i < n1 && j < n2) {
    // Визуализация текущих сравниваемых элементов
    await visualize(numbers, visualizationDiv, left + i, mid + 1 + j);

    if (leftArray[i] <= rightArray[j]) {
      numbers[k] = leftArray[i];
      i++;
    } else {
      numbers[k] = rightArray[j];
      j++;
    }

    // Визуализация обмена
    await visualize(numbers, visualizationDiv, k, k, true);

    k++;
  }

  // Добавление оставшихся элементов из левого подмассива
  while (i < n1) {
    numbers[k] = leftArray[i];
    await visualize(numbers, visualizationDiv, k, k, true);
    i++;
    k++;
  }

  // Добавление оставшихся элементов из правого подмассива
  while (j < n2) {
    numbers[k] = rightArray[j];
    await visualize(numbers, visualizationDiv, k, k, true);
    j++;
    k++;
  }
}

// Визуализация текущего состояния массива и его элементов
async function visualize(
  numbers,
  visualizationDiv,
  index1,
  index2,
  isSwap = false
) {
  // Создание элементов-баров для каждого числа в массиве
  const bars = numbers.map((height, index) => {
    const bar = createBar(height, index === index1 || index === index2);
    return bar;
  });

  // Создание контейнера для баров
  const container = document.createElement("div");
  container.classList.add("container-bar");

  // Добавление всех баров в контейнер
  bars.forEach((bar) => container.appendChild(bar));

  // Очистка визуализации и добавление нового контейнера с барами
  visualizationDiv.innerHTML = "";
  visualizationDiv.appendChild(container);

  // Задержка для визуализации обмена или сравнения
  if (isSwap) {
    await sleep(200);
  } else {
    await sleep(100);
  }
}

// Визуализация завершения сортировки
async function showCompletion(visualizationDiv) {
  const completeDiv = document.createElement("div");
  completeDiv.innerHTML = "<p>Сортировка завершена!</p>";
  visualizationDiv.appendChild(completeDiv);

  const bars = document.querySelectorAll(".bar");

  bars.forEach((bar) => {
    bar.style.backgroundColor = "#f6ff00";
  });
}

// Создание HTML-элемента-бара для визуализации числа
function createBar(height, isActive) {
  const bar = document.createElement("div");
  bar.classList.add("bar");
  bar.style.height = `5em`;
  bar.textContent = height;

  // Выделение активного элемента другим цветом
  if (isActive) {
    bar.style.backgroundColor = "#ff00f7";
  }

  return bar;
}
