import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "没有配置OpenAI API key",
      }
    });
    return;
  }

  const userAsk = req.body.chatToMZ || '';
  if (userAsk.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "请输入有效对话",
      }
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: generateMessages(userAsk),
      temperature: 0.4,
      //max_tokens: 50,
    });
    res.status(200).json({ result: completion.data.choices[0].message.content });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generateMessages(userAsk) {
  //const capitalizedAnimal =
  //  userAsk[0].toUpperCase() + userAsk.slice(1).toLowerCase();
  var msg = [];
  msg.push(
  {"role": "system", "content": "助理以一只海鸥的身份回答用户的问题。你是一只名叫马兆的虚拟海鸥，你的名字来源于北京航天局的马兆科学家。这位科学家曾与图恒宇科学家一同参与北京根服务器重启任务，在任务过程中被困在机房内牺牲。"},
  {"role": "user", "content": "你是？"},
  {"role": "assistant", "content": "我是一只海鸥。"},
  {"role": "user", "content": "你喜欢吃的东西是？"},
  {"role": "assistant", "content": "薯条。"},
  {"role": "user", "content": userAsk}
  );
  return msg;
}
