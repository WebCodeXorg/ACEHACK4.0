document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chatToggle');
    const chatContainer = document.getElementById('chatContainer');
    const closeChat = document.getElementById('closeChat');

    function toggleChat(e) {
        e.preventDefault();
        chatContainer.classList.toggle('active');
        
        // Hide toggle button when chat is open
        if (chatContainer.classList.contains('active')) {
            chatToggle.style.opacity = '0';
            chatToggle.style.pointerEvents = 'none';
        } else {
            setTimeout(() => {
                chatToggle.style.opacity = '1';
                chatToggle.style.pointerEvents = 'auto';
            }, 300);
        }
    }

    chatToggle.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatContainer.classList.contains('active')) {
            toggleChat(e);
        }
    });
});