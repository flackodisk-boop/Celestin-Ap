const ai = require('unlimited-ai');

// Liste des modèles disponibles
const models = new Set([
  'gpt-4o-mini-free', 'gpt-4o-mini', 'gpt-4o-free', 'gpt-4-turbo-2024-04-09',
  'gpt-4o-2024-08-06', 'grok-2', 'grok-2-mini', 'claude-3-opus-20240229',
  'claude-3-opus-20240229-gcp', 'claude-3-sonnet-20240229', 'claude-3-5-sonnet-20240620',
  'claude-3-haiku-20240307', 'claude-2.1', 'gemini-1.5-flash-exp-0827', 'gemini-1.5-pro-exp-0827'
]);

const meta = {
    name: 'ai-models',
    desc: 'Génération de texte dynamique via différents modèles d\'IA',
    method: 'get',
    category: 'ai',
    params: [
        {
            name: 'question',
            desc: 'La question ou le message pour l\'IA',
            example: 'Bonjour !'
        },
        {
            name: 'model',
            desc: 'Le modèle d\'IA à utiliser (par défaut: gpt-4o-mini)',
            example: 'gpt-4o-mini'
        },
        {
            name: 'system',
            desc: 'Les instructions système pour l\'IA (Optionnel)',
            example: 'Tu es Neo AI créée par Célestin Olua.'
        }
    ]
};

async function onStart({ req, res }) {
    try {
        const { question, model = 'gpt-4o-mini', system = 'Tu es une IA utile développée par Célestin Olua 🌹.' } = req.query;

        // Vérification de la question
        if (!question) {
            return res.status(400).json({
                status: false,
                error: "Le paramètre 'question' est requis.",
                availableModels: Array.from(models),
                exampleUsage: "/ai-models?model=gpt-4o-mini&question=Bonjour"
            });
        }

        // Vérification du modèle sélectionné
        if (!models.has(model)) {
            return res.status(400).json({
                status: false,
                error: `Le modèle '${model}' n'est pas supporté.`,
                availableModels: Array.from(models)
            });
        }

        // Préparation du prompt
        const messages = [
            { role: 'system', content: system },
            { role: 'user', content: question }
        ];

        // Appel du package unlimited-ai
        const response = await ai.generate(model, messages);

        return res.json({
            status: true,
            result: response,
            modelUsed: model,
            author: "Célestin Olua 🌹"
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            error: "Erreur lors de la génération avec le modèle d'IA.",
            details: error.message,
            author: "Célestin Olua 🌹"
        });
    }
}

module.exports = { meta, o
  nStart };
