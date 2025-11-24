document.addEventListener('DOMContentLoaded', function () {
    const search = document.getElementById('search-bar');
    const searchResults = document.getElementById('search-results'); 
    const content = document.getElementById('content');
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const logo = document.getElementById('logo');
    const mobMenu = document.getElementById('mobile-menu-button');

    search.addEventListener('focus', function() {
        if (mobileQuery.matches) {
            logo.classList.add('hidden');
            mobMenu.classList.add('hidden');
	    search.placeholder = '';
        }
    });
    
    search.addEventListener('blur', function() {
        logo.classList.remove('hidden');
        mobMenu.classList.remove('hidden');
    });
    mobileQuery.addEventListener('change', function(e) {
        if (!e.matches) {
            logo.classList.remove('hidden');
            mobMenu.classList.remove('hidden');
        } else if (document.activeElement === search) {
            logo.classList.add('hidden');
            mobMenu.classList.add('hhidden');
        }
    });

    // Initialize searchData - this should be loaded from your index.json
    let searchData = [];
    
    // Load the search index
    fetch('/index.json') // Adjust path if your index.json is elsewhere
        .then(response => response.json())
        .then(data => {
            searchData = data;
            console.log('Search data loaded:', searchData);
        })
        .catch(error => console.error('Error loading search data:', error));
    
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            search.focus();
            // Optionally select all text in the search bar
            search.select();
        }
        if (e.key === 'Escape') {
          if (document.activeElement === search) {
            search.blur(); // Remove focus
            search.value = '';
	    renderSearchResults(e);
        }
    }
    });
    search.addEventListener('input', debounce(e => {
        renderSearchResults(e);
    }, 300));
    
    function renderSearchResults(e) {
        const searchTerm = e.target.value.trim();
        console.log('Searching for:', searchTerm);
        
        
        searchResults.innerHTML = '';
        if (!searchTerm || searchData.length === 0) {
            content.classList.remove("hidden");
	    return;
        }
	
	content.classList.add("hidden");
        
        // Initialize Fuse.js
        const fuse = new Fuse(searchData, {
            keys: ['title', 'content'],
            threshold: 0.3,
            includeMatches: true
        });
        
        const results = fuse.search(searchTerm);
           
        const ul = document.createElement('ul');
        ul.className = 'search-results-list';
	const header = document.createElement('h2');
	header.className = 'h-8 my-8 text-sm md:text-lg';
	header.textContent = "Suchergebnisse";
	searchResults.appendChild(header)
	
	if (results.length == 0) {
		console.log("no result");
		const li = document.createElement('li');
		const h = document.createElement('h3');
		h.textContent = 'Keine Ergebnisse gefunden';
		li.appendChild(h);
		ul.appendChild(li);
		console.log(ul)
	}

        if (results.length > 0) {
            results.forEach(result => {
    const li = document.createElement('li');
    li.className = 'search-result-item';
    
    // Create card container
    const card = document.createElement('div');
    card.className = 'rounded-lg border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow';
    
    // Create clickable link wrapper
    const link = document.createElement('a');
    link.href = result.item.url;
    link.className = 'block text-decoration-none';
    
    // Add title
    const title = document.createElement('h3');
    title.className = 'text-lg font-semibold mb-2 text-gray-900';
    title.textContent = result.item.title;
    link.appendChild(title);
    
    // Create excerpt with highlighting
    const excerpt = document.createElement('p');
    excerpt.className = 'text-sm text-gray-600 line-clamp-3';
    
    // Process content and highlight matches
    const content = result.item.content;
    const match = result.matches[0];
    
    if (match && match.key === 'content') {
        // Strip HTML tags for excerpt
        const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        
        // Get the matched text and its position
        const matchIndices = match.indices[0]; // First match
        const matchStart = matchIndices[0];
        const matchEnd = matchIndices[1];
        
        // Calculate excerpt boundaries (show ~100 chars before and after)
        const excerptPadding = 50;
        const startPos = Math.max(0, matchStart - excerptPadding);
        const endPos = Math.min(plainText.length, matchEnd + excerptPadding);
        
        // Extract and build excerpt with highlighting
        let excerptText = plainText.substring(startPos, endPos);
        
        // Add ellipsis if needed
        if (startPos > 0) excerptText = '...' + excerptText;
        if (endPos < plainText.length) excerptText = excerptText + '...';
        
        // Highlight the matched portion
        const searchTerm = result.query || e.target.value.trim();
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        excerptText = excerptText.replace(regex, '<span class="bg-yellow-200 font-medium"><b>$1<b></span>');
        
        excerpt.innerHTML = excerptText;
    } else {
        // If no content match, show beginning of content
        const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        excerpt.textContent = plainText.substring(0, 50) + (plainText.length > 50 ? '...' : '');
    }
    
    link.appendChild(excerpt);
    card.appendChild(link);
    li.appendChild(card);
    ul.appendChild(li);
});
            
        }
            searchResults.appendChild(ul);
    }
});
