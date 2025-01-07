const puppeteer = require('puppeteer');
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.NEXT_PUBLIC_HF_TOKEN);

export async function GET(request) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const SCRAPING_URL = 'https://embedded-posts.vercel.app/';
        await page.goto(SCRAPING_URL, { waitUntil: 'domcontentloaded' });

        await page.waitForSelector('iframe');
        const iframeElements = await page.$$eval('iframe', frames => frames.map(frame => frame.src));
        console.log('Found iframes:', iframeElements);

        const scrapedData = [];
        for (const iframeSrc of iframeElements) {
            const iframeHandle = await page.$(`iframe[src="${iframeSrc}"]`);
            const frame = await iframeHandle.contentFrame();

            const iframeData = await frame.evaluate(() => {
                let bodyText = document.body.innerText.trim();
                bodyText = bodyText.replace(/\n/g, ' ');
                return bodyText;
            });

            scrapedData.push(iframeData);
        }

        console.log('Scraped Data:', scrapedData);
        await browser.close();

        const extractedData = [];
        for (const text of scrapedData) {
            const llmResponse = await hf.chatCompletion({
                model: "mistralai/Mistral-7B-Instruct-v0.3",
                messages: [
                    {
                        role: "user",
                        content: `
                            Extract the following details from the given text. If any detail is not mentioned, return it as empty:
                            - Job Title
                            - Job Description
                            - Experience Required
                            - Skills
                            - Location
                            - Where to Apply
                            - Salary
                            Text: "${text}"
                        `,
                    },
                ],
            });

            const responseContent = llmResponse.choices[0].message.content;
            const parsedData = parseResponseToJson(responseContent);
            extractedData.push(parsedData);
        }

        return new Response(JSON.stringify({ data: extractedData }), { status: 200 });
    } catch (error) {
        console.error("Error occurred:", error);
        return new Response('Failed to process request', { status: 500 });
    }
}

function parseResponseToJson(response) {
    const lines = response.split("\n").filter(line => line.trim() !== "");
    const result = {
        JobTitle: "",
        JobDescription: "",
        ExperienceRequired: "",
        Skills: "",
        Location: "",
        WhereToApply: "",
        Salary: "",
    };

    for (const line of lines) {
        if (line.startsWith("Job Title:")) result.JobTitle = line.replace("Job Title:", "").trim();
        else if (line.startsWith("Job Description:")) result.JobDescription = line.replace("Job Description:", "").trim();
        else if (line.startsWith("Experience Required:")) result.ExperienceRequired = line.replace("Experience Required:", "").trim();
        else if (line.startsWith("Skills:")) result.Skills = line.replace("Skills:", "").trim();
        else if (line.startsWith("Location:")) result.Location = line.replace("Location:", "").trim();
        else if (line.startsWith("Where to Apply:")) result.WhereToApply = line.replace("Where to Apply:", "").trim();
        else if (line.startsWith("Salary:")) result.Salary = line.replace("Salary:", "").trim();
    }

    return result;
}
