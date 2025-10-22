// Importa os módulos
import { initSPA } from './spa.js';
import { renderProjects } from './templates.js';
import { initValidation } from './validation.js';

// =========================================================================
// FUNÇÕES UTILS (Máscaras, API de CEP)
// Código do seu antigo script.js, modularizado em funções
// =========================================================================

function applyMasks() {
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');

    // Função de máscara de CPF (sem biblioteca externa)
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for dígito
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }

    // Função de máscara de Telefone
    if (telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value;
        });
    }
    
    // Função de máscara de CEP
     if (cepInput) {
        cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    }
}


// Função para busca de CEP
async function setupCEPLookup() {
    const cepInput = document.getElementById('cep');
    const enderecoInput = document.getElementById('endereco');
    const cidadeInput = document.getElementById('cidade');
    const estadoSelect = document.getElementById('estado');

    if (!cepInput || !enderecoInput || !cidadeInput || !estadoSelect) return;

    const buscaCEP = async () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        try {
            enderecoInput.value = "Buscando...";
            cidadeInput.value = "Buscando...";
            estadoSelect.value = "";
            enderecoInput.disabled = true;
            cidadeInput.disabled = true;
            estadoSelect.disabled = true;

            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                alert('CEP não encontrado ou inválido.');
            } else {
                enderecoInput.value = data.logradouro + (data.bairro ? (', ' + data.bairro) : '');
                cidadeInput.value = data.localidade;
                estadoSelect.value = data.uf; 
            }

        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            alert('Falha na comunicação com o serviço de CEP.');
        } finally {
            enderecoInput.disabled = false;
            cidadeInput.disabled = false;
            estadoSelect.disabled = false;
        }
    };

    cepInput.removeEventListener('blur', buscaCEP); // Remove para evitar duplicação no SPA
    cepInput.addEventListener('blur', buscaCEP);
}

// =========================================================================
// FUNÇÕES DE UI (Menu Hamburger)
// =========================================================================

function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('navegacao-principal');
    
    if (menuToggle && navMenu) {
        const toggleMenu = () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('mobile-active');
            
            document.body.style.overflow = navMenu.classList.contains('mobile-active') ? 'hidden' : '';
        };
        
        menuToggle.removeEventListener('click', toggleMenu); // Remove para evitar duplicação
        menuToggle.addEventListener('click', toggleMenu);
        
        // Fechar menu ao clicar em um link (para o SPA e para links internos)
        navMenu.querySelectorAll('a').forEach(link => {
            const closeMenu = () => {
                // Fechar se for em tela mobile e o menu estiver aberto
                if (window.innerWidth <= 991 && navMenu.classList.contains('mobile-active')) {
                    toggleMenu();
                }
            };
            link.removeEventListener('click', closeMenu);
            link.addEventListener('click', closeMenu);
        });
    }
}

// =========================================================================
// INICIALIZAÇÃO GERAL (Chamado no DOMContentLoaded e no SPA)
// =========================================================================

function initPage() {
    // 1. Inicialização de UI e Utils
    setupMobileMenu();
    applyMasks();
    setupCEPLookup();
    
    // 2. Inicialização dos módulos de Entrega III
    initValidation(); // Validação do Formulário (CPF/Data)
    renderProjects(); // Sistema de Templates
}


// Cria um objeto global para expor initPage (necessário para o spa.js)
window.app = {
    initPage: initPage
};

// =========================================================================
// START: INICIALIZAÇÃO
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o SPA (captura cliques nos links)
    initSPA();
    
    // 2. Executa todas as inicializações para o carregamento inicial da página
    initPage();
});