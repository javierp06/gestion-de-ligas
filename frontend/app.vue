<template>
  <div>
    <NuxtLayout>
      <NuxtPage :transition="pageTransition" />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore();
const route = useRoute();

// Page transition system - Linear/Notion style
const pageTransition = computed(() => {
  // Default fade for most routes
  let transition = {
    name: 'page-fade',
    mode: 'out-in',
    duration: 300
  }

  // Slide up for detail pages
  if (route.name?.toString().includes('id') || route.name?.toString().includes('detail')) {
    transition.name = 'page-slide-up'
  }

  // Scale for dashboard/main pages
  if (route.name === 'dashboard' || route.name === 'index') {
    transition.name = 'page-scale'
  }

  return transition
})

onMounted(() => {
  authStore.initializeAuth();
  
  // Prefetching is handled automatically by NuxtLink
});
</script>

<style>
/* ============================================
   PAGE TRANSITIONS - Linear/Notion Style
   ============================================ */

/* FADE TRANSITION (Default) */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

/* SLIDE UP TRANSITION (Detail pages) */
.page-slide-up-enter-active,
.page-slide-up-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* SCALE TRANSITION (Dashboard/Main) */
.page-scale-enter-active,
.page-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-scale-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.page-scale-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

/* ============================================
   GLOBAL ANIMATIONS
   ============================================ */

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ============================================
   UTILITY ANIMATIONS
   ============================================ */

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Slide up animation */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale in animation */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Shimmer animation (improved) */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Pulse glow animation */
@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(17, 115, 212, 0.4);
  }
  50% {
    box-shadow: 0 0 20px 5px rgba(17, 115, 212, 0.2);
  }
}

/* Bounce subtle animation */
@keyframes bounceSubtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* ============================================
   UTILITY CLASSES
   ============================================ */

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slide-up {
  animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
}

.animate-pulse-glow {
  animation: pulseGlow 2s infinite;
}

.animate-bounce-subtle {
  animation: bounceSubtle 1s infinite;
}

/* Stagger delays for list items */
.stagger-1 { animation-delay: 0.05s; }
.stagger-2 { animation-delay: 0.1s; }
.stagger-3 { animation-delay: 0.15s; }
.stagger-4 { animation-delay: 0.2s; }
.stagger-5 { animation-delay: 0.25s; }
.stagger-6 { animation-delay: 0.3s; }
.stagger-7 { animation-delay: 0.35s; }
.stagger-8 { animation-delay: 0.4s; }

/* ============================================
   HOVER EFFECTS - Linear Style
   ============================================ */

.hover-lift {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.2);
}

.hover-glow {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(17, 115, 212, 0.3);
}

.hover-scale {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-scale:hover {
  transform: scale(1.02);
}

.hover-border-glow {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-border-glow::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #1173d4, #3b82f6);
  border-radius: inherit;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s;
}

.hover-border-glow:hover::after {
  opacity: 0.5;
}

/* Focus states for accessibility */
.focus-ring {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.focus-ring:focus-visible {
  outline: 2px solid #1173d4;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(17, 115, 212, 0.1);
}

/* ============================================
   LOADING STATES - Linear Style
   ============================================ */

/* Skeleton with improved shimmer */
.skeleton {
  background: linear-gradient(
    90deg,
    rgb(17 24 39) 0%,
    rgb(31 41 55) 50%,
    rgb(17 24 39) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.5rem;
}

.skeleton-light {
  background: linear-gradient(
    90deg,
    rgb(243 244 246) 0%,
    rgb(229 231 235) 50%,
    rgb(243 244 246) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* ============================================
   CARD ANIMATIONS
   ============================================ */

.card-interactive {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
}

.card-interactive:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.3);
}

.card-interactive:active {
  transform: translateY(-2px) scale(0.99);
  transition-duration: 0.1s;
}

/* Glass effect on hover */
.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-effect:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(17, 115, 212, 0.5);
}

/* ============================================
   MICRO-INTERACTIONS
   ============================================ */

/* Button ripple effect */
.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-ripple:active::after {
  width: 300px;
  height: 300px;
}

/* Input focus animation */
.input-animated {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-animated:focus {
  transform: scale(1.01);
  box-shadow: 0 0 0 3px rgba(17, 115, 212, 0.1);
}

/* Icon bounce on hover */
.icon-bounce:hover {
  animation: bounceSubtle 0.6s;
}

/* Badge pulse */
.badge-pulse {
  animation: pulseGlow 2s infinite;
}
</style>
