import base64
import os
from groq import Groq
from dotenv import load_dotenv

class ImageDescriber:
    def __init__(self, groq_api_key: str = None):
        """
        Initializes the ImageDescriber with the Groq API key.
        The API key is loaded from the environment if not provided.
        """
        load_dotenv()
        self.api_key = groq_api_key or os.environ.get("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY must be provided either as an argument or in the environment variables.")
        self.client = Groq(api_key=self.api_key)
    
    def describe(self, img: str) -> str:
        """
        Sends an image to the Groq vision-language model and returns a detailed description.
        
        :param img: Path to your image file (e.g., 'my_image.png').
        :return: The model's detailed description of the image as 'cntent'.
        """
        # Read and encode the image as a data URL
        with open(img, "rb") as img_file:
            image_data = base64.b64encode(img_file.read()).decode("utf-8")
        image_data_url = f"data:image/png;base64,{image_data}"
        
        # Prepare messages with both text and image data
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
        
        # Call the vision-language model
        completion = self.client.chat.completions.create(
            model="llama-3.2-90b-vision-preview",
            messages=messages,
            temperature=1,
            max_completion_tokens=1024,
            top_p=1,
            stream=False,
            stop=None
        )
        
        # Store the model's response in 'cntent'
        cntent = completion.choices[0].message.content
        return cntent

# if __name__ == "__main__":
#     # Example usage: Provide the path to your local image
#     image_path = "canvas.png"
#     describer = ImageDescriber()
#     description = describer.describe(image_path)
#     print("Detailed description of the image:\n", description)
