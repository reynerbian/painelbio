// --- GALLERY MODULE ---

// Function filterGallery not found

// Function renderGallery not found

// Function copySiteUrl not found

// Function startUploadSite not found

// Function deleteSite not found

// Function previewSiteOffline not found

// Function openSiteInfoModal not found

function loadLeadData(data) {
            const currentTemplate = document.querySelector('.template-card.is-selected');

            if (currentTemplate) {
                const templateId = currentTemplate.getAttribute('data-template');
                loadTemplatePreview(templateId, data);
            } else {
                const classicCard = document.querySelector('.template-card[data-template="classic"]');
                if (classicCard) classicCard.classList.add('is-selected');
                loadTemplatePreview('classic', data);
            }

            const topActionBtn = document.querySelector('.top-action-btn');
            if (topActionBtn) {
                topActionBtn.classList.remove('disabled');
            }

            if (typeof openDrawer === 'function' && rightDrawer) {
                openDrawer(rightDrawer);
            }
        }

