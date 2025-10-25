let allObjects = [];

// Charger les données
async function loadData() {
    try {
        const response = await fetch('data.json');
        allObjects = await response.json();
        displayObjects(allObjects);
        updateResultsCount(allObjects.length);
    } catch (error) {
        console.error('Erreur de chargement:', error);
        document.getElementById('objectsGrid').innerHTML = 
            '<p style="text-align: center; color: #666;">Erreur de chargement des données</p>';
    }
}

// Afficher les objets
function displayObjects(objects) {
    const grid = document.getElementById('objectsGrid');
    
    if (objects.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">Aucun objet trouvé</p>';
        return;
    }
    
    grid.innerHTML = objects.map(obj => `
        <div class="object-card">
            <div class="object-image">${obj.emoji || '🔧'}</div>
            <div class="object-content">
                <h3 class="object-title">${obj.titre}</h3>
                <span class="object-category">${getCategoryLabel(obj.categorie)}</span>
                
                <div class="object-meta">
                    <div class="meta-item">⏱️ ${obj.temps_impression}h</div>
                    <div class="meta-item">📏 ${obj.dimensions}</div>
                    <div class="meta-item">📊 ${getDifficultyLabel(obj.difficulte)}</div>
                    <div class="meta-item">${obj.support_necessaire ? '🛠️ Support' : '✅ Sans support'}</div>
                </div>
                
                ${obj.teste_filament_recycle ? 
                    `<span class="badge">♻️ Testé avec ${obj.type_recycle_teste}</span>` : ''}
                
                <div class="tags">
                    ${obj.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                
                <a href="${obj.source_url}" target="_blank" class="source-link">
                    Voir sur ${obj.source_plateforme} →
                </a>
            </div>
        </div>
    `).join('');
}

// Filtrer les objets
function filterObjects() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const difficulty = document.getElementById('difficultyFilter').value;
    const recycled = document.getElementById('recycledFilter').value;
    
    let filtered = allObjects.filter(obj => {
        const matchSearch = !searchTerm || 
            obj.titre.toLowerCase().includes(searchTerm) ||
            obj.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        const matchCategory = !category || obj.categorie === category;
        const matchDifficulty = !difficulty || obj.difficulte === difficulty;
        const matchRecycled = !recycled || 
            (recycled === 'true' && obj.teste_filament_recycle) ||
            (recycled === 'false' && !obj.teste_filament_recycle);
        
        return matchSearch && matchCategory && matchDifficulty && matchRecycled;
    });
    
    displayObjects(filtered);
    updateResultsCount(filtered.length);
}

// Mettre à jour le compteur
function updateResultsCount(count) {
    const countEl = document.getElementById('resultsCount');
    countEl.textContent = `${count} objet${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`;
}

// Labels en français
function getCategoryLabel(category) {
    const labels = {
        'refrigerateur': 'Réfrigérateur',
        'lave-linge': 'Lave-linge',
        'cuisine': 'Cuisine',
        'aspirateur': 'Aspirateur'
    };
    return labels[category] || category;
}

function getDifficultyLabel(difficulty) {
    const labels = {
        'debutant': 'Débutant',
        'intermediaire': 'Intermédiaire',
        'avance': 'Avancé'
    };
    return labels[difficulty] || difficulty;
}

// Événements
document.getElementById('searchInput').addEventListener('input', filterObjects);
document.getElementById('categoryFilter').addEventListener('change', filterObjects);
document.getElementById('difficultyFilter').addEventListener('change', filterObjects);
document.getElementById('recycledFilter').addEventListener('change', filterObjects);

// Charger au démarrage
loadData();
