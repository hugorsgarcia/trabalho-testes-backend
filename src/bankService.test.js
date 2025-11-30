const bankService = require('./bankService');

describe('Testes Unitários - bankService', () => {

    beforeEach(() => {
        bankService.resetDb();
    });

    test('Cenário Positivo: Deve realizar transferência com sucesso', () => {
        const result = bankService.transfer(1, 2, 100);
        
        expect(result.success).toBe(true);
        expect(result.newSenderBalance).toBe(900); 
        expect(bankService.getBalance(2)).toBe(600);
    });

    test('Cenário Negativo: Não deve transferir se saldo for insuficiente', () => {
        expect(() => {
            bankService.transfer(1, 2, 2000);
        }).toThrow("Saldo insuficiente");

        expect(bankService.getBalance(1)).toBe(1000);
    });

    test('Teste de Limite: Não deve transferir valor zero ou negativo', () => {
        expect(() => {
            bankService.transfer(1, 2, -50);
        }).toThrow("O valor da transferência deve ser positivo");

        expect(() => {
            bankService.transfer(1, 2, 0);
        }).toThrow("O valor da transferência deve ser positivo");
    });

    test('Teste de Entrada: Deve falhar se usuário não existir', () => {
        expect(() => {
            bankService.transfer(99, 2, 100);
        }).toThrow("Usuário não encontrado");
    });
});