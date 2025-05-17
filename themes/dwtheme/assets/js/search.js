const search = document.getElementById('search-bar')

function debounce(func, wait) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    }

search.addEventListener('input', debounce(e => {
    renderSearchResults(e)
}, 300));

function renderSearchResults(e) {
    const searchTerm = e.target.value.trim();
    console.log(searchTerm)
    // const fuse = new Fuse(searchData, {
    //     keys: ['title', 'content.explanations.text'],
    //     threshold: 0.3
    // });
}

// const results = fuse.search(searchTerm);
// if (results.length > 0) {
//     console.log(results)
//     menuSvg.classed("hidden", true);
//     const ul = document.createElement('ul');
//     ul.className = 'search-results-list';

//     results.forEach(result => {
//         const li = document.createElement('li');
//         li.className = 'search-result-item';
//         const link = document.createElement('a');
//         link.href = "#" + result.item.anchor;
//         link.addEventListener("click", (e) => {
//             window.closeMap();
//             if (result.matches[0].key == "content.explanations.text") {
//                 e.preventDefault();
//                 const section = document.getElementById(result.item.anchor)
//                 console.log(result, section, result.matches[0].refIndex, section.querySelectorAll('a[href^="#"]'))
//                 const explanationLink = section.querySelectorAll('a[href^="#"]')[result.matches[0].refIndex]
//                 const explanation = section.querySelectorAll('.mo-explanation')[result.matches[0].refIndex]
//                 explanationLink.classList.toggle('active')
//                 explanation.classList.toggle('active')

//                 window.scrollTo(0, section.getBoundingClientRect().bottom + window.scrollY - window.innerHeight)
//                 explanationLink.scrollTo({
//                     top: section.querySelector(".mo-main-content").offsetTop - 15,
//                     behavior: 'smooth'
//                 });
//                 explanationLink.scrollTo({
//                     top: section.querySelector(".mo-translation").offsetTop - 9,
//                     behavior: 'smooth'
//                 });
//             }
//         })
//         const thumb = document.createElement('img');
//         thumb.src = result.item.thumbnail;
//         link.append(thumb)
//         const nameText = document.createTextNode(result.item.name);
//         link.appendChild(nameText);
//         if (result.matches[0].key == "content.explanations.text") {
//             const explanation = document.createElement('span');
//             explanation.textContent = ": " + result.item.content.explanations[result.matches[0].refIndex].title;
//             link.appendChild(explanation)
//         }
//         li.appendChild(link);
//         ul.appendChild(li);
//     })
//     searchResults.append(ul)
// }