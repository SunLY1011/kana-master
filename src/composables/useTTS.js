import { ref } from 'vue'

const volume = ref(Number(localStorage.getItem('kanaVolume') || 0.8))
const DB_NAME = 'KanaMasterAudio'
const STORE_NAME = 'audios'
const DB_VERSION = 1

// IndexedDB management
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
        request.onupgradeneeded = (e) => {
            const db = e.target.result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'char' })
            }
        }
    })
}

async function saveAudio(char, blob) {
    const db = await openDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        tx.objectStore(STORE_NAME).put({ char, blob, timestamp: Date.now() })
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
    })
}

async function getAudio(char) {
    const db = await openDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const req = tx.objectStore(STORE_NAME).get(char)
        req.onsuccess = () => resolve(req.result?.blob)
        req.onerror = () => reject(req.error)
    })
}

async function isCached(char) {
    const blob = await getAudio(char)
    return blob !== undefined
}

// Audio source: pre-recorded audio from Tencent COS
const AUDIO_BASE_URL = 'https://lg-l9n48822-1257392927.cos.ap-shanghai.myqcloud.com'

async function preloadAudio(char) {
    if (await isCached(char)) return
    try {
        const url = `${AUDIO_BASE_URL}/${encodeURIComponent(char)}.mp3`
        const response = await fetch(url)
        if (response.ok) {
            const blob = await response.blob()
            await saveAudio(char, blob)
        }
    } catch (e) {
        console.warn(`Failed to preload audio for ${char}:`, e)
    }
}

// Preload all audios (async, non-blocking)
export async function preloadAllAudios(chars) {
    const batch = 3
    for (let i = 0; i < chars.length; i += batch) {
        const chunk = chars.slice(i, i + batch)
        await Promise.all(chunk.map(c => preloadAudio(c)))
    }
}

async function playLocalAudio(char) {
    const blob = await getAudio(char)
    if (!blob) return false

    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    audio.volume = volume.value

    return new Promise((resolve) => {
        audio.onended = () => {
            URL.revokeObjectURL(url)
            resolve(true)
        }
        audio.onerror = () => {
            URL.revokeObjectURL(url)
            resolve(false)
        }
        audio.play()
    })
}

// Fallback: browser speech synthesis
function speakBrowser(text) {
    if (!('speechSynthesis' in window)) return
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ja-JP'
    u.rate = 0.85
    u.pitch = 1
    u.volume = volume.value
    const voices = speechSynthesis.getVoices()
    const ja = voices.find(v => v.lang.startsWith('ja'))
    if (ja) u.voice = ja
    speechSynthesis.speak(u)
}

export function useTTS() {
    async function playPronunciation(text) {
        if (text.length === 1 && /[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
            try {
                if (await playLocalAudio(text)) {
                    return
                }
            } catch (e) {
                console.warn('Local audio failed, fallback to browser TTS')
            }
        }
        speakBrowser(text)
    }

    function setVolume(val) {
        volume.value = val
        localStorage.setItem('kanaVolume', val)
    }

    return { playPronunciation, volume, setVolume, preloadAllAudios }
}
