<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'

const register = ref(false)
</script>

<template>
  <section
    class="w-full flex items-center justify-center transform-style-3d transition-transform duration-700 transform rotate-y-180"
  >
    <div
      class="overflow-auto absolute mx-3 border-2 w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] p-5 rounded-tl-[25px] rounded-br-[25px] bg-white shadow-2xl backface-hidden duration-500"
      :class="[register ? 'rotate-y-180' : 'rotate-y-0']"
    >
      <login-form @register="register = true" />
    </div>
    <div
      class="overflow-auto absolute mx-3 border-2 w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] p-5 rounded-tl-[25px] rounded-br-[25px] bg-white shadow-2xl backface-hidden duration-500"
      :class="[register ? 'rotate-y-0' : 'rotate-y-180']"
    >
      <register-form @have-account="register = false" />
    </div>
  </section>
</template>
