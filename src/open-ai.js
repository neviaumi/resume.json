import OpenAI from 'openai';

const apiKey = process.env['OPENAI_API_KEY'];

if (!apiKey) {
  throw new Error('OPENAI_API_KEY have to set in env');
}

const client = new OpenAI({
  apiKey,
});

export async function prompt(messages, options) {
  const chatCompletion = await client.chat.completions.create(
    Object.assign(
      {
        messages: messages,
        model: 'gpt-4o-mini',
      },
      options.json
        ? {
            response_format: {
              type: 'json_object',
            },
          }
        : {},
    ),
  );
  return [...messages, chatCompletion.choices[0].message];
}
