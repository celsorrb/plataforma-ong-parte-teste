document.addEventListener('DOMContentLoaded', () => {
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');
    const enderecoInput = document.getElementById('endereco');
    const cidadeInput = document.getElementById('cidade');
    const estadoSelect = document.getElementById('estado');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('navegacao-principal');

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

            // Haptic Feedback sutil para toque no celular
            if (window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        });

        // Fechar menu ao clicar em um link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Fechar se for em tela mobile/tablet E se o link não for um dropdown
                if (window.innerWidth <= 991 && !link.closest('.dropdown')) { 
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('mobile-active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    /* ========================================= */
    /* 2. MÁSCARAS DE FORMULÁRIO */
    /* ========================================= */

    const mask = (value, pattern) => {
        let i = 0;
        const v = value.toString().replace(/\D/g, '');
        return pattern.replace(/#/g, () => v[i++] || '');
    };

    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            e.target.value = mask(e.target.value, '###.###.###-##');
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
            // Máscara para telefone (Fixo: (00) 0000-0000 / Celular: (00) 00000-0000)
            let pattern = (e.target.value.replace(/\D/g, '').length === 11) ? '(##) #####-####' : '(##) ####-####';
            e.target.value = mask(e.target.value, pattern);
        });
    }

    if (cepInput) {
        cepInput.addEventListener('input', (e) => {
            e.target.value = mask(e.target.value, '#####-###');
        });
    }


    /* ========================================= */
    /* 3. BUSCA DE CEP (ViaCEP) */
    /* ========================================= */

    // Otimização: Debounce para evitar múltiplas chamadas à API
    let timeoutId;
    const buscaCEP = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(processaBuscaCEP, 500); // Espera 500ms
    };
    
    const processaBuscaCEP = async () => {
        const cep = cepInput.value.replace(/\D/g, '');

        if (cep.length !== 8) return;

        // Desabilita campos enquanto busca
        enderecoInput.disabled = true;
        cidadeInput.disabled = true;
        estadoSelect.disabled = true;
        
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                alert('CEP não encontrado. Preencha o endereço manualmente.');
            } else {
                enderecoInput.value = data.logradouro;
                document.getElementById('bairro').value = data.bairro;
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
            // Se o endereço foi encontrado, foca no campo número
            if (enderecoInput.value) {
                document.getElementById('numero').focus();
            }
        }
    };

    if (cepInput) {
        cepInput.addEventListener('input', buscaCEP); // Agora aciona o debounce
    }
    
    /* ========================================= */
    /* 4. VALIDAÇÃO ADICIONAL DE FORMULÁRIO */
    /* ========================================= */
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', (e) => {
            const voluntario = document.getElementById('voluntario').checked;
            const doador = document.getElementById('doador').checked;
            const alertaAjuda = document.getElementById('alerta-ajuda');

            if (!voluntario && !doador) {
                e.preventDefault();
                alert('Por favor, selecione pelo menos uma forma de contribuição (Voluntário ou Doador).');
                alertaAjuda.style.border = '2px solid var(--cor-alerta)'; 
            } else {
                 alertaAjuda.style.border = 'none';
                 
                 // Simulação de envio - Ação real seria aqui
                 alert('Obrigado por se cadastrar! Entraremos em contato em breve.');
                 e.preventDefault(); // Impede o envio real para fins de demonstração
            }
        });
    }
});
