const STORAGE_KEY_MODE = "cps-test-mode";
const STORAGE_KEY_TIME_LIMIT = "cps-test-time-limit";
const STORAGE_KEY_CUSTOM_TIME = "cps-test-custom-time";

function isClient() {
  return typeof window !== "undefined";
}

export function saveTestMode(mode: "click" | "spacebar") {
  if (isClient()) {
    localStorage.setItem(STORAGE_KEY_MODE, mode);
  }
}

export function getTestMode(): "click" | "spacebar" {
  if (isClient()) {
    return (localStorage.getItem(STORAGE_KEY_MODE) as "click" | "spacebar") || "click";
  }
  return "click"; 
}

export function saveTimeLimit(timeLimit: string) {
  if (isClient()) {
    localStorage.setItem(STORAGE_KEY_TIME_LIMIT, timeLimit);
  }
}

export function getTimeLimit(): string {
  if (isClient()) {
    return localStorage.getItem(STORAGE_KEY_TIME_LIMIT) || "5";
  }
  return "5"; 
}

export function saveCustomTime(customTime: string) {
  if (isClient()) {
    localStorage.setItem(STORAGE_KEY_CUSTOM_TIME, customTime);
  }
}

export function getCustomTime(): string {
  if (isClient()) {
    return localStorage.getItem(STORAGE_KEY_CUSTOM_TIME) || "";
  }
  return ""; 
}