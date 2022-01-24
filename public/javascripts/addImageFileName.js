function previewMultiple(event) {
    var images = document.getElementById("image");
    var number = images.files.length;
    document.getElementById("formFile").innerHTML = ""
    for (i = 0; i < number; i++) {
        var urls = URL.createObjectURL(event.target.files[i]);
        document.getElementById("formFile").innerHTML += '<img src="' + urls + '">';
    }
}
