const appreciationMessages = [
            { quote: "Inspirational, dedicated. We were lucky to have him.", source: "Old boss (Giorgi)" },
            { quote: "I've learned more from Drew in the last year than I have in the rest of my education. His guidance is invaluable.", source: "A Mentee (Alexandr)" },
            { quote: "I have watched Drew grow as a developer and I can't describe, how better he became. What took me 2 years, takes him 2 months", source: "A Friend, Senior Fullstack Developer" },
            { quote: "Drew's vision and leadership have been the driving force behind our recent successes. An absolute pleasure to work with.", source: "A Grateful Colleague (Brad)" },
            { quote: "His ability to solve complex problems under short time is simply unmatched. He's the calm in the storm", source: "A Project Manager" },
            { quote: "Always willing to lend a hand, no matter how busy he is. A true team player.", source: "A colleague (Lisa)" },
        ];

        function populateAppreciationWall() {
            const scrollerInner = document.getElementById('scroller-inner');
            // Duplicate messages for a seamless loop
            const messagesToDisplay = [...appreciationMessages, ...appreciationMessages];

            messagesToDisplay.forEach(msg => {
                const messageElement = document.createElement('div');
                messageElement.className = 'bg-gray-900 p-6 rounded-lg shadow-lg relative';
                messageElement.innerHTML = `
                    <div class="absolute top-0 right-0 -mt-3 -mr-3 text-3xl">💬</div>
                    <p class="text-lg italic text-gray-300">${msg.quote}</p>
                    <p class="text-right mt-4 font-semibold text-gray-500">- ${msg.source}</p>
                `;
                scrollerInner.appendChild(messageElement);
            });
        }
        
        // Populate the wall when the page loads
        document.addEventListener('DOMContentLoaded', populateAppreciationWall);