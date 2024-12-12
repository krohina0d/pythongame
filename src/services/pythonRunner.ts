declare global {
  interface Window {
    Sk: any;
  }
}

class PythonRunner {
  private initialized: boolean = false;

  async initialize() {
    if (!this.initialized) {
      // Проверяем, что Skulpt загружен
      if (typeof window.Sk !== 'undefined') {
        this.initialized = true;
        console.log('Skulpt initialized successfully');
      } else {
        throw new Error('Skulpt not loaded');
      }
    }
  }

  async runCode(code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Функция для обработки вывода
      function outf(text: string) {
        console.log('Output:', text);
        return text;
      }

      // Функция для чтения файлов (необходима для работы Skulpt)
      function builtinRead(x: string) {
        if (window.Sk.builtinFiles === undefined ||
            window.Sk.builtinFiles["files"][x] === undefined)
          throw "File not found: '" + x + "'";
        return window.Sk.builtinFiles["files"][x];
      }

      // Очищаем canvas перед выполнением
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      if (canvas) {
        // Устанавливаем размеры canvas
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }

      // Настраиваем Skulpt
      window.Sk.configure({
        output: outf,
        read: builtinRead,
        __future__: window.Sk.python3,
        retainglobals: true,
        inputfunTakesPrompt: true,
        // Указываем canvas для turtle
        canvas: 'canvas'
      });

      // Запускаем Python код
      try {
        window.Sk.misceval.asyncToPromise(() => 
          window.Sk.importMainWithBody("<stdin>", false, code, true)
        )
          .then(() => resolve('Code executed successfully'))
          .catch((err: Error) => reject(err.toString()));
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const pythonRunner = new PythonRunner(); 