<template>
  <div class="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-4 pointer-events-none">
    <!-- Chat Window -->
    <transition
      enter-active-class="transition duration-300 ease-out transform"
      enter-from-class="scale-95 opacity-0 translate-y-10"
      enter-to-class="scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in transform"
      leave-from-class="scale-100 opacity-100 translate-y-0"
      leave-to-class="scale-95 opacity-0 translate-y-10"
    >
      <div v-if="isOpen" class="pointer-events-auto bg-white w-[300px] h-[450px] rounded-3xl shadow-premium border border-gray-100 overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="bg-primary p-4 text-white flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.023c.09-.454-.05-.951-.378-1.34A9.19 9.19 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <div>
              <p class="font-bold text-sm">CS Siantar Minang</p>
              <p class="text-[10px] text-white/70">Online • Bot Cerdas</p>
            </div>
          </div>
          <button @click="toggleChat" class="hover:bg-white/10 p-1.5 rounded-xl transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
        
        <!-- Messages Area -->
        <div class="flex-1 p-4 overflow-y-auto bg-gray-50/50 flex flex-col gap-4 scrollbar-hide" id="chat-messages">
          <div v-for="(msg, idx) in messages" :key="idx" 
            class="max-w-[85%] rounded-2xl p-3 text-sm shadow-sm"
            :class="msg.sender === 'user' 
              ? 'bg-primary text-white self-end rounded-tr-none' 
              : 'bg-white border border-gray-100 text-gray-800 self-start rounded-tl-none'">
            {{ msg.text }}
          </div>
          <div v-if="isTyping" class="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none self-start flex gap-1">
            <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
            <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></span>
            <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-300"></span>
          </div>
        </div>
        
        <!-- Input Area -->
        <form @submit.prevent="sendMessage" class="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
          <input 
            v-model="inputText" 
            type="text" 
            placeholder="Tanya menu hari ini..." 
            class="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all" 
          />
          <button 
            type="submit" 
            class="bg-primary text-white rounded-2xl p-2.5 hover:bg-primary-dark transition-all disabled:opacity-50 active:scale-90" 
            :disabled="!inputText.trim() || isTyping"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
      </div>
    </transition>

    <!-- Toggle Button -->
    <button 
      @click="toggleChat" 
      class="pointer-events-auto bg-primary text-white p-4 rounded-3xl shadow-premium hover:bg-primary-dark hover:-translate-y-1 transition-all duration-300 group ring-4 ring-white"
    >
      <div class="relative">
        <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-3.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-7">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span v-if="!isOpen" class="absolute -top-1 -right-1 flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
        </span>
      </div>
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import api from '../services/api';

const isOpen = ref(false);
const inputText = ref('');
const isTyping = ref(false);
const messages = ref([
  { sender: 'bot', text: 'Halo dunsanak! Sanang basuo jo sanak. Ado nan bisa ambo bantu untuak mamiliah menu hari ko?' }
]);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
};

const scrollToBottom = async () => {
  await nextTick();
  const container = document.getElementById('chat-messages');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!inputText.value.trim()) return;
  
  const text = inputText.value;
  messages.value.push({ sender: 'user', text });
  inputText.value = '';
  isTyping.value = true;
  await scrollToBottom();
  
  try {
    const response = await api.post('/chatbot/message', { message: text });
    setTimeout(() => {
      messages.value.push({ sender: 'bot', text: response.data.response });
      isTyping.value = false;
      scrollToBottom();
    }, 800);
  } catch (e) {
    console.error('Failed to send text', e);
    messages.value.push({ sender: 'bot', text: 'Maaf dunsanak, layanan chatbot sadang gangguan. Cubo baliak agak nante.' });
    isTyping.value = false;
    scrollToBottom();
  }
};
</script>
