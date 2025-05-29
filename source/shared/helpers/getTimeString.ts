export function getTimeString(dateString: string | Date): string {
  let date: Date;
  
  if (typeof dateString === 'string') {
    // Если строка уже в формате ISO, просто создаем Date
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } 
    // Если это timestamp в секундах
    else if (/^\d+$/.test(dateString)) {
      date = new Date(parseInt(dateString) * 1000);
    }
    // Если это timestamp в миллисекундах
    else if (/^\d+\.\d+$/.test(dateString)) {
      date = new Date(parseFloat(dateString) * 1000);
    }
    // Другие форматы при необходимости
    else {
      date = new Date(dateString);
    }
  } else {
    date = dateString;
  }
  
  // Остальная логика форматирования времени
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}