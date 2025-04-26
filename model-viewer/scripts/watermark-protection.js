

// Function to add watermark

function addWatermark() {
    const container = document.getElementById('model-container');
    if (!container) return;

    const modelViewer = container.querySelector('model-viewer');
    if (!modelViewer) return;

    // Remove old watermark(s)
    const existing = modelViewer.querySelector('.watermark');
    if (existing) existing.remove();

    // Create new watermark
    const watermark = document.createElement('div');
    watermark.className = 'watermark';
    watermark.textContent = 'Powered by @XRVisionLabs';

    // Append inside model-viewer
    modelViewer.appendChild(watermark);

    console.log('Watermark added inside <model-viewer>');
}


/*function addWatermark() {
    const container = document.getElementById('model-container');
    if (!container) return;

    // Remove any existing watermarks to avoid duplicates
    const existingWatermarks = container.querySelectorAll('.watermark');
    existingWatermarks.forEach(mark => mark.remove());

    // Create new watermark
    const watermark = document.createElement('div');
    watermark.className = 'watermark';
    watermark.textContent = '© YourBrand';
    container.appendChild(watermark);

    console.log('Watermark added/refreshed');
}*/

// Add watermark on initial page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addWatermark);
} else {
    addWatermark();
}

// Also add watermark when all resources are loaded
window.addEventListener('load', addWatermark);

// Monitor for DOM changes
const observer = new MutationObserver(mutations => {
    const container = document.getElementById('model-container');
    if (!container) return;

    const watermarkExists = container.querySelector('.watermark');
    if (!watermarkExists) {
        console.log('Watermark removed - restoring...');
        addWatermark();
    }
});

// Start observing once DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('model-container');
        if (container) {
            observer.observe(container, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }
    });
} else {
    const container = document.getElementById('model-container');
    if (container) {
        observer.observe(container, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }
}

// Aggressively check for watermark every 500ms
setInterval(() => {
    const container = document.getElementById('model-container');
    if (container && !container.querySelector('.watermark')) {
        console.log('Periodic check: Watermark missing - restoring...');
        addWatermark();
    }
}, 500);

// Add a second observer for the entire body
// This helps detect if someone removes the entire model container
const bodyObserver = new MutationObserver(mutations => {
    const container = document.getElementById('model-container');
    if (container && !container.querySelector('.watermark')) {
        addWatermark();
    }
});

// Start observing the body
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        bodyObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
} else {
    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const arParam = urlParams.get('ar');

    if (arParam === 'true') {
        const modelViewer = document.querySelector('model-viewer');

        if (modelViewer) {
            modelViewer.addEventListener('load', () => {
                setTimeout(() => {
                    modelViewer.activateAR();
                }, 300); // Give a little time after loading
            });
        }
    }
});
