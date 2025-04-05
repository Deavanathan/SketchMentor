import base64
from groq import Groq
from dotenv import load_dotenv
import os

def describe_image_in_detail(image_path: str) -> str:
    """
    Sends an image to the Groq vision-language model and requests
    a detailed description of the image.
    
    :param image_path: Path to your image file (e.g., 'my_image.png').
    :return: The model's detailed description of the image.
    """
    load_dotenv()
    # 1. Create a Groq client
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

    # 2. Read and encode the image as a data URL
    with open(image_path, "rb") as img_file:
        image_data = base64.b64encode(img_file.read()).decode("utf-8")
    image_data_url = f"data:image/png;base64,{image_data}"

    # 3. Create the messages with a user instruction + image data
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please describe this image in detail."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": image_data_url
                    }
                }
            ]
        }
    ]

    # 4. Call the vision-language model
    completion = client.chat.completions.create(
        model="llama-3.2-90b-vision-preview",
        messages=messages,
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=False,
        stop=None
    )

    # 5. Return the model's response
    return completion.choices[0].message

if __name__ == "__main__":
    # Example usage: Provide the path to your local image
    image_path = "canvas.png"
    detailed_description = describe_image_in_detail(image_path)
    print("Detailed description of the image:\n", detailed_description)
