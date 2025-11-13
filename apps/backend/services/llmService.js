import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateStory = async (labels) => {
    try {
        const prompt = `
        다음 이미지 태그를 보고, 아래 두 가지를 JSON 형식으로 답해줘:
        1. category: ["자연", "도시", "인물", "음식", "동물", "사물", "기타"] 중 하나
        2. mood: 이미지의 분위기를 나타내는 한글 형용사 한 단어 (예: 평화로운, 따뜻한, 활기찬)
        
        태그: [${labels.join(", ")}]
        형식:
        {"category":"","mood":""}
        `;
        
        const response = await openai.responses.create({
            model: "gpt-5-nano",
            input: prompt
        });

        console.log(response.output_text);

        return response.output_text;
    }
    catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw error;
    }
}