<template>
  <q-layout view="hHh LpR fFf" :class="{ 'bg-dark': $q.dark.isActive }">
    <q-header bordered :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
      <q-toolbar>
        <AppNavbar />
      </q-toolbar>
    </q-header>

    <!-- Main Content -->
    <q-page>
      <div class="hero-section q-pa-lg text-white">
        <div class="text-container">
          <h1 class="text-h3 q-mb-sm">
            <span>{{ typedText }}</span>
            <span v-if="showCursor" class="cursor">|</span>
          </h1>
          <p class="text-subtitle2 q-mb-lg">
            Your friendly, intelligent assistant is here to answer your questions, guide you, and
            provide support 24/7.
          </p>
          <q-btn unelevated color="primary" label="Get Started" class="q-mr-sm" />
          <q-btn outline label="Learn More" class="text-white" />
        </div>
      </div>

      <!-- Features Section -->
      <div class="features-section q-pa-lg">
        <h2 class="text-h5 text-center q-mb-md">Why Choose Our Chatbot?</h2>
        <div class="row justify-center">
          <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm q-pb-lg">
            <q-card class="text-center">
              <q-card-section>
                <q-icon name="chat" size="42px" color="primary" />
                <h3 class="text-h6 q-mt-md">Instant Responses</h3>
                <p class="text-caption">Get instant answers to your queries without any delay.</p>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm q-pb-lg">
            <q-card class="text-center">
              <q-card-section>
                <q-icon name="security" size="42px" color="primary" />
                <h3 class="text-h6 q-mt-md">Secure Conversations</h3>
                <p class="text-caption">
                  Your data is private and encrypted for complete security.
                </p>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 q-px-sm q-pb-lg">
            <q-card class="text-center">
              <q-card-section>
                <q-icon name="settings" size="42px" color="primary" />
                <h3 class="text-h6 q-mt-md">Customizable</h3>
                <p class="text-caption">
                  Tailor the chatbot experience to fit your needs perfectly.
                </p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <div class="how-it-works-section q-pa-lg text-center">
        <h2 class="text-h5 q-mb-md text-white">How It Works</h2>
        <div class="row justify-center">
          <div class="col-xs-12 col-sm-4 q-px-sm q-pb-lg">
            <q-card class="text-center">
              <q-card-section>
                <q-icon name="search" size="42px" color="primary" />
                <h3 class="text-h6 q-mt-md">Ask Your Question</h3>
                <p class="text-caption">Simply type your question in the chatbox and submit it.</p>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-4 q-px-sm q-pb-lg">
            <q-card class="text-center">
              <q-card-section>
                <q-icon name="forum" size="42px" color="primary" />
                <h3 class="text-h6 q-mt-md">Receive a Response</h3>
                <p class="text-caption">
                  The chatbot instantly analyzes your question and provides a response.
                </p>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-4 q-px-sm q-pb-lg">
            <q-card class="text-center">
              <q-card-section>
                <q-icon name="lightbulb" size="42px" color="primary" />
                <h3 class="text-h6 q-mt-md">Learn & Improve</h3>
                <p class="text-caption">
                  Use the answers to make informed decisions and learn new things!
                </p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Testimonials Section -->
      <div
        id="Testimonials"
        class="testimonials-section q-pa-lg text-center"
        :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-grey-2 text-dark'"
      >
        <h2 class="text-h5 q-mb-xl">Developers</h2>
        <q-carousel
          v-model="testimonialIndex"
          navigation
          :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-grey-2 text-dark'"
          control-color="primary"
          height="300px"
        >
          <!-- Slide 1 -->
          <q-carousel-slide name="slide-1">
            <q-img
              src="@/assets/background_2.jpg"
              style="border-radius: 50%; width: 100px; height: 100px; margin: auto"
              alt="Nguyen Thi Thanh Minh"
            />
            <h6>Nguyen Thi Thanh Minh</h6>
          </q-carousel-slide>

          <!-- Slide 2 -->
          <q-carousel-slide name="slide-2">
            <q-img
              src="@/assets/background_3.jpg"
              style="border-radius: 50%; width: 100px; height: 100px; margin: auto"
              alt="Duong Viet Minh Hoang"
            />
            <h6>Duong Viet Minh Hoang</h6>
          </q-carousel-slide>

          <!-- Slide 3 -->
          <q-carousel-slide name="slide-3">
            <q-img
              src="@/assets/background_4.jpg"
              style="border-radius: 50%; width: 100px; height: 100px; margin: auto"
              alt="Nguyen Si Thanh Trung"
            />
            <h6>Nguyen Si Thanh Trung</h6>
          </q-carousel-slide>
        </q-carousel>
      </div>

      <!-- Footer -->
      <q-footer class="bg-light text-white q-px-lg q-pt-sm q-pb-xs static-footer">
        <div class="row items-center justify-around q-col-gutter-md">
          <!-- Company Info -->
          <div class="col-12 col-sm-4 text-center">
            <h4 class="text-h4">
              Rikkeisoft
              <p class="text-caption">Where the dream begins</p>
            </h4>
          </div>

          <!-- Contact Links -->
          <div class="col-12 col-sm-4">
            <q-list dense>
              <q-item clickable tag="a" href="mailto:yourcompany@gmail.com" target="_blank">
                <q-item-section avatar>
                  <q-icon name="email" color="secondary" />
                </q-item-section>
                <q-item-section class="text-caption">Gmail</q-item-section>
              </q-item>
              <q-item clickable tag="a" href="https://www.facebook.com/yourcompany" target="_blank">
                <q-item-section avatar>
                  <q-icon name="facebook" color="blue" />
                </q-item-section>
                <q-item-section class="text-caption">Facebook</q-item-section>
              </q-item>
              <q-item
                clickable
                tag="a"
                href="https://www.linkedin.com/company/yourcompany"
                target="_blank"
              >
                <q-item-section avatar>
                  <q-icon name="linkedin" color="blue" />
                </q-item-section>
                <q-item-section class="text-caption">LinkedIn</q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Social Media Icons -->
          <div class="col-12 col-sm-4 text-center">
            <q-btn
              round
              flat
              icon="facebook"
              color="blue"
              class="q-mx-xs"
              href="https://www.facebook.com/yourcompany"
              target="_blank"
            />
            <q-btn
              round
              flat
              icon="linkedin"
              color="blue"
              class="q-mx-xs"
              href="https://www.linkedin.com/company/yourcompany"
              target="_blank"
            />
            <q-btn
              round
              flat
              icon="email"
              color="secondary"
              class="q-mx-xs"
              href="mailto:yourcompany@gmail.com"
            />
          </div>
        </div>
        <div class="text-center text-caption q-mt-xs">© 2025 Rikkeisoft. All rights reserved.</div>
      </q-footer>
    </q-page>
  </q-layout>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
