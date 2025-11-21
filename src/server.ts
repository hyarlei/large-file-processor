// src/server.ts
import express from 'express';
import { Request, Response } from 'express';
import Busboy from 'busboy';
import { pipeline } from 'node:stream/promises';
import { Transform, Writable } from 'node:stream';
import { parse } from 'csv-parse';

const app = express();

app.post('/upload', (req: Request, res: Response) => {
    const busboy = Busboy({ headers: req.headers });

    busboy.on('file', async (name, fileStream, info) => {
        console.log(`Iniciando processamento do arquivo: ${info.filename}`);

        try {
            // AQUI ESTÁ O SEGREDO: O Pipeline conecta os canos
            await pipeline(
                // 1. Readable Stream: O arquivo chegando aos poucos
                fileStream,

                // 2. Transform Stream: Converte binário para linhas do CSV (Objeto JSON)
                parse({ delimiter: ',', columns: true }),

                // 3. Transform Stream: Sua regra de negócio (Sanitização/Validação)
                new Transform({
                    objectMode: true, // Importante: avisa que estamos passando objetos, não buffer
                    transform(chunk, encoding, callback) {
                        // Simulação: Imagina que 'chunk' é uma linha do CSV: { nome: "Hyarlei", email: "..." }
                        const dataTratada = {
                            ...chunk,
                            processadoEm: new Date().toISOString(),
                            // Exemplo: transformar email em minúsculo
                            email: chunk.email?.toLowerCase()
                        };

                        // Passa o dado tratado adiante
                        callback(null, JSON.stringify(dataTratada));
                    }
                }),

                // 4. Writable Stream: O destino (Simulando Banco de Dados ou outro arquivo)
                new Writable({
                    write(chunk, encoding, callback) {
                        // Se quiser ver passando, descomente o console.log, 
                        // mas isso também deixa lento pq o terminal não aguenta tanta velocidade!
                        // console.log('Salvando:', chunk.toString());

                        callback(); // <--- CHAMA DIRETO!
                    }
                })
            );

            console.log('Arquivo processado com sucesso!');
        } catch (error) {
            console.error('Erro no pipeline:', error);
        }
    });

    busboy.on('finish', () => {
        res.status(201).send({ message: 'Upload concluído e processamento iniciado/finalizado' });
    });

    // Conecta o request original ao busboy
    req.pipe(busboy);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});