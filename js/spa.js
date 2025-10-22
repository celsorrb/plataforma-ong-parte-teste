/**
 * Módulo: spa.js
 * Implementa a navegação Single Page Application (SPA) básica
 * Carrega o conteúdo principal das páginas sem recarregar o Header e Footer.
 */

// Define o container principal onde o conteúdo será injetado
const mainContainer = document.getElementById('conteudo-principal');
const navLinks = document.querySelectorAll('#navegacao-principal a');

// Função para buscar e injetar o conteúdo de uma URL
async function loadContent(url) {
    // Extrai o nome do arquivo (ex: index.html, projetos.html)
    const pageName = url.split('/').pop().split('?')[0].split('#')[0] || 'index.html';
    
    // Feedback de carregamento (opcional)
    if (mainContainer) {
        mainContainer.innerHTML = `<div class="loading-feedback" style="text-align: center; padding: 50px;">Carregando página: ${pageName}...</div>`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao carregar a página: ${response.statusText}`);
        }
        
        const html = await response.text();
        
        // Cria um elemento temporário para isolar o novo HTML
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;
        
        // Extrai SOMENTE o conteúdo dentro da tag <main>
        const newMainContent = tempElement.querySelector('#conteudo-principal');

        if (newMainContent && mainContainer) {
            // Troca o conteúdo
            mainContainer.innerHTML = newMainContent.innerHTML;
            
            // Re-executa as funções de inicialização da página no novo DOM
            // Esta função é exposta pelo script.js principal
            window.app.initPage(); 

            // Atualiza o estado visual do link de navegação ativo
            updateActiveLink(pageName);
            
            // Volta o scroll para o topo da página (melhorando UX no SPA)
            window.scrollTo(0, 0);

        } else {
            mainContainer.innerHTML = `<p style="color: red; padding: 50px;">Conteúdo principal não encontrado em ${pageName}.</p>`;
        }

    } catch (error) {
        console.error('Falha no carregamento SPA:', error);
        if (mainContainer) {
             mainContainer.innerHTML = `<p style="color: red; padding: 50px;">Erro ao carregar a página: ${pageName}. Verifique a URL e a conexão.</p>`;
        }
    }
}

// Função para atualizar o link ativo na navegação
function updateActiveLink(pageName) {
    navLinks.forEach(link => {
        // Remove a propriedade de todos
        link.removeAttribute('aria-current');
        
        // Adiciona a propriedade ao link correspondente
        if (link.getAttribute('href') === pageName) {
            link.setAttribute('aria-current', 'page');
        }
    });
}


// Função que gerencia o clique nos links
function handleLinkClick(e) {
    const url = e.currentTarget.getAttribute('href');
    // Verifica se é uma das páginas internas do projeto
    const isInternalPage = url === 'index.html' || url === 'projetos.html' || url === 'cadastro.html';

    // Garante que só SPA funcione para links internos (não para links externos ou #ancoras)
    if (isInternalPage) {
        e.preventDefault();
        
        // Adiciona a nova URL ao histórico do navegador
        history.pushState({ page: url }, '', url);
        
        // Carrega o novo conteúdo
        loadContent(url);
    }
}

// Função para lidar com a navegação pelo botão "Voltar" (Popstate)
window.addEventListener('popstate', (e) => {
    // Carrega o conteúdo da página do histórico
    const url = window.location.pathname.split('/').pop() || 'index.html';
    loadContent(url);
});


// Inicializa os ouvintes de evento para os links de navegação
export function initSPA() {
    // Ouve os links de navegação principal
    navLinks.forEach(link => {
        link.removeEventListener('click', handleLinkClick); // Evita duplicidade em recarregamento
        link.addEventListener('click', handleLinkClick);
    });
    
    // Ouve o clique no botão de doação do Header/CTA para também usar o SPA
    const ctaHeader = document.querySelector('.cta-header');
     if (ctaHeader) {
        ctaHeader.removeEventListener('click', handleLinkClick);
        ctaHeader.addEventListener('click', handleLinkClick);
    }
}