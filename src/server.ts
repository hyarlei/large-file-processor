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
            await pipeline(
                fileStream,

                parse({ delimiter: ',', columns: true }),

                new Transform({
                    objectMode: true,
                    transform(chunk, encoding, callback) {
                        const dataTratada = {
                            ...chunk,
                            processadoEm: new Date().toISOString(),
                            email: chunk.email?.toLowerCase()
                        };

                        callback(null, JSON.stringify(dataTratada));
                    }
                }),

                new Writable({
                    write(chunk, encoding, callback) {

                        callback();
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

    req.pipe(busboy);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});