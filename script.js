// Wandering Wild Podcast - Interactive Features

let nowPlayingControlInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    
    // Display current date in hero section
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
    
    // Load real podcast stats from JSON file
    loadPodcastStats();
    
    // Load episodes from RSS feed
    loadEpisodesFromRSS();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to header with Apple-style elevation
    let lastScroll = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 60) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            header.style.borderBottom = '1px solid rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
            header.style.borderBottom = '1px solid rgba(0,0,0,0.06)';
        }
        
        lastScroll = currentScroll;
    });

    // Animated counter for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statNumbers.forEach(stat => animateCounter(stat));
            }
        });
    }, {
        threshold: 0.5
    });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
    
    // Fade in sections on scroll with stagger
    const fadeElements = document.querySelectorAll('.about-content, .episode-card, .testimonial-card, .episode-item, .newsletter-content');
    
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50); // Stagger animation
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        fadeObserver.observe(element);
    });
    
    // Newsletter form handling
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            
            // Show success message
            newsletterForm.style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
            
            // In production, integrate with email service like Mailchimp, ConvertKit, etc.
            console.log('Newsletter signup:', email);
        });
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Show success message (replace with actual form submission)
            alert('Thank you for your message! We\'ll get back to you soon.');
            contactForm.reset();
            
            // In production, integrate with email service or backend
            console.log('Contact form submission:', { name, email, subject, message });
        });
    }
    
    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    setupTopicChips();
    
    // Initialize hero map (Leaflet) once assets are ready
    if (typeof L !== 'undefined') {
        initHeroMap();
    } else {
        window.addEventListener('load', initHeroMap);
    }

    console.log('🏔️ Wandering Wild Podcast - Ready to explore!');
});

// Social sharing functions
function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out Wandering Wild Podcast - Adventures, Stories & Wild Conversations with Ashley Bradshaw!');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

// Initialize the Leaflet map in the hero backdrop
function initHeroMap() {
    const mapEl = document.getElementById('hero-map');
    if (!mapEl || typeof L === 'undefined') return;

    // Create map (non-interactive visuals)
    const map = L.map(mapEl, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 5,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        tap: false
    });

    // Light basemap tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd'
    }).addTo(map);

    // Coordinates: Puerto Rico, Guatemala, Portugal, Thailand
    const route = [
        [18.22, -66.59],  // Puerto Rico
        [15.78, -90.23],  // Guatemala
        [38.72,  -9.14],  // Portugal
        [15.87, 100.99]   // Thailand
    ];

    // Draw animated dashed route (higher contrast, thicker line)
    L.polyline(route, {
        color: '#1b5e20',
        weight: 5,
        opacity: 1,
        dashArray: '12 6',
        className: 'travel-route'
    }).addTo(map);

    // Subtle location dots (non-clickable)
    route.forEach(([lat, lng]) => {
        L.circleMarker([lat, lng], {
            radius: 4,
            color: '#2e7d32',
            fillColor: '#2e7d32',
            fillOpacity: 0.9,
            interactive: false
        }).addTo(map);
    });

    // Ensure all points visible
    const bounds = L.latLngBounds(route);
    map.fitBounds(bounds, { padding: [30, 30] });
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

// Lazy-load Spotify embed
function initLazySpotify() {
    const placeholder = document.getElementById('spotify-embed');
    if (!placeholder) return;

    const createIframe = () => {
        if (placeholder.dataset.loaded) return;
        const src = placeholder.getAttribute('data-src');
        if (!src) return;
        const iframe = document.createElement('iframe');
        iframe.style.borderRadius = '12px';
        iframe.style.width = '100%';
        iframe.style.height = '152px';
        iframe.style.border = '0';
        iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        iframe.loading = 'lazy';
        iframe.src = src;
        placeholder.replaceWith(iframe);
        placeholder.dataset.loaded = 'true';
    };

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    createIframe();
                    obs.disconnect();
                }
            });
        }, { rootMargin: '200px 0px' });
        io.observe(placeholder);
    } else {
        setTimeout(createIframe, 1000);
    }
}

