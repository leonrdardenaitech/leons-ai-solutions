/**
 * Script for Sample Products Portfolio
 * Handles scroll-triggered animations and interactive mouse effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    const header = document.querySelector('.glass-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Scroll-triggered fading animations
    const fadeElements = document.querySelectorAll('.staggered-fade');
    
    const fadeObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once faded in if we only want it to happen once
                // observer.unobserve(entry.target);
            }
        });
    }, fadeObserverOptions);

    fadeElements.forEach(el => fadeObserver.observe(el));

    // 3. Interactive Cursor Glow Effect
    const cursorGlow = document.querySelector('.cursor-glow');
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // Smooth trailing effect
    function animateCursor() {
        // Linear interpolation for smooth trailing
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        
        cursorGlow.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%))`;
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 4. 3D Tilt Effect on Cards
    const tiltCards = document.querySelectorAll('.hover-tilt');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease';
            
            // Adjust card inner lighting/glow based on mouse pos if needed
            // e.g. updating a background gradient position
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
        });
    });

    // 5. Dynamic grid scan intensity based on scroll speed
    let lastScrollTop = window.scrollY;
    const gridScan = document.querySelector('.grid-scan');
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        const currentScrollTop = window.scrollY;
        const scrollDiff = Math.abs(currentScrollTop - lastScrollTop);
        
        if (scrollDiff > 20) {
            // Intense pulse on fast scroll
            gridScan.style.opacity = '1';
            gridScan.style.filter = 'brightness(1.5)';
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            gridScan.style.opacity = '0.8';
            gridScan.style.filter = 'brightness(1)';
        }, 150);
        
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    });

    // 6. Chat Widget Logic
    window.handleChatInput = function(event) {
        if (event.key === 'Enter') {
            sendChatMessage();
        }
    };

    window.sendChatMessage = function() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message) return;

        appendMessage('user', message);
        input.value = '';

        // Simulate thinking and auto-reply
        setTimeout(() => {
            if (message.toLowerCase().includes('catering')) {
                const promptEngineeredResponse = `
                    <p>✨ <strong>Catering Protocol Initiated</strong> ✨</p>
                    <p>Based on historical data and current inventory prediction models, I can seamlessly orchestrate your large order.</p>
                    <p>For catering events exceeding 50 attendees, our system recommends a 72-hour lead time to ensure uncompromised quality and optimal resource allocation.</p>
                    <p style="color: var(--neon-cyan); margin-top: 0.5rem;">Would you like me to generate a predictive quote based on your headcount?</p>
                `;
                appendMessage('bot', promptEngineeredResponse);
            } else {
                appendMessage('bot', "<p>I'm currently optimized to discuss our catering and large order fulfillment capabilities. Could you ask me about catering?</p>");
            }
        }, 800);
    };

    function appendMessage(sender, text) {
        const chatBody = document.getElementById('chat-body');
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}`;
        msgDiv.style.opacity = '0';
        msgDiv.style.transform = 'translateY(10px)';
        msgDiv.style.transition = 'opacity 0.3s, transform 0.3s';
        msgDiv.innerHTML = text;
        
        chatBody.appendChild(msgDiv);
        
        // Animate in
        setTimeout(() => {
            msgDiv.style.opacity = '1';
            msgDiv.style.transform = 'translateY(0)';
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 50);
    }

    // 7. Voice Call Widget Logic
    let isCallActive = false;
    window.toggleVoiceCall = function() {
        const widget = document.querySelector('.voice-call-widget');
        const btnText = document.querySelector('.btn-text');
        const audio = document.getElementById('ai-voice');
        
        isCallActive = !isCallActive;
        
        if (isCallActive) {
            widget.classList.add('active');
            btnText.textContent = 'End Call';
            
            // Play the audio
            if (audio) {
                audio.currentTime = 0; // go back to start
                audio.play().catch(e => console.log('Audio playback prevented:', e));
                
                // Optional: Automatically end call when audio finishes
                audio.onended = () => {
                    if (isCallActive) toggleVoiceCall();
                };
            }
        } else {
            widget.classList.remove('active');
            btnText.textContent = 'Initiate Call';
            
            // Stop the audio
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    };

    // 8. Initialize operations dashboard chart
    function initDashboardChart() {
        const ctx = document.getElementById('rushHourChart');
        if (!ctx) return;

        // Realistic restaurant data simulation
        const labels = ['11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM'];
        
        // Data arrays
        const predictedTraffic = [30, 85, 95, 45, 25, 30, 60, 110, 130, 90, 40];
        const recommendedStaff = [4, 8, 8, 5, 3, 4, 6, 10, 12, 8, 4];

        // Custom cyber-noir styling for Chart.js
        Chart.defaults.color = '#8892b0';
        Chart.defaults.font.family = "'JetBrains Mono', monospace";

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        type: 'line',
                        label: 'Predicted Foot Traffic (Guests)',
                        data: predictedTraffic,
                        borderColor: '#ff107a', /* neon-pink */
                        backgroundColor: 'rgba(255, 16, 122, 0.1)',
                        borderWidth: 2,
                        tension: 0.4, // smooth curve
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        type: 'bar',
                        label: 'AI Recommended Staffing Levels',
                        data: recommendedStaff,
                        backgroundColor: 'rgba(0, 243, 255, 0.4)', /* neon-cyan */
                        borderColor: '#00f3ff',
                        borderWidth: 1,
                        borderRadius: 4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 10, 15, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#e0e0e0',
                        borderColor: 'rgba(0, 243, 255, 0.3)',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: true
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Foot Traffic',
                            color: '#8892b0'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Staff Count',
                            color: '#8892b0'
                        },
                        grid: {
                            drawOnChartArea: false // only want the grid lines for one axis to show up
                        }
                    }
                }
            }
        });
    }

    // Call init if on the page
    initDashboardChart();

    // 9. SMS Promo Phone Mockup Logic
    const smsScreen = document.getElementById('sms-screen');
    const smsPromoContainer = document.querySelector('.sms-promo-container');
    
    if (smsScreen && smsPromoContainer) {
        let smsStarted = false;
        
        // Define the conversation sequence
        const conversation = [
            { type: 'out', text: 'Optin YOUR COMPANY', delay: 1000 },
            { type: 'in', text: 'Welcome! Reply YES to confirm your subscription and receive 10% off your next catering order.', delay: 1500 },
            { type: 'out', text: 'YES', delay: 2000 },
            { type: 'in', text: 'Confirmed! 🎉 Use code CATERSAVE10 at checkout. How can our AI assistant help you today?', delay: 1500 },
            { type: 'delay', delay: 3000 }, // Wait for a bit to simulate time passing
            // 30 day follow up simulation
            { type: 'in', text: 'Hi again! It\'s been a while. Thinking about your next team lunch? Here is a 15% VIP discount just for you: VIPLUNCH15. Valid for 48 hours!', delay: 1500 }
        ];

        // Intersection Observer to start animation when visible
        const smsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !smsStarted) {
                smsStarted = true;
                runConversation(0);
            }
        }, { threshold: 0.5 });
        
        smsObserver.observe(smsPromoContainer);

        function runConversation(index) {
            if (index >= conversation.length) {
                // Optional: loop the animation? Wait 10s and restart.
                setTimeout(() => {
                    smsScreen.innerHTML = '';
                    runConversation(0);
                }, 10000);
                return;
            }

            const step = conversation[index];
            
            if (step.type === 'delay') {
                setTimeout(() => runConversation(index + 1), step.delay);
                return;
            }

            // If it's an incoming message (bot), show typing indicator first
            if (step.type === 'in') {
                showTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator();
                    appendSMS(step.type, step.text);
                    runConversation(index + 1);
                }, step.delay);
            } else {
                // Outgoing message (user), just delay and append
                setTimeout(() => {
                    appendSMS(step.type, step.text);
                    runConversation(index + 1);
                }, step.delay);
            }
        }

        function appendSMS(type, text) {
            const msgDiv = document.createElement('div');
            // Add 'highlight' class to the final 30-day promo for emphasis
            const isHighlight = text.includes('VIPLUNCH15') ? ' highlight' : '';
            msgDiv.className = `sms-msg sms-${type}${isHighlight}`;
            msgDiv.innerHTML = `<p>${text}</p>`;
            smsScreen.appendChild(msgDiv);
            scrollToBottom();
        }

        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'sms-msg sms-in typing-indicator';
            typingDiv.id = 'active-typing';
            typingDiv.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
            smsScreen.appendChild(typingDiv);
            scrollToBottom();
        }

        function removeTypingIndicator() {
            const typingDiv = document.getElementById('active-typing');
            if (typingDiv) {
                typingDiv.remove();
            }
        }

        function scrollToBottom() {
            smsScreen.scrollTop = smsScreen.scrollHeight;
        }
    }
});
