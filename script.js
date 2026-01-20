// Mock database of certificates
// In production, this would be connected to a real database
const certificateDatabase = {
    '2501001': {
        name: 'Ahmed Hassan',
        program: 'Online Chapter - Web Development',
        programCode: 'Online Chapter',
        date: 'January 15, 2025',
        year: 2025,
        subProgram: '01',
        serial: '001'
    },
    '2501002': {
        name: 'Fatima Ahmed',
        program: 'Online Chapter - Machine Learning',
        programCode: 'Online Chapter',
        date: 'January 20, 2025',
        year: 2025,
        subProgram: '01',
        serial: '002'
    },
    '2502001': {
        name: 'Mohamed Ali',
        program: 'Bootcamp - Full Stack Development',
        programCode: 'Bootcamp',
        date: 'February 10, 2025',
        year: 2025,
        subProgram: '02',
        serial: '001'
    },
    '2500001': {
        name: 'Sarah Ibrahim',
        program: 'Main Club - Foundations',
        programCode: 'Main Club',
        date: 'March 5, 2025',
        year: 2025,
        subProgram: '00',
        serial: '001'
    },
    '2501003': {
        name: 'Omar Khalid',
        program: 'Online Chapter - Mobile Development',
        programCode: 'Online Chapter',
        date: 'January 25, 2025',
        year: 2025,
        subProgram: '01',
        serial: '003'
    }
};

// Sub-program mapping
const programMapping = {
    '00': { name: 'Main Club', description: 'Main Computer Science Club' },
    '01': { name: 'Online Chapter', description: 'Online Learning Chapter' },
    '02': { name: 'Bootcamp', description: 'Intensive Bootcamp Program' },
    '03': { name: 'Advanced Track', description: 'Advanced Professional Track' }
};

// Initialize Matrix background effect
function initializeMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * canvas.height;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(14, 22, 54, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(24, 188, 233, 0.3)';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i]);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 50);
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Parse certificate ID into components
function parseCertificateId(id) {
    // Format: YYSSCCC
    // YY = Year (2 digits)
    // SS = Sub-program (2 digits)
    // CCC = Serial number (3 digits)
    
    if (!/^\d{7}$/.test(id)) {
        return null;
    }
    
    const year = '20' + id.substring(0, 2);
    const subProgram = id.substring(2, 4);
    const serial = id.substring(4, 7);
    
    return {
        id: id,
        year: year,
        subProgram: subProgram,
        serial: serial,
        serialDisplay: serial.replace(/^0+/, '') || '0'
    };
}

// Validate certificate ID
function validateCertificateId(id) {
    id = id.trim().toUpperCase();
    
    // Check format
    if (!/^\d{7}$/.test(id)) {
        return {
            valid: false,
            error: 'Certificate ID must be 7 digits (Format: YYSSCCC)'
        };
    }
    
    const parsed = parseCertificateId(id);
    
    // Validate year (must be between 20 and 99, representing 2020-2099)
    const yearNum = parseInt(parsed.year.substring(2));
    if (yearNum < 20 || yearNum > 99) {
        return {
            valid: false,
            error: 'Invalid year in certificate ID'
        };
    }
    
    // Validate sub-program (must be in our mapping or valid range)
    const subProgNum = parseInt(parsed.subProgram);
    if (subProgNum < 0 || subProgNum > 99) {
        return {
            valid: false,
            error: 'Invalid sub-program code'
        };
    }
    
    // Validate serial (must be between 1 and 9999)
    const serialNum = parseInt(parsed.serial);
    if (serialNum < 1 || serialNum > 9999) {
        return {
            valid: false,
            error: 'Invalid serial number'
        };
    }
    
    return {
        valid: true,
        parsed: parsed
    };
}

// Simulate certificate lookup with delay
function lookupCertificate(id) {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            if (certificateDatabase[id]) {
                resolve({
                    found: true,
                    data: certificateDatabase[id]
                });
            } else {
                resolve({
                    found: false
                });
            }
        }, 800);
    });
}

// Display loading state
function showLoadingState() {
    document.getElementById('certificateForm').classList.add('hidden');
    document.getElementById('errorState').classList.add('hidden');
    document.getElementById('successState').classList.add('hidden');
    document.getElementById('loadingState').classList.remove('hidden');
}

// Display error state
function showErrorState(message) {
    document.getElementById('certificateForm').classList.add('hidden');
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('successState').classList.add('hidden');
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorState').classList.remove('hidden');
}