import { useQuasar } from 'quasar'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const $q = useQuasar()
const isDark = ref(localStorage.getItem('darkMode') === 'true')

const texts = ref(['Hello World!', 'Welcome to ChatBot!']) // Sentences to type
const typedText = ref('') // Current text being typed
const showCursor = ref(true) // Blinking cursor state
const currentCharIndex = ref(0) // Current character in the text
const currentTextIndex = ref(0) // Tracks which sentence is being typed
let cursorInterval = null // Interval for cursor blinking
const testimonialIndex = ref('slide-1') // Default to the first slide

const typeText = () => {
  const currentText = texts.value[currentTextIndex.value]
  if (currentCharIndex.value < currentText.length) {
    typedText.value += currentText[currentCharIndex.value]
    currentCharIndex.value++
    setTimeout(typeText, 100)
  } else {
    setTimeout(switchText, 2000) // Pause before switching
  }
}

const switchText = () => {
  currentCharIndex.value = 0
  currentTextIndex.value = (currentTextIndex.value + 1) % texts.value.length
  typedText.value = ''
  typeText()
}

const startCursorBlink = () => {
  cursorInterval = setInterval(() => {
    showCursor.value = !showCursor.value
  }, 500)
}

onMounted(() => {
  startCursorBlink()
  typeText()
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode !== null) {
    isDark.value = savedDarkMode === 'true'
    $q.dark.set(isDark.value)
    console.log($q.dark)
  }
})

onBeforeUnmount(() => {
  clearInterval(cursorInterval)
})
</script>

<style>
.hero-section {
  background:
    linear-gradient(rgba(235, 174, 174, 0.7), rgba(49, 84, 90, 0.7)),
    url('@/assets/background.png') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  height: 680px;
  color: white;
}
.text-container {
  max-width: 600px;
  margin-left: 5%;
}
.cursor {
  font-weight: bold;
  animation: blink 1s steps(1) infinite;
}
/* footer style */
.static-footer {
  position: relative;
  bottom: 0;
  padding: 10px 0;
  font-size: 0.875rem;
  background-color: #af3c3c; /* Light gray background */
  color: #000000; /* Dark gray text */
}
.how-it-works-section {
  background:
    linear-gradient(rgba(236, 158, 158, 0.5), rgba(96, 45, 45, 0.5)),
    url('@/assets/background.png') no-repeat center center;
  background-size: cover;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
