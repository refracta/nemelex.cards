// Function to add monster tiles to the monster lists
document.addEventListener('DOMContentLoaded', function() {
    // Find all monster list cells
    const monsterLists = document.querySelectorAll('.monster-list');
    
    monsterLists.forEach(list => {
        // Get the text content
        const monsters = list.textContent.split(',').map(m => m.trim());
        
        // Clear the current content
        list.innerHTML = '';
        
        // Create monster items with tiles
        monsters.forEach(monster => {
            const item = document.createElement('span');
            item.className = 'monster-item';
            
            const img = document.createElement('img');
            img.className = 'monster-tile';
            img.src = `monsters/${monster.replace(/ /g, '_')}.png`;
            img.alt = monster;
            img.title = monster;
            
            const name = document.createElement('span');
            name.textContent = monster;
            
            item.appendChild(img);
            item.appendChild(name);
            list.appendChild(item);
        });
    });
});