// Display success state with certificate data
function showSuccessState(certData, parsedId) {
    // Update certificate display
    document.getElementById('certName').textContent = certData.name;
    document.getElementById('certProgram').textContent = certData.program;
    document.getElementById('certDate').textContent = certData.date;
    document.getElementById('certIdDisplay').textContent = parsedId.id;
    
    // Update details
    document.getElementById('detailYear').textContent = certData.year;
    document.getElementById('detailProgram').textContent = certData.programCode;
    document.getElementById('detailSerial').textContent = `${parsedId.serial} / 9999`;
    
    document.getElementById('certificateForm').classList.add('hidden');
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('errorState').classList.add('hidden');
    document.getElementById('successState').classList.remove('hidden');
}

// Reset form to initial state
function resetForm() {
    document.getElementById('certificateForm').classList.remove('hidden');
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('errorState').classList.add('hidden');
    document.getElementById('successState').classList.add('hidden');
    document.getElementById('certificateForm').reset();
    document.getElementById('certificateId').focus();
}

// Handle form submission
document.getElementById('certificateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const certificateId = document.getElementById('certificateId').value;
    
    // Validate input
    const validation = validateCertificateId(certificateId);
    if (!validation.valid) {
        showErrorState(validation.error);
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    // Lookup certificate
    const result = await lookupCertificate(certificateId);
    
    if (result.found) {
        showSuccessState(result.data, validation.parsed);
    } else {
        showErrorState(
            `Certificate ID "${certificateId}" not found in our system. Please verify the ID and try again.`
        );
    }
});

// Handle real-time input validation
document.getElementById('certificateId').addEventListener('input', (e) => {
    // Only allow digits
    e.target.value = e.target.value.replace(/[^\d]/g, '');
    
    // Format hint as they type
    const value = e.target.value;
    const hint = document.querySelector('.input-hint');
    
    if (value.length === 0) {
        hint.textContent = 'Format: YYSSCCC (e.g., 2501001)';
        hint.style.color = 'rgba(255, 255, 255, 0.5)';
    } else if (value.length < 7) {
        hint.textContent = `${7 - value.length} more digit${7 - value.length !== 1 ? 's' : ''} needed`;
        hint.style.color = 'rgba(255, 255, 255, 0.7)';
    } else if (value.length === 7) {
        hint.textContent = 'Ready to verify ✓';
        hint.style.color = 'rgba(40, 167, 69, 0.8)';
    }
});

// Share certificate
function shareCertificate() {
    const certId = document.getElementById('certIdDisplay').textContent;
    const shareUrl = `${window.location.origin}?id=${certId}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'STEM CSC Certificate',
            text: 'Check out my STEM CS Club Certificate!',
            url: shareUrl
        }).catch(err => {
            if (err.name !== 'AbortError') {
                showFallbackShare(shareUrl);
            }
        });
    } else {
        showFallbackShare(shareUrl);
    }
}

// Fallback share method
function showFallbackShare(url) {
    const certId = document.getElementById('certIdDisplay').textContent;
    const shareText = `I just earned my STEM CS Club Certificate! Certificate ID: ${certId}\n\nVerify it here: ${window.location.origin}`;
    
    // Copy to clipboard
    const textarea = document.createElement('textarea');
    textarea.value = shareText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // Show notification
    const action = document.querySelector('.share-btn');
    const originalText = action.innerHTML;
    action.innerHTML = '<i class="fas fa-check"></i> Copied to Clipboard';
    setTimeout(() => {
        action.innerHTML = originalText;
    }, 3000);
}

// Download certificate (placeholder)
document.querySelector('.download-btn').addEventListener('click', () => {
    const certId = document.getElementById('certIdDisplay').textContent;
    const name = document.getElementById('certName').textContent;
    
    // In production, this would generate a PDF
    // For now, just show a notification
    const btn = document.querySelector('.download-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Download Ready';
    setTimeout(() => {
        btn.innerHTML = originalText;
    }, 3000);
    
    console.log(`Certificate ${certId} for ${name} would be downloaded`);
});

// Handle URL parameter for direct certificate lookup
function handleUrlParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const certId = urlParams.get('id');
    
    if (certId) {
        document.getElementById('certificateId').value = certId;
        // Trigger form submission
        document.getElementById('certificateForm').dispatchEvent(new Event('submit'));
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeMatrix();
    handleUrlParameter();
    document.getElementById('certificateId').focus();
});

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    // Any additional responsive behavior can go here
});
