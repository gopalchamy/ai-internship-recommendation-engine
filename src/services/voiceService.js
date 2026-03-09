// src/services/voiceService.js

export const startVoiceRecognition = (onResult, onListening, onError) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError?.("Voice recognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let hasResult = false;

  recognition.onstart = () => {
    console.log("Listening started...");
    onListening?.(true);
    hasResult = false;
  };

recognition.onresult = (event) => {
  const lastIndex = event.results.length - 1;
  const result = event.results[lastIndex];

  if (result.isFinal) {
    const transcript = result[0].transcript
      .toLowerCase()
      .trim();

    console.log("Recognized:", transcript);
    onResult(transcript);
    recognition.stop();
  }
};

  recognition.onerror = (event) => {
    console.error("Voice error:", event.error);
    onError?.(event.error);
    onListening?.(false);
  };

  recognition.onend = () => {
    console.log("Listening ended");
    onListening?.(false);
  };

  try {
    console.log("Starting voice recognition...");
    recognition.start();
  } catch (e) {
    console.error("Failed to start recognition:", e);
    onError?.(e.message);
  }
};

export const speakResponse = (message) => {
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
};