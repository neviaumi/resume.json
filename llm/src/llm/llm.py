import tempfile
import os
from pathlib import PurePath, Path
from gpt4all import GPT4All

modal_name = "Phi-3-mini-4k-instruct.Q4_0.gguf"
context_size = 4096
cache_dir = PurePath(tempfile.gettempdir(), 'gpt4all')


def save_locally():
    os.makedirs(cache_dir, exist_ok=True)
    if Path(cache_dir.joinpath(modal_name)).is_file():
        return cache_dir.joinpath(modal_name)
    GPT4All.download_model(
        modal_name,
        cache_dir,
    )
    return cache_dir.joinpath(modal_name)


def _create_llama3_prompt_str(system, user, assistant):
    """Check this out
https://llama.meta.com/docs/model-cards-and-prompt-formats/meta-llama-3/
"""
    return f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

{system}<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>

{assistant}<|eot_id|>
<|start_header_id|>user<|end_header_id|>

{user}<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
"""


def _create_phi3_prompt_str(system, user, assistant):
    """Check this out
https://huggingface.co/microsoft/Phi-3-mini-128k-instruct
"""
    return f"""<|system|>
{system}<|end|>
<|assistant|>
{assistant}<|end|>
<|user|>
{user}<|end|>
<|assistant|>
"""


def prompt(system, user, assistant=None):
    if not Path(cache_dir.joinpath(modal_name)).is_file():
        raise Exception("Run save_locally.py before get the prompt")
    model = GPT4All(modal_name, model_path=cache_dir, allow_download=False, n_ctx=context_size)
    print(f"""GPT4All Info:
Backend: {model.backend}
Device: {model.device}   
""")
    with model.chat_session(system, f"""<|system|>
{system}<|end|>
{{0}}
<|assistant|>"""):
        resp = model.generate(f"""<|user|>
{user}<|end|>
<|assistant|>
    {assistant}
<|end|>
        """)
    model.close()

    return resp
