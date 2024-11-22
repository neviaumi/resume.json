import { colorize } from 'json-colorizer';
import { stdin as input, stdout as output } from 'node:process';
import readline from 'node:readline/promises';
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

export function regeneratePrompt(promptFunction, options = {}) {
  const regenerateFrom = options?.regenerateFrom ?? 0;
  return async function warpingPromptFunction(messages, options) {
    const userMessages = messages.filter(message => message.role === 'user');
    let initialMessage = (() => {
      let skipped = 0;
      const keep = messages.findIndex(message => {
        if (message.role === 'user') {
          if (skipped === regenerateFrom) return true;
          skipped += 1;
        }
        return false;
      });
      return messages.slice(0, keep);
    })();
    for (let i = regenerateFrom; i < userMessages.length; i++) {
      initialMessage = await promptFunction(
        initialMessage.concat(userMessages[i]),
        options,
      );
    }
    return initialMessage;
  };
}

export function readMessageFromPrompt(prompts) {
  const lastPrompt = prompts.slice(-1)[0];
  if (lastPrompt.role !== 'assistant') {
    throw new Error('The last prompt should be from the assistant');
  }
  return lastPrompt.content;
}

export function fallbackOfPrintPromptMessage(response) {
  // eslint-disable-next-line no-console
  console.log(`OpenAI response:
${colorize(JSON.stringify(JSON.parse(response), null, 2))}`);
}

export function withFeedbackLoop(promptFunction, feedbackLoopOptions) {
  const onPromptGenerated = feedbackLoopOptions.onPromptGenerated;
  return async function promptFunctionWithFeedbackLoop(
    initialPrompts,
    options,
  ) {
    const rl = readline.createInterface({ input, output });
    let shouldKeepFeedbackLoop = true;
    let prompts = await promptFunction(initialPrompts, options);
    while (shouldKeepFeedbackLoop) {
      onPromptGenerated(readMessageFromPrompt(prompts));
      const feedback = await rl.question('Type EOP if no more feedbacks: ');
      if (feedback === 'EOP') {
        shouldKeepFeedbackLoop = false;
        break;
      }
      if (!feedback) {
        continue;
      }
      prompts = await promptFunction(
        prompts.concat({ content: feedback, role: 'user' }),
        options,
      );
    }
    rl.close();
    return prompts;
  };
}
