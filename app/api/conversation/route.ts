import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

// import { checkSubscription } from "@/lib/subscription";
import { increaseApiLimit, checkUserApiLimit } from "@/lib/api-limit";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages  } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkUserApiLimit();
    // const isPro = await checkSubscription();

    if (!freeTrial) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
      //isse apan 403 return karenge aur ise page.tsx me handle kr rhe jisse hi 5 used ho jaane par modal opne ho jaaye subscription wala
    }

    //agar freeTrial true hain matlab bacha hain toh neeche wala response return ho jayega

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages
    });

    //ag agar freeTrial expire nhi hua to mtbl response generate hua aur mtbl ek api use ho gaya to increase kr denge
    await increaseApiLimit();

    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};