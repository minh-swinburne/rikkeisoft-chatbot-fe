<template>
    <div class="main-container">
        <div class="container">
            <!-- Correctly bind the uploadFile method to the button -->
            <button id="file-upload-button" @click="uploadFile">File Upload</button>
            <button id="weblink-upload-button">Weblink Upload</button>
        </div>
        <div id="file-upload" class="container col-6">
            <form>
                <div class="input-container">
                    <label for="file-document-name">Document Name</label>
                    <input id="file-document-name" type="text" class="form-control">
                </div>
                <div class="input-container">
                    <label for="file-description">Description</label>
                    <textarea id="file-description" class="form-control" rows="3"></textarea>
                </div>
                <div class="input-container">
                    <label for="file-upload-input">Choose File</label>
                    <input 
                        id="file-upload-input" 
                        type="file" 
                        class="form-control" 
                        accept=".pdf, .docx, .xlsx">
                </div>
                <div class="input-container">
                    <label for="category">Category</label>
                    <select id="category" class="form-select">
                        <option value="guidance">Guidance</option>
                        <option value="documents">Documents</option>
                    </select>
                </div>
                <div class="input-container">
                    <label>Day Created:</label>
                    <input type="date" class="form-control">
                </div>
                <input type="submit" value="Upload" class="btn btn-success">
            </form>
        </div>
        <div id="weblink-upload" class="container col-6 d-none">
            <form>
                <div class="input-container">
                    <label for="weblink-document-name">Document Name</label>
                    <input id="weblink-document-name" type="text" class="form-control">
                </div>
                <div class="input-container">
                    <label for="weblink-description">Description</label>
                    <textarea id="weblink-description" class="form-control" rows="3"></textarea>
                </div>
                <div class="input-container">
                    <label>Weblink:</label>
                    <input type="text" class="form-control">
                </div>
                <div class="input-container">
                    <label for="category">Category</label>
                    <select id="weblink-category" class="form-select">
                        <option value="guidance">Guidance</option>
                        <option value="documents">Documents</option>
                    </select>
                </div>
                <div class="input-container">
                    <label>Day Created:</label>
                    <input type="date" class="form-control">
                </div>
                <input type="submit" value="Upload" class="btn btn-success">
            </form>
        </div>
    </div>
</template>

<script setup>
console.log("hahahahahha");

// // This function will be called when the button is clicked
// function uploadFile(event) {
//     console.log("Uploading file...");
//     const fileInput = document.getElementById("file-upload-input");
//     const file = fileInput.files[0];  // Access the uploaded file

//     if (file) {
//         console.log("File name:", file.name);
//         console.log("File size:", file.size);
//     } else {
//         console.log("No file selected.");
//     }
// }
</script>


<style>
    .main-container {
        padding: 20px;
    }

    .container a {
        margin-right: 20px;
        cursor: pointer;
        text-decoration: none;
        color: inherit;
    }

    .container a:hover {
        text-decoration: none;
    }

    .input-container {
        margin-bottom: 15px;
    }

    .d-none {
        display: none;
    }
</style>
