<template>
<q-layout view="hHh LpR fFf" :class="{ 'bg-dark': $q.dark.isActive }">
    <q-header bordered :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
    <q-toolbar>
        <q-btn
        :icon="$q.dark.isActive ? 'menu' : 'menu'"
        aria-label="Menu"
        flat
        dense
        round
        @click="toggleLeftDrawer"
        />
        <nav-bar />
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
                Your friendly, intelligent assistant is here to answer your questions, guide you, and provide support 24/7.
            </p>
            <q-btn unelevated color="secondary" label="Get Started" class="q-mr-sm" />
            <q-btn unelevated color="secondary" label="Learn More" />
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
                <p class="text-caption">
                    Get instant answers to your queries without any delay.
                </p>
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

        <!-- Footer -->
        <q-footer class="bg-primary text-white q-pa-md">
        <div class="row items-center justify-center">
            <p class="text-caption">
            © 2025 ChatBot World. All rights reserved.
            </p>
        </div>
        </q-footer>
    </q-page>
    </q-layout>
</template>

<script>
export default {
name: "HeroSection",
data() {
    return {
      texts: ["Hello World!","Welcome to ChatBot!"], // Sentences to type
      typedText: "", // Current text being typed
      showCursor: true, // Blinking cursor state
      currentCharIndex: 0, // Current character in the text
      currentTextIndex: 0, // Tracks which sentence is being typed
    };
},
methods: {
    typeText() {
    const currentText = this.texts[this.currentTextIndex];
    if (this.currentCharIndex < currentText.length) {
        this.typedText += currentText[this.currentCharIndex];
        this.currentCharIndex++;
        setTimeout(this.typeText, 100);
    } else {
        setTimeout(this.switchText, 2000); // Pause before switching
    }
    },
    switchText() {
    this.currentCharIndex = 0;
    this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
    this.typedText = "";
    this.typeText();
    },
    startCursorBlink() {
    this.cursorInterval = setInterval(() => {
        this.showCursor = !this.showCursor;
    }, 500);
    },
},
mounted() {
    this.startCursorBlink();
    this.typeText();
},
beforeUnmount() {
    clearInterval(this.cursorInterval);
},
};
</script>


<style>
.hero-section {
background: linear-gradient( rgba(99, 121, 123, 0.7), rgba(62, 97, 102, 0.7)),
    url("../assets/background.png") no-repeat center center;
background-size: cover;
display: flex;
align-items: center;
height: 100vh;
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
@keyframes blink {
50% {
    opacity: 0;
}
}
</style>
