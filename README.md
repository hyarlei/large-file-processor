# Large File Processor with Node.js Streams & CI/CD

Projeto desenvolvido para demonstrar o processamento eficiente de arquivos gigantes (CSV) utilizando **Node.js Streams**, garantindo baixo consumo de memória e alta performance.

O projeto conta também com uma pipeline de **CI/CD** configurada via **GitHub Actions** para garantir a integridade do código a cada push.

## 🛠 Tecnologias

- **Node.js & TypeScript**: Backend robusto e tipado.
- **Node Streams (Pipeline)**: Processamento de dados sob demanda (sem carregar tudo na RAM).
- **Busboy**: Upload de arquivos via stream.
- **GitHub Actions**: Automação de Build e Testes (CI).

## ⚡ Como rodar

1. Clone o repositório:

   ```bash
   git clone [https://github.com/hyarlei/large-file-processor.git](https://github.com/hyarlei/large-file-processor.git)
    ```

2. Instale as dependecias:

    ```bash
    cd large-file-processor
    npm install
    ```

3. Inicie o servidor:

    ```bash
    npm dev
    ```

4. Envie um arquivo CSV (via cURL ou Insomnia):

    ```bash
    curl -v -F "file=@seuarquivo.csv" http://localhost:3000/upload
    ```
