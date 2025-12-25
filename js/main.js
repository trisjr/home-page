document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Handling
    initTheme();

    // 2. Fetch Data and Render
    fetchData();
});

// --- Theme Logic ---
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const icon = themeToggleBtn.querySelector('i');

    // Check localStorage or System Preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        document.documentElement.classList.remove('dark');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });
}

// --- Data Fetching & Rendering ---
async function fetchData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Failed to load data');
        const data = await response.json();

        // Check for GitHub Username and fetch data if available
        if (data.githubUsername && data.githubUsername !== "yourusername") {
            try {
                await fetchGitHubData(data.githubUsername, data);
            } catch (ghError) {
                console.warn("GitHub API failed or rate limited, using local fallback:", ghError);
            }
        }

        renderMeta(data.meta);
        renderHero(data.hero);
        renderAbout(data.about);
        renderSkills(data.skills);
        renderProjects(data.projects);
        renderExperience(data.experience);
        renderContact(data.contact);
        renderFooter(data.footer);
    } catch (error) {
        console.error('Error loading content:', error);
        document.body.innerHTML = '<div class="text-center p-10 text-red-500">Error loading content. Please check the console.</div>';
    }
}

async function fetchGitHubData(username, data) {
    const headers = { 'Accept': 'application/vnd.github.v3+json' };

    // 1. Fetch Profile
    const profileRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (profileRes.ok) {
        const profile = await profileRes.json();

        // Update Hero Section
        data.hero.name = profile.name || data.hero.name;
        data.hero.avatar = profile.avatar_url || data.hero.avatar;
        data.hero.tagline = profile.bio || data.hero.tagline; // GitHub Bio as Tagline

        // Update Social Link for GitHub
        const githubLink = data.contact.social.find(s => s.platform === 'GitHub');
        if (githubLink) {
            githubLink.link = profile.html_url;
        }

        // Update Button Link for GitHub
        const githubBtn = data.hero.buttons.find(b => b.text.includes('GitHub'));
        if (githubBtn) {
            githubBtn.link = profile.html_url;
        }
    }

    // 2. Fetch Repositories
    // Sort by updated to show latest work, or stars.
    // Using 'updated' implies recent activity which is good for portfolio.
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6&type=owner`, { headers });

    if (reposRes.ok) {
        const repos = await reposRes.json();

        // Filter out forks if desired, but for now we keep them or we can filter in the API call.
        // We will map these to the project structure.
        if (repos.length > 0) {
            data.projects.items = repos.map(repo => ({
                title: repo.name,
                description: repo.description || "No description provided.",
                tags: [repo.language].filter(Boolean), // GitHub only gives one primary language easily
                github: repo.html_url,
                demo: repo.homepage || null
            }));
        }
    }
}

function renderMeta(meta) {
    if (!meta) return;
    document.title = meta.title;
    document.querySelector('meta[name="description"]').setAttribute('content', meta.description);
}

function renderHero(hero) {
    if (!hero) return;
    const container = document.getElementById('hero');

    const buttonsHtml = hero.buttons.map(btn => {
        const baseClass = "px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-1";
        const primaryClass = "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30";
        const secondaryClass = "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700";

        return `<a href="${btn.link}" class="${baseClass} ${btn.primary ? primaryClass : secondaryClass}">
            ${btn.icon ? `<i class="${btn.icon} mr-2"></i>` : ''}${btn.text}
        </a>`;
    }).join(' ');

    container.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <div class="mb-8 relative group">
                <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <img src="${hero.avatar}" alt="${hero.name}" class="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-2xl">
            </div>
            <h1 class="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                ${hero.name}
            </h1>
            <h2 class="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-semibold mb-6">
                ${hero.role}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                ${hero.tagline}
            </p>
            <div class="flex flex-wrap justify-center gap-4">
                ${buttonsHtml}
            </div>

            <div class="absolute bottom-10 animate-bounce">
                <i class="fas fa-chevron-down text-gray-400 text-2xl"></i>
            </div>
        </div>
    `;
}

