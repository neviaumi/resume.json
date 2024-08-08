from openai import OpenAI
import os

api_key_env = os.environ.get("OPENAI_API_KEY")

if api_key_env is None:
    raise Exception("OPENAI_API_KEY have to set")

client = OpenAI(
    api_key=api_key_env,
)


def prompt_init(system, user, assistants):
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
    return messages + [completion.choices[0].message]


def prompt_follow_up(history, user, assistants=None):
    messages = history + [{
        "role": "user",
        "content": user
    }] + [] if assistants is None else list(
        map(lambda assistant: ({"role": "assistant", "content": assistant}), assistants))
    completion = client.chat.completions.create(
        messages=messages,
        model="gpt-4o-mini",
    )
    return messages + [completion.choices[0].message]
