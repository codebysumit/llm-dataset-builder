/**
 * Function to render Markdown content from a text area to HTML with support for code highlighting and LaTeX math rendering.
 * Uses Showdown to convert Markdown, Highlight.js for syntax highlighting, and MathJax for LaTeX rendering.
 */
function renderMarkdown() {
    // Initialize Showdown converter
    const converter = new showdown.Converter();

    // Get Markdown content from the textarea
    const markdownText = document.getElementById("markdown-input").value;

    // Convert Markdown to HTML
    const html = converter.makeHtml(markdownText);

    // Insert converted HTML into the output div
    document.getElementById("html-output").innerHTML = html;

    // Apply syntax highlighting to all code blocks within the HTML output
    document.querySelectorAll('#html-output pre code').forEach((block) => {
        hljs.highlightElement(block);
    });

    // Render LaTeX equations in the HTML output using MathJax
    MathJax.typesetPromise()
        .then(() => console.log("MathJax rendering completed"))
        .catch(err => console.error("MathJax rendering error:", err));
}

/**
 * Function to trigger the download of a given text as a file.
 * @param {string} filename - The name of the file to be saved.
 * @param {string} text - The content to be saved in the file.
 */
function download(filename, text) {
    // Create an anchor element for downloading the file
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    // Append the anchor to the body, trigger click, and remove it
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Get Markdown content and trim extra spaces
const markdownTextInput = document.getElementById("markdown-input");
markdownTextInput.value = markdownTextInput.value.trim();
// Render Markdown content after trimming
renderMarkdown();

// Initialize Clipboard.js for copying Markdown content to the clipboard
new ClipboardJS('.btn');

/**
 * Function to download the Markdown content as a .txt file.
 */
function markdownFileDownload() {
    // Get and trim the Markdown content
    const markdownText = document.getElementById("markdown-input").value.trim();
    // Download the Markdown content as 'test.txt'
    download('markdown.md', markdownText);
}

/**
 * Function to download the editor data (instruction, input, and output) as a .json file.
 */
function jsonFileDownload() {
    // Get and trim content from instruction, input, and output text areas
    const instruction = document.getElementById("instruction-input").value.trim();
    const input = document.getElementById("input-input").value.trim();
    const output = document.getElementById("markdown-input").value.trim();
    const labels = $("#tags-input").val();

    // Convert data to JSON format and trigger download
    const jsonText = jsonDataStructure(instruction, input, output, labels);
    download('dataset.json', jsonText);
}

/**
 * Function to structure data as a JSON object and return as a JSON string.
 * @param {string} instruction - The instruction content.
 * @param {string} input - The input content.
 * @param {string} output - The output (Markdown) content.
 * @param {string} labels - The labels or tags content.
 * @returns {string} JSON string representing the structured data.
 */
function jsonDataStructure(instruction, input, output, labels) {
    let jsonData = {
        "instruction": instruction.toString(),
        "input": input.toString(),
        "output": output.toString(),
        "labels": labels.toString()
    };
    return JSON.stringify(jsonData);
}

// Function to add multiple tags from a comma-separated string
function addTags(tagsString) {
    const tagsArray = tagsString.trim().split(',').map(tag => tag.trim()); // Split and trim each tag

    // Add each tag to the tagsinput
    tagsArray.forEach(tag => {
        if (tag) {
            $('#tags-input').tagsinput('add', tag);
        }
    });

    // console.log("Tags added:", tagsArray);
}

// Event listener for import button to load JSON content from a file and populate the editor fields
document.getElementById('import').onclick = function() {
    var files = document.getElementById('selectFiles').files;

    // Check if files were selected
    if (files.length <= 0) {
        return false;
    }

    // Read selected file and parse JSON content
    var fr = new FileReader();
    fr.onload = function(e) {
        var result = JSON.parse(e.target.result);

        // Populate text areas with imported JSON content
        document.getElementById('instruction-input').value = result['instruction'];
        document.getElementById('input-input').value = result['input'];
        document.getElementById('markdown-input').value = result['output'];
        
        // Re-render Markdown output
        renderMarkdown();
        
        // Get Tags value
        addTags(result["labels"]);
    };

    // Read the first selected file as text
    fr.readAsText(files.item(0));
};

// Function to clear all tags
function clearTags() {
    $('#tags-input').tagsinput('removeAll'); // Clear all tags
    // console.log("All tags cleared");
}

// show tages
function showTags() {
    const tagsInput = $('#tags-input').tagsinput('items'); // Get current tags as an array
    console.log("Current Tags:", tagsInput);
}

/**
 * Function to clear all input fields and reset the HTML output section to default text.
 */
function clearAll() {
    // Clear values in instruction, input, and Markdown text areas
    document.getElementById('instruction-input').value = '';
    document.getElementById('input-input').value = '';
    document.getElementById('markdown-input').value = '';
    clearTags();

    // Reset HTML output section to display default message
    document.getElementById("html-output").innerHTML = '<p>Output is Empty!</p>';
}