function renderAbout(about) {
    if (!about) return;
    const container = document.getElementById('about');

    const statsHtml = about.stats.map(stat => `
        <div class="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-500 mb-2">${stat.value}</div>
            <div class="text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wide">${stat.label}</div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="container mx-auto px-4 py-20">
            <h2 class="section-title text-3xl md:text-4xl font-bold text-center mb-16">
                <span class="border-b-4 border-blue-600 pb-2">${about.title}</span>
            </h2>
            <div class="max-w-4xl mx-auto">
                <p class="text-lg text-gray-700 dark:text-gray-300 leading-loose text-center mb-12">
                    ${about.description}
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${statsHtml}
                </div>
            </div>
        </div>
    `;
}

function renderSkills(skills) {
    if (!skills) return;
    const container = document.getElementById('skills');

    const categoriesHtml = skills.categories.map(cat => {
        const itemsHtml = cat.items.map(item => `
            <span class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                ${item}
            </span>
        `).join('');

        return `
            <div class="mb-8">
                <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                    <span class="w-2 h-8 bg-blue-600 rounded mr-3"></span>
                    ${cat.name}
                </h3>
                <div class="flex flex-wrap gap-3">
                    ${itemsHtml}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="container mx-auto px-4 py-20 bg-gray-50 dark:bg-gray-800/50">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">
                <span class="border-b-4 border-blue-600 pb-2">${skills.title}</span>
            </h2>
            <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                ${categoriesHtml}
            </div>
        </div>
    `;
}

function renderProjects(projects) {
    if (!projects) return;
    const container = document.getElementById('projects');

    const projectsHtml = projects.items.map(project => {
        const tagsHtml = project.tags.map(tag => `
            <span class="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                ${tag}
            </span>
        `).join('');

        return `
            <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                <div class="p-6 flex-grow">
                    <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">${project.title}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        ${project.description}
                    </p>
                    <div class="flex flex-wrap gap-2 mb-6">
                        ${tagsHtml}
                    </div>
                </div>
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <a href="${project.github}" target="_blank" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm flex items-center">
                        <i class="fab fa-github mr-2"></i> Code
                    </a>
                    ${project.demo ? `
                        <a href="${project.demo}" target="_blank" class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm flex items-center">
                            <i class="fas fa-external-link-alt mr-2"></i> Live Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="container mx-auto px-4 py-20">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">
                <span class="border-b-4 border-blue-600 pb-2">${projects.title}</span>
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                ${projectsHtml}
            </div>
        </div>
    `;
}

function renderExperience(experience) {
    if (!experience) return;
    const container = document.getElementById('experience');

    const itemsHtml = experience.items.map((item, index) => `
        <div class="relative pl-8 md:pl-0 group">
            <!-- Timeline Line -->
            <div class="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2"></div>

            <!-- Timeline Dot -->
            <div class="absolute left-0 md:left-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900 transform md:-translate-x-1/2 mt-1.5 z-10"></div>

            <div class="md:flex justify-between items-start w-full ${index % 2 === 0 ? 'flex-row-reverse' : ''}">
                <div class="md:w-5/12 mb-8 md:mb-0 ${index % 2 === 0 ? 'text-left md:text-left' : 'text-left md:text-right'}">
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                        <span class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-xs font-bold mb-3">
                            ${item.date}
                        </span>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">${item.role}</h3>
                        <h4 class="text-lg font-medium text-gray-600 dark:text-gray-400 mb-4">${item.company}</h4>
                        <ul class="space-y-2">
                            ${item.description.map(desc => `
                                <li class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex items-start ${index % 2 === 0 ? '' : 'md:justify-end'}">
                                    <span class="mr-2 mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 ${index % 2 === 0 ? '' : 'md:order-2 md:ml-2 md:mr-0'}"></span>
                                    <span>${desc}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                <div class="md:w-5/12"></div>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="container mx-auto px-4 py-20 bg-gray-50 dark:bg-gray-800/50">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">
                <span class="border-b-4 border-blue-600 pb-2">${experience.title}</span>
            </h2>
            <div class="max-w-4xl mx-auto space-y-8 md:space-y-12">
                ${itemsHtml}
            </div>
        </div>
    `;
}

function renderContact(contact) {
    if (!contact) return;
    const container = document.getElementById('contact');

    const socialHtml = contact.social.map(item => `
        <a href="${item.link}" target="_blank" class="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all transform hover:scale-110">
            <i class="${item.icon} text-xl"></i>
        </a>
    `).join('');

    container.innerHTML = `
        <div class="container mx-auto px-4 py-20">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">
                <span class="border-b-4 border-blue-600 pb-2">${contact.title}</span>
            </h2>
            <div class="max-w-2xl mx-auto text-center">
                <p class="text-xl text-gray-600 dark:text-gray-400 mb-10">
                    ${contact.message}
                </p>
                <a href="mailto:${contact.email}" class="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1 mb-12">
                    <i class="fas fa-envelope mr-2"></i> Say Hello
                </a>
                <div class="flex justify-center gap-6">
                    ${socialHtml}
                </div>
            </div>
        </div>
    `;
}

function renderFooter(footer) {
    if (!footer) return;
    const container = document.getElementById('footer');
    container.innerHTML = `
        <div class="container mx-auto px-4 py-8 text-center text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800">
            <p>${footer.copyright}</p>
        </div>
    `;
}