// Load real podcast stats from JSON file
async function loadPodcastStats() {
    try {
        const response = await fetch('config.json');
        const config = await response.json();
        const stats = config.stats || {};

        const statElements = document.querySelectorAll('.stat-number');
        statElements.forEach(element => {
            const labelEl = element.parentElement?.querySelector('.stat-label');
            const statLabel = (labelEl?.textContent || '').toLowerCase();
            if (statLabel.includes('episode')) {
                element.setAttribute('data-target', stats.episodes || '0');
            } else if (statLabel.includes('listener')) {
                element.setAttribute('data-target', stats.listeners || '0');
            } else if (statLabel.includes('countr')) {
                element.setAttribute('data-target', stats.countries || '0');
            }
        });

        // Add last updated info to footer
        if (stats.lastUpdated) {
            const footer = document.querySelector('footer p');
            if (footer) {
                const updateDate = new Date(stats.lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });
                footer.innerHTML += ` <span style="opacity: 0.6; font-size: 0.9em;">| Stats updated ${updateDate}</span>`;
            }
        }

        // Ensure Spotify embed lazy-loader is ready
        initLazySpotify();

        // Add RSS <link> tag dynamically from config
        if (config?.podcastInfo?.rssFeedUrl) {
            const link = document.createElement('link');
            link.rel = 'alternate';
            link.type = 'application/rss+xml';
            link.href = config.podcastInfo.rssFeedUrl;
            document.head.appendChild(link);
        }
    } catch (error) {
        console.warn('Could not load podcast stats:', error);
    }
}

