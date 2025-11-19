import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateStory = async (labels) => {
    try {
        // const catMoodprompt = `
        // 다음 이미지 태그를 보고, 아래 두 가지를 JSON 형식으로 답해줘:
        // 1. category: ["자연", "도시", "인물", "음식", "동물", "사물", "기타"] 중 하나
        // 2. mood: 이미지의 분위기를 나타내는 한글 형용사 한 단어 (예: 평화로운, 따뜻한, 활기찬)
        
        // 태그: [${labels.join(", ")}]
        // 형식:
        // {category:...,mood:...}
        // `;
        
        const prompt = `
            다음 이미지 태그 목록을 기반으로 다음 두 가지와 스토리를 JSON 형식으로 만들어줘.
            1. category: ["자연", "도시", "인물", "음식", "동물", "사물", "기타"] 중 하나
            2. mood: 분위기를 나타내는 한글 형용사 한 단어
            3. story: 태그와 분위기, 카테고리를 참고해서 오늘의 일기 형식의 1인칭 한 문장

            태그: [${labels.join(", ")}]

            반드시 아래 형식처럼 JSON으로만 답해:
            {
            category: ...,
            mood: ...,
            story: ...
            }
            `;
            console.time("llm");
        const response = await openai.responses.create({
            model: "gpt-4o-mini",
            input: prompt,
            text: { format: { type: "json_object" } },
        });

        console.timeEnd("llm");

        console.log(JSON.parse(response.output_text))

        // const parsedCatMood = JSON.parse(catMoodresponse.output_text);

        // const storyPrompt = `
        // 아래 정보를 참고해 오늘의 일기에 쓸 한 문장을 만들어줘. 3인칭 시점에서 말고 1인칭 시점에서 일기 쓰듯이. 너무 로봇이 쓴것처럼 직관적으로 적지는 말아줘.
        // 태그: ${labels}
        // 분위기: ${parsedCatMood.mood}
        // 카테고리: ${parsedCatMood.category}
        // 결과는 자연스러운 한국어 문장으로 출력해줘.
        // `;

        // const storyResponse = await openai.responses.create({
        //     model: "gpt-5-nano",
        //     input: storyPrompt
        // });

        return JSON.parse(response.output_text);
    }
    catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw error;
    }
}