declare global {
  interface Window {
    Sk: {
      configure: (config: any) => void;
      misceval: {
        asyncToPromise: (f: () => any) => Promise<any>;
      };
      importMainWithBody: (name: string, dumpJS: boolean, code: string, afterCode: boolean) => any;
      builtinFiles: {
        files: {
          [key: string]: string;
        };
      };
      python3: boolean;
    };
  }
}

export {}; 