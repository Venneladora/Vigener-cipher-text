const modeRadios = document.getElementsByName("mode");
const manualInput = document.getElementById("manualInput");
const fileInput = document.getElementById("fileInput");
const textInput = document.getElementById("textInput");
const fileUpload = document.getElementById("fileUpload");
const keyInput = document.getElementById("keyInput");
const resultBox = document.getElementById("resultBox");

let fileText = ""; // for file content

modeRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "manual") {
      manualInput.style.display = "block";
      fileInput.style.display = "none";
    } else {
      manualInput.style.display = "none";
      fileInput.style.display = "block";
    }
    resultBox.textContent = "";
  });
});

fileUpload.addEventListener("change", () => {
  const file = fileUpload.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    fileText = reader.result;
  };
  if (file) {
    reader.readAsText(file);
  }
});

function vigenere(text, key, encrypt = true) {
  // Convert input to lowercase and remove non-alphabetic characters
  text = text.toLowerCase().replace(/[^a-z]/g, "");
  key = key.toLowerCase().replace(/[^a-z0-9]/g, "");

  let result = "";
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const cCode = c.charCodeAt(0) - 97; // a = 0

    const kChar = key[keyIndex % key.length];
    let shift;

    // If key character is number, use it directly as shift
    if (kChar >= '0' && kChar <= '9') {
      shift = parseInt(kChar);
    } else {
      shift = kChar.charCodeAt(0) - 97; // a = 0
    }

    let newCharCode;
    if (encrypt) {
      newCharCode = (cCode + shift) % 26;
    } else {
      newCharCode = (cCode - shift + 26) % 26;
    }

    result += String.fromCharCode(newCharCode + 97); // back to lowercase
    keyIndex++;
  }

  return result;
}

function handleEncryptDecrypt(encrypt) {
  const key = keyInput.value.trim();
  if (!key) {
    alert("Please enter a key.");
    return;
  }

  const mode = [...modeRadios].find(r => r.checked).value;
  const inputText = (mode === "manual" ? textInput.value : fileText).trim();

  if (!inputText) {
    alert("Please enter or upload text.");
    return;
  }

  const result = vigenere(inputText, key, encrypt);
  resultBox.textContent = result;
}

document.getElementById("encryptBtn").addEventListener("click", () => handleEncryptDecrypt(true));
document.getElementById("decryptBtn").addEventListener("click", () => handleEncryptDecrypt(false));

document.getElementById("downloadBtn").addEventListener("click", () => {
  const blob = new Blob([resultBox.textContent], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "vigenere_output.txt";
  link.click();
});
