document.addEventListener('DOMContentLoaded', () => {
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');
    const enderecoInput = document.getElementById('endereco');
    const cidadeInput = document.getElementById('cidade');
    const estadoSelect = document.getElementById('estado');
    const bairroInput = document.getElementById('bairro'); // Adicionado
    const numeroInput = document.getElementById('numero'); // Adicionado
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('navegacao-principal');
    const cadastroForm = document.getElementById('cadastroForm');

    /* ========================================= */
    /* 1. NAVEGAÇÃO MOBILE (MENU HAMBÚRGUER) */
    /* ========================================= */
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('mobile-active');
            
            // Adiciona ou remove o bloqueio de scroll no body
            document.body.style.overflow = navMenu.classList.contains('mobile-active') ? 'hidden' : '';
        });
        
        // Fechar menu ao clicar em um link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 991) { // Só fecha se for em tela mobile/tablet
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('mobile-active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    /* ========================================= */
    /* 2. MÁSCARAS E VALIDAÇÃO (CPF e TELEFONE) */
    /* ========================================= */
    
    // Máscara de CPF
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        });
    }

    // Máscara de Telefone (simples: apenas dígitos)
    if (telefoneInput) {
         telefoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        });
    }

    /* ========================================= */
    /* 3. BUSCA CEP E PREENCHIMENTO AUTOMÁTICO */
    /* ========================================= */
    const buscaCEP = async () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        // Limpa campos anteriores
        enderecoInput.value = '';
        bairroInput.value = '';
        cidadeInput.value = '';
        estadoSelect.value = '';


        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                // Se o CEP falhar, exibe alerta e limpa
                alert('CEP não encontrado ou inválido.');
            } else {
                // Preenche os campos
                enderecoInput.value = data.logradouro; 
                bairroInput.value = data.bairro;
                cidadeInput.value = data.localidade;
                estadoSelect.value = data.uf; 
                
                // Foca no campo 'número' para que o usuário continue o preenchimento
                if (numeroInput) {
                    numeroInput.focus(); 
                }
            }

        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            alert('Falha na comunicação com o serviço de CEP. Tente novamente.');
        } 
        // Não há 'finally' com desabilitar/reabilitar, pois os campos são livres para edição.
    };

    if (cepInput) {
        cepInput.addEventListener('blur', buscaCEP);
    }
    
    /* ========================================= */
    /* 4. VALIDAÇÃO ADICIONAL DE FORMULÁRIO (Opções de Interesse) */
    /* ========================================= */

    // Elementos de interesse
    const voluntarioInput = document.getElementById('voluntario');
    const doadorInput = document.getElementById('doador');
    const alertaAjuda = document.getElementById('alerta-ajuda');
    const mensagemAlerta = document.getElementById('mensagem-alerta');
    const mensagemPadrao = 'Selecione pelo menos uma opção. Se for voluntário, entraremos em contato para entrevista. Se for doador, será redirecionado para a doação segura após o cadastro.';


    // Funções para controle visual do alerta
    const mostrarErro = (mensagem) => {
        mensagemAlerta.textContent = mensagem;
        alertaAjuda.classList.add('alerta-erro');
        alertaAjuda.style.border = '2px solid var(--cor-perigo)'; 
    };

    const limparErro = () => {
        mensagemAlerta.textContent = mensagemPadrao;
        alertaAjuda.classList.remove('alerta-erro');
        alertaAjuda.style.border = 'none'; 
    };

    // Ouve a interação para limpar o erro imediatamente
    if (voluntarioInput && doadorInput) {
        voluntarioInput.addEventListener('change', limparErro);
        doadorInput.addEventListener('change', limparErro);
    }
    
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', (e) => {
            const voluntario = voluntarioInput.checked;
            const doador = doadorInput.checked;

            if (!voluntario && !doador) {
                e.preventDefault();
                mostrarErro('**ATENÇÃO:** Por favor, selecione pelo menos uma forma de contribuição (Voluntário ou Doador) para continuar.');
                
                // Rola a tela até o campo para melhor visibilidade em mobile/telas pequenas
                document.getElementById('interesse-field').scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                 limparErro();
            }
        });
    }
});
