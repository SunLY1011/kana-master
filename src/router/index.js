import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    { path: '/', redirect: '/practice/hira-to-kata' },
    {
        path: '/practice/:direction',
        name: 'Practice',
        component: () => import('../views/PracticeView.vue'),
        props: true
    },
    {
        path: '/kana-chart',
        name: 'KanaChart',
        component: () => import('../views/KanaChartView.vue')
    },
    {
        path: '/flashcard',
        name: 'Flashcard',
        component: () => import('../views/FlashcardView.vue')
    },
    {
        path: '/study-cards',
        name: 'StudyCards',
        component: () => import('../views/StudyCardsView.vue')
    },
    {
        path: '/listening',
        name: 'ListeningQuiz',
        component: () => import('../views/ListeningQuiz.vue')
    },
    {
        path: '/mixed-quiz',
        name: 'MixedQuiz',
        component: () => import('../views/MixedQuiz.vue')
    }
]

export default createRouter({
    history: createWebHashHistory(),
    routes
})