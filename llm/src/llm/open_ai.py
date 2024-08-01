from openai import OpenAI
import os

api_key_env = os.environ.get("OPENAI_API_KEY")

if api_key_env is None:
    raise Exception("OPENAI_API_KEY have to set")

client = OpenAI(
    api_key=api_key_env,
)


def prompt(system, user, assistants):
    messages = [
                   {
                       "role": "system",
                       "content": system
                   },
                   {
                       "role": "user",
                       "content": user,
                   }
               ] + list(map(lambda assistant: ({"role": "assistant", "content": assistant}), assistants))
    completion = client.chat.completions.create(
        messages=messages,
        model="gpt-4o-mini",
    )
    return completion.choices[0].message.content
