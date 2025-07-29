// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // ===== MODAL FUNCTIONALITY =====
    const uploadModal = document.getElementById('upload-modal');
    const purchaseModal = document.getElementById('purchase-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Open upload modal when "Sell Products" button is clicked
    const sellButton = document.querySelector('.hero-buttons .secondary');
    sellButton.addEventListener('click', function() {
        playSound('whoosh');
        uploadModal.style.display = 'flex';
        animateElement(uploadModal, 'fadeIn');
    });
    
    // Open purchase modal when "Buy Now" buttons are clicked
    const buyButtons = document.querySelectorAll('.product-card .btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            playSound('cash');
            purchaseModal.style.display = 'flex';
            animateElement(purchaseModal, 'fadeIn');
        });
    });
    
    // Close modals when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            playSound('click');
            animateElement(this.closest('.modal'), 'fadeOut', function() {
                uploadModal.style.display = 'none';
                purchaseModal.style.display = 'none';
            });
        });
    });
    
    // Close modals when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === uploadModal || event.target === purchaseModal) {
            playSound('click');
            animateElement(event.target, 'fadeOut', function() {
                uploadModal.style.display = 'none';
                purchaseModal.style.display = 'none';
            });
        }
    });
    
    // ===== PAYMENT HANDLING =====
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const bankDetails = document.getElementById('bank-details');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            playSound('click');
            if (this.value === 'bank') {
                animateElement(bankDetails, 'slideDown');
                bankDetails.style.display = 'block';
            } else {
                animateElement(bankDetails, 'slideUp', function() {
                    bankDetails.style.display = 'none';
                });
            }
        });
    });
    
    // ===== FORM SUBMISSION =====
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading animation
            showLoadingAnimation();
            
            // Simulate product upload with delay
            setTimeout(function() {
                hideLoadingAnimation();
                showSuccessMessage('🎉 EPIC WIN! Product uploaded successfully! +25 XP');
                playSound('success');
                confettiEffect();
                uploadModal.style.display = 'none';
                uploadForm.reset();
                
                // Update XP bar
                updateXP(25);
            }, 1500);
        });
    }
    
    // ===== PURCHASE CONFIRMATION =====
    const confirmPurchaseBtn = document.querySelector('.purchase-details .btn');
    if (confirmPurchaseBtn) {
        confirmPurchaseBtn.addEventListener('click', function() {
            showLoadingAnimation();
            
            setTimeout(function() {
                hideLoadingAnimation();
                showSuccessMessage('🔥 AWESOME! Purchase successful! +10 XP');
                playSound('success');
                purchaseModal.style.display = 'none';
                
                // Update wallet
                updateWallet(-15); // Assuming purchase of 15 $DUI
                
                // Update XP
                updateXP(10);
            }, 1500);
        });
    }
    
    // ===== ACHIEVEMENT SYSTEM =====
    const achievements = document.querySelectorAll('.achievement');
    achievements.forEach(achievement => {
        achievement.addEventListener('mouseenter', function() {
            playSound('hover');
            if (this.classList.contains('unlocked')) {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 10px 20px rgba(76, 175, 80, 0.3)';
            } else {
                this.style.transform = 'scale(1.02)';
                this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
            }
        });
        
        achievement.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
        
        // Click effect for locked achievements
        if (achievement.classList.contains('locked')) {
            achievement.addEventListener('click', function() {
                playSound('locked');
                showTooltip(this, 'Keep grinding to unlock this achievement! 🔒');
            });
        } else {
            achievement.addEventListener('click', function() {
                playSound('achievement');
                pulseElement(this);
            });
        }
    });
    
    // ===== LEVEL PROGRESS SYSTEM =====
    let progressValue = 75; // Starting at 75%
    const progressBar = document.querySelector('.progress');
    const progressText = document.querySelector('.progress-info span:last-child');
    
    // For demo purposes, increment progress when clicking on locked achievements
    const lockedAchievements = document.querySelectorAll('.achievement.locked');
    lockedAchievements.forEach(achievement => {
        achievement.addEventListener('click', function() {
            progressValue += 5;
            if (progressValue > 100) progressValue = 100;
            
            animateProgressBar(progressValue);
            
            if (progressValue === 100) {
                setTimeout(function() {
                    showSuccessMessage('🏆 LEVEL UP! You reached Level 5! +100 XP');
                    playSound('levelup');
                    confettiEffect();
                    document.querySelector('.level-badge').textContent = 'Level 5';
                    document.querySelector('.progress-info span:first-child').textContent = 'Level 5';
                    progressText.textContent = 'MAX LEVEL!';
                }, 1000);
            }
        });
    });
    
    // ===== INITIALIZE SALES CHART =====
    initializeSalesChart();
    
    // ===== FORMAT CURRENCY DISPLAYS =====
    formatCurrencyDisplays();
    
    // ===== ANIMATION UTILITIES =====
    function animateElement(element, animationType, callback) {
        // Remove any existing animation classes
        element.classList.remove('fadeIn', 'fadeOut', 'slideUp', 'slideDown', 'pulse');
        
        // Force reflow
        void element.offsetWidth;
        
        // Add the new animation class
        element.classList.add(animationType);
        
        // Execute callback after animation completes
        if (callback) {
            setTimeout(callback, 500); // Assuming 500ms animation duration
        }
    }
    
    function pulseElement(element) {
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 500);
    }
    
    function showLoadingAnimation() {
        // Create loading overlay if it doesn't exist
        if (!document.querySelector('.loading-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="spinner">
                    <img src="images/gui-inu-logo.png" alt="Loading" class="spin">
                    <p>Processing...</p>
                </div>
            `;
            document.body.appendChild(overlay);
        } else {
            document.querySelector('.loading-overlay').style.display = 'flex';
        }
    }
    
    function hideLoadingAnimation() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
    
    function showSuccessMessage(message) {
        // Create message element if it doesn't exist
        if (!document.querySelector('.success-message')) {
            const messageEl = document.createElement('div');
            messageEl.className = 'success-message';
            document.body.appendChild(messageEl);
        }
        
        const messageEl = document.querySelector('.success-message');
        messageEl.textContent = message;
        messageEl.style.display = 'block';
        animateElement(messageEl, 'fadeIn');
        
        setTimeout(() => {
            animateElement(messageEl, 'fadeOut', function() {
                messageEl.style.display = 'none';
            });
        }, 3000);
    }
    
    function showTooltip(element, message) {
        // Remove any existing tooltips
        const existingTooltip = document.querySelector('.custom-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = message;
        document.body.appendChild(tooltip);
        
        // Position tooltip near the element
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
        
        // Show tooltip
        animateElement(tooltip, 'fadeIn');
        
        // Hide tooltip after delay
        setTimeout(() => {
            animateElement(tooltip, 'fadeOut', function() {
                tooltip.remove();
            });
        }, 2000);
    }
    
    function animateProgressBar(value) {
        // Animate the progress bar
        const progressBar = document.querySelector('.progress');
        progressBar.style.transition = 'width 1s ease-in-out';
        progressBar.style.width = value + '%';
        
        // Update text
        const progressText = document.querySelector('.progress-info span:last-child');
        progressText.textContent = value + '% to Level 5';
    }
    
    function updateXP(amount) {
        // If XP display exists, update it
        const xpDisplay = document.querySelector('.xp-value');
        if (xpDisplay) {
            const currentXP = parseInt(xpDisplay.textContent);
            xpDisplay.textContent = currentXP + amount;
            pulseElement(xpDisplay.parentElement);
        }
    }
    
    function updateWallet(amount) {
        // Update wallet display
        const walletDisplay = document.querySelector('.wallet');
        if (walletDisplay) {
            const currentAmount = parseInt(walletDisplay.textContent.match(/\d+/)[0]);
            const newAmount = currentAmount + amount;
            walletDisplay.textContent = `Wallet: ${newAmount} $DUI`;
            pulseElement(walletDisplay);
        }
    }
    
    function confettiEffect() {
        // Create confetti container if it doesn't exist
        if (!document.querySelector('.confetti-container')) {
            const container = document.createElement('div');
            container.className = 'confetti-container';
            document.body.appendChild(container);
        }
        
        const container = document.querySelector('.confetti-container');
        container.innerHTML = ''; // Clear previous confetti
        
        // Create confetti pieces
        const colors = ['#4CAF50', '#FFC107', '#2196F3', '#E91E63', '#9C27B0'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            container.appendChild(confetti);
        }
        
        // Remove confetti after animation
        setTimeout(() => {
            container.innerHTML = '';
        }, 4000);
    }
    
    // ===== SOUND EFFECTS =====
    function playSound(soundType) {
        // Create audio context if it doesn't exist
        if (!window.audioContext) {
            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                window.audioContext = new AudioContext();
            } catch (e) {
                console.warn('Web Audio API not supported');
                return;
            }
        }
        
        // Sound configurations
        const sounds = {
            click: { frequency: 800, duration: 0.1, type: 'sine' },
            hover: { frequency: 400, duration: 0.05, type: 'sine' },
            success: { frequency: [523.25, 659.25, 783.99], duration: 0.15, type: 'triangle' },
            achievement: { frequency: [440, 554.37, 659.25], duration: 0.2, type: 'triangle' },
            levelup: { frequency: [523.25, 659.25, 783.99, 1046.50], duration: 0.2, type: 'sawtooth' },
            cash: { frequency: [800, 600], duration: 0.1, type: 'square' },
            whoosh: { frequency: [600, 200], duration: 0.3, type: 'sine' },
            locked: { frequency: [300, 200], duration: 0.2, type: 'square' }
        };
        
        const sound = sounds[soundType];
        if (!sound) return;
        
        // Play the sound
        if (Array.isArray(sound.frequency)) {
            // Play sequence of notes
            sound.frequency.forEach((freq, index) => {
                setTimeout(() => {
                    playTone(freq, sound.duration, sound.type);
                }, index * (sound.duration * 1000));
            });
        } else {
            // Play single note or sweep
            if (Array.isArray(sound.frequency)) {
                // Frequency sweep
                playFrequencySweep(sound.frequency[0], sound.frequency[1], sound.duration, sound.type);
            } else {
                // Single tone
                playTone(sound.frequency, sound.duration, sound.type);
            }
        }
    }
    
    function playTone(frequency, duration, type) {
        const oscillator = window.audioContext.createOscillator();
        const gainNode = window.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        oscillator.connect(gainNode);
        gainNode.connect(window.audioContext.destination);
        
        // Apply fade out
        gainNode.gain.setValueAtTime(0.3, window.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(window.audioContext.currentTime + duration);
    }
    
    function playFrequencySweep(startFreq, endFreq, duration, type) {
        const oscillator = window.audioContext.createOscillator();
        const gainNode = window.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(startFreq, window.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, window.audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(window.audioContext.destination);
        
        gainNode.gain.setValueAtTime(0.3, window.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(window.audioContext.currentTime + duration);
    }
    
    // ===== SALES CHART INITIALIZATION =====
    function initializeSalesChart() {
        // Check if the sales chart container exists
        const chartContainer = document.querySelector('.sales-chart');
        if (!chartContainer) {
            // Create chart container in profile content
            const profileContent = document.querySelector('.profile-content');
            if (profileContent) {
                const chartSection = document.createElement('div');
                chartSection.className = 'sales-chart';
                chartSection.innerHTML = `
                    <h3>Sales Performance</h3>
                    <div class="chart-container">
                        <canvas id="salesChart"></canvas>
                    </div>
                    <div class="chart-stats">
                        <div class="chart-stat">
                            <span class="stat-value">$1,250</span>
                            <span class="stat-label">Total Revenue</span>
                        </div>
                        <div class="chart-stat">
                            <span class="stat-value">+15%</span>
                            <span class="stat-label">Growth Rate</span>
                        </div>
                        <div class="chart-stat">
                            <span class="stat-value">8</span>
                            <span class="stat-label">Avg. Daily Sales</span>
                        </div>
                    </div>
                `;
                
                // Insert chart before level progress
                const levelProgress = document.querySelector('.level-progress');
                if (levelProgress) {
                    profileContent.insertBefore(chartSection, levelProgress);
                } else {
                    profileContent.appendChild(chartSection);
                }
                
                // Load Chart.js from CDN if not already loaded
                if (!window.Chart) {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
                    script.onload = drawSalesChart;
                    document.head.appendChild(script);
                } else {
                    drawSalesChart();
                }
            }
        } else {
            // Chart container exists, just draw the chart
            if (window.Chart) {
                drawSalesChart();
            } else {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
                script.onload = drawSalesChart;
                document.head.appendChild(script);
            }
        }
    }
    
    function drawSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;
        
        // Sample data for the chart
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const salesData = [5, 12, 8, 15, 10, 20, 18];
        const revenueData = [25, 60, 40, 75, 50, 100, 90]; // in $DUI
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Sales',
                        data: salesData,
                        backgroundColor: 'rgba(76, 175, 80, 0.6)',
                        borderColor: 'rgba(76, 175, 80, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Revenue ($DUI)',
                        data: revenueData,
                        type: 'line',
                        fill: false,
                        backgroundColor: 'rgba(33, 150, 243, 0.6)',
                        borderColor: 'rgba(33, 150, 243, 1)',
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Sales Count'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Revenue ($DUI)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                family: '"Poppins", sans-serif',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.dataset.label === 'Revenue ($DUI)') {
                                    label += '$' + context.raw;
                                } else {
                                    label += context.raw;
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // ===== FORMAT CURRENCY DISPLAYS =====
    function formatCurrencyDisplays() {
        // Format all price displays to use $ symbol
        const priceElements = document.querySelectorAll('.product-price');
        priceElements.forEach(element => {
            const price = element.textContent.trim();
            if (price.includes('$DUI')) {
                const numericValue = price.replace('$DUI', '').trim();
                element.textContent = `$${numericValue}`;
            }
        });
        
        // Format wallet display
        const walletDisplay = document.querySelector('.wallet');
        if (walletDisplay) {
            const walletText = walletDisplay.textContent;
            if (walletText.includes('$DUI')) {
                const numericValue = walletText.replace('Wallet:', '').replace('$DUI', '').trim();
                walletDisplay.textContent = `Wallet: $${numericValue}`;
            }
        }
        
        // Format purchase modal price
        const purchasePrice = document.querySelector('.purchase-product p');
        if (purchasePrice && purchasePrice.textContent.includes('$DUI')) {
            const price = purchasePrice.textContent;
            const numericValue = price.replace('Price:', '').replace('$DUI', '').trim();
            purchasePrice.textContent = `Price: $${numericValue}`;
        }
        
        // Format conversion info
        const conversionInfo = document.querySelector('.conversion-info p:last-child');
        if (conversionInfo && conversionInfo.textContent.includes('$DUI')) {
            const text = conversionInfo.textContent;
            conversionInfo.textContent = text.replace('$DUI', '$');
        }
        
        // Format earned amount in profile
        const earnedAmount = document.querySelector('.profile-stats .stat:last-child .stat-value');
        if (earnedAmount && earnedAmount.textContent.includes('$DUI')) {
            const amount = earnedAmount.textContent.replace('$DUI', '').trim();
            earnedAmount.textContent = `$${amount}`;
        }
    }
});