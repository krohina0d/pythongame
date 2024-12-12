export const getCanvasPixelMatrix = (canvas: HTMLCanvasElement): Uint8ClampedArray => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Получаем данные изображения
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return imageData.data;
};

export const compareCanvasMatrices = (matrix1: Uint8ClampedArray, matrix2: Uint8ClampedArray): boolean => {
  if (matrix1.length !== matrix2.length) return false;
  
  // Сравниваем каждый пиксель
  for (let i = 0; i < matrix1.length; i += 4) {
    // Сравниваем только альфа-канал (непрозрачность), так как цвет линии может быть разным
    if (matrix1[i + 3] !== matrix2[i + 3]) {
      return false;
    }
  }
  
  return true;
}; 