// Load episodes from Spotify RSS feed
async function loadEpisodesFromRSS() {
    try {
        const episodesContainer = document.getElementById('episodesList') || document.getElementById('episodes-grid');
        if (episodesContainer) {
            episodesContainer.innerHTML = '';
        }

        const configResponse = await fetch('config.json');
        const config = await configResponse.json();

        if (config?.podcastInfo?.rssFeedUrl && config?.settings?.enableRSSAutoUpdate) {
            const rssToJsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(config.podcastInfo.rssFeedUrl)}`;
            const response = await fetch(rssToJsonUrl);
            const data = await response.json();

            if (data.status === 'ok' && Array.isArray(data.items)) {
                const latestEpisodes = data.items.slice(0, 10);

                if (episodesContainer) {
                    latestEpisodes.forEach((item, index) => {
                        const useCard = episodesContainer.id === 'episodes-grid';
                        const el = useCard ? createEpisodeCardForGrid(item) : createEpisodeElement(item, index + 1);
                        episodesContainer.appendChild(el);
                    });
                }

                if (latestEpisodes.length) {
                    updateNowPlayingCard(latestEpisodes[0]);
                }

                // Inject JSON-LD for PodcastSeries and latest episode
                try { injectPodcastJSONLD(config, latestEpisodes[0]); } catch (e) { /* no-op */ }

                const loadMoreBtn = document.getElementById('loadMoreBtn');
                if (loadMoreBtn) loadMoreBtn.style.display = 'none';

                console.log(`✅ Loaded ${latestEpisodes.length} latest episodes from RSS feed`);
            }
        } else {
            console.log('ℹ️ RSS feed not configured. Add your RSS feed URL to config.json');
            console.log('📍 Get it from: Spotify for Podcasters → Your Show → Availability → RSS Feed');
            resetNowPlayingCard('Add your Spotify RSS feed in config.json to auto-load the latest episode here.');
        }

        setupEpisodeSearch();
    } catch (error) {
        console.warn('Could not load episodes from RSS:', error);
        setupEpisodeSearch();
        resetNowPlayingCard('We had trouble talking to Spotify. Refresh or check the feed URL.');
    }
}

function createEpisodeCardForGrid(item) {
    const card = document.createElement('div');
    card.className = 'episode-card';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = item.description || '';
    const description = (tempDiv.textContent || '').trim();
    const descClamped = description.length > 160 ? description.slice(0, 157) + '…' : description;
    const img = item.thumbnail || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop';
    const date = item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
    const duration = item.itunes_duration ? formatEpisodeDuration(item.itunes_duration) : '';
    const episodeUrl = item.link || '#';
    
    card.innerHTML = `
        <img class="episode-card-image" src="${img}" alt="Episode artwork for ${item.title}">
        <div class="episode-card-content">
            <h3 class="episode-card-title">${item.title || 'Episode'}</h3>
            <div class="episode-card-meta">
                <span>${date}</span>
                ${duration ? '<span>•</span><span>'+duration+'</span>' : ''}
            </div>
            <p class="episode-card-description">${descClamped || ''}</p>
            <a href="${episodeUrl}" target="_blank" rel="noopener noreferrer" class="episode-card-link">▶ Listen on Spotify</a>
        </div>
    `;
    
    // Make entire card clickable
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        // Don't navigate if user clicked the link directly
        if (e.target.tagName !== 'A') {
            window.open(episodeUrl, '_blank', 'noopener,noreferrer');
        }
    });
    
    return card;
}

// Inject PodcastSeries / PodcastEpisode JSON-LD
function injectPodcastJSONLD(config, latestItem) {
    const siteUrl = window.location.origin;
    const series = {
        "@context": "https://schema.org",
        "@type": "PodcastSeries",
        "name": config?.podcastInfo?.name || "Wandering Wild Podcast",
        "url": siteUrl,
        "sameAs": [
            config?.social?.spotify,
            config?.social?.applePodcasts,
            config?.social?.youtube,
            config?.social?.instagram
        ].filter(Boolean),
        "rssFeed": config?.podcastInfo?.rssFeedUrl || undefined
    };

    const scripts = [];
    const s1 = document.createElement('script');
    s1.type = 'application/ld+json';
    s1.textContent = JSON.stringify(series);
    scripts.push(s1);

    if (latestItem) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = latestItem.description || '';
        const plain = (tempDiv.textContent || '').trim();
        const ep = {
            "@context": "https://schema.org",
            "@type": "PodcastEpisode",
            "name": latestItem.title,
            "url": latestItem.link || siteUrl,
            "datePublished": latestItem.pubDate ? new Date(latestItem.pubDate).toISOString() : undefined,
            "description": plain || undefined
        };
        const s2 = document.createElement('script');
        s2.type = 'application/ld+json';
        s2.textContent = JSON.stringify(ep);
        scripts.push(s2);
    }

    scripts.forEach(s => document.head.appendChild(s));
}

// Create episode HTML element from RSS item
function createEpisodeElement(item, episodeNumber) {
    const div = document.createElement('div');
    div.className = 'episode-item';
    
    // Parse publish date
    const pubDate = new Date(item.pubDate);
    const isRecent = (Date.now() - pubDate.getTime()) < (7 * 24 * 60 * 60 * 1000); // Within 7 days
    const dateLabel = isRecent ? 'Latest' : pubDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Extract description (remove HTML tags)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = item.description || '';
    const description = tempDiv.textContent.slice(0, 150) + '...';
    
    // Get audio URL from enclosure (rss2json uses 'link' property)
    const audioUrl = item.enclosure?.link || item.enclosure?.url || '';
    
    div.innerHTML = `
        <div class="episode-thumbnail">🎙️</div>
        <div class="episode-details">
            <div class="episode-meta">
                <span class="episode-number">Episode ${episodeNumber}</span>
                <span class="episode-date">${dateLabel}</span>
            </div>
            <h3>${item.title}</h3>
            <p>${description}</p>
            ${audioUrl ? `
                <div class="episode-media-container">
                    <audio controls class="episode-audio" preload="none">
                        <source src="${audioUrl}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            ` : `
                <a href="${item.link || '#'}" target="_blank" class="play-button">▶ Listen on Spotify</a>
            `}
        </div>
    `;
    
    return div;
}

function updateNowPlayingCard(item) {
    if (!item) return;
    const titleEl = document.getElementById('nowPlayingTitle');
    const summaryEl = document.getElementById('nowPlayingSummary');
    const dateEl = document.getElementById('nowPlayingDate');
    const durationEl = document.getElementById('nowPlayingDuration');
    const spotifyLink = document.getElementById('nowPlayingSpotify');
    const controlBtn = document.getElementById('nowPlayingControl');
    const controlLabel = document.getElementById('nowPlayingControlLabel');
    const controlIcon = controlBtn ? controlBtn.querySelector('.control-icon') : null;
    const audioEl = document.getElementById('nowPlayingAudio');

    if (!titleEl || !summaryEl) return;

    titleEl.textContent = item.title || 'New episode';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = item.description || '';
    const plainText = (tempDiv.textContent || '').trim();
    const previewText = plainText.length > 180 ? `${plainText.slice(0, 177)}…` : (plainText || 'Adventure incoming.');
    summaryEl.textContent = previewText;

    if (dateEl) {
        const readableDate = item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
        dateEl.textContent = readableDate;
    }

    if (durationEl) {
        durationEl.textContent = formatEpisodeDuration(item.itunes_duration);
    }

    if (spotifyLink && item.link) {
        spotifyLink.href = item.link;
    }

    const audioUrl = item.enclosure?.link || item.enclosure?.url || '';
    if (audioEl) {
        audioEl.pause();
        audioEl.currentTime = 0;
    }

    if (audioUrl && audioEl && controlBtn && controlLabel && controlIcon) {
        audioEl.src = audioUrl;
        controlBtn.disabled = false;
        controlBtn.dataset.state = 'paused';
        controlIcon.textContent = '▶';
        controlLabel.textContent = 'Play Preview';

        if (!nowPlayingControlInitialized) {
            controlBtn.addEventListener('click', () => toggleNowPlayingPreview(audioEl, controlBtn, controlIcon, controlLabel));
            nowPlayingControlInitialized = true;
        }

        audioEl.onended = () => {
            controlBtn.dataset.state = 'paused';
            controlIcon.textContent = '▶';
            controlLabel.textContent = 'Play Preview';
        };
    } else if (controlBtn) {
        controlBtn.disabled = true;
    }
}

function formatEpisodeDuration(durationValue) {
    if (!durationValue) return '—';

    let totalSeconds;
    if (typeof durationValue === 'number') {
        totalSeconds = durationValue;
    } else if (typeof durationValue === 'string') {
        const segments = durationValue.split(':').map(Number).filter(num => !Number.isNaN(num));
        if (segments.length === 3) {
            totalSeconds = segments[0] * 3600 + segments[1] * 60 + segments[2];
        } else if (segments.length === 2) {
            totalSeconds = segments[0] * 60 + segments[1];
        } else if (segments.length === 1) {
            totalSeconds = segments[0];
        }
    }

    if (!totalSeconds || Number.isNaN(totalSeconds)) return '—';

    const minutes = Math.round(totalSeconds / 60);
    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins.toString().padStart(2, '0')}m`;
    }
    return `${minutes} min`;
}

