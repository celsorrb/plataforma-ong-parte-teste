/**
 * Módulo: validation.js
 * Implementa a validação de consistência de dados em formulários (CPF e Data de Nascimento).
 * Aplicado à página cadastro.html.
 */

const form = document.getElementById('cadastroForm');
const cpfInput = document.getElementById('cpf');
const dataNascimentoInput = document.getElementById('data-nascimento');
const cpfErrorMsg = document.getElementById('cpf-error');
const nascimentoErrorMsg = document.getElementById('nascimento-error');

// =========================================================================
// 1. FUNÇÕES DE VALIDAÇÃO DE CONSISTÊNCIA
// =========================================================================

// Algoritmo básico de validação de CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let sum, rest;
    sum = 0;
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    rest = (sum * 10) % 11;
    if ((rest === 10) || (rest === 11)) rest = 0;
    if (rest !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    rest = (sum * 10) % 11;
    if ((rest === 10) || (rest === 11)) rest = 0;
    if (rest !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

// Verifica se a data de nascimento é válida (se o usuário tem pelo menos 18 anos)
function validarDataNascimento(dataStr) {
    if (!dataStr) return false;
    
    // Padrão YYYY-MM-DD
    const dataNascimento = new Date(dataStr + 'T00:00:00'); 
    const hoje = new Date();
    
    // Calcula a data mínima (18 anos atrás)
    const dataMinima = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate());

    // 1. Verifica se a pessoa é menor de 18 anos
    if (dataNascimento > dataMinima) {
        return {isValid: false, message: 'É necessário ter no mínimo 18 anos para se cadastrar.'};
    }
    
    // 2. Verifica se a data é futura
    if (dataNascimento > hoje) {
        return {isValid: false, message: 'A data de nascimento não pode ser futura.'};
    }

    return {isValid: true, message: ''};
}

// =========================================================================
// 2. FUNÇÃO PRINCIPAL DE VALIDAÇÃO NO SUBMIT/BLUR
// =========================================================================

function validateForm(e) {
    // Reseta as mensagens de erro visuais
    if (cpfErrorMsg) cpfErrorMsg.textContent = '';
    if (nascimentoErrorMsg) nascimentoErrorMsg.textContent = '';
    let formIsValid = true;
    
    // A. VALIDAÇÃO DO CPF
    if (cpfInput && cpfErrorMsg) {
        const cpf = cpfInput.value;
        if (!validarCPF(cpf)) {
            if (e.type === 'submit' || (e.type === 'blur' && cpf.length > 0)) {
                cpfErrorMsg.textContent = 'CPF inválido. Verifique o número digitado.';
                formIsValid = false;
            }
        }
    }
    
    // B. VALIDAÇÃO DA DATA DE NASCIMENTO
    if (dataNascimentoInput && nascimentoErrorMsg) {
        const dataNascimento = dataNascimentoInput.value;
        const validationResult = validarDataNascimento(dataNascimento);

        if (!validationResult.isValid) {
             if (e.type === 'submit' || (e.type === 'blur' && dataNascimento.length > 0)) {
                nascimentoErrorMsg.textContent = validationResult.message;
                formIsValid = false;
            }
        }
    }
    
    if (e.type === 'submit' && !formIsValid) {
        e.preventDefault(); // Impede o envio se houver erro
        alert('Por favor, corrija os erros do formulário antes de enviar.');
    }
}

// =========================================================================
// 3. INICIALIZAÇÃO
// =========================================================================

export function initValidation() {
    if (form) {
        form.removeEventListener('submit', validateForm); 
        form.addEventListener('submit', validateForm);
    }
    
    // Adiciona validação em tempo real (on blur) para feedback imediato
    if (cpfInput) {
         cpfInput.removeEventListener('blur', validateForm);
         cpfInput.addEventListener('blur', validateForm);
    }
     if (dataNascimentoInput) {
         dataNascimentoInput.removeEventListener('blur', validateForm);
         dataNascimentoInput.addEventListener('blur', validateForm);
    }
}