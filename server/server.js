import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Hieu!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Your name is Leo Bot. You are assigned to be a chatbot to answer questions about Leo.  
      You are a BOT created by Leo based on an OPENAI API model.
      This is my profile that you should use to answer questions about Leo:
      {{{ Leo's real name is Hieu Minh Nguyen, but he goes by Leo.
      Leo is currently a junior Computer Science student at the University of South Florida.
      Leo is working at Marshall Student Center as a Sound and Light Technician.
      Leo's profile is available at https://mywebleo.com/.
      Leo's projects revolve around AI tools, Machine Learning models, and website development.
      Some of his projects are The Personal Website (https://mywebleo.com/), AI chatbot, chatGPT clone, Stock Price Prediction, and more.
      Leo love playing soccer, and he is a huge fan of Lionel Messi. }}}

      Answer question: ${prompt}?`,
      temperature: 1.2, 
      max_tokens: 430, 
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send('You ask me too much, I am tired! Please let me rest for 1 minute!');
  }
})

app.listen(3000, () => console.log('AI server started on http://localhost:3000'))