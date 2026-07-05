import { ref } from 'vue'

const volume = ref(Number(localStorage.getItem('kanaVolume') || 0.8))
const DB_NAME = 'KanaMasterAudio'
const STORE_NAME = 'audios'
const DB_VERSION = 1

// IndexedDB 绠＄悊
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

// 闊抽婧愶細浣跨敤鑵捐浜?COS 涓婄殑棰勫綍闊抽锛堟潵鑷師椤圭洰锛?const AUDIO_BASE_URL = 'https://lg-l9n48822-1257392927.cos.ap-shanghai.myqcloud.com'

// 棰勪笅杞芥墍鏈夊熀纭€鍋囧悕鐨勯煶棰?async function preloadAudio(char) {
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

// 棰勫姞杞芥墍鏈夐煶棰戯紙寮傛锛屼笉闃诲锛?export async function preloadAllAudios(chars) {
    // 鎵归噺棰勫姞杞斤紝鏈€澶氬悓鏃?涓?    const batch = 3
    for (let i = 0; i < chars.length; i += batch) {
        const chunk = chars.slice(i, i + batch)
        await Promise.all(chunk.map(c => preloadAudio(c)))
    }
}

// 鎾斁鏈湴缂撳瓨闊抽
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

// 闄嶇骇锛氭祻瑙堝櫒璇煶鍚堟垚
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
        // 濡傛灉鏄崟涓亣鍚嶅瓧绗︼紝浼樺厛灏濊瘯鏈湴缂撳瓨
        if (text.length === 1 && /[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
            try {
                if (await playLocalAudio(text)) {
                    return
                }
            } catch (e) {
                console.warn('Local audio failed, fallback to browser TTS')
            }
        }
        // 闄嶇骇鍒版祻瑙堝櫒璇煶
        speakBrowser(text)
    }

    function setVolume(val) {
        volume.value = val
        localStorage.setItem('kanaVolume', val)
    }

    return { playPronunciation, volume, setVolume, preloadAllAudios }
}
