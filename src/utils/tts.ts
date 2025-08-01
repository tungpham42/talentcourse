export function speak(text: string, rate = 1, voice?: SpeechSynthesisVoice) {
  stop(); // Stop any ongoing speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US"; // Explicitly set to US English
  utterance.rate = rate;
  if (voice && voice.lang.startsWith("en-")) {
    utterance.voice = voice; // Only set voice if it's an English voice
  }
  window.speechSynthesis.speak(utterance);
}

export function stop() {
  window.speechSynthesis.cancel();
}

export function getVoices(): SpeechSynthesisVoice[] {
  return window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.startsWith("en-"));
}
