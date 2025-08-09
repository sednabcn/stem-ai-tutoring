// avatar.js

export function uploadAvatar() {
    const fileInput = document.getElementById("avatar-upload-input");
    if (fileInput) {
        const file = fileInput.files[0];
        if (file) {
            console.log("Avatar uploaded: " + file.name);
            alert("Avatar uploaded successfully!");
        } else {
            alert("Please select an avatar to upload.");
        }
    } else {
        console.error("Avatar upload input not found.");
    }
}
