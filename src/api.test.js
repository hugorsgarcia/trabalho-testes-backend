const request = require('supertest');
const app = require('./api');
const bankService = require('./bankService');

describe('Testes de Integração - API Transferências', () => {

    beforeEach(() => {
        bankService.resetDb();
    });

    test('POST /transfer - retorna 200 se transferência for realizada com sucesso', async () => {
        const response = await request(app)
            .post('/transfer')
            .send({
                senderId: 1,
                receiverId: 2,
                amount: 100
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Transferência realizada");
        expect(response.body.newSenderBalance).toBe(900);
    });

    test('POST /transfer - retorna 400 se faltar campo amount', async () => {
        const response = await request(app)
            .post('/transfer')
            .send({
                senderId: 1,
                receiverId: 2
                // amount faltando
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Dados incompletos");
    });

    test('POST /transfer - retorna 404 se usuário não existir', async () => {
        const response = await request(app)
            .post('/transfer')
            .send({
                senderId: 999,
                receiverId: 2,
                amount: 100
            });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Usuário não encontrado");
    });

    test('POST /transfer - retorna 400 para saldo insuficiente', async () => {
        const response = await request(app)
            .post('/transfer')
            .send({
                senderId: 1,
                receiverId: 2,
                amount: 5000
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Saldo insuficiente");
    });
});