function resetNowPlayingCard(message) {
    const summaryEl = document.getElementById('nowPlayingSummary');
    const controlBtn = document.getElementById('nowPlayingControl');
    const controlLabel = document.getElementById('nowPlayingControlLabel');
    const controlIcon = controlBtn ? controlBtn.querySelector('.control-icon') : null;

    if (summaryEl && message) {
        summaryEl.textContent = message;
    }
    if (controlBtn) {
        controlBtn.disabled = true;
    }
    if (controlIcon && controlLabel) {
        controlIcon.textContent = '▶';
        controlLabel.textContent = 'Play Preview';
    }
}

function toggleNowPlayingPreview(audioEl, controlBtn, iconEl, labelEl) {
    if (!audioEl || !controlBtn || !iconEl || !labelEl) return;

    if (audioEl.paused) {
        audioEl.play().then(() => {
            controlBtn.dataset.state = 'playing';
            iconEl.textContent = '⏸';
            labelEl.textContent = 'Pause Preview';
        }).catch(() => {
            controlBtn.dataset.state = 'paused';
        });
    } else {
        audioEl.pause();
        audioEl.currentTime = 0;
        controlBtn.dataset.state = 'paused';
        iconEl.textContent = '▶';
        labelEl.textContent = 'Play Preview';
    }
}

function setupTopicChips() {
    const chips = document.querySelectorAll('.topic-chip');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    if (!chips.length || !subjectInput || !messageInput) return;

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            if (chip.dataset.subject) {
                subjectInput.value = chip.dataset.subject;
            }
            if (chip.dataset.template && (!messageInput.value || messageInput.value === messageInput.placeholder)) {
                messageInput.value = chip.dataset.template;
            }
        });
    });
}

// Setup episode search and filter functionality
function setupEpisodeSearch() {
    const searchInput = document.getElementById('searchEpisodes');
    const sortSelect = document.getElementById('sortEpisodes');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterEpisodes(searchTerm);
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortEpisodes(e.target.value);
        });
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.textContent = 'Coming soon - More episodes loading...';
            loadMoreBtn.disabled = true;
            // In production, this would load more episodes from the RSS feed
        });
    }
}

function filterEpisodes(searchTerm) {
    const episodes = document.querySelectorAll('.episode-item');
    episodes.forEach(episode => {
        const title = episode.querySelector('h3').textContent.toLowerCase();
        const description = episode.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            episode.style.display = 'flex';
        } else {
            episode.style.display = 'none';
        }
    });
}

function sortEpisodes(sortBy) {
    const episodesList = document.getElementById('episodesList');
    const episodes = Array.from(episodesList.querySelectorAll('.episode-item'));
    
    episodes.sort((a, b) => {
        if (sortBy === 'newest') {
            return 0; // Keep current order
        } else if (sortBy === 'oldest') {
            return 0; // Reverse when we have dates
        } else if (sortBy === 'popular') {
            return 0; // Sort by play count when available
        }
        return 0;
    });
    
    // Re-append in new order
    episodes.forEach(episode => episodesList.appendChild(episode));
}
