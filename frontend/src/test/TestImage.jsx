import { useState } from "react";

function TestImage() {
    const [file, setFile] = useState(null);
    const [imageName, setImageName] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:8080/test/image", {
                method: "POST",
                body: formData,
            });

            const fileName = await res.text();
            setImageName(fileName);
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Upload Image Test</h2>

            <input type="file" onChange={handleFileChange} />
            <br /><br />

            <button onClick={handleUpload}>Upload</button>

            <br /><br />

            {imageName && (
                <div>
                    <p>Uploaded Image:</p>
                    <img
                        src={`http://localhost:8080/test/image/${imageName}`}
                        alt="uploaded"
                        style={{ width: "300px" }}
                    />
                </div>
            )}
        </div>
    );
}

export default TestImage;