/**
 * Módulo: templates.js
 * Lógica para o Sistema de Templates JavaScript (Gerar HTML Dinâmico)
 * Aplicado à página projetos.html.
 */

// 1. DADOS DOS PROJETOS (Array de Objetos)
const projectData = [
    {
        id: 'raizes',
        titulo: 'Raízes do Futuro',
        imagem: 'img/projeto-educacao.jpg', // Use as imagens que você subiu
        descricao: 'Foco na educação infantil em comunidades carentes, oferecendo reforço escolar, alimentação e atividades culturais.',
        categoria: 'Educação',
        indicadores: {
            voluntarios: 85,
            criancas: 320,
            status: 'Ativo'
        }
    },
    {
        id: 'conexao',
        titulo: 'Conexão Digital',
        imagem: 'img/projeto1.jpg', // Use as imagens que você subiu
        descricao: 'Distribuição de kits de conectividade e aulas de informática básica e programação para jovens, visando a inclusão digital.',
        categoria: 'Tecnologia',
        indicadores: {
            voluntarios: 50,
            criancas: 150,
            status: 'Ativo'
        }
    },
    {
        id: 'saude',
        titulo: 'Saúde Comunitária',
        imagem: 'img/hero.jpg.jpg', // Use as imagens que você subiu
        descricao: 'Mutirões de saúde preventiva, vacinação e distribuição de kits de higiene em áreas de difícil acesso.',
        categoria: 'Saúde',
        indicadores: {
            voluntarios: 40,
            criancas: 500,
            status: 'Pendente'
        }
    }
];

// 2. FUNÇÃO TEMPLATE (Usa Template Literal)
function createProjectCard(project) {
    const statusClass = project.indicadores.status === 'Ativo' ? 'badge-secundaria' : 'badge-primaria'; // Trocado para usar verde para Ativo

    return `
        <article class="card-projeto">
            <figure>
                <img src="${project.imagem}" alt="Imagem do projeto ${project.titulo}">
            </figure>
            <div class="card-content">
                <span class="badge ${statusClass}">${project.indicadores.status}</span>
                <span class="badge badge-secundaria">${project.categoria}</span>
                
                <h3>${project.titulo}</h3>
                <p>${project.descricao}</p>
                
                <div class="indicadores">
                    <span><strong>${project.indicadores.voluntarios}</strong> Voluntários</span>
                    <span><strong>${project.indicadores.criancas}+</strong> Atendidos</span>
                </div>
                
                <a href="#${project.id}" class="cta-button cta-secundario">Ver Detalhes</a>
            </div>
        </article>
    `;
}

// 3. FUNÇÃO DE INJEÇÃO NO DOM
export function renderProjects() {
    const containerSection = document.getElementById('projetos-em-destaque');

    // Somente executa se estiver na página projetos.html E o container existir
    if (containerSection && window.location.pathname.includes('projetos.html')) {
        
        let htmlContent = '';
        
        // Gera o HTML de todos os cards
        projectData.forEach(project => {
            htmlContent += createProjectCard(project);
        });
        
        // Cria um div wrapper para o grid e insere o conteúdo
        containerSection.querySelector('h2').insertAdjacentHTML('afterend', `<div class="cards-grid">${htmlContent}</div>`);
    }
}