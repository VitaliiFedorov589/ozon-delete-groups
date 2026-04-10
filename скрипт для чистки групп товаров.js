window.stopDeletion = false;

async function deleteGroups(count) {
  let deleted = 0;

  function getTrashButtons() {
    return Array.from(document.querySelectorAll('button')).filter(b => {
      const svg = b.querySelector('svg')?.innerHTML || '';
      return svg.includes('6.333') || svg.includes('5.834') || svg.includes('8.333');
    });
  }

  function waitFor(min, max) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function getConfirmDeleteBtn() {
    return Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Удалить');
  }

  async function scrollToLoadMore() {
    window.scrollTo(0, document.body.scrollHeight);
    await waitFor(600, 1200);
  }

  while (deleted < count) {

    if (window.stopDeletion) {
      console.log(`⛔ Остановлено вручную. Удалено групп: ${deleted}`);
      break;
    }

    let trashBtns = getTrashButtons();

    if (trashBtns.length === 0) {
      await scrollToLoadMore();
      trashBtns = getTrashButtons();
      if (trashBtns.length === 0) {
        console.log('Нет кнопок удаления — группы закончились');
        break;
      }
    }

    trashBtns[0].click();
    await waitFor(200, 400);

    if (window.stopDeletion) {
      console.log(`⛔ Остановлено вручную. Удалено групп: ${deleted}`);
      break;
    }

    const confirmBtn = getConfirmDeleteBtn();
    if (!confirmBtn) {
      console.log('Кнопка подтверждения не найдена');
      break;
    }

    confirmBtn.click();
    deleted++;
    console.log(`Удалено групп: ${deleted}`);

    await waitFor(300, 600);

    // Каждые 20 удалений — пауза 3–5 сек
    if (deleted % 20 === 0) {
      const pause = Math.floor(Math.random() * 2000) + 3000;
      console.log(`Пауза ${(pause / 1000).toFixed(1)} сек...`);
      await new Promise(resolve => setTimeout(resolve, pause));
    }

    // Каждые 500 удалений — пауза 5 минут
    if (deleted % 500 === 0) {
      console.log(`✅ Удалено ${deleted} групп. Большая пауза 5 минут...`);
      await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
      console.log('▶️ Продолжаем...');
    }
  }

  console.log(`Готово! Всего удалено: ${deleted} групп`);
  return deleted;
}

deleteGroups(3301);