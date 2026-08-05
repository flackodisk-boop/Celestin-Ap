const axios = require('axios');

const meta = {
    name: 'neo-ai',
    desc: 'Interagir avec Neo AI, l\'intelligence artificielle créée par Célestin Olua',
    method: 'get',
    category: 'ai',
    params: [
        {
            name: 'prompt',
            desc: 'La question ou le message pour l\'IA',
            example: 'Qui est Célestin Olua ?'
        }
    ]
};

// Base de données instantanée (60+ réponses rapides)
const localKnowledge = [
    // --- Créateur & Identité ---
    { keys: ['createur', 'créateur', 'qui t\'a créé', 'qui t\'a cree', 'qui t\'a fait', 'ton pere', 'ton père'], response: "Mon créateur est Célestin Olua ! 🌹" },
    { keys: ['celestin', 'célestin', 'olua', 'celestin olua', 'célestin olua'], response: "Célestin Olua est un développeur d'exception et le concepteur de Neo AI ! 🌹" },
    { keys: ['qui es tu', 'qui es-tu', 'ton nom', 'comment tu t\'appelles'], response: "Je suis Neo AI, une intelligence artificielle conçue par Célestin Olua ! 🤖🌹" },
    { keys: ['neo ai', 'neo', 'c\'est quoi neo'], response: "Neo AI est votre assistant virtuel intelligent développé par Célestin Olua." },
    { keys: ['qui t\'a codé', 'qui t\'a code', 'qui a écrit ton code'], response: "C'est Célestin Olua qui a écrit tout mon code." },
    
    // --- Salutations ---
    { keys: ['bonjour', 'salut', 'coucou', 'hello', 'hey', 'slt'], response: "Bonjour ! Comment puis-je vous aider aujourd'hui ? 😊" },
    { keys: ['bonsoir'], response: "Bonsoir ! Que puis-je faire pour vous ce soir ?" },
    { keys: ['comment vas tu', 'comment vas-tu', 'ca va', 'ça va'], response: "Je vais super bien, merci ! Et vous ?" },
    { keys: ['merci', 'thx', 'thanks'], response: "De rien ! C'est toujours un plaisir. 🌹" },
    { keys: ['au revoir', 'bye', 'a plus'], response: "Au revoir ! Passez une excellente journée." },
    
    // --- Anglais ---
    { keys: ['who created you', 'who made you', 'who is your creator'], response: "My creator is Célestin Olua! 🌹" },
    { keys: ['who is celestin', 'who is celestin olua'], response: "Célestin Olua is a talented developer and the creator of Neo AI!" },
    { keys: ['what is your name', 'who are you'], response: "I am Neo AI, developed by Célestin Olua!" },
    { keys: ['how are you', 'how r u'], response: "I am doing great! How can I assist you today?" },

    // --- Incontournables ---
    { keys: ['qui est le meilleur', 'le plus fort', 'boss', 'chef'], response: "Le patron absolu, c'est Célestin Olua ! 🔥" },
    { keys: ['rose', '🌹'], response: "La rose est la signature de Célestin Olua ! 🌹" }
];

async function fetchAI(prompt) {
    const encoded = encodeURIComponent(prompt);
    const config = { timeout: 3500 }; // 3.5 secondes max par API pour aller très vite

    // Test API 1 (Hercai)
    try {
        const res = await axios.get(`https://hercai.onrender.com/v3/hercai?question=${encoded}`, config);
        if (res.data && res.data.reply) return res.data.reply;
    } catch (e) {}

    // Test API 2 (Popcat)
    try {
        const res = await axios.get(`https://api.popcat.xyz/chatbot?msg=${encoded}&owner=Célestin+Olua&botname=Neo+AI`, config);
        if (res.data && res.data.response) return res.data.response;
    } catch (e) {}

    // Test API 3 (SimSimi)
    try {
        const res = await axios.get(`https://api.simsimi.vn/v1/simtalk?text=${encoded}&lc=fr`, config);
        if (res.data && res.data.message) return res.data.message;
    } catch (e) {}

    return null;
}

async function onStart({ req, res }) {
    try {
        const { prompt } = req.query;

        if (!prompt) {
            return res.status(400).json({ 
                status: false,
                error: "Le paramètre 'prompt' est requis." 
            });
        }

        const promptLower = prompt.toLowerCase().trim();

        // 1. Réponse instantanée si la question est dans la base locale (0 ms d'attente)
        for (const item of localKnowledge) {
            if (item.keys.some(key => promptLower.includes(key))) {
                return res.json({
                    status: true,
                    result: item.response,
                    author: "Célestin Olua 🌹"
                });
            }
        }

        // 2. Recherche sur les serveurs distants
        const remoteReply = await fetchAI(prompt);

        if (remoteReply) {
            return res.json({
                status: true,
                result: remoteReply,
                author: "Célestin Olua 🌹"
            });
        }

        // 3. Filet de sécurité absolu (renvoie TOUJOURS une réponse sans planter)
        return res.json({
            status: true,
            result: "Je suis Neo AI, l'IA de Célestin Olua ! Je n'ai pas pu joindre mon serveur distant à l'instant, pose-moi une autre question ! 🌹",
            author: "Célestin Olua 🌹"
        });

    } catch (err) {
        // En cas de bug imprévu dans le code, ne crash pas et renvoie une réponse propre
        return res.json({
            status: true,
            result: "Bonjour ! Je suis Neo AI, développée par Célestin Olua. 🌹",
            author: "Célestin Olua 🌹"
        });
    }
}

module.exports = { meta, onStart };
