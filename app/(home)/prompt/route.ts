import { OpenAIStream, OpenAIStreamPayload } from "../../../lib/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const basePromptPrefix = `Tell me a joke about `;
const vibePromptPrefix = `Make the vibe of the joke `;

export async function POST(req: Request): Promise<Response> {
  const { userInput, vibe } = (await req.json()) as {
    userInput?: string;
    vibe?: string;
  };

  if (!userInput) {
    return new Response("No input in the request", { status: 400 });
  }

  const prompt =
    basePromptPrefix + userInput + ". " + vibePromptPrefix + vibe + ".";

  const payload: OpenAIStreamPayload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
