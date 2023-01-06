import express, { json } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import fs from "fs";

dotenv.config();

// console.log(process.env.OPENAI_API_KEY);
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
	res.status(200).send({
		message: "Hello from Zenox!",
	});
});

app.post("/", async (req, res) => {
	try {
		const prompt = req.body.prompt;

		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: `${prompt}`,
			temperature: 0,
			max_tokens: 3000,
			top_p: 1,
			frequency_penalty: 0.5,
			presence_penalty: 0,
		});

		res.status(200).send({
			bot: response.data.choices[0].text,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send(error || "Something went wrong");
	}
});

app.post("/user", async (req, res) => {
	console.log(">: ", 123);
	try {
		// console.log("Req: ", req.body);
		// const ip = req.body;
		const prompt = req.body;
		// prompt["ip"] = ip;
		prompt["timestamp"] = new Date().toString();
		prompt["view"] = 1;

		let rawData = fs.readFileSync("userData.json"); //read existing json file
		let data = JSON.parse(rawData); //convert string to object
		data.push(prompt); // push new object
		// console.log(JSON.stringify(data));
		let newDataString = JSON.stringify(data); //convert object to string
		fs.writeFileSync("userData.json", newDataString); //write string to file

		res.status(200).send({
			bot: "Saved!",
		});
	} catch (error) {
		console.error(error);
		res.status(500).send(error || "Something went wrong");
	}
});

app.listen(5000, () =>
	console.log("AI server started on http://localhost:5000")
);

// getUserData();

function getUserData() {
	//
}
