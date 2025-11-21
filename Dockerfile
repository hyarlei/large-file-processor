# 1. Escolhe a "forma" do bolo (Linux leve com Node 18)
FROM node:18-alpine

# 2. Cria uma pasta dentro da caixa para o app
WORKDIR /app

# 3. Copia os arquivos de dependências primeiro (para cachear)
COPY package*.json ./

# 4. Instala as dependências dentro da caixa
RUN npm install

# 5. Copia o resto do código fonte
COPY . .

# 6. Compila o TypeScript para JavaScript
RUN npm run build

# 7. Expõe a porta 3000 da caixa para o mundo
EXPOSE 3000

# 8. O comando que roda quando a caixa abre
CMD ["node", "dist/server.js"]