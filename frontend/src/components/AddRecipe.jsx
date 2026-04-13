import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../../config/api";


function AddRecipe() {
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [image, setImage] = useState("");

    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    const navigate = useNavigate()


    const handleSubmit = (e) => {
        e.preventDefault();
        const ingredientsArray = ingredients.split("\n").filter(ing => ing.trim() !== "");
        const requestBody = {
            title,
            instructions,
            difficulty,
            ingredients: ingredientsArray,
            image
        };

        // Get the token from the localStorage
        const storedToken = localStorage.getItem('authToken');

        // Send the token through the request "Authorization" Headers
        axios
            .post(
                `${API_URL}/api/recipes`,
                requestBody,
                { headers: { Authorization: `Bearer ${storedToken}` } }
            )
            .then((response) => {
                navigate("/recipes")
            })
            .catch((error) => console.log(error));
    };


    const handleGenerateInstructions = (e) => {
        e.preventDefault();
        setIsGenerating(true);

        // Convert the ingredients string into an array
        const ingredientsArray = ingredients.split("\n").filter(ing => ing.trim() !== "");

        const requestBody = {
            title,
            difficulty,
            ingredients: ingredientsArray
        };

        const storedToken = localStorage.getItem('authToken');

        axios.post(
            `${API_URL}/api/recipes/generate-instructions`,
            requestBody,
            { headers: { Authorization: `Bearer ${storedToken}` } }
        )
            .then((response) => {
                setInstructions(response.data.instructions);
                setIsGenerating(false);
            })
            .catch((e) => {
                console.log("Error...");
                console.log(e);
                setIsGenerating(false);
            })
        
    }


    const handleGenerateImage = (e) => {
        e.preventDefault();
        setIsGeneratingImage(true);

        const ingredientsArray = ingredients.split("\n").filter(ing => ing.trim() !== "");

        const requestBody = {
            title,
            difficulty,
            ingredients: ingredientsArray
        };

        const storedToken = localStorage.getItem('authToken');

        axios.post(
            `${API_URL}/api/recipes/generate-image`,
            requestBody,
            { headers: { Authorization: `Bearer ${storedToken}` } }
        )
            .then((response) => {
                setImage(response.data.image);
                setIsGeneratingImage(false);
            })
            .catch((e) => {
                console.log("Error generating image...");
                console.log(e);
                setIsGeneratingImage(false);
            })
    }


    return (
        <div className="AddRecipe">
            <h3>Add Recipe</h3>

            <form onSubmit={handleSubmit}>
                <label>Title:</label>
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label>Difficulty:</label>
                <select
                    name="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="difficult">Difficult</option>
                </select>

                <label>Ingredients (one per line):</label>
                <textarea
                    name="ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="Enter ingredients, one per line"
                />


                <div className="instructions-header">
                    <label>Instructions:</label>
                    <button type="button" onClick={handleGenerateInstructions} disabled={isGenerating}>
                        <span className="ai-button-content">
                            {isGenerating ? <span className="ai-button-spinner" aria-hidden="true" /> : <span aria-hidden="true">✨</span>}
                            <span>{isGenerating ? "Generating..." : "Generate with AI"}</span>
                        </span>
                    </button>
                </div>



                <textarea
                    id="textarea-instructions"
                    name="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    disabled={isGenerating}
                />

                <div className="instructions-header">
                    <label>Image:</label>
                    <button type="button" onClick={handleGenerateImage} disabled={isGeneratingImage}>
                        <span className="ai-button-content">
                            {isGeneratingImage ? <span className="ai-button-spinner" aria-hidden="true" /> : <span aria-hidden="true">✨</span>}
                            <span>{isGeneratingImage ? "Generating..." : "Generate Image with AI"}</span>
                        </span>
                    </button>
                </div>

                {image && (
                    <div className="image-preview">
                        <img src={image} alt="Generated recipe" />
                    </div>
                )}

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AddRecipe;
