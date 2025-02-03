import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getAtsScore(resumeContent) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `
                        You are an assistant that reviews resumes/CVs and calculates the ATS (Applicant Tracking System) score out of 100. 
                        If the score is below 85, provide suggestions on how to improve the resume. If the score is 85 or above, 
                        write suggestion as Your resume meets ATS standards.

                        Please return the output in the following json format:
                        {
                            "atsScore": <score>, 
                            "suggestions": <suggestions> 
                        }

                        Resume: 
                        ${resumeContent}
                    `,
                },
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        const atsResult = completion.choices[0]?.message?.content;
        if (!atsResult) {
            throw new Error('No ATS score or suggestions returned from the model.');
        }

        console.log("Raw ATS result:", atsResult);

        const result = JSON.parse(atsResult);

        return result;
    } catch (error) {
        console.error('Error processing ATS request:', error);
        throw new Error('Error processing ATS request');
    }
}

export async function POST(req) {
    try {
        const formData = await req.formData();
        const resumeText = formData.get("resumeText");

        if (!resumeText) {
            return NextResponse.json({ error: "No resume text provided" }, { status: 400 });
        }

        const atsResult = await getAtsScore(resumeText);

        return NextResponse.json(atsResult, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}