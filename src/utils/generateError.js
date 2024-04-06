export function generateError(message) {
  switch (message) {
    case 'Request failed with status code 404':
      return 'По вашему запросу нет данных на сервере.';
    case 'Request failed with status code 401':
      return 'Неавторизованный запрос.';
    case 'Request failed with status code 400':
      return 'Вы уже оценили данный фильм.';
    default:
      return 'Непредвиденная ошибка, попробуйте обновить страницу.';
  }
}
